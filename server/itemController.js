const db = require('./dbcontroller.js');

const useItemAndEmit = (socket,item)=>{
  (async ()=>{
    //Check if stability doesnt go above max_stability
    let checkUserStats = await db.pool.query('select * from players where player_id in (select player_id from players where player_name=$1)',[socket.username]);
    let userStability = checkUserStats.rows[0].stability;
    let userMaxStability = checkUserStats.rows[0].max_stability;
    let amountIncreased = parseInt(item.item_effect_impact);
    console.log('this is amountIncreased->'+amountIncreased);
    //Do a check if the item increases stability
    if(item.item_effect_modified_stat==='stability' && item.item_effect_type==='increase'){
      if(userStability === userMaxStability) socket.emit('consoleMessage','You have max SP points. You can\'t use this item.');
      if(userStability < userMaxStability){
        console.log(userStability);
        console.log(amountIncreased);
        console.log(userMaxStability);
        console.log((userStability+amountIncreased)>userMaxStability);
        if((userStability+amountIncreased)>userMaxStability) amountIncreased = userMaxStability - userStability;
        console.log('how much is amountIncreased now?->'+amountIncreased);
        let sqlQuery = 'update players set '+item.item_effect_modified_stat+'='+item.item_effect_modified_stat+(item.item_effect_type==='increase'?'+':'-')+amountIncreased+' where player_name=\''+socket.username+'\';';
        const result = await db.pool.query(sqlQuery);
        const updateItemsResult = await db.pool.query('update player_items set amount=amount-1 where item_id='+item.item_id+' and player_id in (select player_id from players where player_name=\''+socket.username+'\');');
        db.getPlayerItemsAndEmit(socket);
        db.getPlayerInfoAndEmit(socket);
        socket.emit('consoleMessage','You used 1 '+item.item_name+'. Your '+item.item_effect_modified_stat+' has '+item.item_effect_type+'d by '+amountIncreased+'.');
      }
    }else{
      let sqlQuery = 'update players set '+item.item_effect_modified_stat+'='+item.item_effect_modified_stat+(item.item_effect_type==='increase'?'+':'-')+amountIncreased+' where player_name=\''+socket.username+'\';';
      const result = await db.pool.query(sqlQuery);
      const updateItemsResult = await db.pool.query('update player_items set amount=amount-1 where item_id='+item.item_id+' and player_id in (select player_id from players where player_name=\''+socket.username+'\');');
      db.getPlayerItemsAndEmit(socket);
      db.getPlayerInfoAndEmit(socket);
      socket.emit('consoleMessage','You used 1 '+item.item_name+'. Your '+item.item_effect_modified_stat+' has '+item.item_effect_type+'d by '+amountIncreased+'.');
    }

  })().catch(err=>console.log(err));
}

const equipItemAndEmit = (socket,item)=>{
  (async ()=>{
    console.log('equipping this item');
    console.log(item);
    // First check if user has an item equipped in the slot
    const checkIfUserHasItemEquipped = await db.pool.query('select * from player_equipment a, items b where a.item_id=b.item_id and player_id in (select player_id from players where player_name=$1) and a.equipment_slot_id=$2',[socket.username,item.equipment_slot_id]);
    if(checkIfUserHasItemEquipped.rowCount < 1){
      // If user has no item in that slot , equip it first
      console.log('user has no item in that slot, equipping item');
      const insertItemIntoPlayerEquipment = await db.pool.query('insert into player_equipment select player_id,$1,$2 from players where player_name = $3',[item.item_id,item.equipment_slot_id,socket.username]);
      socket.emit('consoleMessage',item.item_name+' was equipped.');
      // Then start adding effects in players table
      let itemEffectTypeArray = item.item_effect_type.split(',');
      let itemEffectModifiedStatArray = item.item_effect_modified_stat.split(',');
      let itemEffectImpactArray = item.item_effect_impact.split(',');

      for(let i = 0 ; i < itemEffectTypeArray.length ; i++){
        let sqlQuery = 'update players set '+itemEffectModifiedStatArray[i]+'='+itemEffectModifiedStatArray[i]+(itemEffectTypeArray[i]==='increase'?'+':'-')+itemEffectImpactArray[i]+' where player_name=$1';
        console.log(sqlQuery);
        const applyEffect = await db.pool.query(sqlQuery,[socket.username]);
        socket.emit('consoleMessage','Your '+itemEffectModifiedStatArray[i].replace('_',' ')+' '+itemEffectTypeArray[i]+'d by '+itemEffectImpactArray[i]+'.');
      }
      db.getPlayerEquipmentAndEmit(socket);
      db.getPlayerInfoAndEmit(socket);
    }else{
      console.log('user has an item equipped in that slot already, unequpping item');
      let unequipItemFirst = await unequipItemAndEmit(socket,checkIfUserHasItemEquipped.rows[0]);
      const insertItemIntoPlayerEquipment = await db.pool.query('insert into player_equipment select player_id,$1,$2 from players where player_name = $3',[item.item_id,item.equipment_slot_id,socket.username]);
      socket.emit('consoleMessage',item.item_name+' was equipped.');
      // Then start adding effects in players table
      let itemEffectTypeArray = item.item_effect_type.split(',');
      let itemEffectModifiedStatArray = item.item_effect_modified_stat.split(',');
      let itemEffectImpactArray = item.item_effect_impact.split(',');

      for(let i = 0 ; i < itemEffectTypeArray.length ; i++){
        let sqlQuery = 'update players set '+itemEffectModifiedStatArray[i]+'='+itemEffectModifiedStatArray[i]+(itemEffectTypeArray[i]==='increase'?'+':'-')+itemEffectImpactArray[i]+' where player_name=$1';
        console.log(sqlQuery);
        const applyEffect = await db.pool.query(sqlQuery,[socket.username]);
        socket.emit('consoleMessage','Your '+itemEffectModifiedStatArray[i].replace('_',' ')+' '+itemEffectTypeArray[i]+'d by '+itemEffectImpactArray[i]+'.');
      }
      db.getPlayerEquipmentAndEmit(socket);
      db.getPlayerInfoAndEmit(socket);
    }
  })().catch(err=>console.log(err));
}

const unequipItemAndEmit = (socket,item)=>{
  return (async ()=>{
    console.log('unequpping this item');
    console.log(item);
    // We delete the item from player_equipment
    const deleteItemFromPlayerEquipment = await db.pool.query('delete from player_equipment where player_id in (select player_id from players where player_name=$1) and item_id=$2',[socket.username,item.item_id]);
    // Then we make an array of the stats and effects to be modified
    let itemEffectTypeArray = item.item_effect_type.split(',');
    let itemEffectModifiedStatArray = item.item_effect_modified_stat.split(',');
    let itemEffectImpactArray = item.item_effect_impact.split(',');

    for(let i = 0 ; i < itemEffectTypeArray.length ; i++){
      let sqlQuery = 'update players set '+itemEffectModifiedStatArray[i]+'='+itemEffectModifiedStatArray[i]+(itemEffectTypeArray[i]==='increase'?'-':'+')+itemEffectImpactArray[i]+' where player_name=$1';
      const applyCounterEffect = await db.pool.query(sqlQuery,[socket.username]);
    }

    let checkPlayerSP = await db.pool.query('select stability, max_stability from players where player_id in (select player_id from players where player_name=$1)',[socket.username]);
    if(checkPlayerSP.rows[0].stability > checkPlayerSP.rows[0].max_stability){
      let updatePlayerSP = await db.pool.query('update players set stability='+checkPlayerSP.rows[0].max_stability+' where player_id in (select player_id from players where player_name=$1)',[socket.username]);
    }

    socket.emit('consoleMessage',item.item_name+' was unequipped.');
    db.getPlayerEquipmentAndEmit(socket);
    db.getPlayerInfoAndEmit(socket);
    return true;
  })().catch(err=>console.log(err));
}

module.exports = {
  useItemAndEmit:useItemAndEmit,
  equipItemAndEmit:equipItemAndEmit,
  unequipItemAndEmit:unequipItemAndEmit
}
