import React from 'react';
import './Shield.css';

const Shield = ({ blocks, position }) => {
  return (
    <div className="shield" style={{ left: `${position.x}%`, bottom: `${position.y}%` }}>
      {blocks.filter(block => block.health > 0).map(block => (
        <div 
          key={block.id} 
          className="shield-block" 
          style={{ 
            left: `${block.x}%`, 
            top: `${block.y}%`,
            width: `${block.width}%`,
            height: `${block.height}%`,
            opacity: block.health / 4 
          }}
        ></div>
      ))}
    </div>
  );
};

export default Shield; 