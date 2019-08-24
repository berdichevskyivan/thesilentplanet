const db = require('./dbcontroller.js');

var availableZones = [];

const initializeZones = (io)=>{
  db.pool.query('select * from zones;',(err,res)=>{
    if(err){
      console.log(err);
    }else{

      var zoneCount = res.rows.length;

      for(var i = 0 ; i < zoneCount ; i++){
        var zone = {
          zone_nsp:io.of(res.rows[i].zone_namespace),
          zone_namespace:res.rows[i].zone_namespace,
          zone_name:res.rows[i].zone_name,
          zone_id:res.rows[i].zone_id,
          usersInZone:[],
          mobsInZone:[],
          resourcesInZone:[],
          mobCountInZone:0,
          resourceCountInZone:0
        }
        availableZones.push(zone);
      }

      for(var i = 0; i < availableZones.length ; i++){
        onConnectionToZoneNsp(availableZones[i].zone_nsp,db,availableZones[i].mobsInZone,availableZones[i].zone_id,availableZones[i].usersInZone);
        mobSpawn(db,availableZones[i].zone_nsp,availableZones[i].mobsInZone,availableZones[i].mobCountInZone,availableZones[i].zone_id);
        resourceSpawn(db,availableZones[i].zone_nsp,availableZones[i].resourcesInZone,availableZones[i].resourceCountInZone,availableZones[i].zone_id);
      }

    }
  });
}

const mobSpawn = (db,nsp,mobsInZone,mobCount,zoneId)=>{
  setInterval(()=>{
    console.log('Generating Mob for Zone '+zoneId);
    db.getNpcFromZoneAndEmit(zoneId,nsp,mobsInZone,mobCount);
    mobCount++;
  },220000);
};

const resourceSpawn = (db,nsp,resourcesInZone,resourceCount,zoneId)=>{
  setInterval(()=>{
    console.log('Generating Resource for Zone '+zoneId);
    db.getResourceFromZoneAndEmit(zoneId,nsp,resourcesInZone,resourceCount);
    resourceCount++;
  },220000);
};

const onConnectionToZoneNsp = (nsp,db,mobsInZone,zoneId,usersInZone)=>{
  nsp.on('connection',function(socket){
    socket.username = socket.handshake.query.username;
    console.log('User '+socket.username+' has joined the a zone.');
    var shouldPush = true;
    for(var i = 0 ; i < usersInZone.length ; i++){
      if(usersInZone[i]===socket.username){
        shouldPush = false;
      }
    }
    if(shouldPush){
      usersInZone.push(socket.username);
    }

    nsp.emit('usersInZone',usersInZone);
    db.getZoneInformationAndEmit(socket,zoneId);
    db.getOtherZonesAndEmit(socket,zoneId);

    socket.on('attackNpc',function(data){
      var attackedNpcIndex=null;
      var attackedNpc = mobsInZone.find(function(npc,index){
        if(npc.target_name === data.attackedTarget){
          attackedNpcIndex=index;
          return true;
        }
      });
      mobsInZone[attackedNpcIndex].current_stability = mobsInZone[attackedNpcIndex].current_stability - data.spDamage;
      socket.emit('consoleMessage','You attacked '+data.attackedTarget+' for '+data.spDamage+' SP points.');
      nsp.emit('localChatMessage',data.attackingUser+' has attacked '+data.attackedTarget+' for '+data.spDamage+' SP points.');
      if(mobsInZone[attackedNpcIndex].current_stability<=0){
        mobsInZone.splice(attackedNpcIndex,1);
        socket.emit('consoleMessage', data.attackedTarget+' dies.');
        nsp.emit('localChatMessage',data.attackingUser+' deals a killing blow! '+data.attackedTarget+' dies.');
      }
      nsp.emit('generateZoneNpc',mobsInZone);
    });

    //LOCAL
    socket.on('localChatMessage', function(msg){
      console.log('Local Chat Message sent: '+msg);
      nsp.emit('localChatMessage',msg);
    });

    socket.on('changeZone',function(data){
      db.changeZoneAndEmit(socket,data.player_id,data.zone_id);
    });

    socket.on('disconnect',function(){
      console.log('User '+socket.username+' disconnected from the zone.');
      var disconnectedId = null;
      for(var i = 0 ; i < usersInZone.length ; i++){
        if(usersInZone[i]===socket.username){
          disconnectedId = i;
        }
      }
      usersInZone.splice(disconnectedId,1);
      nsp.emit('usersInZone',usersInZone);
    });

  });
}

module.exports = {
  onConnectionToZoneNsp:onConnectionToZoneNsp,
  mobSpawn:mobSpawn,
  resourceSpawn:resourceSpawn,
  initializeZones:initializeZones
}
