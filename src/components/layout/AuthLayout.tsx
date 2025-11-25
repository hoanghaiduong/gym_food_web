import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { isDarkMode, primaryColor } = useTheme();
  const { error: reduxError } = useSelector((state: RootState) => state.auth);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 relative ${
        isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'
      }`}
    >
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[100px] transition-colors duration-500 opacity-20"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/40 dark:border-white/10 text-center transition-all">
          {/* Logo */}
          <div className="w-16 h-16 bg-brand-lime-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-lime/20">
            <ShieldCheck size={32} className="text-brand-lime-dark" />
          </div>

          {/* Global Error Alert */}
          {reduxError && (
            <div className="mb-6 flex items-start gap-2 text-left text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50 animate-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
              <span>{reduxError}</span>
            </div>
          )}

          {/* Title Header */}
          <div className="mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-gray-400 dark:text-gray-600">
          Phát Triển Bởi Đỗ Khắc Đức © 2025
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;