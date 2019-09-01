const { Client, Pool } = require('pg');

// //For local dev
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// For heroku
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:true
});

var genID = function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const getPlayerInfoAndEmit = (socket)=>{
  pool.query('select a.*,b.zone_id,b.zone_namespace,b.zone_video_url from players a, zones b where a.current_zone_id=b.zone_id and player_name = $1',[socket.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerInformation',res.rows[0]);
    }
  });
}

const getPlayerEquipmentAndEmit = (socket)=>{
  let sqlForPlayerEquipment = 'select es.equipment_slot_id,'
  +'es.equipment_slot_name,items.item_id,items.item_name,items.item_text,items.item_effect_type,items.item_effect_modified_stat,items.item_effect_impact'
  +' from equipment_slots es left outer join items on es.equipment_slot_id=items.equipment_slot_id and items.item_id in'
  +' (select item_id from player_equipment pe, players pl where pe.player_id=pl.player_id and pl.player_name=$1);'
  pool.query(sqlForPlayerEquipment,[socket.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerEquipment',res.rows);
    }
  });
}

const getPlayerResourcesAndEmit = (socket)=>{
  pool.query('select b.*,a.amount from player_resources a, resources b,players c'
            +' where a.resource_id = b.resource_id and a.player_id = c.player_id and c.player_name=$1 and a.amount != 0 order by a.amount desc;',[socket.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerResources',res.rows);
    }
  });
}

const getPlayerItemsAndEmit = (socket)=>{
  pool.query('select b.*,a.amount from player_items a, items b,players c where a.item_id = b.item_id and a.player_id = c.player_id and c.player_name=$1 and a.amount > 0 order by a.amount desc;',[socket.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerItems',res.rows);
    }
  });
}

const getPlayerBlueprintsAndEmit = (socket)=>{
  (async ()=>{
    //Initialize response data
    let playerBlueprintsArray = [];
    //First get the blueprints
    let playerBlueprints = await pool.query('select * from player_blueprints where player_id in (select player_id from players where player_name=$1);',[socket.username]);
    //Check if there are any
    if(playerBlueprints.rowCount > 0){
      playerBlueprintsArray = playerBlueprints.rows;
      //Loop and get the resources needed for each blueprint
      for(let i = 0 ; i < playerBlueprintsArray.length ; i++){
        let sqlQuery = 'select a.blueprint_id,a.item_id,b.item_name,a.resource_id,c.resource_name,a.amount '
                        +'from blueprints a, items b, resources c '
                        +'where a.item_id = b.item_id '
                        +'and a.resource_id = c.resource_id '
                        +'and a.blueprint_id = $1';
        let getBlueprintResources = await pool.query(sqlQuery,[playerBlueprintsArray[i].blueprint_id]);
        playerBlueprintsArray[i].blueprint_resources = getBlueprintResources.rows;
      }
      //Now we can send back the blueprints
      socket.emit('getPlayerBlueprints',playerBlueprintsArray);
    }else{
      //No blueprints. We send empty array
      socket.emit('getPlayerBlueprints',playerBlueprintsArray);
    }
  })().catch(err=>console.log(err));
}

const getZoneInformationAndEmit = (socket,zone_id)=>{
  pool.query('select * from zones where zone_id=$1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getZoneInformation',res.rows[0]);
    }
  });
}

const getOtherZonesAndEmit = (socket)=>{
  pool.query('select * from zones where zone_id in (select zone_id from player_available_zones where player_id in (select player_id from players where player_name = $1));',[socket.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getOtherZones',res.rows);
    }
  });
}

const getNpcFromZoneAndEmit = (zone_id,nsp,mobsInZone,mobCount)=>{
  pool.query('select b.* from zone_npc a, npc b where a.npc_id = b.npc_id and zone_id=$1 order by random() limit 1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      console.log('COUNT IS ->'+(mobCount+1));
      if(typeof res.rows[0] === 'undefined'){
        console.log('No mobs in zone '+zone_id);
        return false;
      }
      var targetName = res.rows[0].npc_name.toLowerCase().replace(/\s/g, "");
      res.rows[0].target_name = targetName+'@'+(mobCount+1);
      res.rows[0].current_stability = res.rows[0].stability;
      res.rows[0].current_currency = res.rows[0].currency;
      getNpcItemsAndEmit(res.rows[0],mobsInZone,nsp);
    }
  });
}

const getNpcItemsAndEmit = (npc,mobsInZone,nsp)=>{
  pool.query('select a.amount,b.item_name,b.item_id,b.item_text,b.item_cost from npc_items a, items b where a.item_id = b.item_id and a.npc_id = $1;',[npc.npc_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      npc.npc_items = res.rows;
      mobsInZone.push(npc);
      nsp.emit('generateZoneNpc',mobsInZone);
    }
  });
}

const getResourceFromZoneAndEmit = (zone_id,nsp,resourcesInZone,resourceCount)=>{
  pool.query('select b.resource_id,b.resource_name,b.resource_text,b.img_url from zone_resources a , resources b where a.resource_id = b.resource_id and zone_id=$1 order by random() limit 1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      console.log('RESOURCE COUNT IS ->'+(resourceCount+1));
      var targetName = res.rows[0].resource_name.toLowerCase().replace(/\s/g, "");
      res.rows[0].target_name = targetName+'@'+(resourceCount+1);
      resourcesInZone.push(res.rows[0]);
      nsp.emit('generateZoneResources',resourcesInZone);
    }
  });
}

const insertUsernameAndPasswordAndEmit = (socket,username,password,loggedInUsers)=>{
  (async ()=>{
    let insertNewPlayer = await pool.query('INSERT INTO players(player_name,player_password) VALUES ($1,$2);',[username,password]);
    let insertFirstZone = await pool.query('INSERT INTO player_available_zones SELECT player_id,$1 from players where player_name=$2',[1,username]);
    console.log('User '+username+' was inserted into the database.');
    console.log('First zone was inserted into the database.');
    loggedInUsers[username] = genID();
    socket.emit('submitSignup',{ responseStatus:'OK', responseMessage:'Sign up was successful', username:username, userUniqueID:loggedInUsers[username] });
  })().catch(err=>{
    console.log(err);
    if(err.code === '23505'){
      socket.emit('submitSignup',{ responseStatus:'ERROR', responseMessage:'Username already taken' });
    }else{
      socket.emit('submitSignup',{ responseStatus:'ERROR', responseMessage:'There was an error' });
    }
  });
}

const verifyUsernameAndPasswordAndEmit = (socket,username,password,loggedInUsers)=>{
  pool.query('select from players where player_name=$1 and player_password = $2;',[username,password],(err,res)=>{
    if(err){
      console.log(err);
      socket.emit('submitLogin',{ responseStatus:'ERROR', responseMessage:'There was an error' });
    }else{
      console.log('User '+username+' logged in.')
      if(res.rows.length < 1){
        socket.emit('submitLogin',{ responseStatus:'ERROR', responseMessage:'Invalid Credentials' });
      }else{
        loggedInUsers[username] = genID();
        socket.emit('submitLogin',{ responseStatus:'OK', responseMessage:'Login Successful',username:username, userUniqueID:loggedInUsers[username] });
      }
    }
  });
}

const changeZoneAndEmit = (socket,player_id,zone_id)=>{
  pool.query('update players set current_zone_id=$1 where player_id=$2;',[zone_id,player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('changeZone',{});
    }
  });
}

const addResourceToPlayerAndEmit = (data,resourcesInZone,nsp,socket)=>{
  pool.query('update player_resources set amount=amount+1 where player_id = $1 and resource_id = $2;',[data.collectingUserId,data.collectedResourceId],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      if(res.rowCount>0){
        deleteResourceFromListAndEmit(data,resourcesInZone,nsp,socket);
      }else{
        pool.query('insert into player_resources values($1,$2,$3)',[data.collectingUserId,data.collectedResourceId,1],(err,res)=>{
          if(err){
            console.log(err);
          }else{
            deleteResourceFromListAndEmit(data,resourcesInZone,nsp,socket);
          }
        });
      }
    }
  });
}

const stealFromNpcAndEmit = (socket,nsp,amountStolen,data)=>{
  pool.query('update players set currency=currency+$1 where player_name = $2;',[amountStolen,data.stealingUser],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      getPlayerInfoAndEmit(socket);
      socket.emit('consoleMessage','You stole '+data.amountStolen+' currency from '+data.stolenFromTarget+'.');
      nsp.emit('localChatMessage',data.stealingUser+' has stolen '+data.amountStolen+' currency from '+data.stolenFromTarget+'.');
    }
  });
}

const getNpcDialogueAndEmit = (socket,nsp,data)=>{
  pool.query('select dialogue_text from npc_dialogue where npc_id = $1 order by random() limit 1',[data.npcId],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('consoleMessage','['+data.npcTargetName+'] '+res.rows[0].dialogue_text);
      nsp.emit('localChatMessage','['+data.npcTargetName+'] '+res.rows[0].dialogue_text);
    }
  });
}

const deleteResourceFromListAndEmit = (data,resourcesInZone,nsp,socket)=>{
  var collectedResourceIndex=null;
  var collectedResource = resourcesInZone.find(function(resource,index){
    if(resource.target_name === data.collectedResource){
      collectedResourceIndex=index;
      return true;
    }
  });
  resourcesInZone.splice(collectedResourceIndex,1);
  nsp.emit('generateZoneResources',resourcesInZone);
  getPlayerResourcesAndEmit(socket);
  socket.emit('consoleMessage','You collected '+data.collectedResourceName+'.');
  nsp.emit('localChatMessage',data.collectingUser+' has collected '+data.collectedResourceName+'.');
}

const npcAttackUserAndEmit = (nsp,user,mobInZone)=>{

  return (async ()=>{
    let playerDied = false;
    const stabilityUpdate = await pool.query('update players set stability = stability - $1 where player_name=$2',[mobInZone.attack_power,user.username]);
    const stabilityCheck = await pool.query('select player_id,player_name,player_password,stability,currency from players where player_name=$1',[user.username]);
    if(stabilityCheck.rows[0].stability < 1){
      console.log('Player died');
      nsp.to(user.socketId).emit('consoleMessage',mobInZone.target_name+' attacked you for '+mobInZone.attack_power+' SP.');
      nsp.emit('localChatMessage',mobInZone.target_name+' has attacked '+user.username+' for '+mobInZone.attack_power+' SP.');
      nsp.to(user.socketId).emit('consoleMessage',mobInZone.target_name+' looted '+stabilityCheck.rows[0].currency+' currency from you and all your items.');
      nsp.emit('localChatMessage',mobInZone.target_name+' has looted '+stabilityCheck.rows[0].currency+' currency from '+user.username+' and all its items.');
      nsp.to(user.socketId).emit('consoleMessage','You died.');
      nsp.to(user.socketId).emit('consoleMessage','Reuploading consciousness into new host...');
      nsp.emit('localChatMessage',user.username+' died.');
      nsp.to(user.socketId).emit('deathSignal',{});
      const npcLootsPlayer = await pool.query('select a.amount,b.item_name,b.item_id,b.item_text,b.item_cost from player_items a, items b where a.item_id = b.item_id and a.player_id = $1 and a.amount!=0;',[stabilityCheck.rows[0].player_id]);
      if(npcLootsPlayer.rows.length > 0){
        console.log('NPC will loot now');
        for(var i = 0 ; i < npcLootsPlayer.rows.length ; i++){
          mobInZone.npc_items.push(npcLootsPlayer.rows[i]);
          console.log('looting this item:');
          console.log(npcLootsPlayer.rows[i]);
        }
        mobInZone.current_currency = mobInZone.current_currency + stabilityCheck.rows[0].currency;
        console.log('im here');
        console.log(mobInZone);
      }else{
        console.log('NPC didnt loot anything...')
      }
      const deletePlayerFromDatabase = await pool.query('delete from players where player_id='+stabilityCheck.rows[0].player_id);
      const insertNewPlayer = await pool.query('insert into players(player_id,player_name,player_password) VALUES($1,$2,$3);',[stabilityCheck.rows[0].player_id,stabilityCheck.rows[0].player_name,stabilityCheck.rows[0].player_password]);
      const deletePlayerItems = await pool.query('delete from player_items where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerResources = await pool.query('delete from player_resources where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerEquipment = await pool.query('delete from player_equipment where player_id='+stabilityCheck.rows[0].player_id);
      const deletePlayerBlueprints = await pool.query('delete from player_blueprints where player_id='+stabilityCheck.rows[0].player_id);
      playerDied = true;
    }else{
      console.log(mobInZone.target_name+' has attacked '+user.username+' for '+mobInZone.attack_power+' SP.');
      nsp.to(user.socketId).emit('consoleMessage',mobInZone.target_name+' attacked you for '+mobInZone.attack_power+' SP.');
      nsp.emit('localChatMessage',mobInZone.target_name+' has attacked '+user.username+' for '+mobInZone.attack_power+' SP.');
      getPlayerInfoAndEmitToNspSocket(nsp,user);
    }
    return playerDied;
  })().catch(err=>console.log(err));

}

const getPlayerItemsAndEmitToNspSocket = (nsp,user)=>{
  pool.query('select b.*,a.amount from player_items a, items b,players c where a.item_id = b.item_id and a.player_id = c.player_id and c.player_name=$1 and a.amount > 0 order by a.amount desc;',[user.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      nsp.to(user.socketId).emit('getPlayerItems',res.rows);
    }
  });
}

const getPlayerInfoAndEmitToNspSocket = (nsp,user)=>{
  pool.query('select a.*,b.zone_id,b.zone_namespace,b.zone_video_url from players a, zones b where a.current_zone_id=b.zone_id and player_name = $1',[user.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      nsp.to(user.socketId).emit('getPlayerInformation',res.rows[0]);
    }
  });
}

const lootNpcAndEmit = (npc,socket)=>{
  (async ()=>{
    let zeroCount = 0;
    let responseMessage = 'You looted ';
    for(var i = 0 ; i < npc.npc_items.length ; i++){
      if(npc.npc_items[i].amount>0){
        console.log(npc.npc_items[i].item_name+' will try to be updated or inserted');
        const updateResult = await pool.query('update player_items set amount=amount+$1 where player_id in (select player_id from players where player_name=$2) and item_id=$3;',[npc.npc_items[i].amount,socket.username,npc.npc_items[i].item_id]);
        if(updateResult.rowCount > 0){
          console.log(socket.username+' items were updated.');
          console.log(npc.npc_items[i].item_name+' was updated');
          responseMessage += (npc.npc_items[i].amount + ' ' + npc.npc_items[i].item_name + ', ');
        }else{
          console.log(socket.username+' items were not updated. will insert them instead');
          const insertResult = await pool.query('insert into player_items select player_id,$1,$2 from players where player_name = $3;',[npc.npc_items[i].item_id,npc.npc_items[i].amount,socket.username]);
          console.log(npc.npc_items[i].item_name+' was inserted');
          responseMessage += (npc.npc_items[i].amount + ' ' + npc.npc_items[i].item_name + ', ');
        }
      }else{
        zeroCount++;
      }
    }
    if(zeroCount===npc.npc_items.length){
      console.log('no items were looted');
      socket.emit('consoleMessage',npc.target_name+' dropped no loot.');
    }else{
      responseMessage = responseMessage.slice(0, -2) + '.';
      getPlayerItemsAndEmit(socket);
      socket.emit('consoleMessage',responseMessage);
    }
  })().catch(err=>console.log(err));
}

module.exports = {
  pool:pool,
  getPlayerInfoAndEmit:getPlayerInfoAndEmit,
  getPlayerEquipmentAndEmit:getPlayerEquipmentAndEmit,
  getPlayerResourcesAndEmit:getPlayerResourcesAndEmit,
  getPlayerItemsAndEmit:getPlayerItemsAndEmit,
  getPlayerBlueprintsAndEmit:getPlayerBlueprintsAndEmit,
  getZoneInformationAndEmit:getZoneInformationAndEmit,
  getOtherZonesAndEmit:getOtherZonesAndEmit,
  changeZoneAndEmit:changeZoneAndEmit,
  getNpcFromZoneAndEmit:getNpcFromZoneAndEmit,
  getResourceFromZoneAndEmit:getResourceFromZoneAndEmit,
  insertUsernameAndPasswordAndEmit:insertUsernameAndPasswordAndEmit,
  verifyUsernameAndPasswordAndEmit:verifyUsernameAndPasswordAndEmit,
  addResourceToPlayerAndEmit:addResourceToPlayerAndEmit,
  stealFromNpcAndEmit:stealFromNpcAndEmit,
  getNpcDialogueAndEmit:getNpcDialogueAndEmit,
  npcAttackUserAndEmit:npcAttackUserAndEmit,
  lootNpcAndEmit:lootNpcAndEmit
}
