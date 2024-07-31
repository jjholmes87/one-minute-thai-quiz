// src/App.js
import React, { useState } from 'react';
import Quiz from './components/Quiz';
import StartScreen from './components/StartScreen';
import './App.css'; // Import the stylesheet

const App = () => {
  const [quizMode, setQuizMode] = useState(null);

  const handleStart = (mode) => {
    setQuizMode(mode);
  };

  return (
    <div className="app-container">
      {quizMode ? (
        <Quiz mode={quizMode} />
      ) : (
        <StartScreen onStart={handleStart} />
      )}
    </div>
  );
};

export default App;
