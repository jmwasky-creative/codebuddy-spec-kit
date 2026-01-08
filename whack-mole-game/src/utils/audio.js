/**
 * Audio Utilities
 * Sound effects and music management
 */

/**
 * Audio Manager
 */
class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.enabled = true;
  }

  /**
   * Initialize audio context
   */
  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return true;
    } catch (error) {
      console.warn('Audio context not supported:', error);
      return false;
    }
  }

  /**
   * Play a sound effect
   */
  async playSound(name, volume = null) {
    if (!this.enabled || !this.audioContext) return;

    const vol = volume !== null ? volume : this.sfxVolume;

    try {
      // Resume audio context if suspended (browser policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Check if we have a cached sound
      if (this.sounds[name]) {
        this.sounds[name].play();
        return;
      }

      // Generate sound programmatically if no file available
      this.generateSound(name, vol);
    } catch (error) {
      console.warn(`Failed to play sound "${name}":`, error);
    }
  }

  /**
   * Generate sound effects programmatically
   */
  generateSound(name, volume) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    switch (name) {
      case 'hit':
        this.playTone(400, 'square', 0.1, volume);
        this.playTone(600, 'square', 0.1, volume * 0.8);
        break;

      case 'miss':
        this.playTone(200, 'sawtooth', 0.2, volume * 0.6);
        break;

      case 'score':
        this.playTone(523, 'sine', 0.1, volume);
        setTimeout(() => this.playTone(659, 'sine', 0.1, volume), 50);
        setTimeout(() => this.playTone(784, 'sine', 0.2, volume), 100);
        break;

      case 'mole-appear':
        this.playTone(300, 'sine', 0.15, volume * 0.5);
        break;

      case 'level-up':
        [261, 329, 392, 523].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 'sine', 0.3, volume), i * 80);
        });
        break;

      case 'game-over':
        this.playTone(300, 'sawtooth', 0.4, volume);
        setTimeout(() => this.playTone(250, 'sawtooth', 0.4, volume), 300);
        setTimeout(() => this.playTone(200, 'sawtooth', 0.6, volume), 600);
        break;

      case 'puzzle-piece':
        this.playTone(800, 'sine', 0.1, volume * 0.7);
        break;

      case 'puzzle-complete':
        this.playTone(523, 'sine', 0.2, volume);
        setTimeout(() => this.playTone(659, 'sine', 0.2, volume), 150);
        setTimeout(() => this.playTone(784, 'sine', 0.3, volume), 300);
        break;

      case 'achievement':
        this.playTone(880, 'sine', 0.1, volume);
        setTimeout(() => this.playTone(1108, 'sine', 0.1, volume), 100);
        setTimeout(() => this.playTone(1318, 'sine', 0.2, volume), 200);
        break;

      default:
        console.warn(`Unknown sound: ${name}`);
    }
  }

  /**
   * Play a single tone
   */
  playTone(frequency, type = 'sine', duration = 0.1, volume = 0.5) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Play background music
   */
  async playMusic() {
    if (!this.enabled || !this.audioContext) return;

    // Simple ambient music loop
    this.generateMusicLoop();
  }

  /**
   * Generate simple background music
   */
  generateMusicLoop() {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Simple melody pattern
    const melody = [261, 293, 329, 349, 392, 349, 329, 293];
    const duration = 0.5;

    melody.forEach((freq, i) => {
      setTimeout(() => {
        if (this.enabled) {
          this.playTone(freq, 'sine', duration, this.musicVolume * 0.3);
        }
      }, i * duration * 1000);
    });

    // Loop
    this.musicTimeout = setTimeout(() => {
      if (this.enabled) {
        this.generateMusicLoop();
      }
    }, melody.length * duration * 1000);
  }

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.musicTimeout) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Enable/disable audio
   */
  setEnabled(enabled) {
    this.enabled = enabled;

    if (!enabled) {
      this.stopMusic();
    }
  }

  /**
   * Toggle audio
   */
  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }
}

// Singleton instance
const audioManager = new AudioManager();

export default audioManager;
