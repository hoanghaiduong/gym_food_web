// src/features/setup/components/SetupSidebar.tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { STEPS } from '@/features/setup/constants'; // Tách array STEPS ra file constants

interface Props {
    currentStep: number;
    stepStatus: Record<number, string>;
    isDarkMode: boolean;
}

export const SetupSidebar: React.FC<Props> = ({ currentStep, stepStatus, isDarkMode }) => {
    return (
        <div className="w-full md:w-[280px] flex flex-col p-6 border-b md:border-b-0 md:border-r border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-black/20 relative transition-colors duration-300">
            <div className="mb-8">
                <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Weihu Setup</h1>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Configuration Wizard v2.5</p>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto hide-scrollbar">
                {STEPS.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id || (step.id === currentStep && stepStatus[step.id] === 'success');
                    return (
                        <div key={step.id} className={`relative p-3 rounded-xl border transition-all duration-300 flex items-center gap-3 group ${isActive ? 'bg-brand-lime border-brand-lime text-white shadow-lg shadow-brand-lime/30' : isCompleted ? isDarkMode ? 'bg-white/5 border-transparent text-gray-400' : 'bg-gray-100 border-transparent text-gray-500' : isDarkMode ? 'border-transparent text-gray-600' : 'border-transparent text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-white/20 text-white' : isCompleted ? 'bg-brand-lime/20 text-brand-lime' : isDarkMode ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-200 text-gray-400'}`}>
                                {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                            </div>
                            <div>
                                <p className={`text-sm font-bold`}>{step.title}</p>
                                <p className={`text-[10px] ${isActive ? 'text-white/80' : 'opacity-60'}`}>{step.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};