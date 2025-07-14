import React from 'react';
import './Invader.css';

const Invader = ({ x, y, type }) => {
  return (
    <img 
      src={type} 
      className="invader" 
      alt="invader" 
      style={{ left: `${x}%`, top: `${y}%` }} 
    />
  );
};

export default Invader; 