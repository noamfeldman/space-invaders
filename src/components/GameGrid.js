import React from 'react';
import './GameGrid.css';
import invaderImage from '../assets/invader.png';
import blueMaxImage from '../assets/blue-max.png';
import snakeImage from '../assets/snake.png';

const GameGrid = ({ onGameSelect }) => {
  // We'll have a placeholder for now.
  const games = [
    { id: 1, name: 'Space Invaders', image: invaderImage },
    { id: 2, name: 'Blue Max', image: blueMaxImage },
    { id: 3, name: 'Snake', image: snakeImage },
  ];

  return (
    <div className="game-grid">
      {games.map(game => (
        <div className="game-card" key={game.id} onClick={() => onGameSelect(game)}>
          <img src={game.image} alt={game.name} />
          <h3>{game.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default GameGrid; 