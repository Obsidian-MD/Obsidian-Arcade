import { registerGame } from "../arcade.js";

const PACIENCIA_HTML = String.raw`<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  -webkit-touch-callout:none;
}

body{
  margin:0;
  background:transparent;
  font-family:Arial,Helvetica,sans-serif;
  overflow:hidden;
}

.wrap{
  width:100%;
  max-width:430px;
  margin:auto;
}

.game{
  position:relative;
  width:100%;
  height:650px;
  overflow:hidden;
  border-radius:28px;
  background:
    radial-gradient(circle at 50% 15%,rgba(0,220,255,.14),transparent 30%),
    linear-gradient(180deg,#050718 0%,#071329 55%,#02030b 100%);
  border:1px solid rgba(0,235,255,.35);
  box-shadow:
    0 0 35px rgba(0,200,255,.18),
    inset 0 0 50px rgba(0,120,255,.08);
  color:#fff;
}

.stars{
  position:absolute;
  inset:0;
  pointer-events:none;
  background-image:
    radial-gradient(circle,#fff 1px,transparent 1px),
    radial-gradient(circle,#5cecff 1px,transparent 1px);
  background-size:70px 70px,110px 110px;
  background-position:10px 20px,35px 5px;
  opacity:.3;
  animation:stars 10s linear infinite;
}

@keyframes stars{
  from{transform:translateY(0)}
  to{transform:translateY(70px)}
}

.hud{
  position:absolute;
  z-index:20;
  top:14px;
  left:14px;
  right:14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
}

.logo{
  color:#7df6ff;
  font-weight:900;
  font-size:13px;
  letter-spacing:1.5px;
  text-shadow:0 0 12px #00eaff;
}

.stats{
  display:flex;
  gap:5px;
}

.stat{
  padding:7px 9px;
  border:1px solid rgba(0,240,255,.35);
  border-radius:11px;
  background:rgba(0,10,25,.78);
  color:#a9c7d0;
  font-size:10px;
  white-space:nowrap;
}

.stat b{
  color:#00edff;
}

.table{
  position:absolute;
  z-index:5;
  left:8px;
  right:8px;
  top:66px;
  bottom:72px;
}

.top-row{
  position:absolute;
  left:0;
  right:0;
  top:0;
  height:74px;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
}

.stock-area{
  position:relative;
  width:54px;
  height:70px;
}

.waste-area{
  position:relative;
  width:54px;
  height:70px;
  margin-left:-28px;
}

.foundations{
  display:flex;
  gap:5px;
  margin-left:auto;
}

.slot{
  position:relative;
  width:48px;
  height:66px;
  border-radius:8px;
  border:1px dashed rgba(0,235,255,.28);
  background:rgba(0,30,50,.18);
  box-shadow:inset 0 0 12px rgba(0,200,255,.05);
}

.slot-label{
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  color:rgba(100,240,255,.2);
  font-size:18px;
  font-weight:900;
}

.card{
  position:absolute;
  width:48px;
  height:66px;
  border-radius:8px;
  background:
    linear-gradient(145deg,#ffffff,#dce9ef);
  border:1px solid rgba(0,0,0,.25);
  box-shadow:
    0 3px 7px rgba(0,0,0,.45),
    0 0 5px rgba(0,220,255,.08);
  color:#111;
  cursor:pointer;
  transition:
    transform .12s,
    box-shadow .12s;
}

.card.red{
  color:#e51b54;
}

.card.black{
  color:#101820;
}

.card.face-down{
  background:
    linear-gradient(135deg,#071a35,#0a3653);
  border:2px solid #00d9f5;
  box-shadow:
    0 0 9px rgba(0,220,255,.3),
    inset 0 0 12px rgba(0,230,255,.12);
}

.card.face-down:before{
  content:"";
  position:absolute;
  inset:4px;
  border:1px solid rgba(0,240,255,.5);
  border-radius:5px;
  background:
    repeating-linear-gradient(
      45deg,
      transparent 0 5px,
      rgba(0,235,255,.08) 5px 7px
    );
}

.card.selected{
  transform:translateY(-7px);
  box-shadow:
    0 0 0 2px #00efff,
    0 0 18px rgba(0,235,255,.9);
  z-index:9999 !important;
}

.card .corner{
  position:absolute;
  left:4px;
  top:3px;
  font-size:11px;
  font-weight:900;
  line-height:12px;
  text-align:center;
}

.card .corner-bottom{
  position:absolute;
  right:4px;
  bottom:3px;
  font-size:11px;
  font-weight:900;
  line-height:12px;
  text-align:center;
  transform:rotate(180deg);
}

.card .symbol{
  font-size:24px;
  position:absolute;
  left:0;
  right:0;
  top:21px;
  text-align:center;
}

.card .mini{
  font-size:8px;
}

.tableau{
  position:absolute;
  top:88px;
  left:0;
  right:0;
  bottom:0;
  display:grid;
  grid-template-columns:repeat(7,1fr);
  gap:5px;
}

.column{
  position:relative;
  min-width:0;
  height:430px;
  border-radius:7px;
  border:1px dashed rgba(0,220,255,.12);
}

.column.empty{
  border-color:rgba(0,220,255,.25);
}

.column.empty:after{
  content:"K";
  position:absolute;
  inset:0;
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding-top:10px;
  color:rgba(0,235,255,.16);
  font-size:13px;
  font-weight:900;
}

.floating{
  position:fixed !important;
  z-index:999999 !important;
  pointer-events:none;
}

.message{
  position:absolute;
  z-index:50;
  left:50%;
  top:49%;
  transform:translate(-50%,-50%) scale(.9);
  width:82%;
  padding:12px 15px;
  border-radius:15px;
  background:rgba(3,12,25,.95);
  border:1px solid rgba(0,240,255,.55);
  box-shadow:0 0 25px rgba(0,220,255,.25);
  color:#bdfaff;
  text-align:center;
  font-size:12px;
  opacity:0;
  pointer-events:none;
  transition:.2s;
}

.message.show{
  opacity:1;
  transform:translate(-50%,-50%) scale(1);
}

.controls{
  position:absolute;
  z-index:25;
  left:12px;
  right:12px;
  bottom:13px;
  display:flex;
  justify-content:center;
  gap:7px;
}

.control{
  height:43px;
  min-width:78px;
  padding:0 10px;
  border-radius:13px;
  border:1px solid rgba(0,240,255,.4);
  background:rgba(0,20,35,.88);
  color:#7df8ff;
  font-weight:900;
  font-size:10px;
  letter-spacing:.5px;
  box-shadow:0 0 12px rgba(0,220,255,.12);
  cursor:pointer;
}

.control:active{
  transform:scale(.94);
}

.overlay{
  position:absolute;
  z-index:100;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:25px;
  background:rgba(2,4,15,.78);
  backdrop-filter:blur(6px);
}

.panel{
  width:100%;
  max-width:330px;
  padding:26px 21px;
  text-align:center;
  border-radius:24px;
  background:linear-gradient(145deg,#09182e,#050817);
  border:1px solid rgba(0,235,255,.4);
  box-shadow:0 0 35px rgba(0,200,255,.2);
}

.panel h1{
  margin:0 0 6px;
  color:#76f8ff;
  font-size:27px;
  text-shadow:0 0 15px #00eaff;
}

.panel p{
  color:#9caebe;
  font-size:12px;
  line-height:1.5;
  margin:8px 0 18px;
}

.start{
  width:100%;
  height:49px;
  border:0;
  border-radius:15px;
  color:#001016;
  background:linear-gradient(90deg,#00eaff,#66ffff);
  font-weight:900;
  letter-spacing:1px;
  box-shadow:0 0 20px rgba(0,235,255,.45);
  cursor:pointer;
}

.start:active{
  transform:scale(.96);
}

.help{
  margin-top:10px;
  color:#66818d;
  font-size:9px;
}

@media(max-width:380px){

  .game{
    height:610px;
  }

  .card,
  .slot{
    width:43px;
  }

  .card,
  .slot{
    height:60px;
  }

  .card .symbol{
    font-size:21px;
    top:20px;
  }

  .card .corner,
  .card .corner-bottom{
    font-size:9px;
  }

  .foundations{
    gap:3px;
  }

  .tableau{
    gap:4px;
  }

  .logo{
    font-size:11px;
  }

  .stat{
    padding:6px 7px;
    font-size:9px;
  }
}
</style>

<div class="wrap">

  <div class="game" id="game">

    <div class="stars"></div>

    <div class="hud">
      <div class="logo">🃏 PACIÊNCIA // X</div>

      <div class="stats">
        <div class="stat">
          MOV: <b id="moves">0</b>
        </div>

        <div class="stat">
          TEMPO: <b id="time">00:00</b>
        </div>
      </div>
    </div>

    <div class="table">

      <div class="top-row">

        <div class="stock-area" id="stockArea">
          <div class="slot">
            <div class="slot-label">↻</div>
          </div>
        </div>

        <div class="waste-area" id="wasteArea">
          <div class="slot">
            <div class="slot-label">♠</div>
          </div>
        </div>

        <div class="foundations">

          <div class="slot foundation" data-suit="♥">
            <div class="slot-label">♥</div>
          </div>

          <div class="slot foundation" data-suit="♦">
            <div class="slot-label">♦</div>
          </div>

          <div class="slot foundation" data-suit="♣">
            <div class="slot-label">♣</div>
          </div>

          <div class="slot foundation" data-suit="♠">
            <div class="slot-label">♠</div>
          </div>

        </div>

      </div>

      <div class="tableau" id="tableau">

        <div class="column" data-column="0"></div>
        <div class="column" data-column="1"></div>
        <div class="column" data-column="2"></div>
        <div class="column" data-column="3"></div>
        <div class="column" data-column="4"></div>
        <div class="column" data-column="5"></div>
        <div class="column" data-column="6"></div>

      </div>

    </div>

    <div class="message" id="message"></div>

    <div class="controls">

      <button class="control" id="newGame">
        🔄 NOVO
      </button>

      <button class="control" id="autoMove">
        ✨ AUTO
      </button>

      <button class="control" id="hint">
        💡 DICA
      </button>

    </div>

    <div class="overlay" id="overlay">

      <div class="panel">

        <h1>🃏 PACIÊNCIA X</h1>

        <p id="panelText">
          Organize as cartas nas 7 colunas,
          alternando cores e em ordem decrescente.
          <br><br>
          Complete os 4 naipes começando pelos
          Ases até chegar aos Reis.
        </p>

        <button class="start" id="start">
          INICIAR JOGO
        </button>

        <div class="help">
          Toque numa carta e depois no destino.
        </div>

      </div>

    </div>

  </div>

</div>

<script>
(function(){

var game = document.getElementById("game");
var tableauEl = document.getElementById("tableau");
var stockArea = document.getElementById("stockArea");
var wasteArea = document.getElementById("wasteArea");
var overlay = document.getElementById("overlay");
var startBtn = document.getElementById("start");
var panelText = document.getElementById("panelText");

var movesEl = document.getElementById("moves");
var timeEl = document.getElementById("time");
var messageEl = document.getElementById("message");

var foundationsEls =
  document.querySelectorAll(".foundation");

var playing = false;
var deck = [];
var stock = [];
var waste = [];
var tableau = [[],[],[],[],[],[],[]];

var foundations = {
  "♥":[],
  "♦":[],
  "♣":[],
  "♠":[]
};

var selected = null;
var moves = 0;
var seconds = 0;
var timer = null;

var suits = ["♥","♦","♣","♠"];

var values = [
  {v:1,n:"A"},
  {v:2,n:"2"},
  {v:3,n:"3"},
  {v:4,n:"4"},
  {v:5,n:"5"},
  {v:6,n:"6"},
  {v:7,n:"7"},
  {v:8,n:"8"},
  {v:9,n:"9"},
  {v:10,n:"10"},
  {v:11,n:"J"},
  {v:12,n:"Q"},
  {v:13,n:"K"}
];

/* =========================
   UTILITÁRIOS
========================= */

function isRed(card){
  return card.suit === "♥" || card.suit === "♦";
}

function formatTime(){

  var m = Math.floor(seconds / 60);
  var s = seconds % 60;

  return (
    String(m).padStart(2,"0") +
    ":" +
    String(s).padStart(2,"0")
  );
}

function updateHUD(){

  movesEl.textContent = String(moves);
  timeEl.textContent = formatTime();

}

function showMessage(text){

  messageEl.textContent = text;
  messageEl.classList.add("show");

  clearTimeout(showMessage.timer);

  showMessage.timer = setTimeout(function(){

    messageEl.classList.remove("show");

  },1400);
}

function shuffle(array){

  for(var i=array.length-1;i>0;i--){

    var j =
      Math.floor(
        Math.random() * (i+1)
      );

    var temp = array[i];

    array[i] = array[j];
    array[j] = temp;

  }

  return array;
}

/* =========================
   BARALHO
========================= */

function createDeck(){

  deck = [];

  suits.forEach(function(suit){

    values.forEach(function(item){

      deck.push({

        id:
          suit +
          item.n +
          "_" +
          Math.random()
            .toString(36)
            .slice(2),

        suit:suit,
        value:item.v,
        name:item.n,
        faceUp:false

      });

    });

  });

  shuffle(deck);
}

/* =========================
   INICIAR
========================= */

function startGame(){

  clearInterval(timer);

  playing = true;

  selected = null;

  moves = 0;
  seconds = 0;

  stock = [];
  waste = [];

  tableau = [
    [],[],[],[],[],[],[]
  ];

  foundations = {
    "♥":[],
    "♦":[],
    "♣":[],
    "♠":[]
  };

  createDeck();

  for(var col=0;col<7;col++){

    for(var row=0;row<=col;row++){

      var card = deck.pop();

      card.faceUp =
        row === col;

      tableau[col].push(card);

    }

  }

  stock = deck;

  overlay.style.display = "none";

  render();

  updateHUD();

  timer = setInterval(function(){

    if(!playing)
      return;

    seconds++;

    updateHUD();

  },1000);
}

/* =========================
   RENDERIZAÇÃO
========================= */

function render(){

  renderTableau();
  renderStock();
  renderWaste();
  renderFoundations();

}

function createCardElement(card){

  var el =
    document.createElement("div");

  el.className =
    "card " +
    (isRed(card) ? "red" : "black");

  el.dataset.id = card.id;

  if(!card.faceUp){

    el.classList.add("face-down");

    el.addEventListener(
      "click",
      function(e){

        e.stopPropagation();

        if(selected){

          showMessage(
            "Vire a carta quando ela estiver livre."
          );

          return;

        }

        flipCard(card);

      }
    );

    return el;
  }

  el.innerHTML =
    '<div class="corner">' +
      card.name +
      '<br>' +
      '<span class="mini">' +
        card.suit +
      '</span>' +
    '</div>' +

    '<div class="symbol">' +
      card.suit +
    '</div>' +

    '<div class="corner-bottom">' +
      card.name +
      '<br>' +
      card.suit +
    '</div>';

  el.addEventListener(
    "click",
    function(e){

      e.stopPropagation();

      cardClicked(card);

    }
  );

  return el;
}

function renderTableau(){

  var columns =
    tableauEl.querySelectorAll(".column");

  columns.forEach(function(column,index){

    column.innerHTML = "";

    var cards =
      tableau[index];

    if(cards.length === 0){

      column.classList.add("empty");

      column.onclick = function(){

        if(selected){

          moveSelectedToColumn(index);

        }

      };

      return;
    }

    column.classList.remove("empty");

    column.onclick = function(){

      if(selected){

        moveSelectedToColumn(index);

      }

    };

    cards.forEach(function(card,index2){

      var el =
        createCardElement(card);

      var offset =
        card.faceUp ? 25 : 15;

      el.style.top =
        (index2 * offset) +
        "px";

      if(
        selected &&
        selected.cards &&
        selected.cards.indexOf(card) !== -1
      ){

        el.classList.add("selected");

      }

      el.style.zIndex =
        String(index2 + 1);

      column.appendChild(el);

    });

  });
}

function renderStock(){

  stockArea.innerHTML = "";

  var slot =
    document.createElement("div");

  slot.className = "slot";

  if(stock.length){

    var back =
      document.createElement("div");

    back.className =
      "card face-down";

    back.style.left = "0";
    back.style.top = "0";

    back.addEventListener(
      "click",
      function(e){

        e.stopPropagation();

        drawCard();

      }
    );

    slot.appendChild(back);

  }else{

    var label =
      document.createElement("div");

    label.className = "slot-label";

    label.textContent = "↻";

    slot.appendChild(label);

    slot.addEventListener(
      "click",
      function(){

        recycleWaste();

      }
    );

  }

  stockArea.appendChild(slot);
}

function renderWaste(){

  wasteArea.innerHTML = "";

  var slot =
    document.createElement("div");

  slot.className = "slot";

  if(waste.length){

    var card =
      waste[waste.length - 1];

    var el =
      createCardElement(card);

    el.style.left = "0";
    el.style.top = "0";
    el.style.zIndex = "5";

    slot.appendChild(el);

  }else{

    var label =
      document.createElement("div");

    label.className =
      "slot-label";

    label.textContent = "♠";

    slot.appendChild(label);

  }

  wasteArea.appendChild(slot);
}

function renderFoundations(){

  foundationsEls.forEach(function(slot){

    var suit =
      slot.dataset.suit;

    slot.innerHTML = "";

    var cards =
      foundations[suit];

    if(cards.length){

      var card =
        cards[cards.length - 1];

      var el =
        createCardElement(card);

      el.style.left = "0";
      el.style.top = "0";

      slot.appendChild(el);

    }else{

      var label =
        document.createElement("div");

      label.className =
        "slot-label";

      label.textContent = suit;

      slot.appendChild(label);

    }

    slot.onclick = function(e){

      if(e)
        e.stopPropagation();

      if(selected){

        moveSelectedToFoundation(suit);

      }

    };

  });
}

/* =========================
   ESTOQUE
========================= */

function drawCard(){

  if(!playing)
    return;

  if(!stock.length){

    recycleWaste();

    return;
  }

  selected = null;

  var card =
    stock.pop();

  card.faceUp = true;

  waste.push(card);

  moves++;

  render();
  updateHUD();

  checkWin();
}

function recycleWaste(){

  if(stock.length || !waste.length)
    return;

  selected = null;

  stock =
    waste.reverse();

  waste = [];

  stock.forEach(function(card){

    card.faceUp = false;

  });

  moves++;

  render();
  updateHUD();

}

/* =========================
   LOCALIZAÇÃO
========================= */

function findCardLocation(card){

  for(var c=0;c<7;c++){

    for(
      var i=0;
      i<tableau[c].length;
      i++
    ){

      if(
        tableau[c][i].id === card.id
      ){

        return {
          type:"tableau",
          column:c,
          index:i
        };

      }

    }

  }

  if(
    waste.length &&
    waste[waste.length-1].id === card.id
  ){

    return {
      type:"waste",
      index:waste.length-1
    };

  }

  return null;
}

/* =========================
   SEQUÊNCIAS MÓVEIS
========================= */

function getMovableCards(card){

  var location =
    findCardLocation(card);

  if(!location)
    return [];

  if(location.type === "waste"){

    return [card];

  }

  if(location.type !== "tableau")
    return [];

  var column =
    tableau[location.column];

  var index =
    location.index;

  if(!card.faceUp)
    return [];

  /*
   * A sequência móvel continua sendo:
   *
   * K vermelho
   * Q preto
   * J vermelho
   * 10 preto
   *
   * ou seja:
   * valor atual = próximo + 1
   * e cores diferentes.
   */

  for(
    var i=index;
    i<column.length-1;
    i++
  ){

    var current =
      column[i];

    var next =
      column[i+1];

    if(
      !current.faceUp ||
      !next.faceUp ||
      current.value !== next.value + 1 ||
      isRed(current) === isRed(next)
    ){

      return [];

    }

  }

  return column.slice(index);
}

/* =========================
   CLIQUE NAS CARTAS
========================= */

function cardClicked(card){

  if(!playing || !card.faceUp)
    return;

  if(selected){

    if(
      selected.card &&
      selected.card.id === card.id
    ){

      selected = null;

      render();

      return;

    }

    var destination =
      findCardLocation(card);

    if(
      destination &&
      destination.type === "tableau"
    ){

      moveSelectedToColumn(
        destination.column
      );

      return;

    }

    showMessage(
      "Escolha uma coluna ou um naipe válido."
    );

    return;

  }

  var movable =
    getMovableCards(card);

  if(!movable.length){

    showMessage(
      "Essa sequência não pode ser movida."
    );

    return;

  }

  selected = {
    card:card,
    cards:movable
  };

  render();
}

/* =========================
   REGRA DAS COLUNAS
========================= */

function canPlaceOnColumn(
  cards,
  targetColumn
){

  if(!cards.length)
    return false;

  var moving =
    cards[0];

  var target =
    tableau[targetColumn];

  var source =
    findCardLocation(moving);

  if(
    source &&
    source.type === "tableau" &&
    source.column === targetColumn
  ){

    return false;

  }

  /*
   * REGRA NOVA:
   *
   * Coluna vazia:
   * K
   *
   * Coluna ocupada:
   *
   * K → Q → J → 10 → 9 → ...
   *
   * Sempre alternando vermelho/preto.
   */

  if(!target.length){

    return moving.value === 13;

  }

  var top =
    target[target.length-1];

  if(!top.faceUp)
    return false;

  return (
    isRed(top) !== isRed(moving) &&
    top.value === moving.value + 1
  );
}

function moveSelectedToColumn(columnIndex){

  if(!selected)
    return;

  var cards =
    selected.cards;

  if(!cards || !cards.length){

    selected = null;

    render();

    return;

  }

  var source =
    findCardLocation(cards[0]);

  if(!source){

    selected = null;

    render();

    return;

  }

  var currentMovable =
    getMovableCards(cards[0]);

  if(
    !currentMovable.length ||
    currentMovable.length !== cards.length
  ){

    selected = null;

    render();

    showMessage(
      "A seleção foi atualizada."
    );

    return;

  }

  if(
    !canPlaceOnColumn(
      cards,
      columnIndex
    )
  ){

    showMessage(
      "Use K → Q → J → 10... com cores alternadas."
    );

    return;

  }

  if(source.type === "tableau"){

    tableau[source.column].splice(
      source.index,
      cards.length
    );

  }else if(source.type === "waste"){

    waste.pop();

  }

  cards.forEach(function(card){

    tableau[columnIndex].push(card);

  });

  revealLastCard(source);

  selected = null;

  moves++;

  render();
  updateHUD();

  checkWin();
}

/* =========================
   FUNDAÇÃO
========================= */

function canPlaceFoundation(
  card,
  suit
){

  /*
   * A carta precisa pertencer ao naipe
   * daquela fundação.
   */

  if(card.suit !== suit)
    return false;

  var foundation =
    foundations[suit];

  /*
   * Fundação vazia:
   * começa com A.
   */

  if(!foundation.length){

    return card.value === 1;

  }

  var top =
    foundation[foundation.length-1];

  /*
   * REGRA:
   *
   * A → 2 → 3 → 4 → ... → K
   *
   * A sequência também precisa
   * alternar as cores.
   */

  return (
    card.value === top.value + 1 &&
    isRed(card) !== isRed(top)
  );
}

function moveSelectedToFoundation(suit){

  if(!selected)
    return;

  /*
   * Fundação recebe uma carta por vez.
   */

  if(selected.cards.length !== 1){

    showMessage(
      "Só uma carta por vez vai para o naipe."
    );

    return;

  }

  var card =
    selected.cards[0];

  if(!canPlaceFoundation(card,suit)){

    showMessage(
      "A fundação exige A → 2 → 3... alternando cores."
    );

    return;

  }

  var source =
    findCardLocation(card);

  if(!source){

    selected = null;

    render();

    return;

  }

  if(source.type === "tableau"){

    tableau[source.column].splice(
      source.index,
      1
    );

  }else if(source.type === "waste"){

    waste.pop();

  }

  foundations[suit].push(card);

  revealLastCard(source);

  selected = null;

  moves++;

  render();
  updateHUD();

  checkWin();
}

/* =========================
   VIRAR CARTA
========================= */

function flipCard(card){

  if(card.faceUp)
    return;

  if(selected)
    return;

  var location =
    findCardLocation(card);

  if(
    !location ||
    location.type !== "tableau"
  )
    return;

  var column =
    tableau[location.column];

  if(
    location.index !==
    column.length - 1
  ){

    return;

  }

  card.faceUp = true;

  moves++;

  render();
  updateHUD();
}

/* =========================
   REVELAR
========================= */

function revealLastCard(source){

  if(
    source &&
    source.type === "tableau"
  ){

    var column =
      tableau[source.column];

    if(column.length){

      var last =
        column[column.length-1];

      if(!last.faceUp){

        last.faceUp = true;

      }

    }

  }
}

/* =========================
   AUTO
========================= */

function autoMove(){

  if(!playing)
    return;

  selected = null;

  var candidates = [];

  suits.forEach(function(suit){

    tableau.forEach(function(column){

      if(column.length){

        var card =
          column[column.length-1];

        if(
          card.faceUp &&
          canPlaceFoundation(
            card,
            suit
          )
        ){

          candidates.push(card);

        }

      }

    });

    if(waste.length){

      var card =
        waste[waste.length-1];

      if(
        card.faceUp &&
        canPlaceFoundation(
          card,
          suit
        )
      ){

        candidates.push(card);

      }

    }

  });

  if(!candidates.length){

    showMessage(
      "Nenhum movimento automático disponível."
    );

    return;

  }

  var card =
    candidates[0];

  selected = {
    card:card,
    cards:[card]
  };

  render();

  setTimeout(function(){

    if(
      selected &&
      selected.card &&
      selected.card.id === card.id
    ){

      moveSelectedToFoundation(
        card.suit
      );

    }

  },150);
}

/* =========================
   DICA
========================= */

function hint(){

  if(!playing)
    return;

  selected = null;

  /*
   * Procura movimentos entre colunas.
   */

  for(var c=0;c<7;c++){

    var source =
      tableau[c];

    if(!source.length)
      continue;

    for(
      var i=0;
      i<source.length;
      i++
    ){

      var card =
        source[i];

      if(!card.faceUp)
        continue;

      var movable =
        getMovableCards(card);

      if(!movable.length)
        continue;

      for(
        var target=0;
        target<7;
        target++
      ){

        if(target === c)
          continue;

        if(
          canPlaceOnColumn(
            movable,
            target
          )
        ){

          selected = {
            card:card,
            cards:movable
          };

          render();

          showMessage(
            "💡 Tente mover essa sequência!"
          );

          return;

        }

      }

    }

  }

  /*
   * Procura fundação.
   */

  for(var c2=0;c2<7;c2++){

    var column2 =
      tableau[c2];

    if(!column2.length)
      continue;

    var card2 =
      column2[column2.length-1];

    if(
      card2.faceUp &&
      canPlaceFoundation(
        card2,
        card2.suit
      )
    ){

      selected = {
        card:card2,
        cards:[card2]
      };

      render();

      showMessage(
        "💡 Essa carta pode ir para a fundação!"
      );

      return;

    }

  }

  if(waste.length){

    var wasteCard =
      waste[waste.length-1];

    if(
      canPlaceFoundation(
        wasteCard,
        wasteCard.suit
      )
    ){

      selected = {
        card:wasteCard,
        cards:[wasteCard]
      };

      render();

      showMessage(
        "💡 Coloque essa carta na fundação!"
      );

      return;

    }

  }

  showMessage(
    "Nenhuma dica encontrada."
  );
}

/* =========================
   VITÓRIA
========================= */

function checkWin(){

  var total = 0;

  suits.forEach(function(suit){

    total +=
      foundations[suit].length;

  });

  if(total !== 52)
    return;

  playing = false;

  clearInterval(timer);

  selected = null;

  overlay.style.display = "flex";

  overlay.querySelector("h1").textContent =
    "🏆 VOCÊ VENCEU!";

  panelText.innerHTML =
    "Parabéns! Você completou os 4 naipes!<br><br>" +
    "Movimentos: <b>" +
      moves +
    "</b><br>" +
    "Tempo: <b>" +
      formatTime() +
    "</b>";

  startBtn.textContent =
    "JOGAR NOVAMENTE";
}

/* =========================
   NOVO JOGO
========================= */

document
  .getElementById("newGame")
  .addEventListener(
    "click",
    function(){

      startGame();

    }
  );

document
  .getElementById("autoMove")
  .addEventListener(
    "click",
    function(){

      autoMove();

    }
  );

document
  .getElementById("hint")
  .addEventListener(
    "click",
    function(){

      hint();

    }
  );

startBtn.addEventListener(
  "click",
  startGame
);

game.addEventListener(
  "click",
  function(e){

    if(
      e.target === game ||
      e.target.classList.contains("stars")
    ){

      selected = null;

      render();

    }

  }
);

document.addEventListener(
  "keydown",
  function(e){

    if(e.code === "Escape"){

      selected = null;

      if(playing)
        render();

    }

    if(
      e.code === "Enter" &&
      !playing
    ){

      startGame();

    }

  }
);

overlay.style.display = "flex";

})();
</script>`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name, oldScript.getAttribute(attr.name));
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"paciencia",
  name:"Paciência",
  category:"Cartas",
  icon:"🃏",

  init({container}){
    container.innerHTML = PACIENCIA_HTML;
    executeGameScripts(container);
  }
});