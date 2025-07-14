import React from 'react';
import './MysteryShip.css';
import mysteryShipImage from '../assets/mystery.png';

const MysteryShip = ({ position }) => {
  return (
    <img 
      src={mysteryShipImage} 
      className="mystery-ship" 
      alt="Mystery Ship"
      style={{ left: `${position.x}%`, top: `${position.y}%` }} 
    />
  );
};

export default MysteryShip; 