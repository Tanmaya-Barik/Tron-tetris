import { useEffect, useRef, useCallback } from 'react';

export const useAudio = (settings) => {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Only create AudioContext on first user interaction to comply with browser policies
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('click', initAudio, { once: true });
    
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playTone = useCallback((freq, type, duration, vol = 1) => {
    if (!settings.sound || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol * 0.1, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [settings.sound]);

  const playMove = useCallback(() => playTone(200, 'sine', 0.1, 0.5), [playTone]);
  const playRotate = useCallback(() => playTone(300, 'square', 0.1, 0.4), [playTone]);
  const playDrop = useCallback(() => playTone(150, 'triangle', 0.1, 0.6), [playTone]);
  const playHardDrop = useCallback(() => playTone(100, 'sawtooth', 0.2, 0.8), [playTone]);
  const playLineClear = useCallback(() => {
    playTone(600, 'square', 0.3, 0.6);
    setTimeout(() => playTone(800, 'square', 0.4, 0.6), 100);
  }, [playTone]);
  const playTetris = useCallback(() => {
    playTone(600, 'square', 0.3, 0.8);
    setTimeout(() => playTone(800, 'square', 0.3, 0.8), 100);
    setTimeout(() => playTone(1000, 'square', 0.5, 0.8), 200);
  }, [playTone]);
  const playGameover = useCallback(() => {
    playTone(200, 'sawtooth', 0.5, 0.8);
    setTimeout(() => playTone(150, 'sawtooth', 0.8, 0.8), 400);
  }, [playTone]);

  return {
    playMove,
    playRotate,
    playDrop,
    playHardDrop,
    playLineClear,
    playTetris,
    playGameover
  };
};
