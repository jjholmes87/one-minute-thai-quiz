import React from 'react';
import '../App.css'; // Import the stylesheet

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div className="header-container">
        <h1>Learn Thai with games</h1>
        <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="Logo" className="logo" />
      </div>
      <h2>Vocabulary</h2>
      <button className="start-button" onClick={() => onStart('thai-to-english')}>Thai ➡️ English</button>
      <button className="start-button" onClick={() => onStart('english-to-thai')}>English ➡️ Thai</button>
      <h2>Consonants</h2>
      <button className="start-button" onClick={() => onStart('thai-consonant-class')}>Classes</button>
      <h2>Practice</h2>
      <button className="start-button" onClick={() => onStart('speed-typing')}>Typing</button>
    </div>
  );
};

export default StartScreen;