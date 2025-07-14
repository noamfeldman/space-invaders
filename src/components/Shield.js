import React from 'react';
import './Shield.css';

const Shield = ({ position, blocks }) => {
  const style = { left: `${position.x}%` };
  if (position.y !== undefined) {
    style.top = `${position.y}%`;
  }
  if (position.bottom !== undefined) {
    style.bottom = `${position.bottom}px`;
  }
  
  return (
    <div className="shield" style={style}>
      {blocks.filter(b => b.health > 0).map(block => (
        <div 
          key={block.id} 
          className="shield-block"
          style={{ 
            top: `${block.y}%`, 
            left: `${block.x}%`,
            width: `${block.width}%`,
            height: `${block.height}%`,
            opacity: block.health / 4
          }} 
        />
      ))}
    </div>
  );
};

export default Shield; 