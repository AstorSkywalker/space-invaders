// audio.js

// ——————————————————————————————————————————————
// 1) Shared AudioContext for Web Audio API usage
// ——————————————————————————————————————————————
export const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ——————————————————————————————————————————————
// 2) Core tone player for SFX
// ——————————————————————————————————————————————
function playTone({ type = 'square', startFreq = 440, endFreq = 220, duration = 0.2, volume = 0.2 }) {
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);

  osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration + 0.05);
}

export function playPew()       { playTone({ type: 'square',    startFreq: 900, endFreq: 150, duration: 0.1,  volume: 0.15 }); }
export function playExplosion() { playTone({ type: 'sawtooth',  startFreq: 300, endFreq: 50,  duration: 0.4,  volume: 0.30 }); }
export function playLevelUp()   { playTone({ type: 'triangle',  startFreq: 400, endFreq: 800, duration: 0.25, volume: 0.20 }); }
export function playGameOver()  { playTone({ type: 'sine',      startFreq: 200, endFreq: 50,  duration: 1.0,  volume: 0.25 }); }

// ——————————————————————————————————————————————
// 3) Background wobble drone (Web Audio LFO)
// ——————————————————————————————————————————————
let bgOsc, bgGain, lfoOsc, lfoGain;

export function startBackground() {
  // resume context if needed
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    console.log('[audio] AudioContext resumed');
  }
  if (bgOsc) return; // already running

  console.log('[audio] Starting wobble drone');
  bgOsc  = audioCtx.createOscillator();
  bgGain = audioCtx.createGain();
  bgOsc.type = 'sine';
  bgOsc.frequency.setValueAtTime(100, audioCtx.currentTime);
  bgGain.gain.setValueAtTime(0.05, audioCtx.currentTime);

  lfoOsc  = audioCtx.createOscillator();
  lfoGain = audioCtx.createGain();
  lfoOsc.type = 'triangle';
  lfoOsc.frequency.setValueAtTime(1.5, audioCtx.currentTime);
  lfoGain.gain.setValueAtTime(20, audioCtx.currentTime);

  lfoOsc.connect(lfoGain).connect(bgOsc.frequency);
  bgOsc.connect(bgGain).connect(audioCtx.destination);

  bgOsc.start();
  lfoOsc.start();
}

export function stopBackground() {
  if (!bgOsc) return;

  console.log('[audio] Stopping wobble drone');
  bgGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
  lfoGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

  bgOsc.stop(audioCtx.currentTime + 0.6);
  lfoOsc.stop(audioCtx.currentTime + 0.6);
  bgOsc = bgGain = lfoOsc = lfoGain = null;
}

// ——————————————————————————————————————————————
// 4) Background music via HTMLAudioElement (user-gesture only)
// ——————————————————————————————————————————————
let bgMusic = null;

export async function startMusic() {
  try {
    // resume context if needed
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
      console.log('[audio] AudioContext resumed');
    }
    if (bgMusic) return; // already created

    console.log('[audio] Creating <audio> for music');

// when running locally, use a local file    
    bgMusic = new Audio('assets/battle_theme2.mp3');

// when running on a server, use a relative path
//bgMusic = new Audio('../assets/battle_theme2.mp3');

    bgMusic.loop   = true;
    bgMusic.volume = 0.3;

    bgMusic.addEventListener('canplaythrough', () => {
      console.log('[audio] Music loaded');
    });
    bgMusic.addEventListener('error', e => {
      console.error('[audio] Music failed to load:', e);
    });

    await bgMusic.play();
    console.log('[audio] Music playback started');
  } catch (err) {
    console.error('[audio] Music play() failed:', err);
  }
}

export function stopMusic() {
  if (!bgMusic) return;
  console.log('[audio] Stopping music');
  bgMusic.pause();
  bgMusic.currentTime = 0;
  bgMusic = null;
}
