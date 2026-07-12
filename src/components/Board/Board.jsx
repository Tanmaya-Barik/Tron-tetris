import React from 'react';
import Cell from '../Cell/Cell';
import ParticleSystem from '../particles/ParticleSystem';
import './Board.css';

const Board = ({ board, particleRef, hardDropStreak, particleDensity }) => {
  return (
    <div className="board-container">
      <div className="board">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell 
              key={`${y}-${x}`} 
              type={cell[0]} 
              isGhost={cell[2] === 'ghost'} 
              isClearAnim={cell[1] === 'clear-anim'}
            />
          ))
        )}
      </div>
      
      {/* Reusable Particle System Canvas */}
      <ParticleSystem 
        ref={particleRef} 
        width={300} // 10 columns * 30px
        height={600} // 20 rows * 30px
        density={particleDensity}
      />

      {hardDropStreak && (
        <div 
          className="hard-drop-streak" 
          style={{
            left: `${hardDropStreak.x * 30}px`,
            top: 0,
            height: `${hardDropStreak.y * 30}px`,
          }}
        />
      )}
    </div>
  );
};

export default Board;
