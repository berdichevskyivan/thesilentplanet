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

const getZoneInformationAndEmit = (socket,data)=>{
  pool.query('select * from zones where zone_id in (select current_zone_id from players where player_id=$1)',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getZoneInformation',res.rows[0]);
    }
  });
}

const getZoneNPCAndEmit = (socket,data)=>{
  pool.query('select * from zone_npc where zone_id in (select current_zone_id from players where player_id=$1)',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getZoneNPC',res.rows);
    }
  });
}

const getZoneResourcesAndEmit = (socket,data)=>{
  pool.query('select * from zone_resources where zone_id in (select current_zone_id from players where player_id=$1)',[data.player_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getZoneResources',res.rows);
    }
  });
}

module.exports = {
  pool:pool,
  getPlayerInfoAndEmit:getPlayerInfoAndEmit,
  getPlayerResourcesAndEmit:getPlayerResourcesAndEmit,
  getPlayerItemsAndEmit:getPlayerItemsAndEmit,
  getZoneInformationAndEmit:getZoneInformationAndEmit,
  getZoneNPCAndEmit:getZoneNPCAndEmit,
  getZoneResourcesAndEmit:getZoneResourcesAndEmit
}
