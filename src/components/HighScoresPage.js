import React from 'react';
import { getHighScores } from '../utils/highScores';
import './GameOver.css';
import MainMenuButton from './MainMenuButton';

const HighScoresPage = ({ onMainMenu }) => {
  const highScores = getHighScores();
  return (
    <div className="game-over">
      <h2>High Scores</h2>
      <ol className="high-score-list">
        {highScores.map((entry, idx) => (
          <li key={idx}>
            <span className="initials">{entry.initials}</span>
            <span className="score">{entry.score}</span>
          </li>
        ))}
      </ol>
      <div className="game-over-options">
        <MainMenuButton onClick={onMainMenu} />
      </div>
    </div>
  );
};

export default HighScoresPage; 