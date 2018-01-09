/*
  In helpers.js sono presenti una serie di oggetti e funzioni che vengono richiamati spesso all'interno degli altri
  script nonché dalla pagina html (per esempio per lo start e stop del gioco).
  Tra le funzioni più importanti c'è quella per il controllo dei tasti premuti e la funzione 'loop' che
  chiama ciclicamente una serie di funzioni in tutti gli script per eseguire controlli, spostamenti e riaggiornare
  il canvas. La velocità del gioco viene gestita tramite gli fps, che vengono aumentanti di 1 ogni 5 cibi mangiati
  fino ad un massimo di 60, dando così l'effetto dell'aumento della velocità.
*/

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
