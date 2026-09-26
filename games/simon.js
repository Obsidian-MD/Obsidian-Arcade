import { registerGame } from "../arcade.js";

const SIMON_HTML = String.raw`<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;}
html,body{margin:0;padding:0;width:100%;min-width:0;overflow:hidden;}
body{background:transparent;font-family:'Courier New',Courier,monospace;}
.wrap{width:100%;max-width:430px;margin:0 auto;padding:8px;}
.game{position:relative;width:100%;min-height:560px;overflow:hidden;border-radius:24px;background:#1e1b4b;border:2px solid #818cf8;box-shadow:0 0 25px rgba(129,140,248,0.4);display:flex;flex-direction:column;align-items:center;}
.hud{width:100%;min-height:48px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px;color:#fff;font-size:12px;font-weight:bold;background:#13112e;border-bottom:2px solid #818cf8;z-index:10;flex-shrink:0;}
.hud span b{color:#a5b4fc;}
.pad-wrap{width:100%;flex:1;display:flex;align-items:center;justify-content:center;padding:24px 20px;}
.pads{position:relative;width:100%;max-width:280px;aspect-ratio:1/1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:8px;border-radius:50%;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.6);}
.pad{cursor:pointer;filter:brightness(0.6);transition:filter 0.1s;}
.pad.lit{filter:brightness(1.3);}
.pad.green{background:#22c55e;border-radius:100% 0 0 0;}
.pad.red{background:#dc2626;border-radius:0 100% 0 0;}
.pad.yellow{background:#eab308;border-radius:0 0 0 100%;}
.pad.blue{background:#2563eb;border-radius:0 0 100% 0;}
.center-hole{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32%;height:32%;background:#1e1b4b;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#a5b4fc;font-size:11px;font-weight:bold;text-align:center;z-index:5;pointer-events:none;}
.status-msg{width:100%;text-align:center;color:rgba(255,255,255,0.6);font-size:11px;padding:0 10px 16px;flex-shrink:0;}
.overlay{position:absolute;z-index:50;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,0.92);}
.panel{width:100%;max-width:320px;padding:22px;text-align:center;background:#1e1b4b;border:2px solid #818cf8;border-radius:16px;box-shadow:0 0 30px rgba(129,140,248,0.4);}
.panel h1{color:#a5b4fc;font-size:16px;margin:0 0 10px;letter-spacing:1px;}
.panel p{color:rgba(255,255,255,0.75);font-size:12px;line-height:1.5;margin:0 0 18px;}
#startBtn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#818cf8,#4f46e5);color:#fff;font-family:'Courier New',Courier,monospace;font-weight:bold;font-size:13px;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 10px rgba(129,140,248,0.4);}
#startBtn:active{transform:scale(0.98);}
.footer-info{width:100%;padding:6px 14px 10px;color:rgba(255,255,255,0.4);font-size:9px;text-align:center;background:#13112e;flex-shrink:0;}
</style>
<div class="wrap">
  <div class="game" id="game">
    <div class="overlay" id="overlay">
      <div class="panel">
        <h1 id="overlayTitle">🎵 SIMON</h1>
        <p id="overlayText">Observe a sequência de cores e repita tocando na mesma ordem. A cada rodada a sequência fica maior!</p>
        <button id="startBtn">INICIAR JOGO</button>
      </div>
    </div>
    <div class="hud">
      <span>Rodada: <b id="roundEl">0</b></span>
      <span>Recorde: <b id="bestEl">0</b></span>
    </div>
    <div class="pad-wrap">
      <div class="pads" id="pads">
        <div class="pad green" data-color="green"></div>
        <div class="pad red" data-color="red"></div>
        <div class="pad yellow" data-color="yellow"></div>
        <div class="pad blue" data-color="blue"></div>
        <div class="center-hole" id="centerHole">Toque em<br>INICIAR</div>
      </div>
    </div>
    <div class="status-msg" id="statusMsg">Toque em "Iniciar" para começar.</div>
    <div class="footer-info">Simon • OBSIDIAN ARCADE</div>
  </div>
</div>
<script>
(function(){
  const overlay=document.getElementById('overlay');
  const overlayTitle=document.getElementById('overlayTitle');
  const overlayText=document.getElementById('overlayText');
  const startBtn=document.getElementById('startBtn');
  const roundEl=document.getElementById('roundEl');
  const bestEl=document.getElementById('bestEl');
  const statusMsg=document.getElementById('statusMsg');
  const centerHole=document.getElementById('centerHole');
  const pads=Array.prototype.slice.call(document.querySelectorAll('.pad'));

  const FREQ={green:392.00, red:329.63, yellow:261.63, blue:196.00};
  let audioCtx=null;

  function beep(color, duration){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      const osc=audioCtx.createOscillator();
      const gain=audioCtx.createGain();
      osc.type='sine';
      osc.frequency.value=FREQ[color]||440;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration/1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration/1000);
    }catch(e){}
  }

  let sequence=[];
  let playerStep=0;
  let best=0;
  let acceptingInput=false;
  let playing=false;

  function litPad(color){ return pads.find(function(p){ return p.dataset.color===color; }); }

  function flashPad(color, duration){
    return new Promise(function(resolve){
      const pad=litPad(color);
      pad.classList.add('lit');
      beep(color, duration*0.8);
      setTimeout(function(){
        pad.classList.remove('lit');
        setTimeout(resolve, duration*0.3);
      }, duration*0.7);
    });
  }

  async function playSequence(){
    acceptingInput=false;
    playing=true;
    statusMsg.textContent='Observe a sequência...';
    await new Promise(function(r){ setTimeout(r,500); });
    const speed = sequence.length>12?300 : sequence.length>8?380 : 480;
    for(let i=0;i<sequence.length;i++){
      await flashPad(sequence[i], speed);
    }
    playing=false;
    acceptingInput=true;
    playerStep=0;
    statusMsg.textContent='Sua vez! Repita a sequência.';
  }

  function nextRound(){
    const colors=['green','red','yellow','blue'];
    sequence.push(colors[Math.floor(Math.random()*4)]);
    roundEl.textContent=sequence.length;
    playSequence();
  }

  function onPadClick(color){
    if(!acceptingInput || playing) return;
    flashPad(color, 220);
    if(color===sequence[playerStep]){
      playerStep++;
      if(playerStep===sequence.length){
        acceptingInput=false;
        statusMsg.textContent='Rodada '+sequence.length+' completa! Preparando próxima...';
        setTimeout(nextRound, 900);
      }
    } else {
      acceptingInput=false;
      if(sequence.length-1>best){ best=sequence.length-1; }
      finish();
    }
  }

  function finish(){
    overlayTitle.textContent='💀 FIM DE JOGO!';
    overlayText.textContent='Você errou na rodada '+sequence.length+'. Sua melhor sequência: '+best+' cores.';
    startBtn.textContent='JOGAR NOVAMENTE';
    overlay.style.display='flex';
    bestEl.textContent=best;
  }

  pads.forEach(function(pad){
    pad.addEventListener('click', function(){ onPadClick(pad.dataset.color); });
  });

  startBtn.addEventListener('click', function(){
    overlay.style.display='none';
    centerHole.textContent='';
    sequence=[];
    playerStep=0;
    roundEl.textContent=0;
    bestEl.textContent=best;
    setTimeout(nextRound, 400);
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
  id:"simon",
  name:"Simon",
  category:"Memória",
  icon:"🎵",

  init({container}){
    container.innerHTML=SIMON_HTML;
    executeGameScripts(container);
  }
});