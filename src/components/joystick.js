import React, { useEffect, useRef } from 'react';
import './joystick.css';
import JoyStick from '../utils/joy';

const Joystick = ({ onMove, onStop, onFire }) => {
    const joystickInstance = useRef(null);
    const joystickContainerRef = useRef(null);

    useEffect(() => {
        if (!joystickInstance.current && joystickContainerRef.current) {
            joystickInstance.current = new JoyStick(joystickContainerRef.current, {}, function(stickData) {
                const x = parseInt(stickData.x, 10);
                if (x > 20) {
                    onMove('right');
                } else if (x < -20) {
                    onMove('left');
                } else {
                    onStop();
                }
            });
        }

        return () => {
            if (joystickInstance.current && joystickInstance.current.destroy) {
                joystickInstance.current.destroy();
            }
            joystickInstance.current = null;
        }
    }, []);

    return (
        <div className="joystick-container">
            <div ref={joystickContainerRef} className="joystick"></div>
            <button className="fire-button" onTouchStart={onFire} onMouseDown={(e) => { e.preventDefault(); onFire(); }}>
                FIRE
            </button>
        </div>
    );
};

export default Joystick;
