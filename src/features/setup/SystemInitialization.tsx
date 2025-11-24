import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Loader2, FastForward } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { useSetupWizard } from '@/features/setup/hooks/useSetupWizard';
import { STEPS } from '@/features/setup/constants';

// Imports Sub-components
import { ThemeToggle } from '@/features/setup/components/ui/ThemeToggle';
import { SetupSidebar } from '@/features/setup/components/SetupSidebar';
import { SetupConsole } from '@/features/setup/components/SetupConsole';
import { Step0SecureBoot } from '@/features/setup/components/steps/Step0_SecureBoot';
import { Step1Network } from '@/features/setup/components/steps/Step1_Network';
import { Step2Database } from '@/features/setup/components/steps/Step2_Database';
import { Step3Vector } from '@/features/setup/components/steps/Step3_Vector';
import { Step4Migration } from '@/features/setup/components/steps/Step4_Migration';
import { Step5Admin } from '@/features/setup/components/steps/Step5_Admin';
import { Step6LLM } from '@/features/setup/components/steps/Step6_LLM';
import { Step7General } from '@/features/setup/components/steps/Step7_General';
import { ResetModal } from '@/features/setup/components/ResetModal';

const SystemInitialization: React.FC = () => {
  const { isDarkMode, toggleDarkMode, primaryColor } = useTheme();
  
  // Custom Hook Logic
  const wizard = useSetupWizard();
  const { 
      isCheckingStatus, // <--- BIẾN QUAN TRỌNG ĐỂ CHẶN NHÁY MÀN HÌNH
      currentStep, setCurrentStep, isLoading, logs, 
      finishSetup, quickFinishSetup, canGoNext,
      dbInitStatus, checkDbSchemaStatus, addLog
  } = wizard;

  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Auto-check DB status logic (Only inside Step 4)
  useEffect(() => {
      if (currentStep === 4 && dbInitStatus !== 'migrated' && ['checking', 'dirty', 'clean'].includes(dbInitStatus)) {
          checkDbSchemaStatus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, dbInitStatus]);

  // --- Render Step Content Switcher ---
  const renderStepContent = () => {
      switch (currentStep) {
          case 1: return <Step1Network wizard={wizard} isDarkMode={isDarkMode} />;
          case 2: return <Step2Database wizard={wizard} isDarkMode={isDarkMode} />;
          case 3: return <Step3Vector wizard={wizard} isDarkMode={isDarkMode} />;
          case 4: return <Step4Migration 
                            dbInitStatus={dbInitStatus} 
                            isLoading={isLoading} 
                            runMigration={wizard.runMigration} 
                            skipMigration={wizard.skipMigration} 
                            onShowResetModal={() => setShowResetModal(true)}
                            // Props mới cho Phase B (Admin) trong Step 4
                            isMigrationDone={wizard.isMigrationDone}
                            adminForm={wizard.adminForm}
                            setAdminForm={wizard.setAdminForm}
                            createAdmin={wizard.createAdmin}
                            addLog={wizard.addLog}
                            setCurrentStep={wizard.setCurrentStep}
                         />;
          case 5: return <Step5Admin wizard={wizard} isDarkMode={isDarkMode} />;
          case 6: return <Step6LLM wizard={wizard} isDarkMode={isDarkMode} />;
          case 7: return <Step7General wizard={wizard} isDarkMode={isDarkMode} />;
          default: return null;
      }
  };

  // --- MÀN HÌNH CHỜ KHI CHECK STATUS (FIX LỖI NHÁY) ---
  if (isCheckingStatus) {
      return (
          <div className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors ${isDarkMode ? 'bg-[#030712]' : 'bg-gray-50'}`}>
              <Loader2 size={48} className="animate-spin text-brand-lime mb-4" />
              <p className={`font-mono animate-pulse ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Synchronizing Setup State...
              </p>
          </div>
      );
  }

  // --- Step 0: Login Screen ---
  if (currentStep === 0) {
      return (
        <Step0SecureBoot 
            wizard={wizard} 
            isDarkMode={isDarkMode} 
            primaryColor={primaryColor} 
        />
      );
  }

  // --- Main Layout ---
  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
        
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-500" style={{ backgroundColor: `${primaryColor}20` }} />
        </div>

        <div className="relative w-full max-w-6xl h-[800px] flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-500">
            
            {/* LEFT PANEL: Sidebar */}
            <SetupSidebar 
                currentStep={currentStep} 
                stepStatus={wizard.stepStatus} 
                isDarkMode={isDarkMode} 
            />

            {/* RIGHT PANEL: Content */}
            <div className="flex-1 flex flex-col relative h-full">
                {/* Theme Toggle Button */}
                <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                
                <div className="flex-1 overflow-y-auto transition-colors duration-500 relative">
                    <div className="p-8 pb-24 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300 min-h-full flex flex-col">
                        <div className="flex-1 space-y-6">
                            <div className="mb-8">
                                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{STEPS[currentStep-1]?.title}</h2>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{STEPS[currentStep-1]?.description}</p>
                            </div>
                            
                            {/* DYNAMIC CONTENT */}
                            {renderStepContent()}
                        </div>

                        {/* Navigation Footer */}
                        <div className={`mt-8 pt-6 border-t flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <button onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 1 || isLoading} className={`flex items-center gap-2 text-sm font-bold transition-colors disabled:opacity-30 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button onClick={() => currentStep < 7 ? setCurrentStep(p => p + 1) : finishSetup()} disabled={!canGoNext() || isLoading} className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all text-white ${!canGoNext() || isLoading ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-105'}`}>
                                {currentStep === 7 ? (isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Finish Setup') : 'Next Step'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Console Panel */}
                <SetupConsole 
                    logs={logs} 
                    isMinimized={isConsoleMinimized} 
                    onToggle={() => setIsConsoleMinimized(!isConsoleMinimized)} 
                    isDarkMode={isDarkMode} 
                />
            </div>
        </div>

        {/* Dev Quick Finish */}
        {currentStep > 0 && currentStep < 7 && (
            <div className="absolute bottom-8 right-8 z-50">
                <button onClick={quickFinishSetup} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 bg-white/80 border transition-all">
                    <FastForward size={14} /> Skip (Dev)
                </button>
            </div>
        )}

        {/* Reset Modal */}
        {showResetModal && (
            <ResetModal 
                onCancel={() => setShowResetModal(false)} 
                onConfirm={async () => { setShowResetModal(false); await wizard.runMigration(true); }} 
            />
        )}
    </div>
  );
};

export default SystemInitialization;