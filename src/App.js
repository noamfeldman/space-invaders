import { useState } from 'react';
import './App.css';
import GameGrid from './components/GameGrid';
import GameLobby from './components/GameLobby';
import GameScreen from './components/GameScreen';
import HighScoresPage from './components/HighScoresPage';
import ComingSoon from './components/ComingSoon';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    if (game.id === 1) { // Assuming Space Invaders is always id 1
      setCurrentView('lobby');
    } else {
      setCurrentView('coming-soon');
    }
  };

  const handleStartGame = () => {
    setCurrentView('game');
  };

  const handlePlayAgain = () => {
    // This is tricky because we need to reset the game state
    // For now, let's just go back to the lobby
    setCurrentView('lobby');
  };

  const handleMainMenu = () => {
    setCurrentView('home');
  };

  const handleShowHighScores = () => setCurrentView('high-scores');

  const renderView = () => {
    switch (currentView) {
      case 'game':
        return <GameScreen game={selectedGame} onPlayAgain={handlePlayAgain} onMainMenu={handleMainMenu} />;
      case 'lobby':
        return <GameLobby game={selectedGame} onStartGame={handleStartGame} onMainMenu={handleMainMenu} />;
      case 'high-scores':
        return <HighScoresPage onMainMenu={handleMainMenu} />;
      case 'coming-soon':
        return <ComingSoon onMainMenu={handleMainMenu} />;
      case 'home':
      default:
        return (
          <>
            <header className="App-header">
              <h1 className="neon-text">Arcade Classics</h1>
              <button onClick={handleShowHighScores} className="neon-button">High Scores</button>
            </header>
            <main>
              <GameGrid onGameSelect={handleGameSelect} />
            </main>
          </>
        );
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;
