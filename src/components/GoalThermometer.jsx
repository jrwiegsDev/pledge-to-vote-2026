import React from 'react';

const GoalThermometer = ({ currentPledges, currentGoal }) => {
  // Calculate the percentage towards the current goal, ensuring it doesn't exceed 100%
  const percentage = Math.min((currentPledges / currentGoal) * 100, 100);

  return (
    <div className="thermometer-container">
      <div className="thermometer-labels">
        <span>{currentPledges.toLocaleString()} Pledged</span>
        <span>Goal: {currentGoal.toLocaleString()}</span>
      </div>
      <div className="thermometer-bar">
        <div 
          className="thermometer-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GoalThermometer;