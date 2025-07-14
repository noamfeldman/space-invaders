import React from 'react';
import './Invader.css';

const Invader = ({ position, image }) => {
  return (
    <img 
      src={image} 
      className="invader" 
      alt="invader" 
      style={{ left: `${position.x}%`, top: `${position.y}%` }} 
    />
  );
};

export default Invader; 