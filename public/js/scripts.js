const slider_id = '#mixer-slider';
$(slider_id).slider({
  range: 'min',
  min: 0,
  max: 100,
  value: 50,
  animate: 400,
  classes: {
    'ui-slider': 'ui-corner-all',
    'ui-slider-handle': 'default-hdl',
    'ui-slider-range': 'slider-colour-gradient',
  }
});

var socket = io();

function StartPour() {
  socket.emit('POUR', $(slider_id).slider('value'));
}

function StopPour() {
  socket.emit('STOP');
}

function Roll() {
  $(slider_id).slider('value', Math.random() * 100);
}

$('.ui-slider-handle').append('<div id="mixer-slider-hdl"></div>');
$('#mixer-slider-hdl').append('<img id="mixer-slider-hdl-img" src="img/smalljack-fs8.png">');

setInterval(function() {
  $('#countdown').text(countdown(new Date(2020, 0, 1)).toString());
}, 500);

$('#pour').on('touchstart', function (evt) {
  evt.preventDefault();
  StartPour();
  return false;
});

$('#pour').on('touchend', function (evt) {
  evt.preventDefault();
  StopPour();
  return false;
});

$('#pour').on('mousedown', function (evt) {
  evt.preventDefault();
  StartPour();
  return false;
});

$('#pour').on('mouseup', function (evt) {
  evt.preventDefault();
  StopPour();
  return false;
});

$('#roll').on('click', function (evt) {
  evt.preventDefault();
  Roll();
  return false;
});
