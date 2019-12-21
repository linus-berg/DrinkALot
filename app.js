'use strict';
var express = require('express');
var io = require('socket.io');
var http = require('http');


var app = express();
var srv = http.createServer(app);
var socket = io(srv);
const PORT = 3000;
app.use(express.static('./public'));

socket.on('connection', function(client) {
  client.on('POUR', function() {
    console.log("POURING");
  });

  client.on('STOP', function() {
    console.log("STOPPING");
  });

  client.on('disconnect', (reason) => console.log(reason));
})

srv.listen(PORT, function(){
  console.log('Server started on *:' + PORT);
});
