const db = require('./dbcontroller.js');

const attackUser = (nsp,socket,data,usersInZone)=>{
  //For now just deal damage and emit
  (async ()=>{
    let attackedUserSocketId;
    //Search for the socket_id of Attacked user in UsersInZone array
    for(let i = 0 ; i < usersInZone.length ; i++){
      if(usersInZone[i].username === data.attackedUserName){
        attackedUserSocketId = usersInZone[i].socketId;
      }
    }
    //Attack other user directly
    let attackUser = await db.pool.query('update players set stability=stability-$1 where player_id=$2',[data.attackingUserPower,data.attackedUserId]);
    //Check attacked user stability
    let stabilityCheck = await db.pool.query('select player_id,player_name,player_password,stability,currency from players where player_id=$1',[data.attackedUserId]);
    if(stabilityCheck.rows[0].stability < 1){
      //Attacked player died.
      //Update to Zero and Emit
      const stabilityUpdate = await db.pool.query('update players set stability = 0 where player_id=$1',[data.attackedUserId]);
      //Emit User list after this
      db.getUsersInZoneInfoAndEmit(nsp,usersInZone);
      nsp.to(attackedUserSocketId).emit('consoleMessage',data.attackingUserName+' has attacked you for '+data.attackingUserPower+' damage.');
      socket.emit('consoleMessage','You attacked '+data.attackedUserName+ ' for '+data.attackingUserPower+' damage.');
      nsp.emit('localChatMessage',data.attackingUserName+' has attacked '+data.attackedUserName+ ' for '+data.attackingUserPower+' damage.');
      // Tell everybody attacking user is looting attacked user
      nsp.to(attackedUserSocketId).emit('consoleMessage',data.attackingUserName+' has killed you and looted your items and currency.');
      nsp.emit('localChatMessage',data.attackingUserName+' has killed '+data.attackedUserName+ ' and looted all his items and currency.');
      socket.emit('consoleMessage','You killed '+data.attackedUserName+'.');
      // Send death signal to attacked User
      nsp.to(attackedUserSocketId).emit('consoleMessage','You died.');
      nsp.to(attackedUserSocketId).emit('consoleMessage','Reuploading consciousness into new host...');
      nsp.to(attackedUserSocketId).emit('deathSignal',{});
      // Looting time for the attacking user
      let playerLootsPlayer = await db.pool.query('select a.amount,b.item_name,b.item_id,b.item_text,b.item_cost from player_items a, items b where a.item_id = b.item_id and a.player_id = $1 and a.amount!=0;',[data.attackedUserId]);
      let attackedPlayerCurrency = await db.pool.query('select currency from players where player_id=$1',[data.attackedUserId]);
      if(playerLootsPlayer.rows.length > 0){
        //theres loot
        let responseMessage = 'You looted ';
        for(let i = 0 ; i < playerLootsPlayer.rows.length ; i++){
          //update
          let item = playerLootsPlayer.rows[i];
          //if no rows updated, insert... classic...
          let updateUserItems = await db.pool.query('update player_items set amount=amount+$1 where player_id=$2 and item_id=$3',[item.amount,data.attackingUserId,item.item_id]);
          if(updateUserItems.rowCount < 1){
            //then insert
            let insertUserItems = await db.pool.query('insert into player_items values ($1,$2,$3)',[data.attackingUserId,item.item_id,item.amount]);
          }
          responseMessage += (item.amount + ' ' + item.item_name + ', ');
        }
        //Done looting items
        responseMessage = responseMessage.slice(0, -2) + ' from '+data.attackedUserName+'.';
        socket.emit('consoleMessage',responseMessage);
      }else{
        //no loot
        socket.emit('consoleMessage',data.attackedUserName+ ' dropped no loot.');
      }
      //Now loot currency
      let currency = parseInt(attackedPlayerCurrency.rows[0].currency);
      if(currency<1){
        //attacked player has no currency
        socket.emit('consoleMessage',data.attackedUserName+ ' dropped no currency.');
      }else{
        //attacked player has currency
        //update attacking player currency
        let updateAttackingPlayerCurrency = db.pool.query('update players set currency=currency+$1 where player_id=$2',[currency,data.attackingUserId]);
        socket.emit('consoleMessage','You looted '+currency+' currency from '+data.attackedUserName+'.');
      }
      //Now erase attacked player from the face of Earth
      const deletePlayerFromDatabase = await db.pool.query('delete from players where player_id='+stabilityCheck.rows[0].player_id);
      const insertNewPlayer = await db.pool.query('insert into players(player_id,player_name,player_password) VALUES($1,$2,$3);',[stabilityCheck.rows[0].player_id,stabilityCheck.rows[0].player_name,stabilityCheck.rows[0].player_password]);
      const deletePlayerItems = await db.pool.query('delete from player_items where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerResources = await db.pool.query('delete from player_resources where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerEquipment = await db.pool.query('delete from player_equipment where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerBlueprints = await db.pool.query('delete from player_blueprints where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerZones = await db.pool.query('delete from player_available_zones where player_id='+stabilityCheck.rows[0].player_id+' and zone_id!=1');
    }else{
      nsp.to(attackedUserSocketId).emit('consoleMessage',data.attackingUserName+' has attacked you for '+data.attackingUserPower+' damage.');
      socket.emit('consoleMessage','You attacked '+data.attackedUserName+ ' for '+data.attackingUserPower+' damage.');
      nsp.emit('localChatMessage',data.attackingUserName+' has attacked '+data.attackedUserName+ ' for '+data.attackingUserPower+' damage.');
      db.getPlayerInfoAndEmit(socket);
      db.getPlayerInfoAndEmitToSocketId(nsp,attackedUserSocketId,data.attackedUserName);
      db.getUsersInZoneInfoAndEmit(nsp,usersInZone);
    }
  })().catch(err=>console.log(err));
}

module.exports = {
  attackUser:attackUser
}
