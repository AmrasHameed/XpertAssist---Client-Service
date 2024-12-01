import React, { useEffect, useState, useRef } from 'react';
import './JobTimer.css';

interface JobTimerProps {
  isJobActive: boolean;
}

const JobTimer: React.FC<JobTimerProps> = ({ isJobActive }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentTime = Date.now();
    const storedStartTime = localStorage.getItem('jobStartTime');

    if (storedStartTime && isJobActive) {
      const startTime = parseInt(storedStartTime, 10);
      const timeElapsed = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(timeElapsed);
    }

    const startTimer = () => {
      const existingStartTime = localStorage.getItem('jobStartTime');

      // Only set a new start time if one does not already exist
      const startTime = existingStartTime
        ? parseInt(existingStartTime, 10)
        : Date.now();
      if (!existingStartTime) {
        localStorage.setItem('jobStartTime', startTime.toString());
      }

      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsedTime = Math.floor((now - startTime) / 1000);
        setElapsedTime(newElapsedTime);
      }, 1000);
    };

    const stopTimer = () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };

    if (isJobActive) {
      if (!timerIntervalRef.current) {
        startTimer();
      }
    } else {
      stopTimer();
      localStorage.removeItem('jobStartTime'); // Optional: Clear start time when job is inactive
      setElapsedTime(0); // Reset elapsed time when job becomes inactive
    }

    return () => {
      stopTimer();
    };
  }, [isJobActive]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${
      secs < 10 ? '0' : ''
    }${secs}`;
  };

  return (
    <div className="container1">
      <div className="rotating-wrapper">
        <span className="blur-circle blur-1"></span>
        <span className="blur-circle blur-2"></span>
        <span className="blur-circle blur-3"></span>
        <span className="blur-circle blur-4"></span>
        <div className="inner-circle"></div>
      </div>
      <p className="static-text font-bold text-indigo-600">
        {formatTime(elapsedTime)}
      </p>
    </div>
  );
};

export default JobTimer;
