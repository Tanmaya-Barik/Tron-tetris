import React from 'react';
import '../Overlays/Overlays.css';

const PauseOverlay = ({ resumeGame }) => (
  <div className="overlay">
    <h2 className="overlay-title paused-title">SYSTEM PAUSED</h2>
    <button className="tron-button" onClick={resumeGame}>RESUME</button>
  </div>
);

export default PauseOverlay;
