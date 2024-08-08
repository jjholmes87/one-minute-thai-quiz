import React, { useState, useEffect, useRef, useCallback } from 'react';
import AnswerCard from './AnswerCard';
import '../App.css'; // Import the stylesheet

const consonantClasses = {
  mid: ['ก', 'จ', 'ฎ', 'ฏ', 'ด', 'ต', 'บ', 'ป', 'อ'],
  high: ['ข', 'ฃ', 'ฉ', 'ฐ', 'ถ', 'ผ', 'ฝ', 'ศ', 'ษ', 'ส', 'ห'],
  low: ['ค', 'ฅ', 'ฆ', 'ง', 'ช', 'ซ', 'ฌ', 'ญ', 'ฑ', 'ฒ', 'ณ', 'ท', 'ธ', 'น', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ฬ', 'ฮ']
};

const getRandomConsonant = () => {
  const allConsonants = [...consonantClasses.mid, ...consonantClasses.high, ...consonantClasses.low];
  const randomConsonant = allConsonants[Math.floor(Math.random() * allConsonants.length)];
  return randomConsonant;
};

const getConsonantClass = (consonant) => {
  if (consonantClasses.mid.includes(consonant)) return 'mid';
  if (consonantClasses.high.includes(consonant)) return 'high';
  if (consonantClasses.low.includes(consonant)) return 'low';
  return null;
};

const ConsonantsQuiz = ({ onPlayAgain }) => {
  const [currentConsonant, setCurrentConsonant] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [highlightedChoice, setHighlightedChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const rightSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  const setNewConsonant = useCallback(() => {
    const newConsonant = getRandomConsonant();
    setCurrentConsonant(newConsonant);
    setHighlightedChoice(null);
  }, []);

  const handleAnswerClick = (choice) => {
    const correctAnswer = getConsonantClass(currentConsonant);
    if (choice === correctAnswer) {
      setScore(score + 1);
      setFeedback('Correct!');
      if (rightSoundRef.current) {
        rightSoundRef.current.play();
      }
      setHighlightedChoice(null);
      setNewConsonant();

      setTimeout(() => setFeedback(''), 5000);
    } else {
      setScore(score - 1);
      setFeedback(`Incorrect! '${currentConsonant}' = '${correctAnswer}'`);
      if (wrongSoundRef.current) {
        wrongSoundRef.current.play();
      }
      setHighlightedChoice(correctAnswer);
      setNewConsonant(); // Move to the next question

      setTimeout(() => setFeedback(''), 5000); // Clear feedback after 5 seconds
    }
  };

  useEffect(() => {
    setNewConsonant();
  }, [setNewConsonant]);

  useEffect(() => {
    if (gameOver) {
      if (gameOverSoundRef.current) {
        gameOverSoundRef.current.play();
      }
    }
  }, [gameOver]);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  if (gameOver) {
    return (
      <div className="quiz-container">
        <div className="game-over">
          Game Over! Your score: {score}
        </div>
        <button onClick={handlePlayAgain} className="start-screen-button">Play Again</button>
        <audio ref={gameOverSoundRef} src="/gameover.mp3"></audio>
      </div>
    );
  }

  const feedbackStyle = feedback.includes('Correct') 
    ? { color: 'green', border: '2px solid green', backgroundColor: '#e0ffe0', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }
    : { color: 'red', border: '2px solid red', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '5px', fontWeight: 'bold' };

  return (
    <div className="quiz-container">
      <h1>1 Minute Thai Consonant Class Quiz</h1>
      <div className="score-timer">
        <div className="score">Score: {score}</div>
      </div>
      {feedback && (
        <div style={feedbackStyle}>
          {feedback}
        </div>
      )}
      <div className="consonant-display">{currentConsonant}</div>
      <div className="choices">
        {['mid', 'high', 'low'].map((choice, index) => (
          <AnswerCard
            key={index}
            choice={choice}
            onClick={() => handleAnswerClick(choice)}
            highlight={choice === highlightedChoice}
          />
        ))}
      </div>
      <audio ref={rightSoundRef} src="/right.mp3"></audio>
      <audio ref={wrongSoundRef} src="/wrong.mp3"></audio>
    </div>
  );
};

export default ConsonantsQuiz;