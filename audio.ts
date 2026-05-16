// Simple Web Audio API sound generators

let audioCtx: AudioContext | null = null;
let humOsc: OscillatorNode | null = null;
let humGain: GainNode | null = null;
let fanOsc: AudioBufferSourceNode | null = null;
let fanGain: GainNode | null = null;

let staticBufferSource: AudioBufferSourceNode | null = null;
let staticGain: GainNode | null = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create static buffer
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // white noise
    }

    // Static setup
    staticGain = audioCtx.createGain();
    staticGain.gain.value = 0;
    staticGain.connect(audioCtx.destination);
    
    // Filter static so it's not piercing
    const bpf = audioCtx.createBiquadFilter();
    bpf.type = 'lowpass';
    bpf.frequency.value = 1000;
    
    const staticNode = audioCtx.createBufferSource();
    staticNode.buffer = buffer;
    staticNode.loop = true;
    staticNode.connect(bpf);
    bpf.connect(staticGain);
    staticNode.start(0);

    // Hum setup
    humOsc = audioCtx.createOscillator();
    humOsc.type = 'sine';
    humOsc.frequency.value = 60; // low hum
    
    humGain = audioCtx.createGain();
    humGain.gain.value = 0;
    
    humOsc.connect(humGain);
    humGain.connect(audioCtx.destination);
    humOsc.start();
    
    // Fan setup (low rumble + subtle white noise)
    fanGain = audioCtx.createGain();
    fanGain.gain.value = 0;
    fanGain.connect(audioCtx.destination);
    
    const fanFilter = audioCtx.createBiquadFilter();
    fanFilter.type = 'lowpass';
    fanFilter.frequency.value = 400;
    fanFilter.connect(fanGain);
    
    fanOsc = audioCtx.createBufferSource();
    fanOsc.buffer = buffer;
    fanOsc.loop = true;
    fanOsc.connect(fanFilter);
    fanOsc.start(0);
  }
  
  if (audioCtx.state === 'suspended') {
      audioCtx.resume();
  }
}

export function setFanVolume(volume: number) {
  if (fanGain) {
    fanGain.gain.setTargetAtTime(volume, audioCtx!.currentTime, 0.5);
  }
}

export function setHumVolume(volume: number) {
  if (humGain) {
    humGain.gain.setTargetAtTime(volume, audioCtx!.currentTime, 0.5);
  }
}

export function setStaticVolume(volume: number) {
  if (staticGain) {
    staticGain.gain.setTargetAtTime(volume, audioCtx!.currentTime, 0.1);
  }
}

export function playAlarm() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc.frequency.setValueAtTime(330, audioCtx.currentTime + 0.5);
  osc.frequency.setValueAtTime(440, audioCtx.currentTime + 1.0);
  
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.5);
}

let menuMusicActive = false;
let menuNodes: any[] = [];

export function startMenuMusic() {
    if (!audioCtx || menuMusicActive) return;
    menuMusicActive = true;
    
    const master = audioCtx.createGain();
    master.gain.value = 0.5;
    master.connect(audioCtx.destination);
    menuNodes.push(master);

    // Deep creepy drone (E1)
    const drone = audioCtx.createOscillator();
    drone.type = 'sawtooth'; // richer harmonics
    drone.frequency.value = 41.2;
    
    // Filter to muffle it
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150 + Math.random() * 100;
    
    // Slight LFO for trembling effect
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 5;
    
    lfo.connect(lfoGain);
    lfoGain.connect(drone.frequency);
    
    drone.connect(filter);
    filter.connect(master);
    
    lfo.start();
    drone.start();
    
    menuNodes.push(drone, filter, lfo, lfoGain);
    
    // Replicate FNAC 2 music box vibes, periodic metallic plucks
    const scheduleBell = () => {
       if(!menuMusicActive || !audioCtx) return;
       const bell = audioCtx.createOscillator();
       bell.type = 'sine';
       // Plucked box notes roughly around C# minor or dim
       bell.frequency.value = [554.37, 659.25, 830.61, 415.30][Math.floor(Math.random()*4)];
       
       const bellGain = audioCtx.createGain();
       bellGain.gain.setValueAtTime(0, audioCtx.currentTime);
       bellGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
       bellGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
       
       // Give the bell a "music box" tone by adding a higher harmonic
       const harmonic = audioCtx.createOscillator();
       harmonic.type = 'sine';
       harmonic.frequency.value = bell.frequency.value * 2;
       const harmGain = audioCtx.createGain();
       harmGain.gain.setValueAtTime(0, audioCtx.currentTime);
       harmGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
       harmGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
       
       bell.connect(bellGain);
       harmonic.connect(harmGain);
       bellGain.connect(master);
       harmGain.connect(master);
       
       bell.start();
       harmonic.start();
       bell.stop(audioCtx.currentTime+3);
       harmonic.stop(audioCtx.currentTime+3);
       
       setTimeout(scheduleBell, Math.random() * 4000 + 2000);
    };
    scheduleBell();

    const scheduleBassDrop = () => {
        if(!menuMusicActive || !audioCtx) return;
        const drop = audioCtx.createOscillator();
        drop.type = 'sine';
        drop.frequency.setValueAtTime(60, audioCtx.currentTime);
        drop.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 3);
        const dropGain = audioCtx.createGain();
        dropGain.gain.setValueAtTime(0, audioCtx.currentTime);
        dropGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.5);
        dropGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 6);
        drop.connect(dropGain);
        dropGain.connect(master);
        drop.start();
        drop.stop(audioCtx.currentTime + 6);

        setTimeout(scheduleBassDrop, Math.random() * 15000 + 10000); // every 10-25s
    };
    scheduleBassDrop();
}

export function stopMenuMusic() {
    menuMusicActive = false;
    menuNodes.forEach(n => {
       if(n.stop) { try{n.stop()}catch(e){} }
       if(n.disconnect) { try{n.disconnect()}catch(e){} }
    });
    menuNodes = [];
}

export function playPhoneRing() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc2.type = 'square';
  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
  osc2.frequency.setValueAtTime(480, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime + 1.5);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.55);
  
  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime);
  osc2.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 2);
  osc2.stop(audioCtx.currentTime + 2);
}

export function playTapeClick() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(100, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}

let tapeHissGain: GainNode | null = null;
let tapeHissSource: AudioBufferSourceNode | null = null;

export function startTapeHiss() {
  if (!audioCtx || tapeHissSource) return;
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.03; 
  }
  
  tapeHissSource = audioCtx.createBufferSource();
  tapeHissSource.buffer = buffer;
  tapeHissSource.loop = true;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1500;
  filter.Q.value = 0.5;
  
  tapeHissGain = audioCtx.createGain();
  tapeHissGain.gain.value = 1;
  
  tapeHissSource.connect(filter);
  filter.connect(tapeHissGain);
  tapeHissGain.connect(audioCtx.destination);
  
  tapeHissSource.start();
}

export function stopTapeHiss() {
  if (tapeHissSource) {
    try { tapeHissSource.stop(); } catch(e) {}
    tapeHissSource.disconnect();
    tapeHissSource = null;
  }
  if (tapeHissGain) {
    tapeHissGain.disconnect();
    tapeHissGain = null;
  }
}

export function playJumpscareSound() {
  if (!audioCtx) return;
  
  const startTime = audioCtx.currentTime;
  
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.setValueAtTime(3.0, startTime);
  masterGain.gain.exponentialRampToValueAtTime(0.01, startTime + 4.0);

  // 1. SCREAM (0 to 1.5s)
  const screamDuration = 1.5;
  const screamGain = audioCtx.createGain();
  screamGain.gain.setValueAtTime(0, startTime);
  screamGain.gain.linearRampToValueAtTime(2.0, startTime + 0.1);
  screamGain.gain.linearRampToValueAtTime(0.8, startTime + screamDuration - 0.2);
  screamGain.gain.linearRampToValueAtTime(0, startTime + screamDuration);
  screamGain.connect(masterGain);

  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(1500, startTime);
  osc1.frequency.exponentialRampToValueAtTime(800, startTime + screamDuration);
  
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sawtooth';
  osc2.frequency.setValueAtTime(1600, startTime);
  osc2.frequency.exponentialRampToValueAtTime(850, startTime + screamDuration);
  
  // vibrato for scream
  const vib = audioCtx.createOscillator();
  vib.type = 'sine';
  vib.frequency.value = 12; // fast vibrato
  const vibGain = audioCtx.createGain();
  vibGain.gain.value = 50;
  vib.connect(vibGain);
  vibGain.connect(osc1.frequency);
  vibGain.connect(osc2.frequency);

  osc1.connect(screamGain);
  osc2.connect(screamGain);
  vib.start(startTime);
  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + screamDuration);
  osc2.stop(startTime + screamDuration);
  vib.stop(startTime + screamDuration);

  // 2. CRUNCH (1.2 to 1.8s)
  const crunchStart = startTime + 1.2;
  const crunchDuration = 0.6;
  const crunchGain = audioCtx.createGain();
  crunchGain.gain.setValueAtTime(0, crunchStart);
  crunchGain.gain.linearRampToValueAtTime(4.0, crunchStart + 0.05); // sharp attack
  crunchGain.gain.exponentialRampToValueAtTime(0.01, crunchStart + crunchDuration);
  
  // Distortion to make it sickening
  const distortion = audioCtx.createWaveShaper();
  const distCurve = new Float32Array(4096);
  for(let i = 0; i < 4096; i++) {
     const x = i * 2 / 4096 - 1;
     distCurve[i] = Math.sign(x) * Math.pow(Math.abs(x), 0.2); // hard clipping
  }
  distortion.curve = distCurve;
  
  crunchGain.connect(distortion);
  distortion.connect(masterGain);

  const crunchOsc = audioCtx.createOscillator();
  crunchOsc.type = 'square';
  crunchOsc.frequency.setValueAtTime(60, crunchStart);
  crunchOsc.frequency.linearRampToValueAtTime(20, crunchStart + crunchDuration);
  crunchOsc.connect(crunchGain);
  
  // noise for bone snap/crunch
  const crunchBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * crunchDuration, audioCtx.sampleRate);
  const crunchData = crunchBuffer.getChannelData(0);
  for(let i=0; i<crunchData.length; i++) {
     crunchData[i] = Math.random() * 2 - 1;
  }
  const crunchNoise = audioCtx.createBufferSource();
  crunchNoise.buffer = crunchBuffer;
  const crunchFilter = audioCtx.createBiquadFilter();
  crunchFilter.type = 'lowpass';
  crunchFilter.frequency.setValueAtTime(3000, crunchStart);
  crunchFilter.frequency.exponentialRampToValueAtTime(100, crunchStart + crunchDuration);
  crunchNoise.connect(crunchFilter);
  crunchFilter.connect(crunchGain);

  crunchOsc.start(crunchStart);
  crunchNoise.start(crunchStart);
  crunchOsc.stop(crunchStart + crunchDuration);

  // 3. STATIC / JRS (1.8s to 4.0s)
  const staticStart = startTime + 1.6;
  const staticDuration = 2.4;
  const staticGain = audioCtx.createGain();
  staticGain.gain.setValueAtTime(0, staticStart);
  staticGain.gain.linearRampToValueAtTime(1.5, staticStart + 0.1);
  staticGain.gain.exponentialRampToValueAtTime(0.01, staticStart + staticDuration);
  staticGain.connect(masterGain);

  const staticBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * staticDuration, audioCtx.sampleRate);
  const staticData = staticBuffer.getChannelData(0);
  for(let i=0; i<staticData.length; i++) {
     staticData[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const staticNoise = audioCtx.createBufferSource();
  staticNoise.buffer = staticBuffer;
  const staticFilter = audioCtx.createBiquadFilter();
  staticFilter.type = 'highpass';
  staticFilter.frequency.value = 1000;
  staticNoise.connect(staticFilter);
  staticFilter.connect(staticGain);
  
  staticNoise.start(staticStart);
}

export function playVictoryMusic() {
  if (!audioCtx) return;
  
  const startTime = audioCtx.currentTime;
  
  // High celebratory beeps (Arpeggio)
  const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51]; 
  notes.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    
    osc.type = i % 2 === 0 ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime + (i * 0.15));
    
    gain.gain.setValueAtTime(0, startTime + (i * 0.15));
    gain.gain.linearRampToValueAtTime(0.15, startTime + (i * 0.15) + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + (i * 0.15) + 0.4);
    
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    
    osc.start(startTime + (i * 0.15));
    osc.stop(startTime + (i * 0.15) + 0.5);
  });

  // Low celebratory "dong"
  const lowOsc = audioCtx.createOscillator();
  const lowGain = audioCtx.createGain();
  lowOsc.type = 'sine';
  lowOsc.frequency.setValueAtTime(130.81, startTime); // C3
  lowGain.gain.setValueAtTime(0.3, startTime);
  lowGain.gain.exponentialRampToValueAtTime(0.001, startTime + 2);
  lowOsc.connect(lowGain);
  lowGain.connect(audioCtx.destination);
  lowOsc.start(startTime);
  lowOsc.stop(startTime + 2);

  // Synthesized "Yay!" noise (filtered white noise pulse)
  for (let j = 0; j < 3; j++) {
      const wait = 1.0 + (j * 0.3);
      const spray = audioCtx.createBufferSource();
      const sprayGain = audioCtx.createGain();
      const sprayFilter = audioCtx.createBiquadFilter();
      
      const bSize = audioCtx.sampleRate * 0.5;
      const b = audioCtx.createBuffer(1, bSize, audioCtx.sampleRate);
      const d = b.getChannelData(0);
      for (let k = 0; k < bSize; k++) d[k] = Math.random() * 2 - 1;
      
      spray.buffer = b;
      sprayFilter.type = 'bandpass';
      sprayFilter.frequency.value = 2000 + (j * 500);
      sprayFilter.Q.value = 1;
      
      sprayGain.gain.setValueAtTime(0, startTime + wait);
      sprayGain.gain.linearRampToValueAtTime(0.1, startTime + wait + 0.05);
      sprayGain.gain.exponentialRampToValueAtTime(0.001, startTime + wait + 0.4);
      
      spray.connect(sprayFilter);
      sprayFilter.connect(sprayGain);
      sprayGain.connect(audioCtx.destination);
      spray.start(startTime + wait);
      spray.stop(startTime + wait + 0.5);
  }
}

export function playMenuSelectSound() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
  
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(t);
  osc.stop(t + 0.2);
}
