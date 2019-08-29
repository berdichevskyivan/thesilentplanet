const db = require('./dbcontroller.js');

const useItemAndEmit = (socket,item)=>{
  (async ()=>{

    let sqlQuery = 'update players set '+item.item_effect_modified_stat+'='+item.item_effect_modified_stat+(item.item_effect_type==='increase'?'+':'-')+item.item_effect_impact+' where player_name=\''+socket.username+'\';';

    const result = await db.pool.query(sqlQuery);

    const updateItemsResult = await db.pool.query('update player_items set amount=amount-1 where item_id='+item.item_id+' and player_id in (select player_id from players where player_name=\''+socket.username+'\');');

    db.getPlayerItemsAndEmit(socket);
    db.getPlayerInfoAndEmit(socket);
    socket.emit('consoleMessage','You used 1 '+item.item_name+'. Your '+item.item_effect_modified_stat+' has '+item.item_effect_type+'d by '+item.item_effect_impact+'.');

  })().catch(err=>console.log(err));
}

module.exports = {
  useItemAndEmit:useItemAndEmit
}
