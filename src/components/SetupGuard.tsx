import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';

interface SetupGuardProps {
  children: React.ReactNode;
}

const SetupGuard: React.FC<SetupGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSystem = async () => {
      try {
        // 1. Check System Status (Prioritize LocalStorage for performance/demo)
        const localSetupStatus = localStorage.getItem('system_setup_status');
        const hasAuthToken = !!localStorage.getItem('x-admin-key') || !!localStorage.getItem('access_token');
        
        const isSetupComplete = localSetupStatus === 'completed';
        const path = location.pathname;

        // SCENARIO 1: SYSTEM NOT INITIALIZED
        if (!isSetupComplete) {
            // Must go to setup, unless already there
            if (path !== '/setup') {
                navigate('/setup', { replace: true });
            }
        } 
        // SCENARIO 2: SYSTEM INITIALIZED
        else {
            // If trying to access setup page when already done -> Login
            if (path === '/setup') {
                 navigate('/login', { replace: true });
            }
            // If trying to access protected routes without auth -> Login
            else if (!hasAuthToken) {
                 const isPublicRoute = path.startsWith('/login') || 
                                       path.startsWith('/register') || 
                                       path.startsWith('/forgot-password');
                 
                 if (!isPublicRoute) {
                     navigate('/login', { replace: true });
                 }
            }
            // If logged in and trying to access auth pages -> Dashboard
            else if (hasAuthToken) {
                 const isAuthRoute = path.startsWith('/login') || 
                                     path.startsWith('/register') || 
                                     path.startsWith('/forgot-password');
                 
                 if (isAuthRoute) {
                     navigate('/dashboard', { replace: true });
                 }
            }
        }
      } catch (error) {
        console.error("Guard Error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSystem();
  }, [navigate, location.pathname]);

  // Loading Screen
  if (isChecking) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
         <Loader2 size={48} className="text-brand-lime animate-spin mb-4" />
      </div>
    );
  }

  return <>{children}</>;
};

export default SetupGuard;