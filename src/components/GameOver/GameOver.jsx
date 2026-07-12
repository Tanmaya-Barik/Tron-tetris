import React from 'react';
import '../Overlays/Overlays.css';

const GameOver = ({ score, restartGame }) => (
  <div className="overlay">
    <h2 className="overlay-title">SYSTEM FAILURE</h2>
    <div className="overlay-score">SCORE: {score}</div>
    <button className="tron-button" onClick={restartGame}>REBOOT SYSTEM</button>
  </div>
);

export default GameOver;
