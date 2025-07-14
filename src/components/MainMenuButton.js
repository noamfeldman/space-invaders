import React from 'react';
import '../App.css';

const MainMenuButton = ({ onClick }) => {
  return (
    <button className="neon-button" onClick={onClick}>
      Main Menu
    </button>
  );
};

export default MainMenuButton; 