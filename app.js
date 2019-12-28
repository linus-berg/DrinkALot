'use strict';
const express = require('express');
const io = require('socket.io');
const http = require('http');

/* Raspi Comms */
const raspi = require('raspi');
const pwm = require('raspi-pwm');
const gpio = require('raspi-gpio');

const Pump = require('./classes/pump.js');
const Logger = require('./classes/logging.js');

var app = express();
var srv = http.createServer(app);
var socket = io(srv);
const PORT = 3000;

/* 
 * Motor A(0) (RIGHT PIPE, LEFT SUCTION)
 * PWM: 12
 * IN1: 8
 * IN2: 40
 * Motor B(1) (LEFT PIPE, RIGHT SUCTION)
 * PWM: 33
 * IN1: 16
 * IN2: 36
 */
var pumps = [];
raspi.init(() => {
  /* Right Pipe, Left Suction */
  pumps[0] = new Pump(new pwm.PWM('P1-12'), new gpio.DigitalOutput('P1-8'),
                      new gpio.DigitalOutput('P1-40'));
  /* Left Pipe, Right Suction */
  pumps[1] = new Pump(new pwm.PWM('P1-33'), new gpio.DigitalOutput('P1-16'),
                      new gpio.DigitalOutput('P1-36'))
});

app.use(express.static('./public'));
app.use(require('./routes/health.js')(pumps[0], pumps[1]));

socket.on('connection', function(client) {
  client.on('POUR', function(mix) {
    const jack = mix / 100;
    pumps[0].Run(jack);
    pumps[1].Run(1 - jack);
    Logger.SourceLog(mix);
  });

  client.on('STOP', function(percent) {
    pumps[0].Stop(); 
    pumps[1].Stop(); 
    Logger.SinkLog();
  });

  client.on('disconnect', (reason) => console.log(reason));
});

srv.listen(PORT, function(){
  console.log('Server started on *:' + PORT);
});
