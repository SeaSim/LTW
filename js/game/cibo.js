/*
  L'oggetto 'cibo' instanzia un quadrato della stessa dimensione di un blocco del serpente (snake.size).
  Genera due coordinate random all'interno del canvas in modo da essere situate nella stessa griglia virtuale
  del serpente, per poter effetuare la collisione con la testa.
  Offre la funzione 'crea' per disegnare il box del cibo nel canvas.
*/

var cibo;

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
