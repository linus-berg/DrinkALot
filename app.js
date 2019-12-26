'use strict';
var express = require('express');
var io = require('socket.io');
var http = require('http');
const raspi = require('raspi');
const pwm = require('raspi-pwm');
const gpio = require('raspi-gpio');

var app = express();
var srv = http.createServer(app);
var socket = io(srv);
const PORT = 3000;

var pumps = [];

raspi.init(() = > {
  pumps[0] = {
    pwm: new pwm.PWM('P1-12'),
    pin: new gpio.DigitalOutput('P1-8'),
    state: 0
  }
}

app.use(express.static('./public'));

socket.on('connection', function(client) {
  client.on('POUR', function(percent) {
    console.log("POURING:" + percent + '%');
    pumps[0].pwm.write((percent/100));
    pumps[0].pin.write(1);
  });

  client.on('STOP', function(percent) {
    console.log("STOPPING");
    pumps[0].pwm.write(0);
    pumps[0].pin.write(0);
  });

  client.on('disconnect', (reason) => console.log(reason));
})

srv.listen(PORT, function(){
  console.log('Server started on *:' + PORT);
});
