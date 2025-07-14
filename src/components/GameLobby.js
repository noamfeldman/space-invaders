import React from 'react';
import './GameLobby.css';
import invaderImage from '../assets/invader.png';
import MainMenuButton from './MainMenuButton';

const GameLobby = ({ game, onStartGame, onMainMenu }) => {
  const instructions = {
    'Space Invaders': [
      'Use Left and Right Arrow Keys to Move',
      'Press Spacebar to Shoot'
    ]
  };

  const gameInstructions = instructions[game.name] || [];

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