const { Client, Pool } = require('pg');

const pool = new Pool({
  user:'postgres',
  //password:'dgtic123',
  password:'rakmodar',
  host:'localhost',
  database:'thesilentplanet',
  port:5432
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

var sqlForPlayerEquipment = 'select es.equipment_slot_id,'
+'es.equipment_slot_name,items.item_id,items.item_name,items.item_text,items.item_effect_type,items.item_effect_modified_stat,items.item_effect_impact'
+' from equipment_slots es left outer join items on es.equipment_slot_id=items.equipment_slot_id and items.item_id in'
+' (select item_id from player_equipment pe, players pl where pe.player_id=pl.player_id and pl.player_name=$1);'

const getPlayerEquipmentAndEmit = (socket)=>{
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
            +' where a.resource_id = b.resource_id and a.player_id = c.player_id and c.player_name=$1 order by a.amount desc;',[socket.username],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getPlayerResources',res.rows);
    }
  });
}

const getPlayerItemsAndEmit = (socket)=>{
  pool.query('select b.*,a.amount from player_items a, items b,players c where a.item_id = b.item_id and a.player_id = c.player_id and c.player_name=$1 order by a.amount desc;',[socket.username],(err,res)=>{
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

const getOtherZonesAndEmit = (socket,zone_id)=>{
  pool.query('select * from zones where zone_id!=$1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      socket.emit('getOtherZones',res.rows);
    }
  });
}

const getNpcFromZoneAndEmit = (zone_id,nsp,mobsInFirstZone,mobCount)=>{
  pool.query('select b.* from zone_npc a, npc b where a.npc_id = b.npc_id and zone_id=$1 order by random() limit 1',[zone_id],(err,res)=>{
    if(err){
      console.log(err);
    }else{
      console.log('COUNT IS ->'+(mobCount+1));
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
      console.log('RESOURCE COUNT IS ->'+(resourceCount+1));
      var targetName = res.rows[0].resource_name.toLowerCase().replace(/\s/g, "");
      res.rows[0].target_name = targetName+'@'+(resourceCount+1);
      resourcesInFirstZone.push(res.rows[0]);
      nsp.emit('generateZoneResources',resourcesInFirstZone);
    }
  });
}

const insertUsernameAndPasswordAndEmit = (socket,username,password,loggedInUsers)=>{
  pool.query('INSERT INTO players(player_name,player_password) VALUES ($1,$2);',[username,password],(err,res)=>{
    if(err){
      console.log(err);
      if(err.code === '23505'){
        socket.emit('submitSignup',{ responseStatus:'ERROR', responseMessage:'Username already taken' });
      }else{
        socket.emit('submitSignup',{ responseStatus:'ERROR', responseMessage:'There was an error' });
      }
    }else{
      console.log('User '+username+' was inserted into the database.');
      loggedInUsers[username] = genID();
      socket.emit('submitSignup',{ responseStatus:'OK', responseMessage:'Sign up was successful', username:username, userUniqueID:loggedInUsers[username] });
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

module.exports = {
  pool:pool,
  getPlayerInfoAndEmit:getPlayerInfoAndEmit,
  getPlayerEquipmentAndEmit:getPlayerEquipmentAndEmit,
  getPlayerResourcesAndEmit:getPlayerResourcesAndEmit,
  getPlayerItemsAndEmit:getPlayerItemsAndEmit,
  getZoneInformationAndEmit:getZoneInformationAndEmit,
  getOtherZonesAndEmit:getOtherZonesAndEmit,
  changeZoneAndEmit:changeZoneAndEmit,
  getNpcFromZoneAndEmit:getNpcFromZoneAndEmit,
  getResourceFromZoneAndEmit:getResourceFromZoneAndEmit,
  insertUsernameAndPasswordAndEmit:insertUsernameAndPasswordAndEmit,
  verifyUsernameAndPasswordAndEmit:verifyUsernameAndPasswordAndEmit
}
