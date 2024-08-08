import React, { useState, useEffect, useRef, useCallback } from 'react';
import readXlsxFile from 'read-excel-file';
import '../App.css';

const SpeedTypingGame = ({ onPlayAgain }) => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const timerIntervalRef = useRef(null);
  const rightSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null); // Add reference for game over sound

  const fetchWords = useCallback(async () => {
    try {
      const response = await fetch('/words.xlsx');
      const blob = await response.blob();
      const data = await readXlsxFile(blob);
      console.log("Raw data from Excel:", data); // Log raw data for debugging
      const wordsList = data.slice(1).map((row) => row[2]).filter(word => typeof word === 'string');
      console.log("Processed words list:", wordsList);
      setWords(wordsList);
      setNewWord(wordsList);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }, [setNewWord]);

  const setNewWord = useCallback((wordList) => {
    if (wordList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const newWord = wordList[randomIndex];
    console.log("New word:", newWord);
    setCurrentWord(newWord);
    setTypedWord('');
  }, []);

  useEffect(() => {
    fetchWords();
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setGameOver(true);
          if (gameOverSoundRef.current) {
            gameOverSoundRef.current.play(); // Play game over sound
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [fetchWords]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setTypedWord(value);
    if (value === currentWord) {
      setScore(score + 1);
      if (rightSoundRef.current) {
        rightSoundRef.current.play();
      }
      setNewWord(words);
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  if (gameOver) {
    return (
      <div className="quiz-container">
        <div className="game-over">Time's up! Your score: {score}</div>
        <button onClick={handlePlayAgain} className="start-screen-button">
          Play Again
        </button>
        <audio ref={rightSoundRef} src="/right.mp3"></audio>
        <audio ref={gameOverSoundRef} src="/gameover.mp3"></audio> {/* Add game over sound */}
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>Speed Typing Game</h1>
      <div className="score-timer">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timer}</div>
      </div>
      <div className="current-word">{currentWord}</div>
      <input
        type="text"
        value={typedWord}
        onChange={handleInputChange}
        className="typing-input"
        autoFocus
      />
      <audio ref={rightSoundRef} src="/right.mp3"></audio>
      <audio ref={gameOverSoundRef} src="/gameover.mp3"></audio> {/* Add game over sound */}
    </div>
  );
};

export default SpeedTypingGame;