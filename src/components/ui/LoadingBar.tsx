import React, { useEffect, useState } from 'react';
import { useUI } from '@/core/contexts/UIContext';

const LoadingBar: React.FC = () => {
  const { isLoading } = useUI();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      // Trickle animation: fast at first, slows down, never reaches 100% until stopped
      interval = setInterval(() => {
        setProgress((prev) => {
          const remaining = 90 - prev;
          if (remaining <= 0) return 90;
          // Add a random small amount relative to remaining distance
          const increment = Math.max(Math.random() * (remaining / 5), 0.5);
          return prev + increment;
        });
      }, 200);
    } else {
      // Complete the bar
      if (isVisible) {
        setProgress(100);
        // Wait for transition to finish before hiding
        setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 400); 
      }
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      {/* Progress Fill */}
      <div 
        className="h-full bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 shadow-[0_0_10px_#84CC16] transition-all ease-out duration-300"
        style={{ width: `${progress}%` }}
      />
      
      {/* Glowing Head */}
      <div 
        className="absolute top-0 right-0 h-1 w-[100px] bg-gradient-to-r from-transparent to-white opacity-50 shadow-[0_0_10px_#fff]"
        style={{ 
            left: `calc(${progress}% - 100px)`,
            display: progress === 100 ? 'none' : 'block'
        }} 
      />
    </div>
  );
};

export default LoadingBar;