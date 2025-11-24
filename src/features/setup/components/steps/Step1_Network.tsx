import React from 'react';
import { Wifi, Loader2 } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput';

interface Props { wizard: any; isDarkMode: boolean; }

export const Step1Network: React.FC<Props> = ({ wizard, isDarkMode }) => {
    const updateField = (val: string, field: string) => wizard.setFormData((prev: any) => ({ ...prev, [field]: val }));

    return (
        <>
            <GlassInput 
                label="API Base URL" 
                value={wizard.formData.apiBaseUrl} 
                onChange={(v) => updateField(v, 'apiBaseUrl')} 
                placeholder="http://localhost:8000" 
                required 
                isValid={wizard.stepStatus[1] === 'success' ? true : wizard.stepStatus[1] === 'error' ? false : null} 
                isDarkMode={isDarkMode} 
                disabled={wizard.isLoading} 
            />
            <GlassInput 
                label="WebSocket URL" 
                value={wizard.formData.wsUrl} 
                onChange={(v) => updateField(v, 'wsUrl')} 
                placeholder="ws://localhost:8000/ws" 
                required 
                isDarkMode={isDarkMode} 
                disabled={wizard.isLoading} 
            />
            <div className="pt-2">
                <button onClick={wizard.testNetwork} disabled={wizard.isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}>
                    {wizard.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />} Test Connectivity
                </button>
            </div>
        </>
    );
};