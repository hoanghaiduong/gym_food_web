import { ArrowRight } from "lucide-react";

export const GlassSelect = ({
    label, value, onChange, options, isDarkMode
}: {
    label: string; value: string; onChange: (val: string) => void; options: string[]; isDarkMode: boolean;
}) => (
    <div className="space-y-2">
        <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                  w-full border rounded-xl px-4 py-3 text-sm font-medium outline-none appearance-none cursor-pointer transition-all
                  ${isDarkMode
                    ? 'bg-black/30 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                  }
                  focus:border-[#84CC16] focus:ring-2 focus:ring-[#84CC16]/20
                `}
            >
                {options.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>{opt}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ArrowRight size={14} className="rotate-90" />
            </div>
        </div>
    </div>
);
