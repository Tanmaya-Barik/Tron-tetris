import React from 'react';
import Cell from '../Cell/Cell';
import ParticleSystem from '../particles/ParticleSystem';
import './Board.css';

const PieceOverlay = ({ piece, yPos, isGhost, isHardDropping }) => {
  if (!piece) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: `calc(var(--cell-size) * ${yPos})`,
        left: `calc(var(--cell-size) * ${piece.pos.x})`,
        transition: isHardDropping ? 'top 0.1s linear' : 'none',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
      }}
    >
      {piece.shape.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => {
            const isVisible = cell !== 0 && (yPos + y) >= 0 && (yPos + y) < 20;
            return (
              <div key={x} style={{ width: 'var(--cell-size)', height: 'var(--cell-size)' }}>
                {isVisible && (
                   <Cell type={piece.type} isGhost={isGhost} isActive={!isGhost} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Board = ({ board, piece, ghostY, isHardDropping, gameState, particleRef, hardDropStreak, particleDensity }) => {
  return (
    <div className="board-container" style={{ position: 'relative' }}>
      <div className="board">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell 
              key={`${y}-${x}`} 
              type={cell[0]}
              x={x}
              isClearAnim={cell[1] === 'clear-anim'}
            />
          ))
        )}
        
        {piece && gameState !== 'GAME_OVER' && (
          <>
            <PieceOverlay piece={piece} yPos={ghostY} isGhost />
            <PieceOverlay piece={piece} yPos={piece.pos.y} isHardDropping={isHardDropping} />
          </>
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
