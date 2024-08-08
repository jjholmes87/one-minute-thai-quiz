import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import ConsonantsQuiz from './components/ConsonantsQuiz';
import HamburgerMenu from './components/HamburgerMenu';
import About from './components/About';
import Contact from './components/Contact';
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
      <HamburgerMenu />
      <Routes>
        <Route path="/" element={mode ? (
          mode === 'thai-consonant-class' ? (
            <ConsonantsQuiz onPlayAgain={handlePlayAgain} />
          ) : (
            <Quiz mode={mode} onPlayAgain={handlePlayAgain} />
          )
        ) : (
          <StartScreen onStart={handleStart} />
        )} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
};

export default App;