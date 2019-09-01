const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const socketio = require('socket.io');
const db = require('./dbcontroller.js');
const zoneController = require('./zoneController.js');

const isDev = process.env.NODE_ENV !== 'production';
//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5000;

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

var loggedInUsers = {};

io.on('connection',function(socket){
  socket.username = socket.handshake.query.username;
  socket.userUniqueID = socket.handshake.query.userUniqueID;
  if(typeof socket.username != 'undefined' && typeof socket.userUniqueID != 'undefined'){
    if(loggedInUsers[socket.username]===socket.userUniqueID){
      socket.emit('sessionStatus',{sessionStatus:'valid'});
      console.log('User '+socket.username+' has connected.');
      //GET PLAYER INFORMATION
      socket.on('getPlayerInformation',function(){
        db.getPlayerInfoAndEmit(socket);
        db.getPlayerEquipmentAndEmit(socket);
        db.getPlayerResourcesAndEmit(socket);
        db.getPlayerItemsAndEmit(socket);
        db.getPlayerBlueprintsAndEmit(socket);
      });
      //SENDER
      socket.on('consoleMessage', function(msg){
        console.log('Console Message sent: '+msg);
        socket.emit('consoleMessage',msg);
      });

      //GLOBAL
      socket.on('globalChatMessage', function(msg){
        console.log('Global Chat Message sent: '+msg);
        io.emit('globalChatMessage',msg);
      });

      socket.on('logout',function(){
        console.log('User '+socket.username+' logged out.');
        delete loggedInUsers[socket.username];
        socket.emit('logout',{});
      });

    }else{
      console.log('Someone has connected.');
      socket.emit('sessionStatus',{sessionStatus:'invalid'});
      socket.on('submitLogin', function(data){
        let username = data.username;
        let password = data.password;
        db.verifyUsernameAndPasswordAndEmit(socket,username,password,loggedInUsers);
      });

      socket.on('submitSignup', function(data){
        let username = data.username;
        let password = data.password;
        db.insertUsernameAndPasswordAndEmit(socket,username,password,loggedInUsers);
      });
    }
  }else{
    console.log('Someone has connected.');
    socket.emit('sessionStatus',{sessionStatus:'invalid'});
    socket.on('submitLogin', function(data){
      let username = data.username;
      let password = data.password;
      db.verifyUsernameAndPasswordAndEmit(socket,username,password,loggedInUsers);
    });

    socket.on('submitSignup', function(data){
      let username = data.username;
      let password = data.password;
      db.insertUsernameAndPasswordAndEmit(socket,username,password,loggedInUsers);
    });
  }

  socket.on('disconnect', function(){
    console.log('User disconnected');
  });

});

zoneController.initializeZones(io);
