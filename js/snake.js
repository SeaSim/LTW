var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

game = {

  score: 0,
  fps: 8,
  over: false,
  message: null,
  resetted: true,

  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    snake.init();
    food.set();
  },

  stop: function() {
    game.over = true;
    game.message = 'GAME OVER - PRESS SPACEBAR';
    console.log("canvas width: " + canvas.width + "; canvas height: " + canvas.height);

  },

  drawBox: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  drawScore: function() {
    context.fillStyle = '#999';
    context.font = (canvas.height) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.fillText(game.score, canvas.width/2, canvas.height  * .9);
  },

  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (canvas.height / 10) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width/2, canvas.height/2);
      context.strokeText(game.message, canvas.width/2, canvas.height/2);
    }
  },

  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

};

snake = {

  size: canvas.width /40,
  x: null,
  y: null,
  color: '#0F0',
  direction: 'left',
  sections: [],

  init: function() {
    snake.sections = [];
    snake.direction = 'left';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height /2 + snake.size / 2;
    for (i = snake.x + (5 * snake.size); i >= snake.x; i-=snake.size) {
      snake.sections.push(i + ',' + snake.y);
    }
  },

  move: function() {
    switch(snake.direction) {
      case 'up':
        snake.y-=snake.size;
        break;
      case 'down':
        snake.y+=snake.size;
        break;
      case 'left':
        snake.x-=snake.size;
        break;
      case 'right':
        snake.x+=snake.size;
        break;
    }
    snake.checkCollision();
    snake.checkGrowth();
    snake.sections.push(snake.x + ',' + snake.y);
  },

  draw: function() {
    for (i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i].split(','));
    }
  },

  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.color);
  },

  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      game.stop();
    }
  },

  isCollision: function(x, y) {
    if (x < snake.size/2 ||
        x > canvas.width ||
        y < snake.size/2 ||
        y > canvas.height ||
        snake.sections.indexOf(x+','+y) >= 0) {
      return true;
    }
  },

  checkGrowth: function() {
    if (snake.x == food.x && snake.y == food.y) {
      game.score++;
      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      food.set();
    } else {
      snake.sections.shift();
    }
  }

};

food = {

  size: null,
  x: null,
  y: null,
  color: '#0FF',

  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
  },

  draw: function() {
    game.drawBox(food.x, food.y, food.size, food.color);
  }

};

inverseDirection = {
  'up':'down',
  'left':'right',
  'right':'left',
  'down':'up'
};

keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] instanceof Array && this[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
};

addEventListener("keydown", function (e) {
  if(game.resetted == false){
    lastKey = keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
  }
}, false);

var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop() {
  if (game.over == false) {
    game.resetCanvas();
    game.drawScore();
    snake.move();
    food.draw();
    snake.draw();
    game.drawMessage();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};

function resetSnake() {
  game.over = true;
  game.resetted = true;
  game.resetCanvas();
};

function startSnake() {
  game.resetted = false;
  requestAnimationFrame(loop);
}