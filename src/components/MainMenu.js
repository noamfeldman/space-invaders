import React from 'react';
import './MainMenu.css';
import invaderImage from '../assets/invader.png';

const MainMenu = ({ onStartGame, onShowHighScores }) => {
  return (
    <div className="main-menu">
      <img src={invaderImage} alt="Space Invaders" className="game-image" />
      <div className="menu-buttons">
        <button onClick={onStartGame} className="neon-button">Start Game</button>
        <button onClick={onShowHighScores} className="neon-button">High Scores</button>
      </div>
    </div>
  );
};

export default MainMenu; 