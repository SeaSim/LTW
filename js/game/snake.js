/*
  L'oggetto 'snake' gestisce il serpente: la creazione, i movimenti, le collissioni (con se stesso ed i bordi)
  ed inoltre gestisce l'allungamento (aggiungendo un box in testa) in caso di collisione con il cibo.
*/

var snake;

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
    if (snake.collide(snake.x, snake.y) === true) {
      gioco.stop();
    }
  },

  collide: function(x, y) {
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
