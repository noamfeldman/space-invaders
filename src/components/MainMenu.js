import React from 'react';
import './MainMenu.css';
import invaderImage from '../assets/invader.png';

const MainMenu = ({ onStartGame, onShowHighScores }) => {
  const handleFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  return (
    <div className="main-menu">
      <img src={invaderImage} alt="Space Invaders" className="game-image" />
      <div className="menu-buttons">
        <button onClick={onStartGame} className="neon-button">Start Game</button>
        <button onClick={onShowHighScores} className="neon-button">High Scores</button>
        <button onClick={handleFullScreen} className="neon-button">Go Fullscreen</button>
      </div>
    </div>
  );
};

export default MainMenu; 