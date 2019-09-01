const db = require('./dbcontroller.js');
const tradeController = require('./tradeController.js');
const itemController = require('./itemController.js');

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
        onConnectionToZoneNsp(availableZones[i].zone_nsp,db,availableZones[i].mobsInZone,availableZones[i].resourcesInZone,availableZones[i].zone_id,availableZones[i].usersInZone,availableZones[i].zone_name);
        mobSpawn(db,availableZones[i].zone_nsp,availableZones[i].mobsInZone,availableZones[i].mobCountInZone,availableZones[i].zone_id,availableZones[i].usersInZone);
        npcAttack(db,availableZones[i].zone_nsp,availableZones[i].mobsInZone,availableZones[i].mobCountInZone,availableZones[i].zone_id,availableZones[i].usersInZone);
        resourceSpawn(db,availableZones[i].zone_nsp,availableZones[i].resourcesInZone,availableZones[i].resourceCountInZone,availableZones[i].zone_id,availableZones[i].usersInZone);
      }

    }
  });
}

const mobSpawn = (db,nsp,mobsInZone,mobCount,zoneId,usersInZone)=>{
  db.getNpcFromZoneAndEmit(zoneId,nsp,mobsInZone,mobCount);
  mobCount++;
  db.getNpcFromZoneAndEmit(zoneId,nsp,mobsInZone,mobCount);
  mobCount++;
  setInterval(()=>{
    if(usersInZone.length>0){
      console.log('Generating Mob for Zone '+zoneId);
      db.getNpcFromZoneAndEmit(zoneId,nsp,mobsInZone,mobCount);
      mobCount++;
    }
  },220000);
};

const resourceSpawn = (db,nsp,resourcesInZone,resourceCount,zoneId,usersInZone)=>{
  db.getResourceFromZoneAndEmit(zoneId,nsp,resourcesInZone,resourceCount);
  resourceCount++;
  setInterval(()=>{
    if(usersInZone.length>0){
      console.log('Generating Resource for Zone '+zoneId);
      db.getResourceFromZoneAndEmit(zoneId,nsp,resourcesInZone,resourceCount);
      resourceCount++;
    }
  },70000);
};

const npcAttack = (db,nsp,mobsInZone,mobCount,zoneId,usersInZone)=>{
  setInterval(()=>{
    if(usersInZone.length>0 && mobsInZone.length>0){
        (async ()=>{
          for(let i = 0; i < mobsInZone.length;i++){
            let mobInZone = mobsInZone[i];
            let attackingUser = mobInZone.attacking_user;

            if(typeof attackingUser === 'undefined'){
              console.log('Noone is attacking '+mobInZone.target_name+'. Choosing a random target.');
              let user = retrieveRandomUserFromZoneUsers(usersInZone);
              console.log('Will attack '+user.username);
              mobInZone.attacking_user = user.username;
              let attackResult = await db.npcAttackUserAndEmit(nsp,user,mobInZone);
              console.log('this is attackResult');
              console.log(attackResult);
              if(attackResult) break;
            }else{
              console.log(attackingUser+' is attacking '+mobInZone.target_name+'. Attacking it in return.');
              console.log('retrieving user from json array...');
              let user = retrieveUserFromZoneUsers(attackingUser,usersInZone);
              if(user){
                console.log(user);
                let attackResult = await db.npcAttackUserAndEmit(nsp,user,mobInZone);
                console.log('this is attackResult');
                console.log(attackResult);
                if(attackResult) break;
              }else{
                console.log('user is no longer connected');
                console.log('retrieving new random user');
                //Choose a new target
                user = retrieveRandomUserFromZoneUsers(usersInZone);
                console.log('Will attack '+user.username);
                mobInZone.attacking_user = user.username;
                let attackResult = await db.npcAttackUserAndEmit(nsp,user,mobInZone);
                console.log('this is attackResult');
                console.log(attackResult);
                if(attackResult) break;
              }
            }
          }
          nsp.emit('generateZoneNpc',mobsInZone);
        })().catch(err=>console.log(err));
    }
  },5000);
};

const retrieveUserFromZoneUsers = (username,usersInZone)=>{
  let user = false;
  for(let i = 0 ; i < usersInZone.length ; i++){
    if(usersInZone[i].username===username){
      user = usersInZone[i];
    }
  }
  return user;
}

const retrieveRandomUserFromZoneUsers = (usersInZone)=>{
  let user = false;
  let randomIndex = Math.floor((Math.random() * usersInZone.length));
  user = usersInZone[randomIndex];
  return user;
}

const onConnectionToZoneNsp = (nsp,db,mobsInZone,resourcesInZone,zoneId,usersInZone,zoneName)=>{
  nsp.on('connection',function(socket){
    socket.username = socket.handshake.query.username;
    console.log('User '+socket.username+' has joined '+zoneName);
    var shouldPush = true;
    for(var i = 0 ; i < usersInZone.length ; i++){
      if(usersInZone[i].username===socket.username){
        shouldPush = false;
      }
    }
    if(shouldPush){
      usersInZone.push({
        username:socket.username,
        socketId:socket.id
      });
    }

    nsp.emit('usersInZone',usersInZone);
    nsp.emit('generateZoneNpc',mobsInZone);
    nsp.emit('generateZoneResources',resourcesInZone);
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
      if(typeof mobsInZone[attackedNpcIndex] === 'undefined'){
        nsp.emit('generateZoneNpc',mobsInZone);
      }else{
        mobsInZone[attackedNpcIndex].current_stability = mobsInZone[attackedNpcIndex].current_stability - data.spDamage;
        mobsInZone[attackedNpcIndex].attacking_user = data.attackingUser;
        socket.emit('consoleMessage','You attacked '+data.attackedTarget+' for '+data.spDamage+' SP points.');
        nsp.emit('localChatMessage',data.attackingUser+' has attacked '+data.attackedTarget+' for '+data.spDamage+' SP points.');
        if(mobsInZone[attackedNpcIndex].current_stability<=0){
          db.lootNpcAndEmit(mobsInZone[attackedNpcIndex],socket);
          mobsInZone.splice(attackedNpcIndex,1);
          socket.emit('consoleMessage', data.attackedTarget+' dies.');
          nsp.emit('localChatMessage',data.attackingUser+' deals a killing blow! '+data.attackedTarget+' dies.');
        }
        nsp.emit('generateZoneNpc',mobsInZone);
      }
    });

    socket.on('repairNpc',function(data){
      var repairedNpcIndex=null;
      var repairedNpc = mobsInZone.find(function(npc,index){
        if(npc.target_name === data.repairedTarget){
          repairedNpcIndex=index;
          return true;
        }
      });

      if(typeof mobsInZone[repairedNpcIndex] === 'undefined'){
        nsp.emit('generateZoneNpc',mobsInZone);
      }else{
        var currentHealth = mobsInZone[repairedNpcIndex].current_stability;
        var totalHealth = mobsInZone[repairedNpcIndex].stability;

        if(currentHealth===totalHealth){
          socket.emit('consoleMessage',data.repairedTarget+' already has full health.');
          return;
        }

        if((currentHealth+data.spRepair)>totalHealth){
          mobsInZone[repairedNpcIndex].current_stability = totalHealth;
          socket.emit('consoleMessage','You repaired '+data.repairedTarget+' for '+data.spRepair+' SP points.');
          nsp.emit('localChatMessage',data.repairingUser+' has repaired '+data.repairedTarget+' for '+data.spRepair+' SP points.');
        }else{
          mobsInZone[repairedNpcIndex].current_stability = currentHealth+data.spRepair;
          socket.emit('consoleMessage','You repaired '+data.repairedTarget+' for '+data.spRepair+' SP points.');
          nsp.emit('localChatMessage',data.repairingUser+' has repaired '+data.repairedTarget+' for '+data.spRepair+' SP points.');
        }

        nsp.emit('generateZoneNpc',mobsInZone);
      }

    });

    socket.on('stealFromNpc',function(data){
      var stolenFromNpcIndex=null;
      var stolenFromNpc = mobsInZone.find(function(npc,index){
        if(npc.target_name === data.stolenFromTarget){
          stolenFromNpcIndex=index;
          return true;
        }
      });

      if(typeof mobsInZone[stolenFromNpcIndex] === 'undefined'){
        nsp.emit('generateZoneNpc',mobsInZone);
      }else{
        var currentCurrency = mobsInZone[stolenFromNpcIndex].current_currency;
        var totalCurrency = mobsInZone[stolenFromNpcIndex].currency;

        if(currentCurrency===0){
          socket.emit('consoleMessage',data.stolenFromTarget+' has nothing you could steal.');
          return;
        }

        if((currentCurrency-data.amountStolen)>0){
          mobsInZone[stolenFromNpcIndex].current_currency = (currentCurrency-data.amountStolen);
          db.stealFromNpcAndEmit(socket,nsp,data.amountStolen,data);
        }else{
          mobsInZone[stolenFromNpcIndex].current_currency = 0;
          db.stealFromNpcAndEmit(socket,nsp,currentCurrency,data);
        }

        nsp.emit('generateZoneNpc',mobsInZone);
      }

    });

    socket.on('talkToNpc',function(data){
      db.getNpcDialogueAndEmit(socket,nsp,data);
    });

    socket.on('tradeWithNpc',function(data){
      tradeController.initializeTradingWithNpc(data,socket,nsp,mobsInZone);
    });

    socket.on('collectResource',function(data){
      db.addResourceToPlayerAndEmit(data,resourcesInZone,nsp,socket);
    });

    socket.on('useItem',function(data){
      console.log(data);
      itemController.useItemAndEmit(socket,data);
    });

    socket.on('equipItem',function(data){
      itemController.equipItemAndEmit(socket,data);
    });

    socket.on('unequipItem',function(data){
      itemController.unequipItemAndEmit(socket,data);
    });

    socket.on('craftItem',(data)=>{
      console.log(data);
      itemController.craftItemAndEmit(socket,data);
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
      console.log('User '+socket.username+' has disconnected from '+zoneName);
      var disconnectedId = null;
      for(var i = 0 ; i < usersInZone.length ; i++){
        if(usersInZone[i].username===socket.username){
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
