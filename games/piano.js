import { registerGame } from "../arcade.js";

const GAME_HTML = String.raw`
<style>

*{
  box-sizing:border-box;
  -webkit-tap-highlight-color:transparent;
  user-select:none;
}

html,
body{
  margin:0;
  width:100%;
  height:100%;
  overflow:hidden;
  background:#080a0f;
  color:#fff;
  font-family:Arial,sans-serif;
}

body{
  display:flex;
}

.app{
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  background:
    radial-gradient(
      circle at top,
      #171d2a,
      #080a0f 65%
    );
}

.topbar{
  flex-shrink:0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  padding:8px 10px;
  border-bottom:1px solid #242a35;
}

.title{
  font-size:18px;
  font-weight:900;
}

.note{
  margin-top:3px;
  color:#8c97a9;
  font-size:12px;
}

.controls{
  display:flex;
  gap:5px;
}

button{
  border:1px solid #303744;
  background:#171c25;
  color:#fff;
  border-radius:9px;
  min-height:38px;
  padding:7px 10px;
  font-weight:800;
  font-size:12px;
  cursor:pointer;
  outline:none;
}

button:active{
  transform:scale(.96);
}

.instrument-bar{
  flex-shrink:0;
  display:flex;
  gap:5px;
  padding:5px 6px;
  overflow-x:auto;
  overflow-y:hidden;
  border-bottom:1px solid #202631;
  scrollbar-width:none;
  touch-action:pan-x;
}

.instrument-bar::-webkit-scrollbar{
  display:none;
}

.instrument-button{
  flex:0 0 auto;
  min-width:72px;
  min-height:35px;
  padding:5px 8px;
  font-size:11px;
  white-space:nowrap;
  background:#11161f;
  border-color:#303744;
}

.instrument-button.active{
  background:#2c3b51;
  border-color:#6686ae;
  box-shadow:
    0 0 10px
    rgba(80,140,220,.22);
}

.control-bars{
  flex-shrink:0;
  display:flex;
  flex-direction:column;
  gap:4px;
  padding:4px 6px;
  border-bottom:1px solid #202631;
}

.control-row{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
}

.control-row button{
  width:42px;
  min-width:42px;
  min-height:34px;
  padding:4px 8px;
  font-size:17px;
}

.control-label{
  min-width:120px;
  text-align:center;
  color:#aeb6c4;
  font-size:12px;
}

.control-label strong{
  color:#fff;
}

.orientation{
  flex-shrink:0;
  display:flex;
  justify-content:center;
  gap:6px;
  padding:4px;
}

.orientation button{
  min-width:105px;
  min-height:34px;
}

.orientation button.active{
  background:#2c3b51;
  border-color:#557095;
}

.piano-area{
  flex:1;
  min-height:0;
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  padding:6px 0;
}

.piano-viewport{
  position:relative;
  width:100%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  touch-action:none;
}

.piano{
  position:relative;
  width:100%;
  height:76%;
  min-height:170px;
  max-height:500px;
  display:flex;
  align-items:stretch;
  justify-content:center;
  transition:
    width .15s ease,
    height .15s ease;
  touch-action:none;
}

.keyboard{
  position:relative;
  width:100%;
  height:100%;
  display:flex;
  overflow:visible;
  touch-action:none;
}

.octave{
  position:relative;
  height:100%;
  flex:1 1 0;
  min-width:0;
  display:flex;
  touch-action:none;
}

.white-keys{
  position:absolute;
  inset:0;
  display:flex;
  width:100%;
  height:100%;
}

.white-key{
  position:relative;
  flex:1 1 0;
  min-width:0;
  height:100%;
  padding:0 0 13px;
  border:1px solid #777d87;
  border-radius:0 0 9px 9px;
  background:
    linear-gradient(
      to bottom,
      #fff 0%,
      #f0f1f3 72%,
      #c9ccd2 100%
    );
  color:#222831;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  font-size:11px;
  font-weight:900;
  touch-action:none;
  outline:none;
  z-index:1;
}

.white-key.active{
  background:
    linear-gradient(
      to bottom,
      #d9edff,
      #8dc3ff 70%,
      #5d96d6
    );

  box-shadow:
    inset 0 -12px 22px
      rgba(40,120,220,.35),
    0 0 14px
      rgba(60,145,255,.25);
}

.black-keys{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  pointer-events:none;
  z-index:5;
}

.black-key{
  position:absolute;
  top:0;
  width:11.5%;
  height:57%;
  transform:translateX(-50%);
  border:1px solid #000;
  border-radius:0 0 7px 7px;
  background:
    linear-gradient(
      90deg,
      #030405,
      #292d35 45%,
      #030405
    );
  box-shadow:
    0 7px 10px
      rgba(0,0,0,.7);
  pointer-events:auto;
  touch-action:none;
  z-index:10;
}

.black-key.active{
  background:
    linear-gradient(
      90deg,
      #123d69,
      #4d9df0,
      #123d69
    );

  box-shadow:
    0 0 17px
      rgba(70,155,255,.7);
}

.navigation{
  position:absolute;
  left:0;
  right:0;
  top:50%;
  transform:translateY(-50%);
  display:flex;
  justify-content:space-between;
  padding:0 6px;
  pointer-events:none;
  z-index:30;
}

.nav-button{
  pointer-events:auto;
  width:36px;
  height:48px;
  min-width:36px;
  min-height:48px;
  padding:0;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:12px;
  background:
    rgba(15,19,27,.82);
  border:1px solid #394352;
  font-size:22px;
  opacity:.8;
}

.status{
  flex-shrink:0;
  text-align:center;
  color:#778295;
  font-size:11px;
  padding:4px;
}

.help{
  flex-shrink:0;
  text-align:center;
  color:#535e70;
  font-size:10px;
  padding-bottom:5px;
}

body.horizontal .piano{
  height:78%;
}

@media(max-width:600px){

  .topbar{
    padding:6px 7px;
  }

  .title{
    font-size:16px;
  }

  .note{
    font-size:10px;
  }

  .controls button{
    min-height:34px;
    padding:5px 7px;
    font-size:10px;
  }

  .instrument-bar{
    padding:4px 5px;
  }

  .instrument-button{
    min-width:68px;
    min-height:32px;
    font-size:10px;
  }

  .control-row button{
    width:38px;
    min-width:38px;
    min-height:32px;
  }

  .control-label{
    min-width:105px;
  }

  .orientation{
    padding:3px;
  }

  .orientation button{
    min-width:100px;
    min-height:32px;
  }

  .piano-area{
    padding:4px 0;
  }

  .white-key{
    padding-bottom:10px;
  }

}

@media(max-height:600px){

  .topbar{
    padding:4px 7px;
  }

  .instrument-bar{
    padding:2px 5px;
  }

  .control-bars{
    padding:2px 5px;
  }

  .orientation{
    padding:2px;
  }

  .orientation button{
    min-height:29px;
  }

  .status,
  .help{
    display:none;
  }

  .piano{
    height:88% !important;
  }

}

</style>

<div class="app">

  <div class="topbar">

    <div>

      <div class="title">
        🎹 Obsidian Piano
      </div>

      <div
        class="note"
        id="noteDisplay"
      >
        Toque uma tecla
      </div>

    </div>

    <div class="controls">

      <button id="rotateBtn">
        ↔️ Horizontal
      </button>

      <button id="invertBtn">
        🔄
      </button>

    </div>

  </div>


  <div
    class="instrument-bar"
    id="instrumentBar"
  >

    <button
      class="instrument-button active"
      data-instrument="piano"
    >
      🎹 Piano
    </button>

    <button
      class="instrument-button"
      data-instrument="sax"
    >
      🎷 Sax
    </button>

    <button
      class="instrument-button"
      data-instrument="trumpet"
    >
      🎺 Trompete
    </button>

    <button
      class="instrument-button"
      data-instrument="flute"
    >
      🪈 Flauta
    </button>

    <button
      class="instrument-button"
      data-instrument="trombone"
    >
      🎺 Trombone
    </button>

    <button
      class="instrument-button"
      data-instrument="drums"
    >
      🥁 Bateria
    </button>

    <button
      class="instrument-button"
      data-instrument="guitar"
    >
      🎸 Guitarra
    </button>

    <button
      class="instrument-button"
      data-instrument="acoustic"
    >
      🎸 Violão
    </button>

  </div>


  <div class="control-bars">

    <div class="control-row">

      <button id="octaveDown">
        −
      </button>

      <div class="control-label">

        Oitava
        <strong id="octaveValue">
          4
        </strong>

      </div>

      <button id="octaveUp">
        +
      </button>

    </div>


    <div class="control-row">

      <button id="viewDown">
        −
      </button>

      <div class="control-label">

        Teclas visíveis:
        <strong id="viewValue">
          1 oitava
        </strong>

      </div>

      <button id="viewUp">
        +
      </button>

    </div>

  </div>


  <div class="orientation">

    <button
      id="verticalBtn"
      class="active"
    >
      📱 Vertical
    </button>

    <button
      id="horizontalBtn"
    >
      📱 Horizontal
    </button>

  </div>


  <div class="piano-area">

    <div
      class="piano-viewport"
      id="pianoViewport"
    >

      <div
        class="piano"
        id="piano"
      >

        <div
          class="keyboard"
          id="keyboard"
        ></div>

      </div>

      <div class="navigation">

        <button
          class="nav-button"
          id="navLeft"
        >
          ‹
        </button>

        <button
          class="nav-button"
          id="navRight"
        >
          ›
        </button>

      </div>

    </div>

  </div>


  <div
    class="status"
    id="status"
  >
    🎵 Toque em uma tecla para ativar o áudio
  </div>

  <div class="help">
    Teclado: A W S E D F T G
  </div>

</div>


<script>

(() => {

const piano =
  document.getElementById("piano");

const keyboard =
  document.getElementById("keyboard");

const pianoViewport =
  document.getElementById("pianoViewport");

const noteDisplay =
  document.getElementById("noteDisplay");

const status =
  document.getElementById("status");

const octaveValue =
  document.getElementById("octaveValue");

const viewValue =
  document.getElementById("viewValue");

const rotateBtn =
  document.getElementById("rotateBtn");

const invertBtn =
  document.getElementById("invertBtn");

const verticalBtn =
  document.getElementById("verticalBtn");

const horizontalBtn =
  document.getElementById("horizontalBtn");

const viewDown =
  document.getElementById("viewDown");

const viewUp =
  document.getElementById("viewUp");

const octaveDown =
  document.getElementById("octaveDown");

const octaveUp =
  document.getElementById("octaveUp");

const navLeft =
  document.getElementById("navLeft");

const navRight =
  document.getElementById("navRight");

const instrumentButtons =
  [
    ...document.querySelectorAll(
      ".instrument-button"
    )
  ];


let octave = 4;

let orientation =
  "vertical";

let inverted =
  false;

let visibleOctaves =
  1;

let viewOffset =
  0;

let audioContext =
  null;

let masterGain =
  null;

let currentInstrument =
  "piano";

const activeVoices =
  new Set();

const pressed =
  new Map();

const MIN_VISIBLE =
  1;

const MAX_VISIBLE =
  8;

const whiteNotes = [
  "C",
  "D",
  "E",
  "F",
  "G",
  "A",
  "B"
];

const computerKeys = [
  "a",
  "w",
  "s",
  "e",
  "d",
  "f",
  "t",
  "g"
];


/* =================================
   FREQUÊNCIA
================================= */

function getFrequency(
  note,
  noteOctave
){

  const semitones = {

    C:0,
    "C#":1,
    D:2,
    "D#":3,
    E:4,
    F:5,
    "F#":6,
    G:7,
    "G#":8,
    A:9,
    "A#":10,
    B:11

  };

  const midi =
    (noteOctave + 1) *
    12 +
    semitones[note];

  return 440 *
    Math.pow(
      2,
      (midi - 69) / 12
    );

}


/* =================================
   INICIALIZAR ÁUDIO
================================= */

function initAudio(){

  try{

    if(!audioContext){

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if(!AudioContext){

        status.textContent =
          "❌ Este navegador não suporta áudio.";

        return false;

      }

      audioContext =
        new AudioContext();

      masterGain =
        audioContext.createGain();

      masterGain.gain.value =
        0.75;

      masterGain.connect(
        audioContext.destination
      );

    }

    if(
      audioContext.state !==
      "running"
    ){

      audioContext.resume();

    }

    return true;

  }catch(error){

    console.error(
      "[AUDIO]",
      error
    );

    status.textContent =
      "❌ Erro ao iniciar o áudio.";

    return false;

  }

}


/* =================================
   DESBLOQUEAR ÁUDIO
================================= */

function unlockAudio(){

  if(!initAudio()){
    return;
  }

  if(
    audioContext.state ===
    "suspended"
  ){

    audioContext.resume();

  }

}


document.addEventListener(
  "pointerdown",
  unlockAudio,
  {
    passive:true
  }
);


/* =================================
   ENVELOPE
================================= */

function envelope(
  gain,
  now,
  attack,
  peak,
  release
){

  gain.gain.cancelScheduledValues(
    now
  );

  gain.gain.setValueAtTime(
    0.0001,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    Math.max(
      0.0001,
      peak
    ),
    now + attack
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + release
  );

}


/* =================================
   FILTRO
================================= */

function createFilter(
  type,
  frequency,
  Q = 1
){

  const filter =
    audioContext.createBiquadFilter();

  filter.type =
    type;

  filter.frequency.value =
    frequency;

  filter.Q.value =
    Q;

  return filter;

}


/* =================================
   CONECTAR VOZ AO MASTER
================================= */

function connectOutput(
  output
){

  output.connect(
    masterGain
  );

}


/* =================================
   PIANO
================================= */

function createPianoVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      4200,
      0.7
    );

  const osc1 =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain1 =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc1.type =
    "triangle";

  osc2.type =
    "sine";

  osc1.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain1.gain.value =
    0.42;

  gain2.gain.value =
    0.12;

  osc1.connect(gain1);
  osc2.connect(gain2);

  gain1.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.008,
    0.55,
    2.2
  );

  osc1.start(now);
  osc2.start(now);

  osc1.stop(
    now + 2.25
  );

  osc2.stop(
    now + 2.25
  );

  return {
    output,
    oscillators:[
      osc1,
      osc2
    ]
  };

}


/* =================================
   SAX
================================= */

function createSaxVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      2600,
      1.5
    );

  const osc1 =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain1 =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc1.type =
    "sawtooth";

  osc2.type =
    "square";

  osc1.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain1.gain.value =
    0.17;

  gain2.gain.value =
    0.045;

  osc1.connect(gain1);
  osc2.connect(gain2);

  gain1.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.055,
    0.48,
    1.7
  );

  osc1.start(now);
  osc2.start(now);

  osc1.stop(
    now + 1.9
  );

  osc2.stop(
    now + 1.9
  );

  return {
    output,
    oscillators:[
      osc1,
      osc2
    ]
  };

}


/* =================================
   TROMPETE
================================= */

function createTrumpetVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      3200,
      1.2
    );

  const osc1 =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain1 =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc1.type =
    "sawtooth";

  osc2.type =
    "square";

  osc1.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain1.gain.value =
    0.15;

  gain2.gain.value =
    0.035;

  osc1.connect(gain1);
  osc2.connect(gain2);

  gain1.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.035,
    0.40,
    1.35
  );

  osc1.start(now);
  osc2.start(now);

  osc1.stop(
    now + 1.55
  );

  osc2.stop(
    now + 1.55
  );

  return {
    output,
    oscillators:[
      osc1,
      osc2
    ]
  };

}


/* =================================
   FLAUTA
================================= */

function createFluteVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      3000,
      0.6
    );

  const osc =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc.type =
    "sine";

  osc2.type =
    "triangle";

  osc.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain.gain.value =
    0.28;

  gain2.gain.value =
    0.045;

  osc.connect(gain);
  osc2.connect(gain2);

  gain.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.08,
    0.38,
    1.8
  );

  osc.start(now);
  osc2.start(now);

  osc.stop(
    now + 2
  );

  osc2.stop(
    now + 2
  );

  return {
    output,
    oscillators:[
      osc,
      osc2
    ]
  };

}


/* =================================
   TROMBONE
================================= */

function createTromboneVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      1900,
      1.1
    );

  const osc =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc.type =
    "sawtooth";

  osc2.type =
    "square";

  osc.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain.gain.value =
    0.17;

  gain2.gain.value =
    0.025;

  osc.connect(gain);
  osc2.connect(gain2);

  gain.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.07,
    0.44,
    1.8
  );

  osc.start(now);
  osc2.start(now);

  osc.stop(
    now + 2
  );

  osc2.stop(
    now + 2
  );

  return {
    output,
    oscillators:[
      osc,
      osc2
    ]
  };

}


/* =================================
   GUITARRA
================================= */

function createGuitarVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      3400,
      1.3
    );

  const osc =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc.type =
    "triangle";

  osc2.type =
    "sawtooth";

  osc.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain.gain.value =
    0.32;

  gain2.gain.value =
    0.035;

  osc.connect(gain);
  osc2.connect(gain2);

  gain.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.004,
    0.48,
    0.75
  );

  osc.start(now);
  osc2.start(now);

  osc.stop(
    now + 0.95
  );

  osc2.stop(
    now + 0.95
  );

  return {
    output,
    oscillators:[
      osc,
      osc2
    ]
  };

}


/* =================================
   VIOLÃO
================================= */

function createAcousticVoice(
  frequency,
  now
){

  const output =
    audioContext.createGain();

  const filter =
    createFilter(
      "lowpass",
      3000,
      0.9
    );

  const osc =
    audioContext.createOscillator();

  const osc2 =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  const gain2 =
    audioContext.createGain();

  osc.type =
    "triangle";

  osc2.type =
    "sine";

  osc.frequency.value =
    frequency;

  osc2.frequency.value =
    frequency * 2;

  gain.gain.value =
    0.34;

  gain2.gain.value =
    0.055;

  osc.connect(gain);
  osc2.connect(gain2);

  gain.connect(filter);
  gain2.connect(filter);

  filter.connect(output);

  connectOutput(output);

  envelope(
    output,
    now,
    0.003,
    0.44,
    1.05
  );

  osc.start(now);
  osc2.start(now);

  osc.stop(
    now + 1.25
  );

  osc2.stop(
    now + 1.25
  );

  return {
    output,
    oscillators:[
      osc,
      osc2
    ]
  };

}


/* =================================
   RUÍDO
================================= */

function createNoise(
  duration
){

  const length =
    Math.floor(
      audioContext.sampleRate *
      duration
    );

  const buffer =
    audioContext.createBuffer(
      1,
      length,
      audioContext.sampleRate
    );

  const data =
    buffer.getChannelData(0);

  for(
    let i = 0;
    i < data.length;
    i++
  ){

    data[i] =
      Math.random() * 2 - 1;

  }

  return buffer;

}


/* =================================
   KICK
================================= */

function playKick(){

  const now =
    audioContext.currentTime;

  const osc =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  osc.type =
    "sine";

  osc.frequency.setValueAtTime(
    150,
    now
  );

  osc.frequency.exponentialRampToValueAtTime(
    42,
    now + 0.16
  );

  gain.gain.setValueAtTime(
    0.9,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.32
  );

  osc.connect(gain);

  connectOutput(gain);

  osc.start(now);

  osc.stop(
    now + 0.34
  );

}


/* =================================
   SNARE
================================= */

function playSnare(){

  const now =
    audioContext.currentTime;

  const buffer =
    createNoise(0.25);

  const source =
    audioContext.createBufferSource();

  const filter =
    createFilter(
      "highpass",
      1000
    );

  const gain =
    audioContext.createGain();

  source.buffer =
    buffer;

  gain.gain.setValueAtTime(
    0.65,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.2
  );

  source.connect(filter);
  filter.connect(gain);

  connectOutput(gain);

  source.start(now);

}


/* =================================
   HI-HAT
================================= */

function playHat(){

  const now =
    audioContext.currentTime;

  const buffer =
    createNoise(0.09);

  const source =
    audioContext.createBufferSource();

  const filter =
    createFilter(
      "highpass",
      5000
    );

  const gain =
    audioContext.createGain();

  source.buffer =
    buffer;

  gain.gain.setValueAtTime(
    0.45,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.075
  );

  source.connect(filter);
  filter.connect(gain);

  connectOutput(gain);

  source.start(now);

}


/* =================================
   TOM
================================= */

function playTom(
  frequency
){

  const now =
    audioContext.currentTime;

  const osc =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  osc.type =
    "sine";

  osc.frequency.setValueAtTime(
    frequency,
    now
  );

  osc.frequency.exponentialRampToValueAtTime(
    frequency * 0.5,
    now + 0.22
  );

  gain.gain.setValueAtTime(
    0.65,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.34
  );

  osc.connect(gain);

  connectOutput(gain);

  osc.start(now);

  osc.stop(
    now + 0.36
  );

}


/* =================================
   CRASH
================================= */

function playCrash(){

  const now =
    audioContext.currentTime;

  const buffer =
    createNoise(0.9);

  const source =
    audioContext.createBufferSource();

  const filter =
    createFilter(
      "highpass",
      3200
    );

  const gain =
    audioContext.createGain();

  source.buffer =
    buffer;

  gain.gain.setValueAtTime(
    0.55,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.8
  );

  source.connect(filter);
  filter.connect(gain);

  connectOutput(gain);

  source.start(now);

}


/* =================================
   BATERIA
================================= */

function playDrum(
  note
){

  if(!initAudio()){
    return;
  }

  switch(note){

    case "C":
      playKick();
      break;

    case "D":
      playSnare();
      break;

    case "E":
      playHat();
      break;

    case "F":
      playTom(190);
      break;

    case "G":
      playTom(125);
      break;

    case "A":
      playCrash();
      break;

    case "B":
      playHat();
      break;

    default:
      playKick();

  }

}


/* =================================
   CRIAR VOZ
================================= */

function createVoice(
  note,
  noteOctave
){

  if(!initAudio()){
    return null;
  }

  if(
    currentInstrument ===
    "drums"
  ){

    playDrum(note);

    return null;

  }

  const frequency =
    getFrequency(
      note,
      noteOctave
    );

  const now =
    audioContext.currentTime;

  switch(
    currentInstrument
  ){

    case "sax":

      return createSaxVoice(
        frequency,
        now
      );

    case "trumpet":

      return createTrumpetVoice(
        frequency,
        now
      );

    case "flute":

      return createFluteVoice(
        frequency,
        now
      );

    case "trombone":

      return createTromboneVoice(
        frequency,
        now
      );

    case "guitar":

      return createGuitarVoice(
        frequency,
        now
      );

    case "acoustic":

      return createAcousticVoice(
        frequency,
        now
      );

    case "piano":

    default:

      return createPianoVoice(
        frequency,
        now
      );

  }

}


/* =================================
   TOCAR
================================= */

function playNote(
  note,
  noteOctave,
  element
){

  if(!initAudio()){
    return;
  }

  if(
    currentInstrument ===
    "drums"
  ){

    playDrum(note);

    element.classList.add(
      "active"
    );

    noteDisplay.textContent =
      "🥁 " +
      note;

    status.textContent =
      "🥁 Bateria — " +
      note;

    setTimeout(
      () => {

        element.classList.remove(
          "active"
        );

      },
      100
    );

    return;

  }

  if(element._osc){
    return;
  }

  const voice =
    createVoice(
      note,
      noteOctave
    );

  if(!voice){
    return;
  }

  element._osc =
    voice;

  element._gain =
    voice.output;

  element._pressed =
    true;

  activeVoices.add(
    element
  );

  element.classList.add(
    "active"
  );

  noteDisplay.textContent =
    note +
    noteOctave;

  const instrumentNames = {

    piano:"🎹 Piano",

    sax:"🎷 Saxofone",

    trumpet:"🎺 Trompete",

    flute:"🪈 Flauta",

    trombone:"🎺 Trombone",

    guitar:"🎸 Guitarra",

    acoustic:"🎸 Violão"

  };

  status.textContent =
    instrumentNames[
      currentInstrument
    ] +
    " — " +
    note +
    noteOctave;

}


/* =================================
   PARAR
================================= */

function stopNote(
  element
){

  if(
    !element ||
    !element._osc ||
    !audioContext
  ){
    return;
  }

  const now =
    audioContext.currentTime;

  const voice =
    element._osc;

  const gain =
    element._gain;

  try{

    if(gain){

      gain.gain.cancelScheduledValues(
        now
      );

      gain.gain.setValueAtTime(
        Math.max(
          0.0001,
          gain.gain.value
        ),
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.12
      );

    }

    if(
      voice.oscillators
    ){

      for(
        const oscillator
        of voice.oscillators
      ){

        try{

          oscillator.stop(
            now + 0.15
          );

        }catch{}

      }

    }

  }catch{}

  element._osc =
    null;

  element._gain =
    null;

  element.classList.remove(
    "active"
  );

  activeVoices.delete(
    element
  );

}


/* =================================
   PARAR TUDO
================================= */

function stopAllNotes(){

  for(
    const element
    of [...activeVoices]
  ){

    stopNote(
      element
    );

  }

}


/* =================================
   LIGAR TECLA
================================= */

function bindKey(
  element,
  note,
  noteOctave
){

  element.dataset.note =
    note;

  element.dataset.octave =
    noteOctave;

  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      event.stopPropagation();

      unlockAudio();

      if(
        currentInstrument !==
        "drums" &&
        element._pressed
      ){
        return;
      }

      element._pressed =
        true;

      try{

        element.setPointerCapture(
          event.pointerId
        );

      }catch{}

      playNote(
        note,
        noteOctave,
        element
      );

    }
  );

  element.addEventListener(
    "pointerup",
    event => {

      event.preventDefault();

      event.stopPropagation();

      element._pressed =
        false;

      stopNote(
        element
      );

    }
  );

  element.addEventListener(
    "pointercancel",
    event => {

      event.stopPropagation();

      element._pressed =
        false;

      stopNote(
        element
      );

    }
  );

}


/* =================================
   CRIAR OITAVA
================================= */

function createOctave(
  octaveNumber,
  octaveIndex
){

  const octaveElement =
    document.createElement(
      "div"
    );

  octaveElement.className =
    "octave";

  octaveElement.dataset.octave =
    octaveNumber;

  const whites =
    document.createElement(
      "div"
    );

  whites.className =
    "white-keys";

  const blacks =
    document.createElement(
      "div"
    );

  blacks.className =
    "black-keys";

  for(
    let i = 0;
    i < 7;
    i++
  ){

    const note =
      whiteNotes[i];

    const key =
      document.createElement(
        "button"
      );

    key.type =
      "button";

    key.className =
      "white-key";

    key.textContent =
      note +
      octaveNumber;

    bindKey(
      key,
      note,
      octaveNumber
    );

    whites.appendChild(
      key
    );

  }

  const blackPositions = [

    {
      note:"C#",
      left:"14.2857%"
    },

    {
      note:"D#",
      left:"28.5714%"
    },

    {
      note:"F#",
      left:"57.1428%"
    },

    {
      note:"G#",
      left:"71.4285%"
    },

    {
      note:"A#",
      left:"85.7142%"
    }

  ];

  for(
    const data
    of blackPositions
  ){

    const key =
      document.createElement(
        "button"
      );

    key.type =
      "button";

    key.className =
      "black-key";

    key.style.left =
      data.left;

    bindKey(
      key,
      data.note,
      octaveNumber
    );

    blacks.appendChild(
      key
    );

  }

  octaveElement.appendChild(
    whites
  );

  octaveElement.appendChild(
    blacks
  );

  return octaveElement;

}


/* =================================
   RENDERIZAR
================================= */

function renderPiano(){

  stopAllNotes();

  keyboard.innerHTML =
    "";

  const octaveList = [];

  for(
    let i = 0;
    i < visibleOctaves;
    i++
  ){

    octaveList.push(
      octave + i
    );

  }

  if(inverted){

    octaveList.reverse();

  }

  octaveList.forEach(
    (number,index) => {

      const octaveElement =
        createOctave(
          number,
          index
        );

      keyboard.appendChild(
        octaveElement
      );

    }
  );

  const finalOctave =
    inverted
      ? octave
      : octave +
        visibleOctaves;

  const lastOctave =
    keyboard.lastElementChild;

  if(lastOctave){

    const whites =
      lastOctave.querySelector(
        ".white-keys"
      );

    const key =
      document.createElement(
        "button"
      );

    key.type =
      "button";

    key.className =
      "white-key";

    key.textContent =
      "C" +
      finalOctave;

    bindKey(
      key,
      "C",
      finalOctave
    );

    whites.appendChild(
      key
    );

  }

  updateKeyboardSize();

  octaveValue.textContent =
    octave;

  updateViewLabel();

  updateNavigation();

}


/* =================================
   TAMANHO
================================= */

function updateKeyboardSize(){

  const width =
    pianoViewport.clientWidth;

  piano.style.width =
    width + "px";

  const octaves =
    keyboard.querySelectorAll(
      ".octave"
    );

  const octaveWidth =
    width /
    visibleOctaves;

  octaves.forEach(
    octaveElement => {

      octaveElement.style.flex =
        "0 0 " +
        octaveWidth +
        "px";

    }
  );

  const whiteWidth =
    octaveWidth / 7;

  const blackWidth =
    whiteWidth * 0.62;

  keyboard
    .querySelectorAll(
      ".black-key"
    )
    .forEach(
      key => {

        key.style.width =
          Math.max(
            5,
            blackWidth
          ) + "px";

      }
    );

  let fontSize =
    11;

  if(
    visibleOctaves >= 3
  ){

    fontSize = 9;

  }

  if(
    visibleOctaves >= 5
  ){

    fontSize = 7;

  }

  if(
    visibleOctaves >= 7
  ){

    fontSize = 5;

  }

  keyboard
    .querySelectorAll(
      ".white-key"
    )
    .forEach(
      key => {

        key.style.fontSize =
          fontSize + "px";

      }
    );

}


/* =================================
   LABEL
================================= */

function updateViewLabel(){

  if(
    visibleOctaves ===
    1
  ){

    viewValue.textContent =
      "1 oitava";

  }else{

    viewValue.textContent =
      visibleOctaves +
      " oitavas";

  }

}


/* =================================
   INSTRUMENTOS
================================= */

instrumentButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        unlockAudio();

        currentInstrument =
          button.dataset.instrument;

        stopAllNotes();

        instrumentButtons.forEach(
          item => {

            item.classList.toggle(
              "active",
              item === button
            );

          }
        );

        const names = {

          piano:
            "🎹 Piano pronto",

          sax:
            "🎷 Saxofone pronto",

          trumpet:
            "🎺 Trompete pronto",

          flute:
            "🪈 Flauta pronta",

          trombone:
            "🎺 Trombone pronto",

          drums:
            "🥁 Bateria pronta",

          guitar:
            "🎸 Guitarra pronta",

          acoustic:
            "🎸 Violão pronto"

        };

        status.textContent =
          names[
            currentInstrument
          ];

      }
    );

  }
);


/* =================================
   VISÍVEIS -
================================= */

viewDown.addEventListener(
  "click",
  event => {

    event.preventDefault();

    if(
      visibleOctaves <
      MAX_VISIBLE
    ){

      visibleOctaves++;

      viewOffset =
        0;

      renderPiano();

    }

  }
);


/* =================================
   VISÍVEIS +
================================= */

viewUp.addEventListener(
  "click",
  event => {

    event.preventDefault();

    if(
      visibleOctaves >
      MIN_VISIBLE
    ){

      visibleOctaves--;

      viewOffset =
        0;

      renderPiano();

    }

  }
);


/* =================================
   NAVEGAÇÃO
================================= */

function updateNavigation(){

  const maxOffset =
    Math.max(
      0,
      keyboard.scrollWidth -
      pianoViewport.clientWidth
    );

  viewOffset =
    Math.max(
      0,
      Math.min(
        viewOffset,
        maxOffset
      )
    );

  keyboard.style.transform =
    "translateX(" +
    (-viewOffset) +
    "px";

  navLeft.disabled =
    viewOffset <= 0;

  navRight.disabled =
    viewOffset >=
    maxOffset;

}


navLeft.addEventListener(
  "click",
  () => {

    const amount =
      pianoViewport.clientWidth *
      0.6;

    viewOffset =
      Math.max(
        0,
        viewOffset -
        amount
      );

    updateNavigation();

  }
);


navRight.addEventListener(
  "click",
  () => {

    const maxOffset =
      Math.max(
        0,
        keyboard.scrollWidth -
        pianoViewport.clientWidth
      );

    const amount =
      pianoViewport.clientWidth *
      0.6;

    viewOffset =
      Math.min(
        maxOffset,
        viewOffset +
        amount
      );

    updateNavigation();

  }
);


/* =================================
   ARRASTAR
================================= */

let dragging =
  false;

let dragStartX =
  0;

let dragStartOffset =
  0;

pianoViewport.addEventListener(
  "pointerdown",
  event => {

    if(
      event.target.closest(
        ".white-key,.black-key"
      )
    ){

      return;

    }

    const maxOffset =
      Math.max(
        0,
        keyboard.scrollWidth -
        pianoViewport.clientWidth
      );

    if(maxOffset <= 0){
      return;
    }

    dragging =
      true;

    dragStartX =
      event.clientX;

    dragStartOffset =
      viewOffset;

    try{

      pianoViewport.setPointerCapture(
        event.pointerId
      );

    }catch{}

  }
);


pianoViewport.addEventListener(
  "pointermove",
  event => {

    if(!dragging){
      return;
    }

    const difference =
      event.clientX -
      dragStartX;

    const maxOffset =
      Math.max(
        0,
        keyboard.scrollWidth -
        pianoViewport.clientWidth
      );

    viewOffset =
      Math.max(
        0,
        Math.min(
          maxOffset,
          dragStartOffset -
          difference
        )
      );

    updateNavigation();

  }
);


pianoViewport.addEventListener(
  "pointerup",
  () => {

    dragging =
      false;

  }
);


pianoViewport.addEventListener(
  "pointercancel",
  () => {

    dragging =
      false;

  }
);


/* =================================
   ORIENTAÇÃO
================================= */

function updateOrientation(){

  document.body.classList.remove(
    "vertical",
    "horizontal"
  );

  document.body.classList.add(
    orientation
  );

  verticalBtn.classList.toggle(
    "active",
    orientation ===
      "vertical"
  );

  horizontalBtn.classList.toggle(
    "active",
    orientation ===
      "horizontal"
  );

  rotateBtn.textContent =
    orientation ===
      "vertical"

      ? "↔️ Horizontal"

      : "↕️ Vertical";

  setTimeout(
    () => {

      updateKeyboardSize();

      updateNavigation();

    },
    30
  );

}


rotateBtn.addEventListener(
  "click",
  () => {

    orientation =
      orientation ===
        "vertical"

        ? "horizontal"

        : "vertical";

    updateOrientation();

  }
);


verticalBtn.addEventListener(
  "click",
  () => {

    orientation =
      "vertical";

    updateOrientation();

  }
);


horizontalBtn.addEventListener(
  "click",
  () => {

    orientation =
      "horizontal";

    updateOrientation();

  }
);


/* =================================
   INVERTER
================================= */

invertBtn.addEventListener(
  "click",
  () => {

    inverted =
      !inverted;

    viewOffset =
      0;

    renderPiano();

  }
);


/* =================================
   OITAVA -
================================= */

octaveDown.addEventListener(
  "click",
  () => {

    if(
      octave > 1
    ){

      octave--;

      viewOffset =
        0;

      renderPiano();

    }

  }
);


/* =================================
   OITAVA +
================================= */

octaveUp.addEventListener(
  "click",
  () => {

    if(
      octave < 7
    ){

      octave++;

      viewOffset =
        0;

      renderPiano();

    }

  }
);


/* =================================
   TECLADO FÍSICO
================================= */

document.addEventListener(
  "keydown",
  event => {

    if(event.repeat){
      return;
    }

    const key =
      event.key.toLowerCase();

    const index =
      computerKeys.indexOf(
        key
      );

    if(index === -1){
      return;
    }

    unlockAudio();

    const targets =
      [
        ...keyboard.querySelectorAll(
          ".white-key"
        )
      ];

    const target =
      targets[index];

    if(!target){
      return;
    }

    const note =
      target.dataset.note;

    const noteOctave =
      Number(
        target.dataset.octave
      );

    if(!note){
      return;
    }

    target._pressed =
      true;

    pressed.set(
      key,
      target
    );

    playNote(
      note,
      noteOctave,
      target
    );

  }
);


document.addEventListener(
  "keyup",
  event => {

    const key =
      event.key.toLowerCase();

    const target =
      pressed.get(
        key
      );

    if(!target){
      return;
    }

    target._pressed =
      false;

    stopNote(
      target
    );

    pressed.delete(
      key
    );

  }
);


/* =================================
   RESIZE
================================= */

window.addEventListener(
  "resize",
  () => {

    updateKeyboardSize();

    updateNavigation();

  }
);


/* =================================
   INICIALIZAÇÃO
================================= */

renderPiano();

})();

</script>
`;


/* =================================
   EXECUTAR SCRIPTS DO JOGO
================================= */

function executeGameScripts(container){

  const scripts = [
    ...container.querySelectorAll("script")
  ];

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

    container.appendChild(
      script
    );

  }

}


/* =================================
   REGISTRAR NO OBSIDIAN ARCADE
================================= */

registerGame({

  id:"piano",

  name:"Obsidian Piano",

  category:"Música",

  icon:"🎹",

  init({container}){

    container.innerHTML =
      GAME_HTML;

    executeGameScripts(
      container
    );

  }

});