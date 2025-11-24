import React from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput';
import { GlassSelect } from '../ui/GlassSelect';

interface Props { wizard: any; isDarkMode: boolean; }

export const Step3Vector: React.FC<Props> = ({ wizard, isDarkMode }) => {
    const updateField = (val: string, field: string) => wizard.setFormData((prev: any) => ({ ...prev, [field]: val }));

    return (
        <>
            <GlassSelect label="Provider" value={wizard.formData.vectorProvider} onChange={(v) => updateField(v, 'vectorProvider')} options={['Qdrant', 'Pinecone', 'Milvus', 'ChromaDB']} isDarkMode={isDarkMode} />
            <GlassInput label="Cluster URL / Host" value={wizard.formData.vectorHost} onChange={(v) => updateField(v, 'vectorHost')} placeholder="http://localhost:6333" isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            <GlassInput label="API Key (Optional)" value={wizard.formData.vectorKey} onChange={(v) => updateField(v, 'vectorKey')} type="password" isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            <GlassInput label="Collection Name" value={wizard.formData.vectorCollection} onChange={(v) => updateField(v, 'vectorCollection')} placeholder="e.g. gym_food_v1" isValid={wizard.stepStatus[3] === 'success' ? true : null} isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            <div className="pt-2 flex items-center gap-3">
                <button onClick={wizard.verifyVector} disabled={wizard.isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'}`}>
                    {wizard.isLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} Verify Collection
                </button>
            </div>
        </>
    );
};