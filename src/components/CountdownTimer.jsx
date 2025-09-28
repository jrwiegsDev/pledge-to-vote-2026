import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    // The 2026 Midterm Election Day is November 3rd, 2026
    const electionDay = new Date('2026-11-03T00:00:00');
    const difference = electionDay - new Date();
    
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Set up a timer that updates the countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      {Object.keys(timeLeft).length > 0 ? (
        <>
          <div className="countdown-item">
            <span>{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span>{timeLeft.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span>{timeLeft.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span>{timeLeft.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </>
      ) : (
        <span>The election is here!</span>
      )}
    </div>
  );
};

export default CountdownTimer;