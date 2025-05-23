import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

/**
 * CountdownTimer - A performant React countdown timer component
 * 
 * @param {Object} props Component props
 * @param {string|Date} props.endDate The target date to count down to (ISO string or Date object)
 * @param {function} [props.onComplete] Optional callback function to run when countdown completes
 * @param {boolean} [props.showSeconds=true] Whether to display seconds
 * @param {string} [props.className] Optional CSS class name for styling
 * @return {JSX.Element} The rendered countdown component
 */
const CountdownTimer = memo(({ 
  endDate, 
  onComplete, 
  showSeconds = true,
  className = '',
}) => {
  // Use refs to minimize re-renders and store the timer ID
  const timerRef = useRef(null);
  const endTimeRef = useRef(new Date(endDate).getTime());
  
  // State for time units
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  });

  // Calculate the time difference between now and end date
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const difference = endTimeRef.current - now;
    
    // If countdown is complete
    if (difference <= 0) {
      clearInterval(timerRef.current);
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true
      });
      
      // Call onComplete callback if provided
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
      
      return;
    }
    
    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    setTimeLeft({
      days,
      hours,
      minutes,
      seconds,
      isComplete: false
    });
  }, [onComplete]);

  // Set up the timer when component mounts
  useEffect(() => {
    // Validate endDate
    if (!endDate || isNaN(new Date(endDate).getTime())) {
      console.error('CountdownTimer: Invalid endDate provided');
      return;
    }
    
    // Update the end time ref
    endTimeRef.current = new Date(endDate).getTime();
    
    // Calculate initial time
    calculateTimeLeft();
    
    // Use requestAnimationFrame for smoother updates
    let frameId;
    let lastUpdate = Date.now();
    
    // Use a less frequent interval (1000ms) to reduce CPU usage
    timerRef.current = setInterval(() => {
      // Only update if at least 1 second has passed
      const now = Date.now();
      if (now - lastUpdate >= 1000) {
        lastUpdate = now;
        calculateTimeLeft();
      }
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(frameId);
    };
  }, [endDate, calculateTimeLeft]);

  // Pad numbers with leading zero if needed
  const padWithZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  // Render the countdown display
  return (
    <div className={`countdown-timer ${className}`}>
      {!timeLeft.isComplete ? (
        <div className="countdown-timer__content">
          <div className="countdown-timer__item">
            <span className="countdown-timer__value">{padWithZero(timeLeft.days)}</span>
            <span className="countdown-timer__label">Days</span>
          </div>
          <div className="countdown-timer__item">
            <span className="countdown-timer__value">{padWithZero(timeLeft.hours)}</span>
            <span className="countdown-timer__label">Hours</span>
          </div>
          <div className="countdown-timer__item">
            <span className="countdown-timer__value">{padWithZero(timeLeft.minutes)}</span>
            <span className="countdown-timer__label">Minutes</span>
          </div>
          {showSeconds && (
            <div className="countdown-timer__item">
              <span className="countdown-timer__value">{padWithZero(timeLeft.seconds)}</span>
              <span className="countdown-timer__label">Seconds</span>
            </div>
          )}
        </div>
      ) : (
        <div className="countdown-timer__complete">Countdown complete!</div>
      )}
    </div>
  );
});

/**
 * Basic CSS for the countdown timer 
 * This can be overridden with custom styles in WordPress
 */
const styles = `
.countdown-timer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.countdown-timer__content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.countdown-timer__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.countdown-timer__value {
  font-size: 1.5rem;
  font-weight: bold;
}

.countdown-timer__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.countdown-timer__complete {
  text-align: center;
  font-weight: bold;
}

@media (max-width: 480px) {
  .countdown-timer__content {
    gap: 0.5rem;
  }
  
  .countdown-timer__item {
    min-width: 50px;
  }
  
  .countdown-timer__value {
    font-size: 1.2rem;
  }
  
  .countdown-timer__label {
    font-size: 0.7rem;
  }
}
`;

// Add styles to the document head when component is first used
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerText = styles;
  document.head.appendChild(styleElement);
}

// Example usage:
// <CountdownTimer endDate="2023-12-31T23:59:59" onComplete={() => alert('Countdown finished!')} />

export default CountdownTimer;