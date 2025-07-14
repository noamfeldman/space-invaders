import React, { useState, useEffect } from 'react';
import './Player.css';
import playerShipImage from '../assets/user-ship.png';

const Player = React.forwardRef(({ onFire, isHit }, ref) => {
  const [position, setPosition] = useState(50); // percentage

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setPosition(pos => Math.max(pos - 2, 0));
      } else if (e.key === 'ArrowRight') {
        setPosition(pos => Math.min(pos + 2, 95)); // 100 - width of player
      } else if (e.key === ' ') { // Spacebar
        onFire({ x: position, y: 90 }); // Fire from player's position
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, onFire]);

  return (
    <img 
      src={playerShipImage}
      className={`player ${isHit ? 'hit' : ''}`}
      alt="Player's ship"
      style={{ left: `${position}%` }} 
      ref={ref} 
    />
  );
});

export default Player; 