const usersInZone = [];

const mobSpawn = (db,nsp,mobsInZone,mobCount,zoneId)=>{
  setInterval(()=>{
    console.log('Generating Mob for Zone '+zoneId);
    db.getNpcFromZoneAndEmit(1,nsp,mobsInZone,mobCount);
    mobCount++;
  },120000);
};

const resourceSpawn = (db,nsp,resourcesInZone,resourceCount,zoneId)=>{
  setInterval(()=>{
    console.log('Generating Resource for Zone '+zoneId);
    db.getResourceFromZoneAndEmit(1,nsp,resourcesInZone,resourceCount);
    resourceCount++;
  },110000);
};

const onConnectionToZoneNsp = (nsp,db,mobsInZone)=>{
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
    db.getZoneInformationAndEmit(socket,1);

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
  resourceSpawn:resourceSpawn
}
