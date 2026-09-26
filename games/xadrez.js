import { registerGame } from "../arcade.js";

const XADREZ_HTML = String.raw`
<style>

/* ===========================
   NEON CHESS
=========================== */

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
  -webkit-touch-callout:none;
}

.wrap{
  width:100%;
  max-width:440px;
  margin:auto;
  font-family:'Orbitron',sans-serif;
}

.page{
  position:relative;
  background:
    radial-gradient(
      circle at 50% 25%,
      rgba(18,24,56,.9) 0%,
      rgba(8,11,24,.97) 65%,
      #050711 100%
    ),
    linear-gradient(170deg,#0d1124,#050711);

  border-radius:14px;

  border:1px solid rgba(0,243,255,.25);

  box-shadow:
    0 0 25px rgba(0,243,255,.15),
    0 22px 40px rgba(0,0,0,.75),
    inset 0 0 15px rgba(0,243,255,.05);

  padding:18px;

  overflow:hidden;
}

.content{
  position:relative;
}

/* ===========================
   PLACAR
=========================== */

.scorecorner{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  margin-bottom:6px;
}

.score-item{
  text-align:center;
  min-width:42px;
}

.score-num{
  display:block;

  font-weight:900;
  font-size:18px;
  line-height:1;

  color:#00f3ff;

  text-shadow:
    0 0 8px rgba(0,243,255,.7);
}

.score-label{
  display:block;

  margin-top:3px;

  font-size:7px;

  color:#8fa1c7;

  text-transform:uppercase;

  letter-spacing:.5px;
}

/* ===========================
   TÍTULO
=========================== */

.title{
  font-weight:900;

  font-size:25px;

  line-height:1.1;

  color:#fff;

  text-shadow:
    0 0 10px rgba(255,255,255,.5),
    0 0 20px rgba(0,243,255,.4);

  margin:0 0 2px;

  letter-spacing:1px;
}

.subtitle{
  font-size:9px;

  color:#00f3ff;

  text-transform:uppercase;

  letter-spacing:2px;

  margin-bottom:10px;

  text-shadow:
    0 0 5px rgba(0,243,255,.5);
}

/* ===========================
   DIFICULDADE
=========================== */

.difficulty-bar{
  display:flex;

  gap:5px;

  margin-bottom:10px;

  background:rgba(0,0,0,.3);

  padding:4px;

  border-radius:8px;

  border:1px solid rgba(0,243,255,.15);
}

.diff-btn{
  flex:1;

  background:transparent;

  border:none;

  font-family:'Orbitron',sans-serif;

  font-size:8px;

  color:#8fa1c7;

  padding:6px 2px;

  border-radius:6px;

  cursor:pointer;

  text-transform:uppercase;

  font-weight:700;
}

.diff-btn.active{
  background:rgba(0,243,255,.15);

  color:#00f3ff;

  box-shadow:
    0 0 10px rgba(0,243,255,.3);

  border:1px solid rgba(0,243,255,.4);
}

/* ===========================
   STATUS
=========================== */

.turn{
  text-align:center;

  font-weight:700;

  font-size:12px;

  color:#8fa1c7;

  margin-bottom:8px;

  min-height:18px;

  letter-spacing:.5px;
}

.turn.win{
  color:#00f3ff;

  text-shadow:
    0 0 8px rgba(0,243,255,.7);
}

.turn.lose{
  color:#ff0055;

  text-shadow:
    0 0 8px rgba(255,0,85,.7);
}

/* ===========================
   TABULEIRO
=========================== */

.chess-wrap{
  width:min(100%,360px);

  aspect-ratio:1/1;

  margin:5px auto 10px;

  padding:4px;

  border-radius:10px;

  background:
    linear-gradient(
      135deg,
      rgba(0,243,255,.35),
      rgba(255,0,85,.25)
    );

  box-shadow:
    0 0 18px rgba(0,243,255,.15);
}

.chess-board{
  width:100%;
  height:100%;

  display:grid;

  grid-template-columns:repeat(8,1fr);
  grid-template-rows:repeat(8,1fr);

  border-radius:7px;

  overflow:hidden;

  border:1px solid rgba(255,255,255,.15);
}

.square{
  position:relative;

  display:flex;

  align-items:center;
  justify-content:center;

  cursor:pointer;

  font-family:
    "Segoe UI Symbol",
    "Noto Sans Symbols 2",
    sans-serif;

  font-size:clamp(25px,8vw,43px);

  line-height:1;

  transition:
    background .12s ease,
    box-shadow .12s ease;
}

.square.dark{
  background:
    linear-gradient(
      135deg,
      rgba(5,9,24,.98),
      rgba(11,18,38,.98)
    );
}

.square.light{
  background:
    linear-gradient(
      135deg,
      rgba(0,120,145,.22),
      rgba(0,243,255,.08)
    );
}

.square.selected{
  background:
    rgba(0,243,255,.30) !important;

  box-shadow:
    inset 0 0 0 2px #00f3ff,
    inset 0 0 18px rgba(0,243,255,.35);
}

.square.move::after{
  content:"";

  position:absolute;

  width:20%;
  height:20%;

  border-radius:50%;

  background:#00f3ff;

  box-shadow:
    0 0 10px rgba(0,243,255,.9);
}

.square.capture{
  box-shadow:
    inset 0 0 0 3px rgba(255,0,85,.8),
    inset 0 0 15px rgba(255,0,85,.3);
}

.square.check{
  background:
    rgba(255,0,85,.35) !important;

  box-shadow:
    inset 0 0 15px rgba(255,0,85,.8);
}

.piece{
  position:relative;

  z-index:2;

  filter:
    drop-shadow(0 0 5px rgba(255,255,255,.25));

  transition:
    transform .12s ease;
}

.square.selected .piece{
  transform:scale(1.08);

  filter:
    drop-shadow(0 0 8px rgba(0,243,255,.8));
}

/* ===========================
   MENSAGEM
=========================== */

.message{
  text-align:center;

  font-size:9px;

  color:#8fa1c7;

  min-height:15px;

  margin-bottom:9px;

  letter-spacing:.4px;
}

/* ===========================
   BOTÕES
=========================== */

.buttons{
  display:flex;

  gap:8px;

  justify-content:center;
}

.btn{
  font-family:'Orbitron',sans-serif;

  font-size:9px;

  font-weight:700;

  color:#00f3ff;

  background:
    rgba(0,243,255,.1);

  border:
    1px solid rgba(0,243,255,.4);

  border-radius:8px;

  padding:9px 13px;

  cursor:pointer;

  box-shadow:
    0 0 10px rgba(0,243,255,.15);

  letter-spacing:.4px;
}

.btn:active{
  transform:scale(.95);
}

.btn-ghost{
  color:#8fa1c7;

  background:
    rgba(255,255,255,.05);

  border-color:
    rgba(255,255,255,.2);

  box-shadow:none;
}

@media(max-width:380px){

  .page{
    padding:14px;
  }

  .title{
    font-size:22px;
  }

  .square{
    font-size:clamp(22px,7.8vw,38px);
  }

}

</style>


<div class="wrap">

<div class="page">

<div class="content">

<div class="scorecorner">

  <div class="score-item">
    <span class="score-num" id="wins">0</span>
    <span class="score-label">vitórias</span>
  </div>

  <div class="score-item">
    <span class="score-num" id="draws">0</span>
    <span class="score-label">empates</span>
  </div>

  <div class="score-item">
    <span class="score-num" id="losses">0</span>
    <span class="score-label">derrotas</span>
  </div>

</div>


<div class="title">
  NEON_CHESS
</div>

<div class="subtitle">
  Cyber Chess Edition
</div>


<div class="difficulty-bar">

  <button
    class="diff-btn active"
    data-diff="easy">
    Fácil
  </button>

  <button
    class="diff-btn"
    data-diff="medium">
    Médio
  </button>

  <button
    class="diff-btn"
    data-diff="hard">
    Extremo
  </button>

</div>


<div
  class="turn"
  id="turn">
  sua vez [brancas]
</div>


<div class="chess-wrap">

  <div
    class="chess-board"
    id="board">
  </div>

</div>


<div
  class="message"
  id="message">
  selecione uma peça para começar
</div>


<div class="buttons">

  <button
    class="btn"
    id="restart">
    reiniciar
  </button>

  <button
    class="btn btn-ghost"
    id="newgame">
    zerar placar
  </button>

</div>

</div>
</div>
</div>


<script>

(function(){

"use strict";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

var boardEl =
  document.getElementById("board");

var turnEl =
  document.getElementById("turn");

var messageEl =
  document.getElementById("message");

var winsEl =
  document.getElementById("wins");

var drawsEl =
  document.getElementById("draws");

var lossesEl =
  document.getElementById("losses");

var restartBtn =
  document.getElementById("restart");

var newgameBtn =
  document.getElementById("newgame");

var diffBtns =
  Array.prototype.slice.call(
    document.querySelectorAll(".diff-btn")
  );


/* =========================================================
   PEÇAS
========================================================= */

var PIECES = {

  wK:"♔",
  wQ:"♕",
  wR:"♖",
  wB:"♗",
  wN:"♘",
  wP:"♙",

  bK:"♚",
  bQ:"♛",
  bR:"♜",
  bB:"♝",
  bN:"♞",
  bP:"♟"

};


/* =========================================================
   TABULEIRO INICIAL
========================================================= */

var INITIAL = [

  "bR","bN","bB","bQ","bK","bB","bN","bR",

  "bP","bP","bP","bP","bP","bP","bP","bP",

  "","","","","","","","",

  "","","","","","","","",

  "","","","","","","","",

  "","","","","","","","",

  "wP","wP","wP","wP","wP","wP","wP","wP",

  "wR","wN","wB","wQ","wK","wB","wN","wR"

];


/* =========================================================
   ESTADO
========================================================= */

var board =
  INITIAL.slice();

var selected = null;

var legalMoves = [];

var playerTurn = true;

var playing = true;

var difficulty = "easy";

var wins = 0;
var draws = 0;
var losses = 0;

var castle = {

  wK:true,
  wQ:true,
  bK:true,
  bQ:true

};

var enPassant = null;


/* =========================================================
   STORAGE
========================================================= */

try{

  wins =
    Number(
      localStorage.getItem(
        "neon_chess_wins"
      ) || 0
    );

  draws =
    Number(
      localStorage.getItem(
        "neon_chess_draws"
      ) || 0
    );

  losses =
    Number(
      localStorage.getItem(
        "neon_chess_losses"
      ) || 0
    );

  difficulty =
    localStorage.getItem(
      "neon_chess_diff"
    ) || "easy";

}catch(e){}


function save(){

  try{

    localStorage.setItem(
      "neon_chess_wins",
      String(wins)
    );

    localStorage.setItem(
      "neon_chess_draws",
      String(draws)
    );

    localStorage.setItem(
      "neon_chess_losses",
      String(losses)
    );

    localStorage.setItem(
      "neon_chess_diff",
      difficulty
    );

  }catch(e){}

}


function updateScore(){

  winsEl.textContent =
    String(wins);

  drawsEl.textContent =
    String(draws);

  lossesEl.textContent =
    String(losses);

  save();

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function row(i){

  return Math.floor(i / 8);

}


function col(i){

  return i % 8;

}


function inside(r,c){

  return (
    r >= 0 &&
    r < 8 &&
    c >= 0 &&
    c < 8
  );

}


function index(r,c){

  return r * 8 + c;

}


function colorOf(piece){

  return piece
    ? piece.charAt(0)
    : null;

}


function typeOf(piece){

  return piece
    ? piece.charAt(1)
    : null;

}


function opposite(color){

  return color === "w"
    ? "b"
    : "w";

}


/* =========================================================
   RENDER
========================================================= */

function render(){

  boardEl.innerHTML = "";

  for(var i=0;i<64;i++){

    var cell =
      document.createElement("div");

    cell.className =
      "square " +
      (((row(i)+col(i)) % 2)
        ? "dark"
        : "light");

    cell.dataset.i =
      String(i);

    var piece =
      board[i];

    if(piece){

      var span =
        document.createElement("span");

      span.className =
        "piece";

      span.textContent =
        PIECES[piece];

      cell.appendChild(span);

    }

    if(i === selected){

      cell.classList.add(
        "selected"
      );

    }

    for(
      var m=0;
      m<legalMoves.length;
      m++
    ){

      if(
        legalMoves[m].to === i
      ){

        cell.classList.add(
          board[i]
            ? "capture"
            : "move"
        );

      }

    }

    if(
      piece &&
      typeOf(piece) === "K" &&
      isInCheck(board,colorOf(piece))
    ){

      cell.classList.add(
        "check"
      );

    }

    cell.addEventListener(
      "click",
      onSquareClick
    );

    boardEl.appendChild(cell);

  }

}


/* =========================================================
   ATAQUES
========================================================= */

function squareAttacked(
  b,
  target,
  byColor
){

  var tr = row(target);
  var tc = col(target);

  for(var i=0;i<64;i++){

    var p = b[i];

    if(
      !p ||
      colorOf(p) !== byColor
    ) continue;

    var r = row(i);
    var c = col(i);
    var t = typeOf(p);

    if(t === "P"){

      var dir =
        byColor === "w"
          ? -1
          : 1;

      if(
        r + dir === tr &&
        Math.abs(c-tc) === 1
      ){

        return true;

      }

    }

    if(t === "N"){

      var knight = [

        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1]

      ];

      for(
        var n=0;
        n<knight.length;
        n++
      ){

        if(
          r + knight[n][0] === tr &&
          c + knight[n][1] === tc
        ){

          return true;

        }

      }

    }

    if(t === "K"){

      if(
        Math.max(
          Math.abs(r-tr),
          Math.abs(c-tc)
        ) === 1
      ){

        return true;

      }

    }

    var dirs = [];

    if(
      t === "R" ||
      t === "Q"
    ){

      dirs.push(
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
      );

    }

    if(
      t === "B" ||
      t === "Q"
    ){

      dirs.push(
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1]
      );

    }

    for(
      var d=0;
      d<dirs.length;
      d++
    ){

      var rr = r + dirs[d][0];
      var cc = c + dirs[d][1];

      while(
        inside(rr,cc)
      ){

        var idx =
          index(rr,cc);

        if(idx === target){

          return true;

        }

        if(b[idx]) break;

        rr += dirs[d][0];
        cc += dirs[d][1];

      }

    }

  }

  return false;

}


/* =========================================================
   XEQUE
========================================================= */

function isInCheck(
  b,
  color
){

  var king = -1;

  for(var i=0;i<64;i++){

    if(
      b[i] === color + "K"
    ){

      king = i;
      break;

    }

  }

  if(king === -1){

    return true;

  }

  return squareAttacked(
    b,
    king,
    opposite(color)
  );

}


/* =========================================================
   MOVIMENTOS
========================================================= */

function pseudoMoves(
  b,
  from,
  includeCastle
){

  var p = b[from];

  if(!p) return [];

  var color =
    colorOf(p);

  var type =
    typeOf(p);

  var r = row(from);
  var c = col(from);

  var moves = [];


  function add(to,extra){

    if(
      to < 0 ||
      to >= 64
    ) return;

    var target =
      b[to];

    if(
      target &&
      colorOf(target) === color
    ) return;

    moves.push({

      from:from,
      to:to,

      promotion:
        extra &&
        extra.promotion
          ? extra.promotion
          : null,

      castle:
        extra &&
        extra.castle
          ? extra.castle
          : null,

      enPassant:
        extra &&
        extra.enPassant
          ? true
          : false

    });

  }


  if(type === "P"){

    var dir =
      color === "w"
        ? -1
        : 1;

    var start =
      color === "w"
        ? 6
        : 1;

    var promotionRow =
      color === "w"
        ? 0
        : 7;

    var oneR =
      r + dir;

    if(
      inside(oneR,c)
    ){

      var one =
        index(oneR,c);

      if(!b[one]){

        if(
          oneR === promotionRow
        ){

          ["Q","R","B","N"]
            .forEach(
              function(pr){

                add(
                  one,
                  {promotion:pr}
                );

              }
            );

        }else{

          add(one);

        }

        if(r === start){

          var two =
            index(
              r + dir*2,
              c
            );

          if(!b[two]){

            add(two);

          }

        }

      }

    }


    for(
      var dc=-1;
      dc<=1;
      dc+=2
    ){

      var rr =
        r + dir;

      var cc =
        c + dc;

      if(
        !inside(rr,cc)
      ) continue;

      var to =
        index(rr,cc);

      if(
        b[to] &&
        colorOf(b[to]) !== color
      ){

        if(
          rr === promotionRow
        ){

          ["Q","R","B","N"]
            .forEach(
              function(pr){

                add(
                  to,
                  {promotion:pr}
                );

              }
            );

        }else{

          add(to);

        }

      }

      if(
        enPassant === to
      ){

        add(
          to,
          {enPassant:true}
        );

      }

    }

  }


  if(type === "N"){

    var jumps = [

      [-2,-1],
      [-2,1],
      [-1,-2],
      [-1,2],
      [1,-2],
      [1,2],
      [2,-1],
      [2,1]

    ];

    jumps.forEach(
      function(v){

        var rr =
          r + v[0];

        var cc =
          c + v[1];

        if(
          inside(rr,cc)
        ){

          add(
            index(rr,cc)
          );

        }

      }
    );

  }


  if(type === "K"){

    for(
      var dr=-1;
      dr<=1;
      dr++
    ){

      for(
        var dc=-1;
        dc<=1;
        dc++
      ){

        if(
          dr === 0 &&
          dc === 0
        ) continue;

        var rr =
          r + dr;

        var cc =
          c + dc;

        if(
          inside(rr,cc)
        ){

          add(
            index(rr,cc)
          );

        }

      }

    }


    if(
      includeCastle &&
      !isInCheck(b,color)
    ){

      if(
        color === "w"
      ){

        if(
          castle.wK &&
          b[61] === "" &&
          b[62] === "" &&
          b[63] === "wR" &&
          !squareAttacked(
            b,61,"b"
          ) &&
          !squareAttacked(
            b,62,"b"
          )
        ){

          add(
            62,
            {castle:"K"}
          );

        }

        if(
          castle.wQ &&
          b[59] === "" &&
          b[58] === "" &&
          b[57] === "" &&
          b[56] === "wR" &&
          !squareAttacked(
            b,59,"b"
          ) &&
          !squareAttacked(
            b,58,"b"
          )
        ){

          add(
            58,
            {castle:"Q"}
          );

        }

      }else{

        if(
          castle.bK &&
          b[5] === "" &&
          b[6] === "" &&
          b[7] === "bR" &&
          !squareAttacked(
            b,5,"w"
          ) &&
          !squareAttacked(
            b,6,"w"
          )
        ){

          add(
            6,
            {castle:"K"}
          );

        }

        if(
          castle.bQ &&
          b[3] === "" &&
          b[2] === "" &&
          b[1] === "" &&
          b[0] === "bR" &&
          !squareAttacked(
            b,3,"w"
          ) &&
          !squareAttacked(
            b,2,"w"
          )
        ){

          add(
            2,
            {castle:"Q"}
          );

        }

      }

    }

  }


  if(
    type === "R" ||
    type === "B" ||
    type === "Q"
  ){

    var directions = [];

    if(
      type === "R" ||
      type === "Q"
    ){

      directions.push(
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
      );

    }

    if(
      type === "B" ||
      type === "Q"
    ){

      directions.push(
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1]
      );

    }

    directions.forEach(
      function(dir){

        var rr =
          r + dir[0];

        var cc =
          c + dir[1];

        while(
          inside(rr,cc)
        ){

          var to =
            index(rr,cc);

          if(!b[to]){

            add(to);

          }else{

            if(
              colorOf(b[to]) !== color
            ){

              add(to);

            }

            break;

          }

          rr += dir[0];
          cc += dir[1];

        }

      }
    );

  }

  return moves;

}


/* =========================================================
   APLICAR MOVIMENTO
========================================================= */

function applyMove(
  state,
  move
){

  var b =
    state.slice();

  var piece =
    b[move.from];

  var color =
    colorOf(piece);


  b[move.from] = "";


  if(move.enPassant){

    var dir =
      color === "w"
        ? 1
        : -1;

    b[
      move.to +
      dir*8
    ] = "";

  }


  if(move.promotion){

    b[move.to] =
      color +
      move.promotion;

  }else{

    b[move.to] =
      piece;

  }


  if(move.castle){

    if(color === "w"){

      if(
        move.castle === "K"
      ){

        b[63] = "";
        b[61] = "wR";

      }else{

        b[56] = "";
        b[59] = "wR";

      }

    }else{

      if(
        move.castle === "K"
      ){

        b[7] = "";
        b[5] = "bR";

      }else{

        b[0] = "";
        b[3] = "bR";

      }

    }

  }


  return b;

}


/* =========================================================
   MOVIMENTOS LEGAIS
========================================================= */

function legalMovesFor(
  b,
  color
){

  var result = [];

  for(var i=0;i<64;i++){

    if(
      !b[i] ||
      colorOf(b[i]) !== color
    ) continue;

    var pseudo =
      pseudoMoves(
        b,
        i,
        true
      );

    pseudo.forEach(
      function(move){

        var next =
          applyMove(
            b,
            move
          );

        if(
          !isInCheck(
            next,
            color
          )
        ){

          result.push(move);

        }

      }
    );

  }

  return result;

}


/* =========================================================
   EXECUTAR JOGADA
========================================================= */

function executeMove(
  move
){

  var piece =
    board[move.from];

  var color =
    colorOf(piece);


  board =
    applyMove(
      board,
      move
    );


  if(
    typeOf(piece) === "K"
  ){

    if(color === "w"){

      castle.wK = false;
      castle.wQ = false;

    }else{

      castle.bK = false;
      castle.bQ = false;

    }

  }


  if(move.from === 63 ||
     move.to === 63){

    castle.wK = false;

  }

  if(move.from === 56 ||
     move.to === 56){

    castle.wQ = false;

  }

  if(move.from === 7 ||
     move.to === 7){

    castle.bK = false;

  }

  if(move.from === 0 ||
     move.to === 0){

    castle.bQ = false;

  }


  enPassant = null;

  if(
    typeOf(piece) === "P" &&
    Math.abs(
      row(move.to) -
      row(move.from)
    ) === 2
  ){

    enPassant =
      (
        move.from +
        move.to
      ) / 2;

  }

}


/* =========================================================
   FIM DE JOGO
========================================================= */

function checkGame(){

  var turnColor =
    playerTurn
      ? "w"
      : "b";

  var moves =
    legalMovesFor(
      board,
      turnColor
    );

  if(moves.length){

    return false;

  }

  playing = false;

  if(
    isInCheck(
      board,
      turnColor
    )
  ){

    if(turnColor === "b"){

      wins++;

      turnEl.textContent =
        "XEQUE-MATE — VOCÊ VENCEU!";

      turnEl.classList.add(
        "win"
      );

      messageEl.textContent =
        "rei inimigo neutralizado";

    }else{

      losses++;

      turnEl.textContent =
        "XEQUE-MATE — BOT VENCEU";

      turnEl.classList.add(
        "lose"
      );

      messageEl.textContent =
        "seu rei foi neutralizado";

    }

  }else{

    draws++;

    turnEl.textContent =
      "EMPATE";

    messageEl.textContent =
      "posição sem movimentos legais";

  }

  updateScore();

  render();

  return true;

}


/* =========================================================
   JOGADOR
========================================================= */

function onSquareClick(){

  if(
    !playing ||
    !playerTurn
  ) return;

  var i =
    Number(
      this.dataset.i
    );


  if(selected !== null){

    var chosen = null;

    for(
      var x=0;
      x<legalMoves.length;
      x++
    ){

      if(
        legalMoves[x].to === i
      ){

        chosen =
          legalMoves[x];

        break;

      }

    }


    if(chosen){

      executeMove(
        chosen
      );

      selected = null;

      playerTurn = false;

      legalMoves = [];

      render();


      if(
        checkGame()
      ) return;


      turnEl.textContent =
        "IA PROCESSANDO...";

      messageEl.textContent =
        "calculando melhor rota";


      setTimeout(
        machineMove,
        350
      );

      return;

    }

  }


  if(
    board[i] &&
    colorOf(board[i]) === "w"
  ){

    selected = i;

    legalMoves =
      legalMovesFor(
        board,
        "w"
      ).filter(
        function(m){

          return m.from === i;

        }
      );

    messageEl.textContent =
      legalMoves.length
        ? "selecione o destino"
        : "essa peça não possui movimentos";

    render();

    return;

  }


  selected = null;

  legalMoves = [];

  render();

}


/* =========================================================
   IA
========================================================= */

function materialValue(piece){

  if(!piece) return 0;

  var values = {

    P:100,
    N:320,
    B:330,
    R:500,
    Q:900,
    K:20000

  };

  return values[
    typeOf(piece)
  ] || 0;

}


function evaluate(b){

  var score = 0;

  for(
    var i=0;
    i<64;
    i++
  ){

    if(!b[i]) continue;

    var value =
      materialValue(
        b[i]
      );

    if(
      colorOf(b[i]) === "b"
    ){

      score += value;

    }else{

      score -= value;

    }

  }

  return score;

}


/* =========================================================
   MINIMAX
========================================================= */

function minimax(
  b,
  depth,
  alpha,
  beta,
  maximizing
){

  var color =
    maximizing
      ? "b"
      : "w";

  var moves =
    legalMovesFor(
      b,
      color
    );


  if(
    depth === 0 ||
    moves.length === 0
  ){

    if(
      moves.length === 0 &&
      isInCheck(b,color)
    ){

      return maximizing
        ? -100000
        : 100000;

    }

    return evaluate(b);

  }


  if(maximizing){

    var best =
      -Infinity;

    for(
      var i=0;
      i<moves.length;
      i++
    ){

      var score =
        minimax(
          applyMove(
            b,
            moves[i]
          ),
          depth-1,
          alpha,
          beta,
          false
        );

      best =
        Math.max(
          best,
          score
        );

      alpha =
        Math.max(
          alpha,
          score
        );

      if(beta <= alpha)
        break;

    }

    return best;

  }


  var worst =
    Infinity;

  for(
    var j=0;
    j<moves.length;
    j++
  ){

    var score2 =
      minimax(
        applyMove(
          b,
          moves[j]
        ),
        depth-1,
        alpha,
        beta,
        true
      );

    worst =
      Math.min(
        worst,
        score2
      );

    beta =
      Math.min(
        beta,
        score2
      );

    if(beta <= alpha)
      break;

  }

  return worst;

}


/* =========================================================
   MELHOR JOGADA
========================================================= */

function bestMove(){

  var moves =
    legalMovesFor(
      board,
      "b"
    );

  if(!moves.length)
    return null;


  if(
    difficulty === "easy"
  ){

    return moves[
      Math.floor(
        Math.random() *
        moves.length
      )
    ];

  }


  if(
    difficulty === "medium"
  ){

    var bestCapture =
      moves.filter(
        function(m){

          return !!board[m.to];

        }
      );

    if(
      bestCapture.length &&
      Math.random() < .65
    ){

      return bestCapture[
        Math.floor(
          Math.random() *
          bestCapture.length
        )
      ];

    }

    return moves[
      Math.floor(
        Math.random() *
        moves.length
      )
    ];

  }


  var best = null;

  var bestScore =
    -Infinity;


  for(
    var i=0;
    i<moves.length;
    i++
  ){

    var score =
      minimax(
        applyMove(
          board,
          moves[i]
        ),
        3,
        -Infinity,
        Infinity,
        false
      );


    if(
      score > bestScore
    ){

      bestScore = score;

      best = moves[i];

    }

  }

  return best;

}


/* =========================================================
   MOVIMENTO DA IA
========================================================= */

function machineMove(){

  if(!playing)
    return;

  var move =
    bestMove();

  if(!move){

    checkGame();

    return;

  }

  executeMove(move);

  playerTurn = true;

  render();


  if(
    checkGame()
  ) return;


  if(
    isInCheck(
      board,
      "w"
    )
  ){

    turnEl.textContent =
      "XEQUE! [BRANCAS]";

    messageEl.textContent =
      "seu rei está sob ataque";

  }else{

    turnEl.textContent =
      "sua vez [BRANCAS]";

    messageEl.textContent =
      "selecione uma peça";

  }

}


/* =========================================================
   RESET
========================================================= */

function resetBoard(){

  board =
    INITIAL.slice();

  selected = null;

  legalMoves = [];

  playerTurn = true;

  playing = true;

  castle = {

    wK:true,
    wQ:true,
    bK:true,
    bQ:true

  };

  enPassant = null;

  turnEl.classList.remove(
    "win",
    "lose"
  );

  turnEl.textContent =
    "sua vez [BRANCAS]";

  messageEl.textContent =
    "selecione uma peça para começar";

  render();

}


/* =========================================================
   DIFICULDADE
========================================================= */

diffBtns.forEach(
  function(btn){

    if(
      btn.dataset.diff ===
      difficulty
    ){

      btn.classList.add(
        "active"
      );

    }

    btn.addEventListener(
      "click",
      function(){

        diffBtns.forEach(
          function(b){

            b.classList.remove(
              "active"
            );

          }
        );

        btn.classList.add(
          "active"
        );

        difficulty =
          btn.dataset.diff;

        save();

        resetBoard();

      }
    );

  }
);


/* =========================================================
   BOTÕES
========================================================= */

restartBtn.addEventListener(
  "click",
  resetBoard
);


newgameBtn.addEventListener(
  "click",
  function(){

    wins = 0;
    draws = 0;
    losses = 0;

    updateScore();

    resetBoard();

  }
);


/* =========================================================
   START
========================================================= */

updateScore();

resetBoard();

})();

</script>
`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(
        attr.name,
        oldScript.getAttribute(attr.name)
      );
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"xadrez",
  name:"Xadrez",
  category:"Tabuleiro",
  icon:"♟️",

  init({container}){
    container.innerHTML = XADREZ_HTML;
    executeGameScripts(container);
  }
});