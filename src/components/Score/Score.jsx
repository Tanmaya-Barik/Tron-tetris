import React from 'react';
import './Score.css';

const Score = ({ score, lines, level, highScore, combo, backToBack }) => {
  return (
    <div className="score-panel">
      <div className="score-item" style={{ position: 'relative' }}>
        <span className="score-label">SCORE</span>
        <span className="score-value">{score}</span>
        {combo > 1 && <span className="combo-value">{combo}x COMBO</span>}
        {backToBack && <span className="b2b-value">BACK-TO-BACK</span>}
      </div>
      
      <div className="score-item">
        <span className="score-label">HIGH SCORE</span>
        <span className="score-value" style={{ color: 'var(--bright-white)', textShadow: 'var(--glow-white)' }}>
          {highScore}
        </span>
      </div>
      
      <div className="score-item">
        <span className="score-label">LINES</span>
        <span className="score-value">{lines}</span>
      </div>
      
      <div className="score-item">
        <span className="score-label">LEVEL</span>
        <span className="score-value">{level}</span>
      </div>
    </div>
  );
};

export default Score;
