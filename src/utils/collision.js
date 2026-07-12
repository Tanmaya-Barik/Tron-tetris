import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

export const checkCollision = (piece, board, { x: moveX, y: moveY }) => {
  for (let y = 0; y < piece.shape.length; y += 1) {
    for (let x = 0; x < piece.shape[y].length; x += 1) {
      // 1. Check that we're on an actual Tetromino cell
      if (piece.shape[y][x] !== 0) {
        // 2. Check that our move is inside the game board height (y)
        // 3. Check that our move is inside the game board width (x)
        // 4. Check that the cell we're moving to isn't set to clear
        const targetY = y + piece.pos.y + moveY;
        const targetX = x + piece.pos.x + moveX;
        
        if (
          targetY >= BOARD_HEIGHT ||
          targetX < 0 ||
          targetX >= BOARD_WIDTH ||
          (targetY >= 0 && board[targetY][targetX][1] !== 'clear')
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
