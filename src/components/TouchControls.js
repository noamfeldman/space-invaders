import React from 'react';
import './TouchControls.css';

const TouchControls = ({ onTouchStart, onTouchEnd }) => {
  return (
    <div className="touch-controls">
      <div className="touch-left">
        <button
          className="touch-button"
          onTouchStart={() => onTouchStart('left')}
          onTouchEnd={() => onTouchEnd('left')}
        >
          &#8592;
        </button>
      </div>
      <div className="touch-right">
        <button
          className="touch-button"
          onTouchStart={() => onTouchStart('right')}
          onTouchEnd={() => onTouchEnd('right')}
        >
          &#8594;
        </button>
      </div>
      <div className="touch-fire">
        <button
          className="touch-button"
          onTouchStart={() => onTouchStart('fire')}
          onTouchEnd={() => onTouchEnd('fire')}
        >
          FIRE
        </button>
      </div>
    </div>
  );
};

export default TouchControls; 