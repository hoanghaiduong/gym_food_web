import React, { useRef, useEffect } from 'react';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { LogEntry } from '@/features/setup/types/setup'; // Giả sử bạn có type này

interface SetupConsoleProps {
  logs: LogEntry[]; // Cần define interface LogEntry
  isMinimized: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
}

export const SetupConsole: React.FC<SetupConsoleProps> = ({ logs, isMinimized, onToggle }) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isMinimized]);

  return (
    <div className={`shrink-0 w-full bg-[#0F172A] border-t border-brand-lime/30 transition-all duration-300 ease-in-out flex flex-col ${isMinimized ? 'h-10' : 'h-64'}`}>
        <div className="h-10 bg-gray-950 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-900 transition-colors border-b border-white/5" onClick={onToggle}>
            <div className="flex items-center gap-4">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-yellow-500/80"></div><div className="w-3 h-3 rounded-full bg-green-500/80"></div></div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400"><Terminal size={12} className="text-brand-lime" /><span>live_console --verbose</span><span className="w-1.5 h-3 bg-brand-lime animate-pulse"></span></div>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">{isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 scroll-smooth bg-[#0F172A]">
             {logs.map((log) => (
                 <div key={log.id} className="flex items-start gap-3 opacity-90 hover:opacity-100 transition-opacity">
                     <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                     <span className={`font-bold shrink-0 w-16 ${log.type === 'INFO' ? 'text-gray-400' : log.type === 'SUCCESS' ? 'text-brand-lime' : log.type === 'WARNING' ? 'text-yellow-400' : log.type === 'SQL' ? 'text-blue-400' : 'text-red-500'}`}>[{log.type}]</span>
                     <span className={`break-all ${log.type === 'ERROR' ? 'text-red-300' : log.type === 'SQL' ? 'text-blue-300' : 'text-gray-300'}`}>{log.message}</span>
                 </div>
             ))}
             <div ref={consoleEndRef} />
        </div>
    </div>
  );
};