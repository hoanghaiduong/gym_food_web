import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowUp } from 'lucide-react';
interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  isTyping: boolean;
  isStreaming: boolean;
  isNewChat: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, isTyping, isStreaming, isNewChat }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto focus
  useEffect(() => {
    if (!isTyping && !isStreaming && inputRef.current) inputRef.current.focus();
  }, [isTyping, isStreaming]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/50 z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#84CC16] to-emerald-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <div className="relative flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-full border border-white/50 dark:border-gray-700 shadow-2xl">
                    <button className="p-4 text-gray-400 hover:text-[#84CC16] transition-colors">
                        <Sparkles size={20} />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isNewChat ? "Nhập câu hỏi của bạn..." : "Hỏi tiếp..."}
                        className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 py-4 text-sm focus:outline-none"
                        autoFocus
                        disabled={isTyping || isStreaming}
                    />
                    <button 
                        onClick={() => handleSend()}
                        disabled={isTyping || isStreaming || !input.trim()}
                        className={`p-2 mr-2 rounded-full transition-all ${
                            input.trim() && !isTyping && !isStreaming
                            ? 'bg-[#84CC16] text-white hover:scale-105 shadow-lg' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isNewChat ? <ArrowUp size={20} strokeWidth={2.5} /> : <Send size={18} className="ml-0.5" />}
                    </button>
                </div>
            </div>
            <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-3 font-medium">
                Gym Food AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
            </p>
        </div>
    </div>
  );
};

export default ChatInput;