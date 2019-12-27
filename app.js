'use strict';
const express = require('express');
const io = require('socket.io');
const http = require('http');
const raspi = require('raspi');
const pwm = require('raspi-pwm');
const gpio = require('raspi-gpio');
const winston = require('winston');

const Pump = require('./classes/pump.js');

var app = express();
var srv = http.createServer(app);
var socket = io(srv);
const PORT = 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'info.log', level: 'info', timestamp: true}),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});


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
socket.on('connection', function(client) {
  client.on('POUR', function(percent) {
    const jack = percent / 100;
    pumps[0].Run(jack);
    pumps[1].Run(1 - jack);
    logger.info('Pouring ' + percent + '% Jack with ' + 100 - percent + '% coke.');
  });

  client.on('STOP', function(percent) {
    pumps[0].Stop(); 
    pumps[1].Stop(); 
    logger.info('Stopped Pouring');
  });

  client.on('disconnect', (reason) => console.log(reason));
})

srv.listen(PORT, function(){
  console.log('Server started on *:' + PORT);
});
