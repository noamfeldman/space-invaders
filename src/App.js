import { useState } from 'react';
import './App.css';
import GameLobby from './components/GameLobby';
import GameScreen from './components/GameScreen';
import HighScoresPage from './components/HighScoresPage';
import MainMenu from './components/MainMenu';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const spaceInvadersGame = { id: 1, name: 'Space Invaders' };

  const handleStartGame = () => {
    setCurrentView('game');
  };
  
  const handleStartLobby = () => {
    setCurrentView('lobby');
  }

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
        return <GameScreen game={spaceInvadersGame} onPlayAgain={handlePlayAgain} onMainMenu={handleMainMenu} />;
      case 'lobby':
        return <GameLobby game={spaceInvadersGame} onStartGame={handleStartGame} onMainMenu={handleMainMenu} />;
      case 'high-scores':
        return <HighScoresPage onMainMenu={handleMainMenu} />;
      case 'home':
      default:
        return (
          <>
            <header className="app-header">
              <h1 className="neon-text">Arcade Classics</h1>
              <h2 className="neon-text">Space Invaders</h2>
            </header>
            <main>
              <MainMenu onStartGame={handleStartLobby} onShowHighScores={handleShowHighScores} />
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
