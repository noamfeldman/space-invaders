import React from 'react';
import './InvaderLaser.css';

const InvaderLaser = ({ position }) => {
  return (
    <div className="invader-laser" style={{ left: `${position.x}%`, top: `${position.y}%` }}></div>
  );
};

export default InvaderLaser; 