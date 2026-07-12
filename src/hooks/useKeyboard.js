import { useEffect } from 'react';
import { GAME_STATE } from '../utils/constants';

export const useKeyboard = (gameState, { move, drop, rotate, hardDrop, holdPiece, pauseGame }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState !== GAME_STATE.PLAYING && e.key !== 'p' && e.key !== 'P') return;

      switch (e.key) {
        case 'ArrowLeft':
          move(-1);
          break;
        case 'ArrowRight':
          move(1);
          break;
        case 'ArrowDown':
          drop();
          break;
        case 'ArrowUp':
          rotate(1); // Clockwise
          break;
        case ' ': // Spacebar
          hardDrop();
          break;
        case 'Shift': // Shift
          holdPiece();
          break;
        case 'p':
        case 'P':
          pauseGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, move, drop, rotate, hardDrop, holdPiece, pauseGame]);
};
