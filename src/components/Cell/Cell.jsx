import React from 'react';
import { TETROMINOES } from '../../utils/tetrominoes';
import './Cell.css';

const Cell = ({ type, isGhost, isClearAnim }) => {
  const isFilled = type !== 0;
  const color = isFilled ? `rgb(${TETROMINOES[type].color})` : 'transparent';
  
  let className = 'cell';
  if (isFilled && !isGhost) className += ' filled';
  if (isGhost) className += ' ghost';
  if (isClearAnim) className += ' clear-anim';

  return (
    <div
      className={className}
      style={{
        color: isFilled ? color : 'inherit'
      }}
    />
  );
};

export default React.memo(Cell);
