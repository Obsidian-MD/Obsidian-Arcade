import { registerGame } from "../arcade.js";

export const CHECKERS_HTML = String.raw`<style>
*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  -webkit-user-select:none;
  user-select:none;
}

html,body{
  margin:0;
  padding:0;
  width:100%;
  min-width:0;
  overflow:hidden;
}

body{
  background:transparent;
  font-family:'Courier New',Courier,monospace;
}

.wrap{
  width:100%;
  max-width:430px;
  margin:0 auto;
  padding:8px;
}

.game{
  position:relative;
  width:100%;
  height:560px;
  overflow:hidden;
  border-radius:24px;
  background:#121224;
  border:2px solid #3b82f6;
  box-shadow:0 0 25px rgba(59,130,246,0.4);
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud{
  width:100%;
  min-height:48px;
  padding:10px 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  color:#fff;
  font-size:12px;
  font-weight:bold;
  background:#0a0a1a;
  border-bottom:2px solid #3b82f6;
  z-index:10;
  flex-shrink:0;
}

.hud span b{
  color:#60a5fa;
}

.board-container{
  position:relative;
  width:min(88vw,340px);
  aspect-ratio:1/1;
  height:auto;
  margin:14px auto 0;
  padding:0;
  background:#000;
  border:3px solid #1e3a8a;
  border-radius:8px;
  box-shadow:0 0 15px rgba(0,0,0,0.8);
  overflow:hidden;
  flex-shrink:0;
}

canvas{
  display:block;
  width:100%;
  height:100%;
  max-width:100%;
  max-height:100%;
  background:#1e293b;
  touch-action:none;
}

.footer-info{
  width:100%;
  flex:1;
  min-height:70px;
  display:flex;
  justify-content:center;
  align-items:center;
  color:rgba(255,255,255,0.7);
  font-size:11px;
  background:#080814;
  padding:10px 16px;
  text-align:center;
}

.overlay{
  position:absolute;
  z-index:30;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,0.9);
}

.panel{
  width:100%;
  max-width:320px;
  padding:20px;
  text-align:center;
  border-radius:16px;
  background:#0f172a;
  border:2px solid #3b82f6;
  box-shadow:0 0 30px rgba(59,130,246,0.3);
}

.panel h1{
  margin:0 0 8px;
  color:#60a5fa;
  font-size:20px;
  text-shadow:0 0 10px rgba(96,165,250,0.5);
}

.panel p{
  color:#cbd5e1;
  font-size:11px;
  line-height:1.4;
  margin:0 0 16px;
}

.diff-btns{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.diff-btn{
  width:100%;
  height:40px;
  border:2px solid #3b82f6;
  border-radius:8px;
  color:#fff;
  background:#1e293b;
  font-weight:bold;
  font-size:12px;
  cursor:pointer;
  transition:0.2s;
}

.diff-btn:active,
.diff-btn.selected{
  background:#3b82f6;
  color:#fff;
  box-shadow:0 0 10px rgba(59,130,246,0.6);
}

.start-btn{
  width:100%;
  height:42px;
  margin-top:12px;
  border:2px solid #60a5fa;
  border-radius:8px;
  color:#0f172a;
  background:#60a5fa;
  font-weight:bold;
  font-size:13px;
  cursor:pointer;
  box-shadow:0 0 12px rgba(96,165,250,0.4);
}

.start-btn:active{
  transform:scale(0.96);
}

@media(max-width:360px){
  .wrap{
    padding:5px;
  }

  .game{
    height:540px;
    border-radius:20px;
  }

  .hud{
    font-size:10px;
    padding:9px 10px;
  }

  .board-container{
    width:min(88vw,310px);
    margin-top:10px;
  }

  .panel{
    padding:16px;
  }

  .panel h1{
    font-size:17px;
  }
}
</style>

<div class="wrap">
  <div class="game" id="game">

    <div class="hud">
      <div>TURNO: <b id="turn">VOCÊ (🔴)</b></div>
      <div>PLACAR: <b id="score-status">🔴 12 | ⚪ 12</b></div>
    </div>

    <div class="board-container" id="board-container">
      <canvas id="canvas" width="680" height="680"></canvas>
    </div>

    <div class="footer-info" id="status-msg">
      Toque em uma peça vermelha para jogar.
    </div>

    <div class="overlay" id="overlay">
      <div class="panel">
        <h1>JOGO DE DAMAS VS BOT</h1>
        <p>Escolha a dificuldade da Inteligência Artificial:</p>

        <div class="diff-btns">
          <button class="diff-btn selected" data-diff="easy">
            FÁCIL
          </button>

          <button class="diff-btn" data-diff="medium">
            MÉDIO
          </button>

          <button class="diff-btn" data-diff="hard">
            EXTREMAMENTE DIFÍCIL
          </button>
        </div>

        <button class="start-btn" id="start-btn">
          INICIAR PARTIDA
        </button>
      </div>
    </div>

  </div>
</div>

<script>
(function(){

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const turnEl = document.getElementById("turn");
  const scoreStatusEl = document.getElementById("score-status");
  const statusMsg = document.getElementById("status-msg");
  const overlay = document.getElementById("overlay");
  const startBtn = document.getElementById("start-btn");
  const diffBtns = document.querySelectorAll(".diff-btn");

  const BOARD_SIZE = 8;
  const INTERNAL_SIZE = 680;

  canvas.width = INTERNAL_SIZE;
  canvas.height = INTERNAL_SIZE;

  const TILE_SIZE = INTERNAL_SIZE / BOARD_SIZE;

  let board = [];
  let turn = 1;
  let selectedPiece = null;
  let validMoves = [];
  let gameOver = false;
  let difficulty = "easy";
  let mustContinueJump = null;

  diffBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      diffBtns.forEach(b => {
        b.classList.remove("selected");
      });
      btn.classList.add("selected");
      difficulty = btn.getAttribute("data-diff");
    });
  });

  function initBoard(){
    board = [];
    for(let r = 0; r < BOARD_SIZE; r++){
      let row = [];
      for(let c = 0; c < BOARD_SIZE; c++){
        if((r + c) % 2 === 1){
          if(r < 3){
            row.push(3);
          }else if(r > 4){
            row.push(1);
          }else{
            row.push(0);
          }
        }else{
          row.push(0);
        }
      }
      board.push(row);
    }

    turn = 1;
    selectedPiece = null;
    validMoves = [];
    gameOver = false;
    mustContinueJump = null;
    overlay.style.display = "none";
    updateHUD();
  }

  function isRed(p){
    return p === 1 || p === 2;
  }

  function isWhite(p){
    return p === 3 || p === 4;
  }

  function isKing(p){
    return p === 2 || p === 4;
  }

  function getAllMovesForPlayer(currentBoard, playerTurn){
    let allMoves = [];
    const isCurrentRed = playerTurn === 1;

    for(let r = 0; r < BOARD_SIZE; r++){
      for(let c = 0; c < BOARD_SIZE; c++){
        const p = currentBoard[r][c];
        if(p === 0) continue;
        if(isCurrentRed && !isRed(p)) continue;
        if(!isCurrentRed && !isWhite(p)) continue;

        if(mustContinueJump && (mustContinueJump.r !== r || mustContinueJump.c !== c)) continue;

        const moves = getValidMovesForPiece(currentBoard, r, c);

        moves.forEach(m => {
          allMoves.push({
            fromR: r,
            fromC: c,
            toR: m.r,
            toC: m.c,
            jump: m.jump,
            jumpedPieces: m.jumpedPieces || (m.jump ? [m.jump] : [])
          });
        });
      }
    }
    return allMoves;
  }

  function getValidMovesForPiece(currentBoard, r, c){
    const p = currentBoard[r][c];
    if(p === 0) return [];

    const moves = [];
    const isCurrentRed = isRed(p);
    const king = isKing(p);
    const directions = [[-1,-1], [-1,1], [1,-1], [1,1]];

    if(king){
      function findKingJumpsRecursive(currR, currC, currentJumped, boardState){
        let foundAny = false;
        directions.forEach(function(dir){
          let dr = dir[0], dc = dir[1];
          let step = 1;
          let foundEnemy = null;
          while(true){
            let nr = currR + dr * step;
            let nc = currC + dc * step;
            if(nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
            const target = boardState[nr][nc];

            if(target === 0){
              if(foundEnemy){
                let alreadyJumped = false;
                for(let i = 0; i < currentJumped.length; i++){
                  if(currentJumped[i].r === foundEnemy.r && currentJumped[i].c === foundEnemy.c){
                    alreadyJumped = true;
                    break;
                  }
                }
                if(!alreadyJumped){
                  foundAny = true;
                  let nextJumped = currentJumped.concat([foundEnemy]);
                  let tempSimBoard = boardState.map(function(row){ return row.slice(); });
                  tempSimBoard[foundEnemy.r][foundEnemy.c] = 0;

                  let deeper = findKingJumpsRecursive(nr, nc, nextJumped, tempSimBoard);
                  if(deeper.length === 0){
                    moves.push({
                      r: nr,
                      c: nc,
                      jump: nextJumped[0],
                      jumpedPieces: nextJumped
                    });
                  }
                }
              } else if(!mustContinueJump){
                moves.push({ r: nr, c: nc, jump: null, jumpedPieces: [] });
              }
            } else {
              const friendOrFoe = isCurrentRed ? isRed(target) : isWhite(target);
              if(friendOrFoe || foundEnemy){
                break;
              } else {
                foundEnemy = { r: nr, c: nc };
              }
            }
            step++;
          }
        });
        return foundAny ? moves : [];
      }

      findKingJumpsRecursive(r, c, [], currentBoard);

      if(!mustContinueJump){
        let hasJumps = false;
        for(let i = 0; i < moves.length; i++){
          if(moves[i].jumpedPieces && moves[i].jumpedPieces.length > 0){
            hasJumps = true;
            break;
          }
        }
        if(!hasJumps){
          directions.forEach(function(dir){
            let dr = dir[0], dc = dir[1];
            let step = 1;
            while(true){
              let nr = r + dr * step;
              let nc = c + dc * step;
              if(nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
              if(currentBoard[nr][nc] === 0){
                moves.push({ r: nr, c: nc, jump: null, jumpedPieces: [] });
              } else {
                break;
              }
              step++;
            }
          });
        }
      }

    } else {
      if(!mustContinueJump){
        let fwdDr = isCurrentRed ? -1 : 1;
        let nr = r + fwdDr;
        [c - 1, c + 1].forEach(function(nc){
          if(nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE){
            if(currentBoard[nr][nc] === 0){
              moves.push({ r: nr, c: nc, jump: null, jumpedPieces: [] });
            }
          }
        });
      }

      function findPawnJumpsRecursive(currR, currC, currentJumped, boardState){
        let foundAny = false;
        directions.forEach(function(dir){
          let ddr = dir[0], ddc = dir[1];
          let tR = currR + ddr;
          let tC = currC + ddc;
          if(tR >= 0 && tR < BOARD_SIZE && tC >= 0 && tC < BOARD_SIZE){
            let target = boardState[tR][tC];
            if(target !== 0){
              let friendOrFoe = isCurrentRed ? isRed(target) : isWhite(target);
              if(!friendOrFoe){
                let nnR = tR + ddr;
                let nnC = tC + ddc;
                if(nnR >= 0 && nnR < BOARD_SIZE && nnC >= 0 && nnC < BOARD_SIZE){
                  let landingTile = boardState[nnR][nnC];
                  let alreadyJumped = false;
                  for(let i = 0; i < currentJumped.length; i++){
                    if(currentJumped[i].r === tR && currentJumped[i].c === tC){
                      alreadyJumped = true;
                      break;
                    }
                  }
                  if((landingTile === 0 || (nnR === r && nnC === c)) && !alreadyJumped){
                    foundAny = true;
                    let nextJumped = currentJumped.concat([{ r: tR, c: tC }]);
                    let tempSimBoard = boardState.map(function(row){ return row.slice(); });
                    tempSimBoard[tR][tC] = 0;

                    let deeperMoves = findPawnJumpsRecursive(nnR, nnC, nextJumped, tempSimBoard);
                    if(deeperMoves.length === 0){
                      moves.push({
                        r: nnR,
                        c: nnC,
                        jump: nextJumped[0],
                        jumpedPieces: nextJumped
                      });
                    }
                  }
                }
              }
            }
          }
        });
        return foundAny ? moves : [];
      }

      findPawnJumpsRecursive(r, c, [], currentBoard);
    }

    let uniqueMoves = [];
    let seen = {};
    for(let i = 0; i < moves.length; i++){
      let m = moves.get ? moves[i] : moves[i];
      let jpStr = JSON.stringify(m.jumpedPieces || []);
      let key = m.r + "," + m.c + "," + jpStr;
      if(!seen[key]){
        seen[key] = true;
        uniqueMoves.push(m);
      }
    }

    return uniqueMoves;
  }

  function updateHUD(){
    let reds = 0;
    let whites = 0;

    for(let r = 0; r < BOARD_SIZE; r++){
      for(let c = 0; c < BOARD_SIZE; c++){
        if(isRed(board[r][c])) reds++;
        if(isWhite(board[r][c])) whites++;
      }
    }

    turnEl.textContent = (turn === 1) ? "VOCÊ (🔴)" : "BOT (⚪)";
    turnEl.style.color = (turn === 1) ? "#f87171" : "#cbd5e1";
    scoreStatusEl.textContent = "🔴 " + reds + " | ⚪ " + whites;

    if(reds === 0){
      endGame("BOT VENCEU A PARTIDA!");
    }else if(whites === 0){
      endGame("VOCÊ VENCEU A PARTIDA!");
    }
  }

  function endGame(msg){
    gameOver = true;
    overlay.style.display = "flex";
    overlay.querySelector("h1").textContent = "FIM DE JOGO";
    overlay.querySelector("p").textContent = msg;
    startBtn.textContent = "JOGAR NOVAMENTE";
  }

  function draw(){
    ctx.clearRect(0, 0, INTERNAL_SIZE, INTERNAL_SIZE);

    for(let r = 0; r < BOARD_SIZE; r++){
      for(let c = 0; c < BOARD_SIZE; c++){
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        ctx.fillStyle = ((r + c) % 2 === 1) ? "#334155" : "#f1f5f9";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        if(selectedPiece && selectedPiece.r === r && selectedPiece.c === c){
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 10;
          ctx.strokeRect(x + 6, y + 6, TILE_SIZE - 12, TILE_SIZE - 12);
        }
      }
    }

    validMoves.forEach(function(m){
      const x = m.c * TILE_SIZE + TILE_SIZE / 2;
      const y = m.r * TILE_SIZE + TILE_SIZE / 2;

      ctx.fillStyle = "rgba(74,222,128,0.75)";
      ctx.beginPath();
      ctx.arc(x, y, TILE_SIZE / 5, 0, Math.PI * 2);
      ctx.fill();
    });

    for(let r = 0; r < BOARD_SIZE; r++){
      for(let c = 0; c < BOARD_SIZE; c++){
        const p = board[r][c];
        if(p === 0) continue;

        const x = c * TILE_SIZE + TILE_SIZE / 2;
        const y = r * TILE_SIZE + TILE_SIZE / 2;
        const radius = TILE_SIZE / 2 - 14;

        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.65)";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isRed(p) ? "#dc2626" : "#f8fafc";
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = isRed(p) ? "#991b1b" : "#94a3b8";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x - radius * 0.25, y - radius * 0.25, radius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fill();

        if(isKing(p)){
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.48, 0, Math.PI * 2);
          ctx.fillStyle = "#fbbf24";
          ctx.fill();
          ctx.lineWidth = 5;
          ctx.strokeStyle = "#b45309";
          ctx.stroke();

          ctx.fillStyle = "#78350f";
          ctx.font = "bold " + Math.floor(TILE_SIZE * 0.34) + "px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("♛", x, y + 2);
        }
      }
    }
  }

  canvas.addEventListener("pointerdown", function(e){
    if(gameOver || turn !== 1) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const scaleX = INTERNAL_SIZE / rect.width;
    const scaleY = INTERNAL_SIZE / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const c = Math.floor(x / TILE_SIZE);
    const r = Math.floor(y / TILE_SIZE);

    if(r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return;

    const clickedPiece = board[r][c];
    let targetMove = null;
    for(let i = 0; i < validMoves.length; i++){
      if(validMoves[i].r === r && validMoves[i].c === c){
        targetMove = validMoves[i];
        break;
      }
    }

    if(targetMove){
      const isAJump = targetMove.jumpedPieces && targetMove.jumpedPieces.length > 0;

      executeMove({
        fromR: selectedPiece.r,
        fromC: selectedPiece.c,
        toR: r,
        toC: c,
        jump: targetMove.jump,
        jumpedPieces: targetMove.jumpedPieces
      }, 1);

      if(isAJump){
        selectedPiece = { r: r, c: c };
        let nextMoves = getValidMovesForPiece(board, r, c);
        validMoves = [];
        for(let i = 0; i < nextMoves.length; i++){
          if(nextMoves[i].jumpedPieces && nextMoves[i].jumpedPieces.length > 0){
            validMoves.push(nextMoves[i]);
          }
        }

        if(validMoves.length > 0){
          mustContinueJump = { r: r, c: c };
          draw();
          statusMsg.textContent = "Continue comendo! Escolha a próxima casa verde.";
          return;
        }
      }

      mustContinueJump = null;
      selectedPiece = null;
      validMoves = [];

      draw();
      updateHUD();

      if(!gameOver){
        turn = 3;
        updateHUD();
        statusMsg.textContent = "Bot pensando...";
        setTimeout(botTurn, 600);
      }
      return;
    }

    if(mustContinueJump){
      if(r === mustContinueJump.r && c === mustContinueJump.c){
        selectedPiece = { r, c };
        let pieceMoves = getValidMovesForPiece(board, r, c);
        validMoves = [];
        for(let i = 0; i < pieceMoves.length; i++){
          if(pieceMoves[i].jumpedPieces && pieceMoves[i].jumpedPieces.length > 0){
            validMoves.push(pieceMoves[i]);
          }
        }
        draw();
        statusMsg.textContent = "Continue o salto múltiplo!";
      }
      return;
    }

    if(isRed(clickedPiece)){
      selectedPiece = { r, c };
      validMoves = getValidMovesForPiece(board, r, c);
      draw();
      if(validMoves.length){
        statusMsg.textContent = "Escolha uma casa verde para mover.";
      }else{
        statusMsg.textContent = "Essa peça não possui movimentos.";
      }
    }else{
      selectedPiece = null;
      validMoves = [];
      draw();
      statusMsg.textContent = "Toque em uma peça vermelha sua.";
    }
  }, {passive:false});

  function executeMove(m, player){
    board[m.toR][m.toC] = board[m.fromR][m.fromC];
    board[m.fromR][m.fromC] = 0;

    if(m.jump){
      board[m.jump.r][m.jump.c] = 0;
    }

    if(m.jumpedPieces && m.jumpedPieces.length > 0){
      for(let i = 0; i < m.jumpedPieces.length; i++){
        let jp = m.jumpedPieces[i];
        board[jp.r][jp.c] = 0;
      }
    }

    if(player === 1 && m.toR === 0){
      board[m.toR][m.toC] = 2;
    }

    if(player === 3 && m.toR === BOARD_SIZE - 1){
      board[m.toR][m.toC] = 4;
    }
  }

  function botTurn(){
    if(gameOver) return;

    function executeBotStep(){
      if(gameOver) return;

      const allBotMoves = getAllMovesForPlayer(board, 3);

      if(allBotMoves.length === 0){
        if(!mustContinueJump){
          endGame("VOCÊ VENCEU! O BOT FICOU SEM MOVIMENTOS.");
        }
        return;
      }

      let chosenMove = null;

      if(difficulty === "easy"){
        let jumpMoves = [];
        for(let i = 0; i < allBotMoves.length; i++){
          if(allBotMoves[i].jumpedPieces && allBotMoves[i].jumpedPieces.length > 0){
            jumpMoves.push(allBotMoves[i]);
          }
        }
        chosenMove = (jumpMoves.length > 0 && Math.random() < 0.7)
          ? jumpMoves[Math.floor(Math.random() * jumpMoves.length)]
          : allBotMoves[Math.floor(Math.random() * allBotMoves.length)];
      }else if(difficulty === "medium"){
        let jumpMoves = [];
        for(let i = 0; i < allBotMoves.length; i++){
          if(allBotMoves[i].jumpedPieces && allBotMoves[i].jumpedPieces.length > 0){
            jumpMoves.push(allBotMoves[i]);
          }
        }
        chosenMove = (jumpMoves.length > 0)
          ? jumpMoves[Math.floor(Math.random() * jumpMoves.length)]
          : allBotMoves[Math.floor(Math.random() * allBotMoves.length)];
      }else{
        let bestScore = -Infinity;
        let bestMoves = [];

        for(let i = 0; i < allBotMoves.length; i++){
          let m = allBotMoves[i];
          const tempBoard = cloneBoard(board);
          applyMoveOnClone(tempBoard, m, 3);
          const score = minimax(tempBoard, 4, false, -Infinity, Infinity);
          if(score > bestScore){
            bestScore = score;
            bestMoves = [m];
          }else if(score === bestScore){
            bestMoves.push(m);
          }
        }

        chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      }

      if(chosenMove){
        const isAJump = chosenMove.jumpedPieces && chosenMove.jumpedPieces.length > 0;
        executeMove(chosenMove, 3);

        draw();
        updateHUD();

        if(isAJump){
          mustContinueJump = { r: chosenMove.toR, c: chosenMove.toC };
          let nextMoves = getValidMovesForPiece(board, chosenMove.toR, chosenMove.toC);
          let furtherMoves = [];
          for(let i = 0; i < nextMoves.length; i++){
            if(nextMoves[i].jumpedPieces && nextMoves[i].jumpedPieces.length > 0){
              furtherMoves.push(nextMoves[i]);
            }
          }
          if(furtherMoves.length > 0 && !gameOver){
            setTimeout(executeBotStep, 500);
            return;
          }
        }
      }

      mustContinueJump = null;
      if(!gameOver){
        turn = 1;
        updateHUD();
        statusMsg.textContent = "Sua vez! Toque em uma peça.";
      }
    }

    executeBotStep();
  }

  function cloneBoard(b){
    return b.map(function(row){ return row.slice(); });
  }

  function applyMoveOnClone(b, m, player){
    b[m.toR][m.toC] = b[m.fromR][m.fromC];
    b[m.fromR][m.fromC] = 0;

    if(m.jump){
      b[m.jump.r][m.jump.c] = 0;
    }

    if(m.jumpedPieces && m.jumpedPieces.length > 0){
      for(let i = 0; i < m.jumpedPieces.length; i++){
        let jp = m.jumpedPieces[i];
        b[jp.r][jp.c] = 0;
      }
    }

    if(player === 1 && m.toR === 0){
      b[m.toR][m.toC] = 2;
    }

    if(player === 3 && m.toR === BOARD_SIZE - 1){
      b[m.toR][m.toC] = 4;
    }
  }

  function evaluate(b){
    let score = 0;
    for(let r = 0; r < BOARD_SIZE; r++){
      for(let c = 0; c < BOARD_SIZE; c++){
        const p = b[r][c];
        if(p === 3){
          score += 10 + r;
        }else if(p === 4){
          score += 25;
        }else if(p === 1){
          score -= 10 + (7 - r);
        }else if(p === 2){
          score -= 25;
        }
      }
    }
    return score;
  }

  function minimax(b, depth, isMaximizing, alpha, beta){
    if(depth === 0){
      return evaluate(b);
    }

    const playerTurn = isMaximizing ? 3 : 1;
    const moves = getAllMovesForPlayer(b, playerTurn);

    if(moves.length === 0){
      return isMaximizing ? -1000 : 1000;
    }

    if(isMaximizing){
      let maxEval = -Infinity;
      for(let i = 0; i < moves.length; i++){
        let m = moves[i];
        const tempB = cloneBoard(b);
        applyMoveOnClone(tempB, m, 3);
        const evalScore = minimax(tempB, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if(beta <= alpha) break;
      }
      return maxEval;
    }else{
      let minEval = Infinity;
      for(let i = 0; i < moves.length; i++){
        let m = moves[i];
        const tempB = cloneBoard(b);
        applyMoveOnClone(tempB, m, 1);
        const evalScore = minimax(tempB, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if(beta <= alpha) break;
      }
      return minEval;
    }
  }

  startBtn.addEventListener("click", function(){
    overlay.querySelector("h1").textContent = "JOGO DE DAMAS VS BOT";
    overlay.querySelector("p").textContent = "Escolha a dificuldade da Inteligência Artificial:";
    startBtn.textContent = "INICIAR PARTIDA";
    initBoard();
    draw();
    statusMsg.textContent = "Sua vez! Toque em uma peça.";
  });

  initBoard();
  draw();

})();
</script>`;

function executeGameScripts(container){
  const scripts = [...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script = document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(attr.name, attr.value);
    }

    script.textContent = oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);
  }
}

registerGame({
  id:"damas",
  name:"Damas",
  category:"Estratégia",
  icon:"🔴",

  init({container}){
    container.innerHTML = CHECKERS_HTML;
    executeGameScripts(container);
  }
});