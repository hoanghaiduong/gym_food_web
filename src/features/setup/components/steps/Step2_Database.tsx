import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput';
import { GlassSelect } from '../ui/GlassSelect';

interface Props { wizard: any; isDarkMode: boolean; }

export const Step2Database: React.FC<Props> = ({ wizard, isDarkMode }) => {
    const updateField = (val: string, field: string) => wizard.setFormData((prev: any) => ({ ...prev, [field]: val }));

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <GlassSelect label="Database Type" value={wizard.formData.dbType} onChange={(v) => updateField(v, 'dbType')} options={['PostgreSQL', 'MongoDB', 'MySQL']} isDarkMode={isDarkMode} />
                <GlassInput label="Database Name" value={wizard.formData.dbName} onChange={(v) => updateField(v, 'dbName')} isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2"><GlassInput label="Host" value={wizard.formData.dbHost} onChange={(v) => updateField(v, 'dbHost')} placeholder="localhost" isDarkMode={isDarkMode} disabled={wizard.isLoading} /></div>
                <GlassInput label="Port" value={wizard.formData.dbPort} onChange={(v) => updateField(v, 'dbPort')} placeholder="5432" isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <GlassInput label="Username" value={wizard.formData.dbUser} onChange={(v) => updateField(v, 'dbUser')} isDarkMode={isDarkMode} disabled={wizard.isLoading} />
                <GlassInput label="Password" value={wizard.formData.dbPass} onChange={(v) => updateField(v, 'dbPass')} type="password" isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            </div>
            <div className="pt-2">
                <button onClick={wizard.testDatabase} disabled={wizard.isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}>
                    {wizard.isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Test DB Connection
                </button>
            </div>
        </>
    );
};