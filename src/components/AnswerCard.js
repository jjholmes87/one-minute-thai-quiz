import React from 'react';
import '../App.css'; // Import the stylesheet

const AnswerCard = ({ choice, onClick }) => {
  return (
    <div className="answer-card" onClick={onClick}>
      {choice}
    </div>
  );
};

export default AnswerCard;
