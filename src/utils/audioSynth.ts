// Web Audio API Synthesizer for Soothing Mental Well-Being Music & Soundscapes

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string | null = null;
  private loopTimer: any = null;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private volume: number = 0.4;
  private onTimeUpdateCallback: ((seconds: number) => void) | null = null;
  private elapsedSeconds: number = 0;
  private timeTicker: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  public setOnTimeUpdate(cb: (seconds: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public playTrack(trackId: string, soundType: 'piano' | 'nature' | 'acoustic' | 'ambient' | 'pulse') {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrackId = trackId;
    this.elapsedSeconds = 0;

    // Master gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Start timer ticker
    this.timeTicker = setInterval(() => {
      if (this.isPlaying) {
        this.elapsedSeconds += 1;
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.elapsedSeconds);
        }
      }
    }, 1000);

    // Route to appropriate sound generator
    if (soundType === 'piano') {
      this.startCalmPianoLoop();
    } else if (soundType === 'nature') {
      this.startNatureRainLoop();
    } else if (soundType === 'acoustic') {
      this.startGentleAcousticLoop();
    } else if (soundType === 'pulse') {
      this.startLightEnergyLoop();
    } else {
      this.startUpliftingAmbientLoop();
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentTrackId = null;
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.timeTicker) {
      clearInterval(this.timeTicker);
      this.timeTicker = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore already stopped
      }
    });
    this.activeOscillators = [];
    if (this.noiseNode) {
      try {
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
  }

  // 1. Calm Instrumental Piano / Rhodes simulation
  private startCalmPianoLoop() {
    if (!this.ctx || !this.gainNode) return;
    const notes = [
      261.63, // C4
      329.63, // E4
      392.0, // G4
      493.88, // B4
      523.25, // C5
      493.88, // B4
      392.0, // G4
      329.63, // E4
      220.0, // A3
      261.63, // C4
      329.63, // E4
      440.0, // A4
    ];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      // Dual oscillator for rich warm bell-like electric piano
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Low pass filter for soft mellow warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.3, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.3);
      osc2.stop(now + 2.3);
    };

    playNextNote();
    this.loopTimer = setInterval(playNextNote, 1400);
  }

  // 2. Nature Sounds (Filtered Rain & Ambient Streams)
  private startNatureRainLoop() {
    if (!this.ctx || !this.gainNode) return;

    // Pink noise generation
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.gainNode);
    whiteNoise.start(0);
    this.noiseNode = whiteNoise;

    // Periodic gentle chime note
    const chimes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    const playChime = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const freq = chimes[Math.floor(Math.random() * chimes.length)];
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.08, now + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.gainNode);
      chimeOsc.start(now);
      chimeOsc.stop(now + 3.6);
    };

    this.loopTimer = setInterval(playChime, 3000);
  }

  // 3. Gentle Acoustic Guitar chords
  private startGentleAcousticLoop() {
    if (!this.ctx || !this.gainNode) return;
    const chords = [
      [130.81, 196.0, 246.94, 329.63], // Cmaj7
      [110.0, 164.81, 220.0, 293.66], // Am9
      [174.61, 220.0, 261.63, 349.23], // Fmaj7
      [196.0, 246.94, 293.66, 392.0], // G6
    ];
    let chordIdx = 0;

    const arpeggiateChord = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, i) => {
        if (!this.ctx || !this.gainNode) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const noteTime = this.ctx.currentTime + i * 0.28;
        noteGain.gain.setValueAtTime(0.001, noteTime);
        noteGain.gain.exponentialRampToValueAtTime(0.22, noteTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.0);

        noteOsc.connect(noteGain);
        noteGain.connect(this.gainNode);
        noteOsc.start(noteTime);
        noteOsc.stop(noteTime + 2.1);
      });
    };

    arpeggiateChord();
    this.loopTimer = setInterval(arpeggiateChord, 1800);
  }

  // 4. Uplifting Bright Harmonic Progression
  private startUpliftingAmbientLoop() {
    if (!this.ctx || !this.gainNode) return;
    const notes = [
      293.66, // D4
      369.99, // F#4
      440.0, // A4
      587.33, // D5
      329.63, // E4
      392.0, // G4
      493.88, // B4
      587.33, // D5
    ];
    let noteIdx = 0;

    const playWarmArp = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start(now);
      osc.stop(now + 1.9);
    };

    playWarmArp();
    this.loopTimer = setInterval(playWarmArp, 600);
  }

  // 5. Light Energy Pulse / Rhythmic Lofi Ambient
  private startLightEnergyLoop() {
    if (!this.ctx || !this.gainNode) return;
    let step = 0;
    const bassline = [110.0, 110.0, 146.83, 164.81];

    const playStep = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;

      // Soft bass / kick pulse on downbeats
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassline[(step / 2) % bassline.length], now);
        bassGain.gain.setValueAtTime(0.28, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        bassOsc.connect(bassGain);
        bassGain.connect(this.gainNode);
        bassOsc.start(now);
        bassOsc.stop(now + 0.36);
      }

      // Soft warm melodic synth stab
      const synthOsc = this.ctx.createOscillator();
      const synthGain = this.ctx.createGain();
      synthOsc.type = 'triangle';
      const melodyNotes = [440, 523.25, 659.25, 783.99];
      synthOsc.frequency.setValueAtTime(melodyNotes[step % melodyNotes.length], now);
      synthGain.gain.setValueAtTime(0.08, now);
      synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      synthOsc.connect(synthGain);
      synthGain.connect(this.gainNode);
      synthOsc.start(now);
      synthOsc.stop(now + 0.23);

      step++;
    };

    playStep();
    this.loopTimer = setInterval(playStep, 450);
  }
}

export const ambientAudio = new AmbientAudioEngine();
