import React from 'react';
import './GameUI.css';

const GameUI = ({ score, lives, level }) => {
  return (
    <div className="game-ui">
      <div className="score">Score: {score}</div>
      <div className="level">Level: {level}</div>
      <div className="lives">Lives: {lives}</div>
    </div>
  );
};

export default GameUI; 