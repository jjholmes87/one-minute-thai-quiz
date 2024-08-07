// src/components/StartScreen.js
import React from 'react';
import '../App.css'; // Import the stylesheet

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1>One Minute Thai Quiz</h1>
      <button className="start-button" onClick={() => onStart('thai-to-english')}>Thai ➡️ English</button>
      <button className="start-button" onClick={() => onStart('english-to-thai')}>English ➡️ Thai</button>
      <button className="start-button" onClick={() => onStart('thai-consonant-class')}>Thai Consonant Class</button>
    </div>
  );
};

export default StartScreen;