import { registerGame } from "../arcade.js";

const RACING_GAME_HTML = String.raw`<style>
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
  height:620px;
  overflow:hidden;
  border-radius:24px;
  background:#02030a;
  border:2px solid #ec4899;
  box-shadow:
    0 0 20px rgba(236,72,153,.35),
    0 0 55px rgba(6,182,212,.12);
  display:flex;
  flex-direction:column;
  align-items:center;
}

.hud{
  width:100%;
  min-height:52px;
  padding:9px 14px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  color:#fff;
  font-size:10px;
  font-weight:bold;
  background:
    linear-gradient(90deg,#09091a,#11112b,#09091a);
  border-bottom:2px solid #ec4899;
  z-index:20;
  flex-shrink:0;
}

.hud-item{
  display:flex;
  flex-direction:column;
  gap:2px;
}

.hud-label{
  color:#94a3b8;
  font-size:8px;
  letter-spacing:1px;
}

.hud-value{
  color:#fff;
  font-size:15px;
  text-shadow:0 0 8px rgba(255,255,255,.3);
}

#speed-display{
  color:#22d3ee;
  text-shadow:0 0 9px rgba(34,211,238,.7);
}

#score-display{
  color:#f472b6;
  text-shadow:0 0 9px rgba(244,114,182,.7);
}

.board-container{
  position:relative;
  width:100%;
  flex:1;
  min-height:0;
  background:#02030a;
  overflow:hidden;
}

canvas{
  display:block;
  width:100%;
  height:100%;
  background:#02030a;
}

.controls-panel{
  width:100%;
  background:
    linear-gradient(180deg,#09091b,#05050f);
  border-top:2px solid #ec4899;
  padding:11px 13px;
  display:flex;
  justify-content:space-between;
  gap:14px;
  flex-shrink:0;
  z-index:20;
}

.ctrl-btn{
  flex:1;
  height:54px;
  background:
    linear-gradient(180deg,#25205c,#151333);
  border:2px solid #ec4899;
  border-radius:15px;
  color:#fff;
  font-size:22px;
  font-weight:bold;
  cursor:pointer;
  box-shadow:
    0 0 12px rgba(236,72,153,.18),
    inset 0 0 12px rgba(236,72,153,.06);
  transition:transform .08s,background .08s;
}

.ctrl-btn:active,
.ctrl-btn.active{
  transform:scale(.95);
  background:#ec4899;
  box-shadow:
    0 0 20px rgba(236,72,153,.65),
    inset 0 0 10px rgba(255,255,255,.15);
}

.overlay{
  position:absolute;
  z-index:50;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:
    radial-gradient(circle at center,
      rgba(15,23,42,.78),
      rgba(2,3,10,.96));
  backdrop-filter:blur(3px);
}

.panel{
  width:100%;
  max-width:330px;
  padding:25px 22px;
  text-align:center;
  border-radius:20px;
  background:
    linear-gradient(145deg,
      rgba(15,23,42,.98),
      rgba(9,9,26,.98));
  border:2px solid #06b6d4;
  box-shadow:
    0 0 25px rgba(6,182,212,.25),
    inset 0 0 25px rgba(6,182,212,.04);
}

.panel h1{
  margin:0 0 10px;
  color:#22d3ee;
  font-size:25px;
  letter-spacing:2px;
  text-shadow:
    0 0 7px rgba(34,211,238,.8),
    0 0 20px rgba(34,211,238,.35);
}

.panel p{
  color:#cbd5e1;
  font-size:11px;
  line-height:1.65;
  margin:0 0 20px;
}

.start-btn{
  width:100%;
  height:47px;
  border:2px solid #06b6d4;
  border-radius:11px;
  color:#021016;
  background:#06b6d4;
  font-weight:bold;
  font-size:13px;
  cursor:pointer;
  box-shadow:
    0 0 15px rgba(6,182,212,.4);
}

.start-btn:active{
  transform:scale(.97);
}

.difficulty{
  margin-top:12px;
  color:#64748b;
  font-size:8px;
  letter-spacing:1px;
}
</style>

<div class="wrap">
  <div class="game">

    <div class="hud">

      <div class="hud-item">
        <div class="hud-label">VELOCIDADE</div>
        <div class="hud-value" id="speed-display">0 km/h</div>
      </div>

      <div class="hud-item" style="text-align:right">
        <div class="hud-label">PONTOS</div>
        <div class="hud-value" id="score-display">0</div>
      </div>

    </div>

    <div class="board-container">
      <canvas id="raceCanvas"></canvas>

      <div class="overlay" id="overlay">
        <div class="panel">

          <h1 id="panel-title">CYBER RACER</h1>

          <p id="panel-text">
            Corra pela cidade neon, desvie do trânsito e mantenha o controle.
            Use os botões ou as setas esquerda e direita.
          </p>

          <button class="start-btn" id="start-btn">
            INICIAR CORRIDA
          </button>

          <div class="difficulty">
            TRÂNSITO NEON • MODO ARCADE
          </div>

        </div>
      </div>

    </div>

    <div class="controls-panel">

      <button class="ctrl-btn" id="btn-left">
        ◀
      </button>

      <button class="ctrl-btn" id="btn-right">
        ▶
      </button>

    </div>

  </div>
</div>

<script>
(function(){

  const canvas = document.getElementById("raceCanvas");
  const ctx = canvas.getContext("2d");

  const speedDisplay =
    document.getElementById("speed-display");

  const scoreDisplay =
    document.getElementById("score-display");

  const overlay =
    document.getElementById("overlay");

  const startBtn =
    document.getElementById("start-btn");

  const panelTitle =
    document.getElementById("panel-title");

  const panelText =
    document.getElementById("panel-text");

  const btnLeft =
    document.getElementById("btn-left");

  const btnRight =
    document.getElementById("btn-right");


  let W = 0;
  let H = 0;

  function resizeCanvas(){

    const rect =
      canvas.parentElement.getBoundingClientRect();

    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));

    const dpr =
      Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(dpr,0,0,dpr,0,0);

  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();


  let gameRunning = false;

  let playerX = 0;

  let playerVelocity = 0;

  let speed = 0;

  let score = 0;

  let distance = 0;

  let roadOffset = 0;

  let lastTime = 0;

  let spawnTimer = 0;

  let obstacles = [];

  let keyLeft = false;
  let keyRight = false;


  const MAX_SPEED = 95;


  const lanes = [-0.66, 0, 0.66];


  function clamp(v,min,max){
    return Math.max(min,Math.min(max,v));
  }


  function roadGeometry(depth){

    const horizon =
      H * 0.36;

    const bottom =
      H;

    const d =
      clamp(depth,0,1);

    const perspective =
      Math.pow(d,1.65);

    const roadWidth =
      W * (
        0.10 +
        0.88 * perspective
      );

    const centerCurve =
      Math.sin(
        (distance * 0.006) +
        (1-d) * 2.8
      ) * W * 0.035 * perspective;

    const center =
      W / 2 + centerCurve;

    const y =
      horizon +
      (bottom-horizon) * perspective;

    return {
      x:center,
      y:y,
      width:roadWidth
    };

  }


  function drawSky(){

    const horizon = H * .36;

    const sky =
      ctx.createLinearGradient(
        0,0,
        0,horizon
      );

    sky.addColorStop(0,"#01020a");
    sky.addColorStop(.45,"#08051b");
    sky.addColorStop(1,"#181044");

    ctx.fillStyle = sky;
    ctx.fillRect(0,0,W,horizon);


    // lua
    const moonX = W * .78;
    const moonY = H * .14;
    const moonR = Math.max(15,W*.045);

    ctx.save();

    ctx.shadowColor = "#67e8f9";
    ctx.shadowBlur = 25;

    ctx.fillStyle = "#cffafe";

    ctx.beginPath();
    ctx.arc(
      moonX,
      moonY,
      moonR,
      0,
      Math.PI*2
    );

    ctx.fill();

    ctx.restore();


    // estrelas

    ctx.fillStyle = "#a5f3fc";

    for(let i=0;i<32;i++){

      const x =
        (i*83)%W;

      const y =
        10 + ((i*47)%(horizon-20));

      const r =
        i%4===0 ? 1.5 : .7;

      ctx.globalAlpha =
        .35 + (i%3)*.2;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI*2
      );

      ctx.fill();

    }

    ctx.globalAlpha = 1;


    // cidade no horizonte

    const cityBase =
      horizon + 5;

    for(let i=0;i<28;i++){

      const bw =
        10 + ((i*17)%30);

      const bh =
        12 + ((i*31)%(H*.15));

      const x =
        (i*47)%W;

      ctx.fillStyle =
        i%2
        ? "#090b20"
        : "#0c102c";

      ctx.fillRect(
        x,
        cityBase-bh,
        bw,
        bh
      );


      ctx.fillStyle =
        i%3
        ? "#22d3ee"
        : "#f472b6";

      for(
        let wy=cityBase-bh+7;
        wy<cityBase-4;
        wy+=8
      ){

        if((wy+i)%3!==0){

          ctx.globalAlpha=.5;

          ctx.fillRect(
            x+3,
            wy,
            2,
            3
          );

          if(bw>18){

            ctx.fillRect(
              x+bw-6,
              wy,
              2,
              3
            );

          }

        }

      }

      ctx.globalAlpha=1;

    }

  }


  function drawRoad(){

    const horizon = H*.36;


    // chão

    const ground =
      ctx.createLinearGradient(
        0,horizon,
        0,H
      );

    ground.addColorStop(0,"#090b18");
    ground.addColorStop(1,"#020208");

    ctx.fillStyle=ground;

    ctx.fillRect(
      0,
      horizon,
      W,
      H-horizon
    );


    const slices = 55;


    for(let i=0;i<slices;i++){

      const d1 = i/slices;
      const d2 = (i+1)/slices;

      const a = roadGeometry(d1);
      const b = roadGeometry(d2);


      // grama/laterais

      ctx.fillStyle =
        i%2
        ? "#08091a"
        : "#0b0d22";

      ctx.beginPath();

      ctx.moveTo(0,a.y);
      ctx.lineTo(W,a.y);
      ctx.lineTo(W,b.y);
      ctx.lineTo(0,b.y);

      ctx.closePath();
      ctx.fill();


      // estrada

      ctx.fillStyle =
        i%2
        ? "#111322"
        : "#0d0f1e";

      ctx.beginPath();

      ctx.moveTo(
        a.x-a.width/2,
        a.y
      );

      ctx.lineTo(
        a.x+a.width/2,
        a.y
      );

      ctx.lineTo(
        b.x+b.width/2,
        b.y
      );

      ctx.lineTo(
        b.x-b.width/2,
        b.y
      );

      ctx.closePath();
      ctx.fill();


      // bordas neon

      const edgeA =
        a.width*.025;

      const edgeB =
        b.width*.025;

      ctx.fillStyle =
        Math.floor(
          (i + Math.floor(distance/3))
        )%2
        ? "#ec4899"
        : "#06b6d4";


      ctx.beginPath();

      ctx.moveTo(
        a.x-a.width/2,
        a.y
      );

      ctx.lineTo(
        a.x-a.width/2+edgeA,
        a.y
      );

      ctx.lineTo(
        b.x-b.width/2+edgeB,
        b.y
      );

      ctx.lineTo(
        b.x-b.width/2,
        b.y
      );

      ctx.fill();


      ctx.beginPath();

      ctx.moveTo(
        a.x+a.width/2,
        a.y
      );

      ctx.lineTo(
        a.x+a.width/2-edgeA,
        a.y
      );

      ctx.lineTo(
        b.x+b.width/2-edgeB,
        b.y
      );

      ctx.lineTo(
        b.x+b.width/2,
        b.y
      );

      ctx.fill();


      // linhas das faixas

      if(i%4===0 && i>1){

        ctx.fillStyle =
          "rgba(255,255,255,.55)";

        for(const lane of [-1/3,1/3]){

          const ax =
            a.x + lane*a.width;

          const bx =
            b.x + lane*b.width;

          const lwA =
            Math.max(1,a.width*.009);

          const lwB =
            Math.max(1,b.width*.009);

          ctx.beginPath();

          ctx.moveTo(
            ax-lwA,
            a.y
          );

          ctx.lineTo(
            ax+lwA,
            a.y
          );

          ctx.lineTo(
            bx+lwB,
            b.y
          );

          ctx.lineTo(
            bx-lwB,
            b.y
          );

          ctx.fill();

        }

      }

    }

  }


  function drawStreetObjects(){

    const horizon = H*.36;

    for(let i=0;i<13;i++){

      const depth =
        ((i*0.075 + distance*0.00035)%1);

      if(depth<.06) continue;

      const g =
        roadGeometry(depth);

      const side =
        i%2===0 ? -1 : 1;

      const x =
        g.x +
        side *
        (g.width/2 + W*.055);

      const scale =
        .12 + depth*.8;


      // poste

      ctx.strokeStyle =
        i%3===0
        ? "#06b6d4"
        : "#ec4899";

      ctx.lineWidth =
        Math.max(1,2*scale);

      ctx.beginPath();

      ctx.moveTo(
        x,
        g.y
      );

      ctx.lineTo(
        x,
        g.y-85*scale
      );

      ctx.stroke();


      ctx.fillStyle =
        i%3===0
        ? "#67e8f9"
        : "#f472b6";

      ctx.shadowColor =
        ctx.fillStyle;

      ctx.shadowBlur =
        12*scale;

      ctx.beginPath();

      ctx.arc(
        x,
        g.y-86*scale,
        4*scale,
        0,
        Math.PI*2
      );

      ctx.fill();

      ctx.shadowBlur=0;


      // placa/luz lateral

      if(i%3===0){

        ctx.fillStyle="#1e293b";

        ctx.fillRect(
          x-8*scale,
          g.y-55*scale,
          16*scale,
          10*scale
        );

        ctx.fillStyle="#22d3ee";

        ctx.fillRect(
          x-5*scale,
          g.y-52*scale,
          10*scale,
          2*scale
        );

      }

    }

  }


  function spawnObstacle(){

    if(!gameRunning) return;


    const lane =
      lanes[
        Math.floor(
          Math.random()*lanes.length
        )
      ];


    const colorList = [
      "#ef4444",
      "#8b5cf6",
      "#f59e0b",
      "#22c55e",
      "#3b82f6"
    ];


    obstacles.push({

      distance:
        distance + 150 + Math.random()*55,

      lane:lane,

      color:
        colorList[
          Math.floor(
            Math.random()*colorList.length
          )
        ],

      speed:
        20 + Math.random()*25,

      type:
        Math.random()>.35
        ? "car"
        : "sport"

    });


    const difficulty =
      Math.min(score/1000,1);

    spawnTimer =
      Math.max(
        800,
        1500 - difficulty*500
      );

  }


  function drawCar(x,y,scale,color,player){

    ctx.save();

    const w =
      50*scale;

    const h =
      82*scale;


    // sombra

    ctx.fillStyle =
      "rgba(0,0,0,.6)";

    ctx.beginPath();

    ctx.ellipse(
      x,
      y+8*scale,
      w*.65,
      h*.16,
      0,
      0,
      Math.PI*2
    );

    ctx.fill();


    // brilho

    ctx.shadowColor =
      player
      ? "#06b6d4"
      : color;

    ctx.shadowBlur =
      player ? 18*scale : 10*scale;


    // corpo

    ctx.fillStyle =
      player
      ? "#0891b2"
      : color;

    ctx.beginPath();

    ctx.roundRect(
      x-w/2,
      y-h/2,
      w,
      h,
      9*scale
    );

    ctx.fill();


    ctx.shadowBlur=0;


    // parte frontal/traseira

    ctx.fillStyle =
      player
      ? "#164e63"
      : "#111827";

    ctx.beginPath();

    ctx.roundRect(
      x-w*.38,
      y-h*.38,
      w*.76,
      h*.30,
      5*scale
    );

    ctx.fill();


    // vidro

    ctx.fillStyle =
      "#020617";

    ctx.beginPath();

    ctx.moveTo(
      x-w*.31,
      y-h*.30
    );

    ctx.lineTo(
      x+w*.31,
      y-h*.30
    );

    ctx.lineTo(
      x+w*.23,
      y-h*.02
    );

    ctx.lineTo(
      x-w*.23,
      y-h*.02
    );

    ctx.closePath();

    ctx.fill();


    // reflexo do vidro

    ctx.strokeStyle =
      player
      ? "rgba(103,232,249,.7)"
      : "rgba(255,255,255,.25)";

    ctx.lineWidth =
      Math.max(1,2*scale);

    ctx.beginPath();

    ctx.moveTo(
      x-w*.23,
      y-h*.25
    );

    ctx.lineTo(
      x+w*.18,
      y-h*.08
    );

    ctx.stroke();


    // lanternas

    ctx.shadowColor =
      player
      ? "#ec4899"
      : "#ef4444";

    ctx.shadowBlur =
      10*scale;

    ctx.fillStyle =
      player
      ? "#ec4899"
      : "#ef4444";


    ctx.fillRect(
      x-w*.36,
      y+h*.27,
      w*.22,
      h*.055
    );

    ctx.fillRect(
      x+w*.14,
      y+h*.27,
      w*.22,
      h*.055
    );


    ctx.shadowBlur=0;


    // rodas

    ctx.fillStyle="#020617";

    ctx.fillRect(
      x-w*.57,
      y-h*.12,
      w*.17,
      h*.30
    );

    ctx.fillRect(
      x+w*.40,
      y-h*.12,
      w*.17,
      h*.30
    );


    // detalhe central

    if(player){

      ctx.fillStyle="#67e8f9";

      ctx.fillRect(
        x-w*.08,
        y-h*.46,
        w*.16,
        h*.07
      );

    }


    ctx.restore();

  }


  function drawObstacles(){

    for(let i=obstacles.length-1;i>=0;i--){

      const obs =
        obstacles[i];

      const relative =
        obs.distance-distance;

      if(relative<0) continue;

      const depth =
        1-clamp(
          relative/170,
          0,
          1
        );


      if(depth<=0) continue;


      const g =
        roadGeometry(depth);


      const x =
        g.x +
        obs.lane*g.width*.42;


      const scale =
        .16 + depth*.78;


      const y =
        g.y -
        35*scale;


      drawCar(
        x,
        y,
        scale,
        obs.color,
        false
      );

    }

  }


  function drawPlayer(){

    const g =
      roadGeometry(1);

    const x =
      g.x +
      playerX*g.width*.42;

    const y =
      H-67;


    drawCar(
      x,
      y,
      1.05,
      "#06b6d4",
      true
    );

  }


  function updateObstacles(dt){

    for(let i=obstacles.length-1;i>=0;i--){

      const obs =
        obstacles[i];


      const relative =
        obs.distance-distance;


      // colisão somente quando realmente chegou

      if(
        relative<13 &&
        relative>-8 &&
        Math.abs(
          playerX-obs.lane
        )<.27
      ){

        endGame();
        return;

      }

      if(relative < -15){

        obstacles.splice(i,1);

      }

    }

  }


  function endGame(){

    if(!gameRunning) return;

    gameRunning=false;

    keyLeft=false;
    keyRight=false;

    btnLeft.classList.remove("active");
    btnRight.classList.remove("active");

    overlay.style.display="flex";

    panelTitle.textContent =
      "FIM DE CORRIDA";

    panelText.textContent =
      "Você bateu no trânsito neon! Pontuação final: "
      + Math.floor(score)
      + " pontos.";

    startBtn.textContent =
      "TENTAR NOVAMENTE";

  }


  function startNewGame(){

    gameRunning=true;

    playerX=0;

    playerVelocity=0;

    speed=18;

    score=0;

    distance=0;

    roadOffset=0;

    obstacles=[];

    spawnTimer=900;

    lastTime=performance.now();


    overlay.style.display="none";

    speedDisplay.textContent =
      "36 km/h";

    scoreDisplay.textContent =
      "0";


    requestAnimationFrame(gameLoop);

  }


  function gameLoop(now){

    if(!gameRunning) return;


    let dt =
      (now-lastTime)/1000;

    dt =
      Math.min(dt,.035);

    lastTime=now;


    // aceleração suave

    if(speed<MAX_SPEED){

      speed +=
        12*dt;

    }


    // controle

    let steer=0;

    if(keyLeft) steer-=1;
    if(keyRight) steer+=1;


    const steeringPower =
      .95 +
      speed/MAX_SPEED*.35;


    playerVelocity +=
      steer*
      steeringPower*
      dt;


    playerVelocity *=
      Math.pow(.08,dt);


    playerX +=
      playerVelocity*
      dt;


    // limites da pista

    playerX =
      clamp(
        playerX,
        -.86,
        .86
      );


    // se estiver sem acelerar, reduz um pouco

    if(!keyLeft && !keyRight){

      playerVelocity *=
        Math.pow(.15,dt);

    }


    distance +=
      speed*dt;


    roadOffset +=
      speed*dt;


    score +=
      speed*dt*.18;


    spawnTimer -=
      dt*1000;


    if(spawnTimer<=0){

      spawnObstacle();

    }


    updateObstacles(dt);


    if(!gameRunning) return;


    // render

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    drawSky();

    drawRoad();

    drawStreetObjects();

    drawObstacles();

    drawPlayer();


    speedDisplay.textContent =
      Math.floor(speed*2)
      + " km/h";

    scoreDisplay.textContent =
      Math.floor(score);


    requestAnimationFrame(gameLoop);

  }


  // teclado

  window.addEventListener(
    "keydown",
    function(e){

      if(
        e.key==="ArrowLeft" ||
        e.key.toLowerCase()==="a"
      ){

        keyLeft=true;
        btnLeft.classList.add("active");

        e.preventDefault();

      }


      if(
        e.key==="ArrowRight" ||
        e.key.toLowerCase()==="d"
      ){

        keyRight=true;
        btnRight.classList.add("active");

        e.preventDefault();

      }

    },
    {passive:false}
  );


  window.addEventListener(
    "keyup",
    function(e){

      if(
        e.key==="ArrowLeft" ||
        e.key.toLowerCase()==="a"
      ){

        keyLeft=false;
        btnLeft.classList.remove("active");

      }


      if(
        e.key==="ArrowRight" ||
        e.key.toLowerCase()==="d"
      ){

        keyRight=false;
        btnRight.classList.remove("active");

      }

    }
  );


  // touch / mouse

  function holdButton(
    button,
    side
  ){

    const down = function(e){

      if(e.cancelable)
        e.preventDefault();

      if(side==="left")
        keyLeft=true;
      else
        keyRight=true;

      button.classList.add("active");

    };


    const up = function(){

      if(side==="left")
        keyLeft=false;
      else
        keyRight=false;

      button.classList.remove("active");

    };


    button.addEventListener(
      "mousedown",
      down
    );

    button.addEventListener(
      "mouseup",
      up
    );

    button.addEventListener(
      "mouseleave",
      up
    );

    button.addEventListener(
      "touchstart",
      down,
      {passive:false}
    );

    button.addEventListener(
      "touchend",
      up
    );

    button.addEventListener(
      "touchcancel",
      up
    );

  }


  holdButton(
    btnLeft,
    "left"
  );

  holdButton(
    btnRight,
    "right"
  );


  startBtn.addEventListener(
    "click",
    startNewGame
  );


  // desenho inicial

  function drawMenuScene(){

    ctx.clearRect(
      0,
      0,
      W,
      H
    );

    drawSky();
    drawRoad();
    drawStreetObjects();

    const g =
      roadGeometry(1);

    drawCar(
      g.x,
      H-67,
      1.05,
      "#06b6d4",
      true
    );

  }


  drawMenuScene();


})();
</script>`;

function executeGameScripts(container){

  const scripts =
    [...container.querySelectorAll("script")];

  for(const oldScript of scripts){

    const script =
      document.createElement("script");

    for(const attr of oldScript.attributes){

      script.setAttribute(
        attr.name,
        oldScript.getAttribute(attr.name)
      );

    }

    script.textContent =
      oldScript.textContent;

    oldScript.remove();

    container.appendChild(script);

  }

}

registerGame({

  id:"racer",

  name:"Cyber Racer",

  category:"Corrida",

  icon:"🏎️",

  init({container}){

    container.innerHTML =
      RACING_GAME_HTML;

    executeGameScripts(container);

  }

});