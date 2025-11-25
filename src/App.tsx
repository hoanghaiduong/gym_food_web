
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/features/dashboard/components/DashboardStats';
import KnowledgeBase from '@/features/knowledge-base/components/KnowledgeBase';
import BotConfig from '@/features/bot-config/components/BotConfig';
import ThemeStudio from '@/features/settings/components/ThemeStudio';
import SystemLogs from '@/features/logs/components/SystemLogs';
import SystemSettings from '@/features/settings/components/SystemSettings';
import LoginScreen from '@/features/auth/components/LoginScreen';
import SystemInitialization from '@/features/setup/SystemInitialization';
import LiveChatPlayground from '@/features/chat/components/LiveChatPlayground';
import SetupGuard from '@/components/SetupGuard';
import LoadingBar from '@/components/ui/LoadingBar';
import ToastContainer from '@/components/ui/ToastContainer';
import { ThemeProvider } from '@/core/contexts/ThemeContext';
import { SidebarProvider } from '@/core/contexts/SidebarContext';
import { UIProvider } from '@/core/contexts/UIContext';
import UserLayout from '@/components/layout/UserLayout';
import UserChatPage from '@/features/public/components/UserChatPage';
import RegisterScreen from './features/auth/components/RegisterScreen';
import ForgotPasswordScreen from './features/auth/components/ForgotPasswordScreen';

const App: React.FC = () => {
  return (
    <HashRouter>
     
            
            <SetupGuard>
                 <Routes>
                    {/* Public User Routes (Root) */}
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<UserChatPage />} />
                    </Route>

                    {/* Public Auth Routes */}
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/register" element={<RegisterScreen />} />
                    <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                    
                    {/* System Setup Route */}
                    <Route path="/setup" element={<SystemInitialization />} />

                    {/* Protected Admin Routes */}
                    <Route element={<MainLayout />}>
                        <Route path="dashboard" element={<DashboardStats />} />
                        <Route path="knowledge" element={<KnowledgeBase />} />
                        <Route path="bot-config" element={<BotConfig />} />
                        <Route path="theme-studio" element={<ThemeStudio />} />
                        <Route path="logs" element={<SystemLogs />} />
                        <Route path="settings" element={<SystemSettings />} />
                        {/* Playground is handled inside MainLayout */}
                        <Route path="playground" element={<LiveChatPlayground />} /> 
                    </Route>
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </SetupGuard>
         
    </HashRouter>
  );
};

export default App;
