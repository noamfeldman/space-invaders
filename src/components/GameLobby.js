import React from 'react';
import './GameLobby.css';
import invaderImage from '../assets/invader.png';
import MainMenuButton from './MainMenuButton';

const GameLobby = ({ game, onStartGame, onMainMenu }) => {
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  const desktopInstructions = {
    'Space Invaders': [
      'Use Left and Right Arrow Keys to Move',
      'Press Spacebar to Shoot'
    ]
  };

  const mobileInstructions = {
    'Space Invaders': [
      'Tap Left/Right side of screen to Move',
      'Tap Middle of screen to Shoot'
    ]
  };

  const gameInstructions = (isTouchDevice() ? mobileInstructions[game.name] : desktopInstructions[game.name]) || [];

  return (
    <div className="game-lobby">
      <img src={invaderImage} alt="invader" />
      <h2 className="neon-text">{game.name}</h2>
      <div className="instructions">
        <h3>Controls</h3>
        {gameInstructions.map((inst, index) => (
          <p key={index}>{inst}</p>
        ))}
      </div>
      <button className="start-button" onClick={onStartGame}>Start Game</button>
      <div style={{ marginTop: '20px' }}>
        <MainMenuButton onClick={onMainMenu} />
      </div>
    </div>
  );
};

export default GameLobby; 