import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput';

interface Props { wizard: any; isDarkMode: boolean; }

export const Step5Admin: React.FC<Props> = ({ wizard, isDarkMode }) => {
    const { adminForm, setAdminForm, createAdmin, isLoading, addLog, setCurrentStep } = wizard;

    const handleCreateAdminMock = async () => {
        if (!adminForm.username || !adminForm.email || !adminForm.password) return;
        if (adminForm.password !== adminForm.confirmPassword) {
            addLog('ERROR', 'Passwords do not match');
            return;
        }
        
        const success = await createAdmin();
        if (success) {
            setTimeout(() => setCurrentStep(6), 500);
        }
    }

    return (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Full Name" placeholder="John Doe" value={adminForm.fullName} onChange={(v) => setAdminForm({...adminForm, fullName: v})} isDarkMode={isDarkMode} />
                <GlassInput label="Username" placeholder="admin" value={adminForm.username} onChange={(v) => setAdminForm({...adminForm, username: v})} isDarkMode={isDarkMode} />
            </div>
            <GlassInput label="Email" placeholder="admin@example.com" value={adminForm.email} onChange={(v) => setAdminForm({...adminForm, email: v})} isDarkMode={isDarkMode} />
            <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Password" type="password" value={adminForm.password} onChange={(v) => setAdminForm({...adminForm, password: v})} isDarkMode={isDarkMode} />
                <GlassInput label="Confirm Password" type="password" value={adminForm.confirmPassword} onChange={(v) => setAdminForm({...adminForm, confirmPassword: v})} isDarkMode={isDarkMode} />
            </div>
            
            <div className="pt-4">
                <button 
                    onClick={handleCreateAdminMock}
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-white bg-brand-lime hover:bg-brand-lime-dark shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                    Create Administrator
                </button>
            </div>
        </div>
    );
};