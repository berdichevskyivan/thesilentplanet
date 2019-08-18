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

  io.on('connection',function(socket){

    const socketID = socket.id;

    console.log('A User connected');

    socket.on('disconnect', function(){
      console.log('User disconnected');
    });

    //GLOBAL
    socket.on('chat message', function(msg){
      console.log('Message sent: '+msg);
      io.emit('chat message',msg);
    });

    socket.on('getPlayerInformation',function(data){
      db.getPlayerInfoAndEmit(socket,data);
      db.getPlayerResourcesAndEmit(socket,data);
      db.getPlayerItemsAndEmit(socket,data);
      db.getZoneInformationAndEmit(socket,data);
      db.getZoneNPCAndEmit(socket,data);
      db.getZoneResourcesAndEmit(socket,data);
    });

  });

}
