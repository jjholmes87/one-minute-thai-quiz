import React, { useState, useEffect } from 'react';
import { readXlsxFile } from '../utils';
import AnswerCard from './AnswerCard';

const Quiz = () => {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState({});
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);

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
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (choice) => {
    if (choice === currentWord.English) {
      setScore(score + 1);
    } else {
      setScore(score - 1);
    }
    setNewWord(words);
  };

  if (timer === 0) {
    return <div>Game Over! Your score: {score}</div>;
  }

  return (
    <div>
      <h1>1 Minute Thai and English Quiz</h1>
      <div>Score: {score}</div>
      <div>Time: {timer}</div>
      <div>{currentWord.Thai}</div>
      <div className="choices">
        {choices.map((choice, index) => (
          <AnswerCard key={index} choice={choice} onClick={() => handleAnswerClick(choice)} />
        ))}
      </div>
    </div>
  );
};

export default Quiz;
