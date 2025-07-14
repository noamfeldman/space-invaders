import React from 'react';
import './Laser.css';

const Laser = ({ position }) => {
  return (
    <div className="laser" style={{ left: `${position.x}%`, top: `${position.y}%` }}></div>
  );
};

export default Laser; 