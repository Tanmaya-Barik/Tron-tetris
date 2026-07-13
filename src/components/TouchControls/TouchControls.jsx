import React, { useRef, useEffect } from 'react';
import './TouchControls.css';
import { GAME_STATE } from '../../utils/constants';

const TouchControls = ({ move, drop, rotate, hardDrop, holdPiece, gameState, pauseGame, isMobile }) => {
  const dropIntervalRef = useRef(null);

  const startSoftDrop = () => {
    if (gameState !== GAME_STATE.PLAYING) return;
    drop();
    dropIntervalRef.current = setInterval(drop, 50);
  };

  const stopSoftDrop = () => {
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return stopSoftDrop;
  }, []);

  return (
    <div className="bottom-controls-container">
      {/* Universal Minimalist Buttons (Always visible) */}
      <div className="minimal-controls">
        <button className="minimal-btn" onClick={() => {}} title="Settings">
          ⛭
        </button>
        <button className="minimal-btn" onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(()=>{});
          } else {
            document.exitFullscreen().catch(()=>{});
          }
        }} title="Fullscreen">
          ⛶
        </button>
        <button className="minimal-btn play-btn" onClick={pauseGame} title="Pause/Play">
          {gameState === GAME_STATE.PAUSED || gameState === GAME_STATE.START ? '▶' : '⏸'}
        </button>
      </div>

      {/* Touch Controls (Always visible as requested) */}
      <div className="touch-controls">
        <div className="touch-row">
          <button className="touch-btn" onPointerDown={(e) => { e.preventDefault(); holdPiece(); }} onContextMenu={(e) => e.preventDefault()}>H</button>
          <button className="touch-btn" onPointerDown={(e) => { e.preventDefault(); hardDrop(); }} onContextMenu={(e) => e.preventDefault()}>⤓</button>
          <button className="touch-btn" onPointerDown={(e) => { e.preventDefault(); rotate(1); }} onContextMenu={(e) => e.preventDefault()}>↻</button>
        </div>
        <div className="touch-row" style={{ marginTop: '1rem' }}>
          <button className="touch-btn large" onPointerDown={(e) => { e.preventDefault(); move(-1); }} onContextMenu={(e) => e.preventDefault()}>←</button>
          <button 
            className="touch-btn large" 
            onPointerDown={(e) => { e.preventDefault(); startSoftDrop(); }}
            onPointerUp={(e) => { e.preventDefault(); stopSoftDrop(); }}
            onPointerLeave={(e) => { e.preventDefault(); stopSoftDrop(); }}
            onContextMenu={(e) => e.preventDefault()}
          >
            ↓
          </button>
          <button className="touch-btn large" onPointerDown={(e) => { e.preventDefault(); move(1); }} onContextMenu={(e) => e.preventDefault()}>→</button>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
