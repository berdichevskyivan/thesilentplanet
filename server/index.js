const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const socketio = require('socket.io');
//const { Client, Pool } = require('pg');
const db = require('./dbcontroller.js');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  var server = app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });

  const io = socketio(server);
  const firstZoneNsp = io.of('/first-zone-namespace');

  io.on('connection',function(socket){
    socket.username = socket.handshake.query.username;
    console.log('User '+socket.username+' has connected.');

    socket.on('disconnect', function(){
      console.log('User disconnected');
    });

    socket.on('getPlayerInformation',function(data){
      db.getPlayerInfoAndEmit(socket,data);
      db.getPlayerEquipmentAndEmit(socket,data);
      db.getPlayerResourcesAndEmit(socket,data);
      db.getPlayerItemsAndEmit(socket,data);
    });

    //SENDER
    socket.on('consoleMessage', function(msg){
      console.log('Console Message sent: '+msg);
      socket.emit('consoleMessage',msg);
    });

    //LOCAL
    socket.on('localChatMessage', function(msg){
      console.log('Local Chat Message sent: '+msg);
      firstZoneNsp.emit('localChatMessage',msg);
    });

    //GLOBAL
    socket.on('globalChatMessage', function(msg){
      console.log('Global Chat Message sent: '+msg);
      io.emit('globalChatMessage',msg);
    });

  });

  const mobsInFirstZone = [];
  const resourcesInFirstZone = [];

  let mobCount = 0;
  let resourceCount = 0;

  const mobSpawn = (nsp,mobsInFirstZone)=>{
    setInterval(()=>{
      console.log('Generating Mob for Zone 1');
      db.getNpcFromZoneAndEmit(1,nsp,mobsInFirstZone,mobCount);
      mobCount++;
    },5000);
  };

  const resourceSpawn = (nsp,resourcesInFirstZone)=>{
    setInterval(()=>{
      console.log('Generating Resource for Zone 1');
      db.getResourceFromZoneAndEmit(1,nsp,resourcesInFirstZone,resourceCount);
    },5000);
  };

  mobSpawn(firstZoneNsp,mobsInFirstZone);
  resourceSpawn(firstZoneNsp,resourcesInFirstZone);

  firstZoneNsp.on('connection',function(socket){
    socket.username = socket.handshake.query.username;
    console.log('User '+socket.username+' has joined the First Zone.');
    db.getZoneInformationAndEmit(socket,1);
    socket.on('attackNpc',function(data){
      var attackedNpcIndex=null;
      var attackedNpc = mobsInFirstZone.find(function(npc,index){
        if(npc.target_name === data.attackedTarget){
          attackedNpcIndex=index;
          return true;
        }
      });
      mobsInFirstZone[attackedNpcIndex].current_stability = mobsInFirstZone[attackedNpcIndex].current_stability - data.spDamage;
      socket.emit('consoleMessage','You attacked '+data.attackedTarget+' for '+data.spDamage+' SP points.');
      firstZoneNsp.emit('localChatMessage',data.attackingUser+' has attacked '+data.attackedTarget+' for '+data.spDamage+' SP points.');
      if(mobsInFirstZone[attackedNpcIndex].current_stability<=0){
        mobsInFirstZone.splice(attackedNpcIndex,1);
        socket.emit('consoleMessage', data.attackedTarget+' dies.');
        firstZoneNsp.emit('localChatMessage',data.attackingUser+' deals a killing blow! '+data.attackedTarget+' dies.');
      }
      firstZoneNsp.emit('generateZoneNpc',mobsInFirstZone);
    });
  });

}
