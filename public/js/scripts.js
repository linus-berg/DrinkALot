$("#mixer").slider({
  range: "min",
  min: 0,
  max: 100,
  value: 50,
  animate: 400,
  classes: {
    "ui-slider": "ui-corner-all",
    "ui-slider-handle": "bg_transparent",
    "ui-slider-range": "slider-range",
  }
});

//$('.ui-slider-handle').draggable();
var socket = io();

function StartPour() {
  console.log('STARTED POURING');
  socket.emit('POUR', $('#mixer').slider('value'));
}

function StopPour() {
  console.log('STOPPED POURING');
  socket.emit('STOP');
}
function Roll() {
  $('#mixer').slider('value', Math.random() * 100);
  var audio = new Audio('pickle_rick.mp3');
  //audio.play();
  //$('#inner-wrapper').append('<div class="scroll">test</div>');
  //$('.rnd').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) {
  // $(this).remove();
  //});
}

$('.ui-slider-handle').append('<div id="hdl"></div>');
$('#hdl').append('<img id="hdl_img" src="jack.png">');

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
