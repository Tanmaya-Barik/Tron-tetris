import React from 'react';

const Settings = ({ settings, updateSettings, resetHighScore }) => (
  <div className="glass-panel">
    <div className="panel-title">SYSTEM SETTINGS</div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>SOUND FX</label>
      <input 
        type="checkbox" 
        checked={settings.sound} 
        onChange={(e) => updateSettings({ ...settings, sound: e.target.checked })}
        style={{ cursor: 'pointer' }}
      />
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <label style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>PARTICLES</label>
      <select 
        value={settings.particles} 
        onChange={(e) => updateSettings({ ...settings, particles: e.target.value })}
        style={{ background: 'transparent', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)', outline: 'none', cursor: 'pointer' }}
      >
        <option style={{background: '#000'}} value="high">HIGH</option>
        <option style={{background: '#000'}} value="low">LOW</option>
        <option style={{background: '#000'}} value="off">OFF</option>
      </select>
    </div>

    <button 
      className="tron-button" 
      onClick={resetHighScore}
      style={{ width: '100%', fontSize: '0.8rem', padding: '5px' }}
    >
      RESET HIGH SCORE
    </button>
  </div>
);

export default Settings;
