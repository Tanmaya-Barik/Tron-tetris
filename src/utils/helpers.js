import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

export const createBoard = () =>
  Array.from(Array(BOARD_HEIGHT), () =>
    new Array(BOARD_WIDTH).fill([0, 'clear'])
  );

// Ghost piece calculation
import { checkCollision } from './collision';

export const calculateGhostPosition = (piece, board) => {
  let dropDistance = 0;
  while (!checkCollision(piece, board, { x: 0, y: dropDistance + 1 })) {
    dropDistance++;
  }
  return dropDistance;
};
