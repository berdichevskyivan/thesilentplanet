const { Client, Pool } = require('pg');

const pool = new Pool({
  user:'postgres',
  password:'rakmodar',
  host:'localhost',
  database:'thesilentplanet',
  port:5432
});

const getPlayerInfoAndEmit = (socket,data)=>{
  pool.query('select * from players where player_id = $1',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerInformation',res.rows[0]);
    }
  });
}

var sqlForPlayerEquipment = 'select es.equipment_slot_id,'
+'es.equipment_slot_name,items.item_id,items.item_name,items.item_text,items.item_effect_type,items.item_effect_modified_stat,items.item_effect_impact'
+' from equipment_slots es left outer join items on es.equipment_slot_id=items.equipment_slot_id and items.item_id in (select item_id from player_equipment where player_id=$1);'

const getPlayerEquipmentAndEmit = (socket,data)=>{
  pool.query(sqlForPlayerEquipment,[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerEquipment',res.rows);
    }
  });
}

const getPlayerResourcesAndEmit = (socket,data)=>{
  pool.query('select b.*,a.amount from player_resources a, resources b where a.resource_id = b.resource_id and a.player_id=$1 order by a.amount desc;',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerResources',res.rows);
    }
  });
}

const getPlayerItemsAndEmit = (socket,data)=>{
  pool.query('select b.*,a.amount from player_items a, items b where a.item_id = b.item_id and a.player_id=$1 order by a.amount desc;',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerItems',res.rows);
    }
  });
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

const getNpcFromZoneAndEmit = (zone_id,nsp,mobsInFirstZone,mobCount)=>{
  pool.query('select b.* from zone_npc a, npc b where a.npc_id = b.npc_id and zone_id=$1 order by random() limit 1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      console.log('COUNT IS ->'+mobCount);
      var targetName = res.rows[0].npc_name.toLowerCase().replace(/\s/g, "");
      res.rows[0].target_name = targetName+'@'+(mobCount+1);
      res.rows[0].current_stability = res.rows[0].stability;
      mobsInFirstZone.push(res.rows[0]);
      nsp.emit('generateZoneNpc',mobsInFirstZone);
    }
  });
}

const getResourceFromZoneAndEmit = (zone_id,nsp,resourcesInFirstZone,resourceCount)=>{
  pool.query('select b.resource_id,b.resource_name,b.resource_text,b.img_url from zone_resources a , resources b where a.resource_id = b.resource_id and zone_id=$1 order by random() limit 1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      console.log('RESOURCE COUNT IS ->'+resourceCount);
      var targetName = res.rows[0].resource_name.toLowerCase().replace(/\s/g, "");
      res.rows[0].target_name = targetName+'@'+(resourceCount+1);
      resourcesInFirstZone.push(res.rows[0]);
      nsp.emit('generateZoneResources',resourcesInFirstZone);
    }
  });
}

module.exports = {
  pool:pool,
  getPlayerInfoAndEmit:getPlayerInfoAndEmit,
  getPlayerEquipmentAndEmit:getPlayerEquipmentAndEmit,
  getPlayerResourcesAndEmit:getPlayerResourcesAndEmit,
  getPlayerItemsAndEmit:getPlayerItemsAndEmit,
  getZoneInformationAndEmit:getZoneInformationAndEmit,
  getNpcFromZoneAndEmit:getNpcFromZoneAndEmit,
  getResourceFromZoneAndEmit:getResourceFromZoneAndEmit
}
