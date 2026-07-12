import { POINTS } from './constants';

export const calculateScore = (linesCleared, level, combo, isBackToBack, isTSpin) => {
  let scoreMultiplier = 0;
  let newIsBackToBack = false;

  if (linesCleared === 1) {
    scoreMultiplier = isTSpin ? POINTS.TSPIN_SINGLE : POINTS.SINGLE;
  } else if (linesCleared === 2) {
    scoreMultiplier = isTSpin ? POINTS.TSPIN_DOUBLE : POINTS.DOUBLE;
  } else if (linesCleared === 3) {
    scoreMultiplier = isTSpin ? POINTS.TSPIN_TRIPLE : POINTS.TRIPLE;
  } else if (linesCleared === 4) {
    scoreMultiplier = POINTS.TETRIS;
    newIsBackToBack = true;
  } else if (isTSpin) {
    scoreMultiplier = POINTS.TSPIN;
  }

  // Back-to-Back Bonus (Tetris or T-Spin followed by another Tetris or T-Spin)
  if ((isTSpin || linesCleared === 4) && isBackToBack) {
    scoreMultiplier = Math.floor(scoreMultiplier * 1.5);
    newIsBackToBack = true;
  }

  // Combo Bonus
  const comboBonus = combo > 0 ? 50 * combo * level : 0;

  return {
    scoreAdded: (scoreMultiplier * level) + comboBonus,
    isBackToBack: newIsBackToBack
  };
};
