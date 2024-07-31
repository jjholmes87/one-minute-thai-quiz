// src/components/Quiz.js

import React, { useState, useEffect, useRef } from 'react';
import { readXlsxFile } from '../utils';
import AnswerCard from './AnswerCard';
import '../App.css'; // Import the stylesheet

const Quiz = ({ mode }) => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [feedback, setFeedback] = useState('');
  const [highlightedChoice, setHighlightedChoice] = useState(null);

  const rightSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/words.xlsx');
        const blob = await response.blob();
        const data = await readXlsxFile(blob);
        console.log("Fetched words:", data);
        setWords(data);
        setNewWord(data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      gameOverSoundRef.current.play();
    }
  }, [timer]);

  const setNewWord = (wordList) => {
    if (wordList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * wordList.length);
    const newWord = wordList[randomIndex];
    console.log("Selected new word:", newWord);

    setCurrentWord(newWord);

    const newChoices = [newWord.English];
    while (newChoices.length < 4) {
      const randomChoice = wordList[Math.floor(Math.random() * wordList.length)].English;
      if (!newChoices.includes(randomChoice)) {
        newChoices.push(randomChoice);
      }
    }

    const shuffledChoices = shuffleArray(newChoices);
    console.log("Choices:", shuffledChoices);
    setChoices(shuffledChoices);
    setHighlightedChoice(null); // Reset the highlighted choice
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (choice) => {
    const correctAnswer = currentWord.English;

    if (choice === correctAnswer) {
      setScore(score + 1);
      setTimer(timer + 10);
      setFeedback('ถูกต้อง! +10 วินาที');
      rightSoundRef.current.play();
      setHighlightedChoice(null); // Reset the highlighted choice
    } else {
      const newTimer = Math.max(timer - 10, 0); // Deduct 10 seconds but not below 0
      setScore(score - 1);
      setTimer(newTimer);
      setFeedback(`ผิดพลาด! คำตอบที่ถูกต้องคือ "${correctAnswer}". ลดเวลา 10 วินาที`);
      wrongSoundRef.current.play();
      setHighlightedChoice(correctAnswer);
    }
    setNewWord(words);
  };

  useEffect(() => {
    const feedbackTimeout = setTimeout(() => setFeedback(''), 5000); // Show feedback for 5 seconds
    return () => clearTimeout(feedbackTimeout);
  }, [feedback]);

  if (timer === 0) {
    return (
      <div className="quiz-container">
        <div className="game-over">หมดเวลา! คะแนนของคุณ: {score}</div>
        <audio ref={gameOverSoundRef} src="/gameover.mp3"></audio>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>การทดสอบภาษาไทย - อังกฤษ 1 นาที</h1>
      <div className="score-timer">
        <div className="score">คะแนน: {score}</div>
        <div className="timer">เวลา: {timer}</div>
      </div>
      {feedback && (
        <div className={`feedback ${feedback.includes('ถูกต้อง') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}
      <div>{currentWord.Thai}</div>
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
