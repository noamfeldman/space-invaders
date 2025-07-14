import React from 'react';
import './Invader.css';

const Invader = ({ x, y, image }) => {
  return (
    <img 
      src={image} 
      className="invader" 
      alt="invader" 
      style={{ left: `${x}%`, top: `${y}%` }} 
    />
  );
};

export default Invader; 