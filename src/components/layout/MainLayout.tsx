import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import CommandPalette from '@/components/common/CommandPalette';
import { useTheme } from '@/core/contexts/ThemeContext';
import LiveChatPlayground from '@/features/chat/components/LiveChatPlayground';

const MainLayout: React.FC = () => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { primaryColor, isDarkMode } = useTheme();
  const location = useLocation();

  // Keyboard Shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic Mesh Gradient Style (Center Focused)
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#0f1115' : '#F9FAFB',
    backgroundImage: isDarkMode 
      ? `radial-gradient(circle at 50% 50%, ${primaryColor}15 0%, ${primaryColor}05 30%, transparent 60%)`
      : `radial-gradient(circle at 50% 50%, ${primaryColor}25 0%, ${primaryColor}05 25%, transparent 60%)`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover'
  };

  // Special layout for Playground (No padding on right side)
  const isPlayground = location.pathname === '/playground';

  return (
    <div className="flex h-screen w-full font-sans text-primary dark:text-white overflow-hidden transition-colors duration-500" style={backgroundStyle}>
      <Sidebar />
      
      {isPlayground ? (
         <div className="flex-1 h-full overflow-hidden">
             <LiveChatPlayground />
         </div>
      ) : (
        <main className="flex-1 flex flex-col h-full p-6 pl-0 overflow-hidden relative">
            {/* Inner container for right side content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 flex-shrink-0">
                    <Header 
                      onSearchClick={() => setIsPaletteOpen(true)}
                    />
                </div>
                
                <div className="flex-1 px-6 overflow-hidden pb-2 flex flex-col min-h-0">
                    <Outlet />
                </div>
            </div>
        </main>
      )}

      <CommandPalette 
          isOpen={isPaletteOpen} 
          onClose={() => setIsPaletteOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;