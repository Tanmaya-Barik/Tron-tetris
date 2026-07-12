import { useEffect, useRef } from 'react';

export const useGameLoop = (callback, delay, isPlaying) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (deltaTime >= delay) {
        callback();
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlaying && delay !== null) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, delay, callback]);
};
