import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import './Player.css';
import playerShipImage from '../assets/user-ship.png';

const Player = React.forwardRef(({ onFire, isHit }, ref) => {
  const [position, setPosition] = useState(50); // percentage
  const [moveDirection, setMoveDirection] = useState('none'); // 'left', 'right', or 'none'
  const imgRef = useRef();

  useImperativeHandle(ref, () => ({
    move: (direction) => {
      setMoveDirection(direction);
    },
    stop: () => {
      setMoveDirection('none');
    },
    fire: () => {
      onFire({ x: position, y: 90 });
    },
    getBoundingClientRect: () => {
      return imgRef.current?.getBoundingClientRect();
    }
  }));

  useEffect(() => {
    let moveInterval;
    if (moveDirection !== 'none') {
      moveInterval = setInterval(() => {
        setPosition(pos => {
          if (moveDirection === 'left') {
            return Math.max(pos - 2, 0);
          } else {
            return Math.min(pos + 2, 95);
          }
        });
      }, 50);
    }
    return () => clearInterval(moveInterval);
  }, [moveDirection]);

  return (
    <img 
      ref={imgRef}
      src={playerShipImage}
      className={`player ${isHit ? 'hit' : ''}`}
      alt="Player's ship"
      style={{ left: `${position}%` }} 
    />
  );
});

export default Player; 