import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getHighScores, saveHighScore } from '../utils/highScores';
import GameOver from './GameOver';
import './GameScreen.css';
import GameUI from './GameUI';
import Invader from './Invader';
import InvaderLaser from './InvaderLaser';
import Laser from './Laser';
import MysteryShip from './MysteryShip';
import Player from './Player';
import Shield from './Shield';
import invader1Image from '../assets/invader1.png';
import invader2Image from '../assets/invader2.png';
import invader3Image from '../assets/invader3.png';
import invader4Image from '../assets/invader4.png';
import playSound from '../utils/sound';

// Placeholder sound imports - we will need to add these files
import shootSound from '../assets/sounds/shoot.wav';
import invaderHitSound from '../assets/sounds/invaderkilled.wav';
import playerHitSound from '../assets/sounds/explosion.wav';
import gameStartSound from '../assets/sounds/start.mp3';
import gameOverSound from '../assets/sounds/gameover.mp3';
import mysteryHitSound from '../assets/sounds/mystery.wav';

const shieldShape = [
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
];

const GameScreen = ({ game, onPlayAgain, onMainMenu }) => {
  // --- State and refs ---
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [lasers, setLasers] = useState([]);
  const [invaders, setInvaders] = useState([]);
  const [invaderLasers, setInvaderLasers] = useState([]);
  const [shields, setShields] = useState([]);
  const [mysteryShip, setMysteryShip] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const invaderMoveLoopRef = useRef(null);
  const gameLoopRef = useRef(null);
  const playerRef = useRef(null);
  const gameLoopCounterRef = useRef(0);

  const livesRef = useRef(lives);
  livesRef.current = lives;
  const invaderDirectionRef = useRef(1);
  const invadersRef = useRef(invaders);
  invadersRef.current = invaders;
  const lasersRef = useRef(lasers);
  lasersRef.current = lasers;
  const mysteryShipRef = useRef(mysteryShip);
  mysteryShipRef.current = mysteryShip;
  const invaderLasersRef = useRef(invaderLasers);
  invaderLasersRef.current = invaderLasers;
  const shieldsRef = useRef(shields);
  shieldsRef.current = shields;

  const [level, setLevel] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showHighScores, setShowHighScores] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [playerIsHit, setPlayerIsHit] = useState(false);

  const checkShieldCollision = (laser, gameWidth, gameHeight) => {
    for (const shield of shieldsRef.current) {
      for (const block of shield.blocks) {
        if (block.health > 0) {
          const shieldX = (shield.position.x / 100) * gameWidth;
          const shieldY = (shield.position.y / 100) * gameHeight;

          const blockX = shieldX + (block.x / 100) * (10 / 100 * gameWidth);
          const blockY = shieldY + (block.y / 100) * (5 / 100 * gameHeight);
          const blockWidth = (block.width / 100) * (10 / 100 * gameWidth);
          const blockHeight = (block.height / 100) * (5 / 100 * gameHeight);

          const laserX = (laser.x / 100) * gameWidth;
          const laserY = (laser.y / 100) * gameHeight;

          if (
            laserX >= blockX && laserX <= blockX + blockWidth &&
            laserY >= blockY && laserY <= blockY + blockHeight
          ) {
            setShields(prevShields => {
              const newShields = [...prevShields];
              const newBlocks = [...newShields[newShields.indexOf(shield)].blocks];
              const blockToUpdate = newBlocks.find(b => b.id === block.id);
              if (blockToUpdate) {
                blockToUpdate.health -= 1;
              }
              newShields[newShields.indexOf(shield)].blocks = newBlocks;
              return newShields;
            });
            return true;
          }
        }
      }
    }
    return false;
  };
  
  // --- gameLoop function ---
  const gameLoop = useCallback(() => {
    // --- Stop loop if game is over ---
    if (livesRef.current <= 0) {
        setIsGameOver(true);
        return;
    }

    // --- All Calculations First ---
    const counter = gameLoopCounterRef.current;
    const invadersShouldMove = (counter === 0);
    const gameArea = document.querySelector('.game-screen');
    const gameWidth = gameArea ? gameArea.offsetWidth : window.innerWidth;
    const gameHeight = gameArea ? gameArea.offsetHeight : window.innerHeight;

    let invadersToRemove = new Set();
    let lasersToRemove = new Set();
    const currentInvaders = invadersRef.current;
    const currentLasers = lasersRef.current;

    // 1. Calculate player laser hits
    currentLasers.forEach(laser => {
        if (laser.y > 0) { // Player lasers move up
            if (checkShieldCollision(laser, gameWidth, gameHeight)) {
                lasersToRemove.add(laser.id);
                return;
            }

            const laserX = (laser.x / 100) * gameWidth;
            const laserTipY = (laser.y / 100) * gameHeight;
            const candidates = currentInvaders.filter(invader => {
                const invaderX = (invader.x / 100) * gameWidth;
                const invaderY = (invader.y / 100) * gameHeight;
                const invaderWidth = (4 / 100) * gameWidth;
                const invaderHeight = (4 / 100) * gameHeight;
                return laserX >= invaderX && laserX <= invaderX + invaderWidth &&
                       laserTipY >= invaderY && laserTipY <= invaderY + invaderHeight;
            });
            if (candidates.length > 0) {
                const closest = candidates.reduce((a, b) => (a.y > b.y ? a : b));
                lasersToRemove.add(laser.id);
                if (!invadersToRemove.has(closest.id)) {
                    invadersToRemove.add(closest.id);
                    setScore(s => s + closest.score);
                    playSound(invaderHitSound);
                }
            }
        }
    });
    
    // 2. Mystery Ship Collision
    const currentMysteryShip = mysteryShipRef.current;
    if (currentMysteryShip) {
        currentLasers.forEach(laser => {
            if (
                laser.y > 0 &&
                laser.x >= currentMysteryShip.x && laser.x <= currentMysteryShip.x + 5 &&
                laser.y >= currentMysteryShip.y && laser.y <= currentMysteryShip.y + 3
            ) {
                lasersToRemove.add(laser.id);
                setScore(s => s + currentMysteryShip.score);
                playSound(mysteryHitSound);
                setMysteryShip(null); // Remove ship immediately
            }
        });
    }

    // --- All State Updates ---

    // 1. Unified Invader Update (Movement & Destruction)
    if (invadersShouldMove || invadersToRemove.size > 0) {
        setInvaders(prevInvaders => {
            let newInvaders = prevInvaders.filter(inv => !invadersToRemove.has(inv.id));

            if (invadersShouldMove) {
                let direction = invaderDirectionRef.current;
                let edgeReached = false;
                for (const invader of newInvaders) {
                    if ((invader.x > 96 && direction === 1) || (invader.x < 0 && direction === -1)) {
                        edgeReached = true;
                        break;
                    }
                }
                if (edgeReached) {
                    direction *= -1;
                    invaderDirectionRef.current = direction;
                    newInvaders = newInvaders.map(invader => ({
                        ...invader,
                        y: invader.y + 2,
                        x: invader.x + 0.5 * direction
                    }));
                } else {
                    newInvaders = newInvaders.map(invader => ({
                        ...invader,
                        x: invader.x + 0.5 * direction
                    }));
                }
            }
            return newInvaders;
        });
    }

    // 2. Player Laser Updates
    setLasers(prev => prev
        .map(l => ({ ...l, y: l.y - 5 }))
        .filter(l => l.y > 0 && !lasersToRemove.has(l.id))
    );

    // 3. Invader Laser Updates
    let playerWasHit = false;
    const newInvaderLasers = [];
    for (const laser of invaderLasersRef.current) {
        if (checkShieldCollision(laser, gameWidth, gameHeight)) {
            continue; // Laser is absorbed by the shield, so we skip it
        }

        const playerRect = playerRef.current?.getBoundingClientRect();
        const laserX = (laser.x / 100) * gameWidth;
        const laserY = (laser.y / 100) * gameHeight;

        if (
            playerRect &&
            laserX >= playerRect.left && laserX <= playerRect.right &&
            laserY >= playerRect.top && laserY <= playerRect.bottom
        ) {
            playerWasHit = true;
            // Laser is removed by not being added to newInvaderLasers
        } else if (laser.y < 100) {
            newInvaderLasers.push({ ...laser, y: laser.y + 5 });
        }
    }

    if (playerWasHit) {
        setLives(l => {
            // Ensure we don't go below 0
            if (l > 0) {
                playSound(playerHitSound);
                setPlayerIsHit(true);
                setTimeout(() => setPlayerIsHit(false), 300); // Glow for 300ms
                return l - 1;
            }
            return 0;
        });
    }
    setInvaderLasers(newInvaderLasers);


    // 4. Invader Shooting
    if (Math.random() < 0.03 && invadersRef.current.length > 0) {
        const randomInvader = invadersRef.current[Math.floor(Math.random() * invadersRef.current.length)];
        setInvaderLasers(prev => [...prev, { id: Date.now(), x: randomInvader.x, y: randomInvader.y + 5 }]);
    }
    
    // 5. Mystery Ship Movement
    setMysteryShip(ms => {
        if (!ms) return null;
        if (ms.x > 100) return null;
        return { ...ms, x: ms.x + 0.2 };
    });


    // --- Post-Update Game Logic ---
    
    // Update counter for next tick
    gameLoopCounterRef.current = (gameLoopCounterRef.current + 1) % 10;

    // Check for game over by invaders reaching bottom
    if (invadersRef.current.some(inv => ((inv.y / 100) * gameHeight) > (gameHeight * 0.8))) {
        setLives(0);
        setIsGameOver(true);
        playSound(gameOverSound);
    }
  }, []);

  // --- useEffect for intervals ---
  useEffect(() => {
    gameLoopRef.current = setInterval(gameLoop, 50);

    return () => {
      clearInterval(gameLoopRef.current);
    };
  }, [gameLoop]);

  // --- AABB collision detection function ---
  // const checkCollision = (rect1, rect2) => {
  //   return (
  //     rect1.x < rect2.x + rect2.width &&
  //     rect1.x + rect1.width > rect2.x &&
  //     rect1.y < rect2.y + rect2.height &&
  //     rect1.y + rect1.height > rect2.y
  //   );
  // };

  const resetLevel = useCallback(() => {
    // Logic to create invaders based on level
    const initialInvaders = [];
    const scoreValues = [30, 20, 20, 10, 10];
    const invaderImages = [invader1Image, invader2Image, invader3Image, invader4Image, invader1Image];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        initialInvaders.push({
          id: `${row}-${col}`,
          x: 10 + col * 8,
          y: 10 + row * 8,
          image: invaderImages[row],
          score: scoreValues[row],
        });
      }
    }
    setInvaders(initialInvaders);
    invaderDirectionRef.current = 1;

    // Reset mystery ship for new level
    setMysteryShip(null);
  }, []);

  useEffect(() => {
    playSound(gameStartSound);
    resetLevel();
    setInitialLoad(false);
  }, [resetLevel]);

  useEffect(() => {
    if (!initialLoad && invaders.length === 0 && lives > 0) {
      setLevel(l => l + 1);
      resetLevel();
    }
  }, [invaders, lives, resetLevel, initialLoad]);

  useEffect(() => {
    // Create initial shields
    const initialShields = [];
    const blockWidth = 100 / shieldShape[0].length;
    const blockHeight = 100 / shieldShape.length;

    for (let i = 0; i < 4; i++) {
      const shieldBlocks = [];
      shieldShape.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col === 1) {
            shieldBlocks.push({
              id: `shield-${i}-block-${rowIndex}-${colIndex}`,
              x: colIndex * blockWidth,
              y: rowIndex * blockHeight,
              width: blockWidth,
              height: blockHeight,
              health: 4,
            });
          }
        });
      });
      initialShields.push({
        id: `shield-${i}`,
        blocks: shieldBlocks,
        position: { x: 15 + i * 20, y: 20 },
      });
    }
    setShields(initialShields);
  }, []);

  useEffect(() => {
    // Adjust invader speed based on level
    // invaderSpeedRef.current = 500 - (level * 50); // This line was removed as per the new_code, as level state is no longer managed here.
  }, [level]); // This line was removed as per the new_code, as level state is no longer managed here.

  useEffect(() => {
    const mysteryShipInterval = setInterval(() => {
      if (!mysteryShip) {
        setMysteryShip({ x: 0, y: 5, score: 100 });
      }
    }, 15000); // Appear every 15 seconds
    return () => clearInterval(mysteryShipInterval);
  }, [mysteryShip]);

  useEffect(() => {
    if (lives <= 0) {
      setIsGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (isGameOver) {
      clearInterval(gameLoopRef.current);
      playSound(gameOverSound);
    }
  }, [isGameOver]);

  const fireLaser = (position) => {
    playSound(shootSound);
    setLasers(prevLasers => [...prevLasers, { id: Date.now(), ...position }]);
  };

  // --- handleHighScoreSubmit function ---
  const handleHighScoreSubmit = (initials) => {
    const updatedScores = saveHighScore(initials, score);
    setHighScores(updatedScores);
    setShowHighScores(true);
  };

  // --- Rendering ---
  if (isGameOver) {
    return (
      <GameOver
        score={score}
        onPlayAgain={onPlayAgain}
        onMainMenu={onMainMenu}
        gameId={game.id}
        highScores={highScores}
        onHighScoreSubmit={handleHighScoreSubmit}
        showHighScores={showHighScores}
      />
    );
  }

  return (
    <div className="game-screen">
      <GameUI score={score} lives={lives} level={level} />
      <Player ref={playerRef} onFire={fireLaser} isHit={playerIsHit} />
      {lasers.map(laser => <Laser key={laser.id} position={{ x: laser.x, y: laser.y }} />)}
      {invaders.map(invader => (
        <Invader key={invader.id} position={{ x: invader.x, y: invader.y }} image={invader.image} />
      ))}
      {invaderLasers.map(laser => <InvaderLaser key={laser.id} position={{ x: laser.x, y: laser.y }} />)}
      {shields.map(shield => (
        <Shield key={shield.id} blocks={shield.blocks} position={shield.position} />
      ))}
      {mysteryShip && <MysteryShip position={mysteryShip} />}
    </div>
  );
};

export default GameScreen; 