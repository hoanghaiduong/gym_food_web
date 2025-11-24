import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeToggle: React.FC<Props> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button 
      onClick={toggleDarkMode} 
      className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-200/50 dark:bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/30 transition-colors shadow-lg group"
    >
      {isDarkMode ? (
        <Moon size={20} className="text-white" />
      ) : (
        <Sun size={20} className="text-yellow-600" />
      )}
    </button>
  );
};