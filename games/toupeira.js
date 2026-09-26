import { registerGame } from "../arcade.js";

const WHACKAMOLE_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:520px;border-radius:24px;background:#422006;border:2px solid #ea580c;box-shadow:0 0 25px rgba(234,88,12,0.4);display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.hud{width:100%;padding:10px 14px;display:flex;justify-content:space-between;color:#fff;font-size:12px;font-weight:bold;background:#2c1608;border-bottom:2px solid #ea580c;}
.hud b{color:#fb923c;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:26px;width:100%;max-width:340px;margin:0 auto;flex:1;align-content:center;}
.hole{aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle,#1c0f04,#4a2811);display:flex;align-items:center;justify-content:center;font-size:34px;box-shadow:inset 0 6px 12px rgba(0,0,0,0.7);cursor:pointer;overflow:hidden;}
.mole{transition:transform 0.12s;transform:translateY(70%);}
.mole.up{transform:translateY(0);}
.mole.hit{transform:translateY(0) scale(0.8);}
.status-msg{width:100%;text-align:center;color:rgba(255,255,255,0.6);font-size:11px;padding:0 10px 14px;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#2c1608;border:2px solid #ea580c;border-radius:16px;box-shadow:0 0 30px rgba(234,88,12,0.4);}
.panel h1{color:#fb923c;font-size:16px;margin:0 0 10px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#ea580c,#c2410c);color:#fff;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#2c1608;}
</style>
<div class="wrap"><div class="game" id="game">
  <div class="overlay" id="overlay">
    <div class="panel">
      <h1>🔨 WHACK-A-MOLE</h1>
      <p id="overlayText">Acerte o máximo de toupeiras em 30 segundos! Toque nelas assim que aparecerem.</p>
      <button id="startBtn">INICIAR</button>
    </div>
  </div>
  <div class="hud"><span>Pontos: <b id="scoreEl">0</b></span><span>Tempo: <b id="timeEl">30</b>s</span></div>
  <div class="grid" id="grid"></div>
  <div class="status-msg">Toque nas toupeiras assim que saírem do buraco!</div>
  <div class="footer-info">Whack-a-Mole • OBSIDIAN ARCADE</div>
</div></div>
<script>
(function(){
  const overlay=document.getElementById('overlay');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const scoreEl=document.getElementById('scoreEl');
  const timeEl=document.getElementById('timeEl');
  const grid=document.getElementById('grid');
  const N=9;
  let holes=[];
  let score=0, timeLeft=30;
  let activeHole=-1, hitThisRound=false;
  let moleTimer=null, countdownTimer=null;
  let running=false;

  for(let i=0;i<N;i++){
    const hole=document.createElement('div');
    hole.className='hole';
    const mole=document.createElement('div');
    mole.className='mole';
    mole.textContent='🐹';
    hole.appendChild(mole);
    hole.addEventListener('click', function(){ onWhack(i); });
    grid.appendChild(hole);
    holes.push({el:hole, mole:mole});
  }

  function popRandom(){
    if(!running) return;
    if(activeHole!==-1){ holes[activeHole].mole.classList.remove('up','hit'); }
    activeHole=Math.floor(Math.random()*N);
    hitThisRound=false;
    holes[activeHole].mole.classList.add('up');
    const showTime=Math.max(450, 1100-score*15);
    moleTimer=setTimeout(function(){
      if(activeHole!==-1) holes[activeHole].mole.classList.remove('up');
      activeHole=-1;
      setTimeout(popRandom, 200+Math.random()*300);
    }, showTime);
  }

  function onWhack(i){
    if(!running || i!==activeHole || hitThisRound) return;
    hitThisRound=true;
    score++;
    scoreEl.textContent=score;
    holes[i].mole.classList.add('hit');
    clearTimeout(moleTimer);
    setTimeout(function(){
      holes[i].mole.classList.remove('up','hit');
      activeHole=-1;
      setTimeout(popRandom, 200+Math.random()*300);
    }, 150);
  }

  function tick(){
    timeLeft--;
    timeEl.textContent=timeLeft;
    if(timeLeft<=0){ finish(); }
  }

  function finish(){
    running=false;
    clearTimeout(moleTimer);
    clearInterval(countdownTimer);
    if(activeHole!==-1) holes[activeHole].mole.classList.remove('up');
    document.getElementById('overlay').querySelector('h1').textContent='⏱ TEMPO ESGOTADO!';
    overlayText.textContent='Você fez '+score+' pontos! Toque em iniciar para tentar de novo.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
  }

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    score=0; timeLeft=30; activeHole=-1;
    scoreEl.textContent=0; timeEl.textContent=30;
    running=true;
    clearInterval(countdownTimer);
    countdownTimer=setInterval(tick,1000);
    popRandom();
  });
})();
</script>`;

function executeGameScripts(container){
  const scripts=[...container.querySelectorAll("script")];

  for(const oldScript of scripts){
    const script=document.createElement("script");

    for(const attr of oldScript.attributes){
      script.setAttribute(
        attr.name,
        oldScript.getAttribute(attr.name)
      );
    }

    script.textContent=oldScript.textContent;

    oldScript.remove();
    container.appendChild(script);
  }
}

registerGame({
  id:"toupeira",
  name:"Whack-a-Mole",
  category:"Arcade",
  icon:"🔨",

  init({container}){
    container.innerHTML=WHACKAMOLE_HTML;
    executeGameScripts(container);
  }
});