import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface GlassInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  isValid?: boolean | null;
  isDarkMode: boolean;
  disabled?: boolean;
  icon?: React.ElementType;
}

export const GlassInput: React.FC<GlassInputProps> = ({ 
  label, value, onChange, placeholder, type = "text", required = false, isValid = null, isDarkMode, disabled = false, icon: Icon
}) => (
  <div className="space-y-2">
    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all border ${Icon ? 'pl-10' : ''}
            ${isDarkMode 
              ? 'bg-black/30 border-gray-700 text-white placeholder-gray-600' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20'}
            ${isValid === true ? '!border-brand-lime/50' : isValid === false ? '!border-red-500/50 focus:!border-red-500 focus:!ring-red-500/20' : ''}
          `}
        />
        {Icon && <Icon size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />}
        {isValid === true && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-lime animate-in zoom-in duration-200"><CheckCircle2 size={16} /></div>
        )}
        {isValid === false && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in zoom-in duration-200"><AlertCircle size={16} /></div>
        )}
    </div>
  </div>
);