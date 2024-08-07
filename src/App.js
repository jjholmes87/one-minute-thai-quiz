import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import ConsonantsQuiz from './components/ConsonantsQuiz';
import './App.css';

const App = () => {
  const [mode, setMode] = useState(null);

  const handleStart = (selectedMode) => {
    setMode(selectedMode);
  };

  const handlePlayAgain = () => {
    setMode(null);
  };

  return (
    <div className="app-container">
      {mode ? (
        mode === 'thai-consonant-class' ? (
          <ConsonantsQuiz onPlayAgain={handlePlayAgain} />
        ) : (
          <Quiz mode={mode} onPlayAgain={handlePlayAgain} />
        )
      ) : (
        <StartScreen onStart={handleStart} />
      )}
    </div>
  );
};

export default App;