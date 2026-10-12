/**
 * ==============================================================================
 * audioService.js - محرك المؤثرات الصوتية البيداغوجية المتوافق مع معايير الويب
 * ==============================================================================
 * مبني عبر Web Audio API ليعمل بدون أي طلبات شبكية أو تبعيات خارجية،
 * مع إدارة آمنة لدورة حياة سياق الصوت (AudioContext lifecycle).
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playSuccess() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.16); // G5

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio FX suppressed:', e);
    }
  }

  playError() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.09); // G3

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {
      console.warn('Audio FX suppressed:', e);
    }
  }

  dispose() {
    if (this.audioCtx && typeof this.audioCtx.close === 'function') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
