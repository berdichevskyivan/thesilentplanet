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

const getPlayerResourcesAndEmit = (socket,data)=>{
  pool.query('select * from player_resources where player_id = $1',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerResources',res.rows);
    }
  });
}

const getPlayerItemsAndEmit = (socket,data)=>{
  pool.query('select * from player_items where player_id = $1',[data.player_id],(err,res)=>{
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

const getResourceFromZoneAndEmit = (zone_id,nsp,resourcesInFirstZone)=>{
  pool.query('select * from zone_resources where zone_id=$1 order by random() limit 1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      resourcesInFirstZone.push(res.rows[0]);
      nsp.emit('generateZoneResources',resourcesInFirstZone);
    }
  });
}

module.exports = {
  pool:pool,
  getPlayerInfoAndEmit:getPlayerInfoAndEmit,
  getPlayerResourcesAndEmit:getPlayerResourcesAndEmit,
  getPlayerItemsAndEmit:getPlayerItemsAndEmit,
  getZoneInformationAndEmit:getZoneInformationAndEmit,
  getNpcFromZoneAndEmit:getNpcFromZoneAndEmit,
  getResourceFromZoneAndEmit:getResourceFromZoneAndEmit
}
