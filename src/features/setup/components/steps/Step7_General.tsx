import React from 'react';
import { GlassInput } from '../ui/GlassInput';
import { GlassSelect } from '../ui/GlassSelect';

interface Props { wizard: any; isDarkMode: boolean; }

export const Step7General: React.FC<Props> = ({ wizard, isDarkMode }) => {
    const updateField = (val: string, field: string) => wizard.setFormData((prev: any) => ({ ...prev, [field]: val }));

    return (
        <>
            <GlassInput label="Bot Name" value={wizard.formData.botName} onChange={(v) => updateField(v, 'botName')} isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Welcome Message</label>
                <textarea 
                    value={wizard.formData.welcomeMessage} 
                    onChange={(e) => updateField(e.target.value, 'welcomeMessage')} 
                    disabled={wizard.isLoading} 
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all min-h-[100px] resize-none ${isDarkMode ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'} focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20`}
                />
            </div>
            <GlassSelect label="Primary Language" value={wizard.formData.language} onChange={(v) => updateField(v, 'language')} options={['Vietnamese', 'English', 'Japanese']} isDarkMode={isDarkMode} />
        </>
    );
};