import React from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { GlassInput } from '../ui/GlassInput';
import { GlassSelect } from '../ui/GlassSelect';

interface Props { wizard: any; isDarkMode: boolean; }

export const Step6LLM: React.FC<Props> = ({ wizard, isDarkMode }) => {
    const updateField = (val: string, field: string) => wizard.setFormData((prev: any) => ({ ...prev, [field]: val }));

    return (
        <>
            <GlassSelect label="Provider" value={wizard.formData.llmProvider} onChange={(v) => updateField(v, 'llmProvider')} options={['Gemini', 'OpenAI', 'Anthropic', 'Local LLM (Ollama)']} isDarkMode={isDarkMode} />
            <GlassInput label="API Key" value={wizard.formData.llmKey} onChange={(v) => updateField(v, 'llmKey')} type="password" placeholder="sk-..." isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            <GlassInput label="Model Name" value={wizard.formData.llmModel} onChange={(v) => updateField(v, 'llmModel')} placeholder="gemini-1.5-flash" isDarkMode={isDarkMode} disabled={wizard.isLoading} />
            <div className="pt-2">
                <button onClick={wizard.testLlm} disabled={wizard.isLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-md ${isDarkMode ? 'bg-purple-900/20 hover:bg-purple-900/40 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200'}`}>
                    {wizard.isLoading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />} Test LLM Response
                </button>
            </div>
        </>
    );
};