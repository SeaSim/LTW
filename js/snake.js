var canvas = document.getElementById("snake");
var context = canvas.getContext("2d");
var gioco, snake, cibo;

gioco = {

  punteggio: 0,
  fps: 8,
  over: false,
  messaggio: null,
  resettato: true,

  start: function() {
    gioco.over = false;
    gioco.messaggio = null;
    gioco.punteggio = 0;
    gioco.fps = 8;
    snake.init();
    cibo.set();
  },

  stop: function() {
    if (typeof(Storage) !== "undefined") {
      if(localStorage.bestscore){
        if(gioco.punteggio > localStorage.bestscore){
          localStorage.bestscore = gioco.punteggio;
        }
      } else {
        localStorage.bestscore = gioco.punteggio;
      }
    }
    document.getElementById("status").innerHTML = 'Miglior punteggio: ' + localStorage.bestscore;
    gioco.over = true;
    gioco.messaggio = 'Premi spacebar per iniziare ';
  },

  creaBox: function(x, y, size, colore) {
    context.fillStyle = colore;
    context.beginPath();
    context.moveTo(x - (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y - (size / 2));
    context.lineTo(x + (size / 2), y + (size / 2));
    context.lineTo(x - (size / 2), y + (size / 2));
    context.closePath();
    context.fill();
  },

  creaPunteggio: function() {
    context.fillStyle = '#999';
    context.font = (50) + 'px Impact, sans-serif';
    context.textAlign = 'center';
    context.fillText(gioco.punteggio, canvas.width * 0.9, canvas.height * 0.1);
  },

  creaMessaggio: function() {
    if (gioco.messaggio !== null) {
      context.fillStyle = '#00F';
      context.strokeStyle = '#FFF';
      context.font = (30) + 'px Impact';
      context.textAlign = 'center';
      context.fillText(gioco.messaggio, canvas.width/2, canvas.height/2);
      context.strokeText(gioco.messaggio, canvas.width/2, canvas.height/2);
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
  colore: '#0F0',
  direzione: 'sinistra',
  sezioni: [],

  init: function() {
    snake.sezioni = [];
    snake.direzione = 'sinistra';
    snake.x = canvas.width / 2 + snake.size / 2;
    snake.y = canvas.height /2 + snake.size / 2;
    for (i = snake.x + (5 * snake.size); i >= snake.x; i-=snake.size) {
      snake.sezioni.push(i + ',' + snake.y);
    }
  },

  muovi: function() {
    switch(snake.direzione) {
      case 'su':
        snake.y-=snake.size;
        break;
      case 'giu':
        snake.y+=snake.size;
        break;
      case 'sinistra':
        snake.x-=snake.size;
        break;
      case 'destra':
        snake.x+=snake.size;
        break;
    }
    snake.checkCollisione();
    snake.checkCrescita();
    snake.sezioni.push(snake.x + ',' + snake.y);
  },

  crea: function() {
    for (i = 0; i < snake.sezioni.length; i++) {
      snake.creaSezione(snake.sezioni[i].split(','));
    }
  },

  creaSezione: function(section) {
    gioco.creaBox(parseInt(section[0]), parseInt(section[1]), snake.size, snake.colore);
  },

  checkCollisione: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      gioco.stop();
    }
  },

  isCollision: function(x, y) {
    if (x < snake.size/2 ||
        x > canvas.width ||
        y < snake.size/2 ||
        y > canvas.height ||
        snake.sezioni.indexOf(x+','+y) >= 0) {
      return true;
    }
  },

  checkCrescita: function() {
    if (snake.x == cibo.x && snake.y == cibo.y) {
      gioco.punteggio++;
      if (gioco.punteggio % 5 == 0 && gioco.fps < 60) {
        gioco.fps++;
      }
      cibo.set();
    } else {
      snake.sezioni.shift();
    }
  }

};

cibo = {

  size: null,
  x: null,
  y: null,
  colore: '#0FF',

  set: function() {
    cibo.size = snake.size;
    cibo.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    cibo.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;
  },

  crea: function() {
    gioco.creaBox(cibo.x, cibo.y, cibo.size, cibo.colore);
  }

};

direzioniInverse = {
  'su':'giu',
  'sinistra':'destra',
  'destra':'sinistra',
  'giu':'su'
};

keys = {
  su: [38, 75, 87],
  giu: [40, 74, 83],
  sinistra: [37, 65, 72],
  destra: [39, 68, 76],
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
  if(gioco.resettato == false){
    ultimaKey = keys.getKey(e.keyCode);
    if (['su', 'giu', 'sinistra', 'destra'].indexOf(ultimaKey) >= 0
        && ultimaKey != direzioniInverse[snake.direzione]) {
      snake.direzione = ultimaKey;
    } else if (['start_game'].indexOf(ultimaKey) >= 0 && gioco.over) {
      gioco.start();
    }
  }
}, false);

var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop() {
  if (gioco.over == false) {
    gioco.resetCanvas();
    gioco.creaPunteggio();
    snake.muovi();
    cibo.crea();
    snake.crea();
    gioco.creaMessaggio();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / gioco.fps);
};

function resetSnake() {
  gioco.over = true;
  gioco.resettato = true;
  gioco.resetCanvas();
};

function startSnake() {
  gioco.resettato = false;
  requestAnimationFrame(loop);
}
