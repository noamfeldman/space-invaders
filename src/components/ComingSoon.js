import React from 'react';
import './ComingSoon.css';
import MainMenuButton from './MainMenuButton';

const ComingSoon = ({ onMainMenu }) => {
  return (
    <div className="coming-soon">
      <h1 className="neon-text">Coming Soon</h1>
      <p>This game is not yet available. Check back later!</p>
      <MainMenuButton onClick={onMainMenu} />
    </div>
  );
};

export default ComingSoon; 