import { checkCollision } from './collision';

// Rotate matrix clockwise or counter-clockwise
export const rotateMatrix = (matrix, dir) => {
  // Transpose
  const rotatedMatrix = matrix.map((_, index) =>
    matrix.map((col) => col[index])
  );
  // Reverse each row for clockwise, or reverse columns for counter-clockwise
  if (dir > 0) return rotatedMatrix.map((row) => row.reverse());
  return rotatedMatrix.reverse();
};

// Simplified SRS Wall Kicks (Right, Left, Down)
export const rotate = (piece, board, dir) => {
  const clonedPiece = JSON.parse(JSON.stringify(piece));
  clonedPiece.shape = rotateMatrix(clonedPiece.shape, dir);

  // Wall kick basic implementation
  const pos = clonedPiece.pos.x;
  let offset = 1;
  while (checkCollision(clonedPiece, board, { x: 0, y: 0 })) {
    clonedPiece.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > clonedPiece.shape[0].length) {
      // If we couldn't resolve collision, revert rotation
      rotateMatrix(clonedPiece.shape, -dir);
      clonedPiece.pos.x = pos;
      return piece; 
    }
  }
  return clonedPiece;
};
