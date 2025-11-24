import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Loader2, Terminal } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput'; // Import từ file bạn đã tách
import { useSetupWizard } from '../../hooks/useSetupWizard';

interface Props {
    wizard:  ReturnType<typeof useSetupWizard>
    isDarkMode: boolean;
    primaryColor: string;
}

export const Step0SecureBoot: React.FC<Props> = ({ wizard, isDarkMode, primaryColor }) => {
    const [adminKey, setAdminKey] = useState('');
    const [authError, setAuthError] = useState(false);
    const consoleEndRef = useRef<HTMLDivElement>(null);

    const handleSecureBoot = async () => {
        if (adminKey.length < 6) {
            setAuthError(true);
            wizard.addLog('ERROR', 'Validation Failed: Key must be at least 6 characters.');
            setTimeout(() => setAuthError(false), 500);
            return;
        }
        await wizard.initAdmin(adminKey);
    };

    // Auto-scroll logic cho mini console
    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [wizard.logs]);

    return (
        <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 transition-colors duration-500 relative ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] transition-colors duration-500 opacity-20" style={{ backgroundColor: primaryColor }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-white/10 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-brand-lime/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(132,204,22,0.3)]">
                        <ShieldCheck size={40} className="text-brand-lime drop-shadow-md" />
                    </div>
                    <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Secure Setup</h1>
                    <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enter the <strong>Master Admin Key</strong> to unlock the initialization wizard. This key is set in your backend environment variables.
                    </p>
                    <div className={`space-y-4 text-left ${authError ? 'animate-shake' : ''}`}>
                        <GlassInput 
                            label="Master Admin Key" 
                            type="password" 
                            placeholder="e.g. sk-admin-..." 
                            value={adminKey} 
                            onChange={setAdminKey} 
                            isDarkMode={isDarkMode} 
                            disabled={wizard.isLoading} 
                        />
                        <button onClick={handleSecureBoot} disabled={wizard.isLoading || !adminKey} className={`w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${wizard.isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-lime hover:bg-brand-lime-dark hover:scale-[1.02] shadow-brand-lime/30'}`}>
                            {wizard.isLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            {wizard.isLoading ? 'Verifying Key...' : 'Unlock & Start Setup'}
                        </button>
                    </div>
                </div>

                {/* Mini Console */}
                <div className="mt-6 bg-[#0F172A] rounded-xl border border-gray-800 p-4 font-mono text-[10px] h-48 overflow-y-auto hide-scrollbar shadow-inner opacity-90">
                    <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-2">
                        <Terminal size={12} className="text-brand-lime" />
                        <span className="text-gray-400">security_audit.log</span>
                    </div>
                    <div className="space-y-1.5">
                        {wizard.logs.map((log: any) => (
                            <div key={log.id} className="flex items-start gap-2">
                                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                                <span className={log.type === 'ERROR' ? 'text-red-500' : log.type === 'SUCCESS' ? 'text-brand-lime' : log.type === 'WARNING' ? 'text-yellow-500' : log.type === 'SQL' ? 'text-blue-400' : 'text-gray-400'}>{log.message}</span>
                            </div>
                        ))}
                        <div ref={consoleEndRef} />
                    </div>
                </div>
            </div>
            <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .animate-shake { animation: shake 0.3s ease-in-out; }`}</style>
        </div>
    );
};