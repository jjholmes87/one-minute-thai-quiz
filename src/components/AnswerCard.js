import React from 'react';

const AnswerCard = ({ choice, onClick }) => {
  return (
    <div className="answer-card" onClick={onClick}>
      {choice}
    </div>
  );
};

export default AnswerCard;
