import React from 'react';
import { Outlet } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';

const UserLayout: React.FC = () => {
  const { primaryColor, isDarkMode, toggleDarkMode } = useTheme();

  // Dynamic Mesh Gradient Style
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#030712' : '#F9FAFB',
    backgroundImage: isDarkMode 
      ? `radial-gradient(circle at 50% 40%, ${primaryColor}15 0%, ${primaryColor}05 40%, transparent 70%)`
      : `radial-gradient(circle at 50% 40%, ${primaryColor}25 0%, ${primaryColor}05 30%, transparent 60%)`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover'
  };

  return (
    <div className="min-h-screen w-full font-sans text-gray-900 dark:text-white transition-colors duration-500 flex flex-col" style={backgroundStyle}>
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-white/50 dark:bg-gray-950/50 backdrop-blur-md border-b border-white/10 dark:border-white/5">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#84CC16] rounded-xl flex items-center justify-center shadow-lg shadow-[#84CC16]/30">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">Gym Food</span>
        </div>

        {/* Actions - Chỉ giữ lại Theme Toggle */}
        <div className="flex items-center gap-4">
            <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
            >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 relative overflow-hidden h-screen">
          <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;