import React, { useState, useEffect } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  onComplete?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  decimals = 0,
  onComplete
}) => {
  const [current, setCurrent] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    const increment = (end - start) / (duration / 16); // ~60fps
    let currentValue = start;
    
    const timer = setInterval(() => {
      currentValue += increment;
      
      if (
        (increment > 0 && currentValue >= end) ||
        (increment < 0 && currentValue <= end)
      ) {
        currentValue = end;
        clearInterval(timer);
        onComplete?.();
      }
      
      setCurrent(currentValue);
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, start, end, duration, onComplete]);

  return <span>{current.toFixed(decimals)}</span>;
};

export default CountUp;