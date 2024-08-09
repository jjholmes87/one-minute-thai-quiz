
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { readXlsxFile } from '../utils';
import AnswerCard from './AnswerCard';
import '../App.css'; // Import the stylesheet

const Quiz = ({ mode, onPlayAgain }) => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [feedback, setFeedback] = useState('');
  const [highlightedChoice, setHighlightedChoice] = useState(null);
  const [gameOver, setGameOver] = useState(false); // Track if game is over
  const [isPaused, setIsPaused] = useState(false); // Add state to track if the game is paused
  const timerIntervalRef = useRef(null); // Add a reference to store the timer interval

  const rightSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  const setNewWord = useCallback((wordList) => {
    if (wordList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * wordList.length);
    const newWord = wordList[randomIndex];
    console.log("Selected new word:", newWord);

    setCurrentWord(newWord);

    const answerLanguage = mode === 'thai-to-english' ? 'English' : 'Thai';

    const newChoices = [newWord[answerLanguage]];
    while (newChoices.length < 4) {
      const randomChoice = wordList[Math.floor(Math.random() * wordList.length)][answerLanguage];
      if (!newChoices.includes(randomChoice)) {
        newChoices.push(randomChoice);
      }
    }

    const shuffledChoices = shuffleArray(newChoices);
    console.log("Choices:", shuffledChoices);
    setChoices(shuffledChoices);
    setHighlightedChoice(null); // Reset the highlighted choice
  }, [mode]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (choice) => {
    const correctAnswer = mode === 'thai-to-english' ? currentWord.English : currentWord.Thai;
    const questionWord = mode === 'thai-to-english' ? currentWord.Thai : currentWord.English;

    if (choice === correctAnswer) {
      setScore(score + 1);
      setTimer(timer + 10);
      setFeedback('Correct! +10 Seconds');
      if (rightSoundRef.current) {
        rightSoundRef.current.play();
      }
      setHighlightedChoice(null); // Reset the highlighted choice
      setNewWord(words);

      // Clear feedback after 5 seconds for correct answer
      setTimeout(() => setFeedback(''), 5000);
    } else {
      const newTimer = Math.max(timer - 10, 0); // Deduct 10 seconds but not below 0
      setScore(score - 1);
      setTimer(newTimer);
      setFeedback(`Incorrect! -10 Seconds. '${questionWord}' = '${correctAnswer}'`);
      if (wrongSoundRef.current) {
        wrongSoundRef.current.play(); // Play the wrong sound
      }
      setHighlightedChoice(correctAnswer);
      setIsPaused(true); // Pause the game
    }
  };

  const handleUnpause = () => {
    setIsPaused(false);
    setFeedback(''); // Clear feedback message
    setNewWord(words); // Set a new word when unpausing
  };

  const fetchWords = useCallback(async () => {
    try {
      const response = await fetch('/words.xlsx');
      const blob = await response.blob();
      const data = await readXlsxFile(blob);
      console.log("Fetched words:", data);
      setWords(data);
      setNewWord(data); // Set initial word
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }, [setNewWord]);

  useEffect(() => {
    fetchWords(); // Fetch words on component mount

    if (isPaused) {
      clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setGameOver(true); // Set game over state
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [isPaused, fetchWords]); // Add fetchWords to the dependency array

  useEffect(() => {
    if (gameOver) {
      if (gameOverSoundRef.current) {
        gameOverSoundRef.current.play();
      }
    }
  }, [gameOver]);

  const handlePlayAgain = () => {
    window.location.reload(); // Reload the page
  };

  if (gameOver) {
    return (
      <div className="quiz-container">
        <div className="game-over">
          Time's up! Your score: {score}
        </div>
        <button onClick={handlePlayAgain} className="start-screen-button">Play Again</button>
        <audio ref={gameOverSoundRef} src="/gameover.mp3"></audio>
      </div>
    );
  }

  if (isPaused) {
    if (wrongSoundRef.current) {
      wrongSoundRef.current.play(); // Play the wrong sound when paused
    }
    return (
      <div className="quiz-container">
        <div className="feedback incorrect">
          {feedback}
        </div>
        <button onClick={handleUnpause} className="start-screen-button">Continue</button>
        <audio ref={wrongSoundRef} src="/wrong.mp3"></audio>
      </div>
    );
  }

  // Apply styles directly inline
  const feedbackStyle = feedback.includes('Correct') 
    ? { color: 'green', border: '2px solid green', backgroundColor: '#e0ffe0', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }
    : { color: 'red', border: '2px solid red', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '5px', fontWeight: 'bold' };

  return (
    <div className="quiz-container">
      <h1>1 Minute Thai and English Quiz</h1>
      <div className="score-timer">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timer}</div>
      </div>
      {feedback && (
        <div style={feedbackStyle}>
          {feedback}
        </div>
      )}
      <div className="question-word">{mode === 'thai-to-english' ? currentWord.Thai : currentWord.English}</div>
      <div className="choices">
        {choices.map((choice, index) => (
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

export default Quiz;