import React, { useState } from 'react';
import './GameOver.css';
import MainMenuButton from './MainMenuButton';

const GameOver = ({ score, onPlayAgain, onMainMenu, onHighScoreSubmit, highScores, showHighScores }) => {
  const [initials, setInitials] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isHighScore = score > 100 && !showHighScores; // Placeholder logic

  const handleSubmit = (e) => {
    e.preventDefault();
    onHighScoreSubmit(initials);
    setSubmitted(true);
  };

  if (showHighScores) {
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
          <button onClick={onPlayAgain}>Play Again</button>
          <span style={{ marginLeft: '10px' }}><MainMenuButton onClick={onMainMenu} /></span>
        </div>
      </div>
    );
  }

  return (
    <div className="game-over">
      {isHighScore ? (
        <>
          <h2>High Score!</h2>
          <p>Your Score: {score}</p>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              maxLength="3" 
              value={initials} 
              onChange={(e) => setInitials(e.target.value.toUpperCase())} 
              placeholder="AAA"
              required
            />
            <div className="game-over-options">
              <button type="submit">Submit</button>
              <button type="button" onClick={onPlayAgain}>Retry</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <div className="game-over-options">
            <button onClick={onPlayAgain}>Play Again</button>
            <span style={{ marginLeft: '10px' }}><MainMenuButton onClick={onMainMenu} /></span>
          </div>
        </>
      )}
    </div>
  );
};

GameOver.defaultProps = {
  highScores: []
};

export default GameOver; 