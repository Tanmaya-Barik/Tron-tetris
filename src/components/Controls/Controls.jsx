import React from 'react';

const Controls = () => (
  <div className="glass-panel">
    <div className="panel-title">CONTROLS</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>MOVE</span>
        <span style={{ color: 'var(--neon-cyan)' }}>← →</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>ROTATE</span>
        <span style={{ color: 'var(--neon-cyan)' }}>↑</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>SOFT DROP</span>
        <span style={{ color: 'var(--neon-cyan)' }}>↓</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>HARD DROP</span>
        <span style={{ color: 'var(--neon-cyan)' }}>SPACE</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>HOLD</span>
        <span style={{ color: 'var(--neon-cyan)' }}>SHIFT</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>PAUSE</span>
        <span style={{ color: 'var(--neon-cyan)' }}>P</span>
      </div>
    </div>
  </div>
);

export default Controls;
