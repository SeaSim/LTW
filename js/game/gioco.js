/*
  L'oggetto 'gioco' gestisce le funzioni di start e stop del gioco, e quelle necessarie
  alla stampa di messaggi quali il punteggio, game over, ecc.
  Una funzione importante e usata spesso all'interno degli script è creaBox che permette di
  disegnare graficamente all'interno del canvas un box (corpo del serpente, cibo, ecc).
*/

var gioco;

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
          localStorage.bestplayer = localStorage.player;
          localStorage.bestscore = gioco.punteggio;
        }
      } else {
        localStorage.bestplayer = localStorage.player;
        localStorage.bestscore = gioco.punteggio;
      }
    }
    document.getElementById("status").innerHTML = 'Miglior punteggio: ' + localStorage.bestscore + ', di ' + localStorage.bestplayer;
    gioco.over = true;
    gioco.messaggio = 'Premi SPAZIO per iniziare ';
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
