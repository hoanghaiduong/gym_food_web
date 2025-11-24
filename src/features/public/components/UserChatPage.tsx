import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, ArrowUp } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
    "Phở bò bao nhiêu calo?",
    "Thực đơn tăng cơ giảm mỡ",
    "Ăn gì trước khi tập?",
    "Cách tính macro đơn giản"
];

const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl w-fit">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const UserChatPage: React.FC = () => {
  const { primaryColor } = useTheme();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Bot Response (Replace with useChat hook later)
    setTimeout(() => {
        const botMsg: Message = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: `Đây là câu trả lời mô phỏng cho: "${text}". \n\nTrong phiên bản thực tế, hệ thống sẽ kết nối với Gemini API để trả về thông tin dinh dưỡng chính xác.` 
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    }, 1500);
  };

  // --- RENDER: HERO STATE (No messages) ---
  if (messages.length === 0) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-brand-lime/20 blur-[60px] rounded-full animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex items-center justify-center border border-white/20">
                      <Bot size={48} className="text-brand-lime" />
                  </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4 tracking-tight">
                  Hôm nay bạn muốn <span className="text-brand-lime">ăn gì?</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-10 text-lg">
                  Trợ lý AI chuyên gia về dinh dưỡng Gym & Thể hình. Hỏi tôi bất cứ điều gì về calories, macro và thực đơn.
              </p>

              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                  {SUGGESTIONS.map((sug) => (
                      <button
                          key={sug}
                          onClick={() => handleSend(sug)}
                          className="px-5 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-brand-lime hover:text-brand-lime dark:hover:text-brand-lime transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                          {sug}
                      </button>
                  ))}
              </div>

              {/* Floating Input for Hero */}
              <div className="w-full max-w-xl mt-12 relative">
                  <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Nhập câu hỏi của bạn..."
                      className="w-full h-14 pl-6 pr-14 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-lime/50 transition-all"
                  />
                  <button 
                      onClick={() => handleSend()}
                      className={`absolute right-2 top-2 bottom-2 w-10 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-brand-lime text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
                  >
                      <ArrowUp size={20} strokeWidth={2.5} />
                  </button>
              </div>
          </div>
      );
  }

  // --- RENDER: CHAT INTERFACE ---
  return (
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full relative">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6 scroll-smooth hide-scrollbar">
              {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                      {/* Bot Avatar */}
                      {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-brand-lime-bg flex items-center justify-center border border-brand-lime/20 flex-shrink-0 mt-1">
                              <Bot size={16} className="text-brand-lime-dark" />
                          </div>
                      )}

                      {/* Bubble */}
                      <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-brand-lime text-white rounded-tr-sm' 
                          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                      }`}>
                          {msg.content.split('\n').map((line, i) => (
                              <p key={i} className={`min-h-[1rem] ${i > 0 ? 'mt-2' : ''}`}>{line}</p>
                          ))}
                      </div>
                  </div>
              ))}
              
              {isTyping && (
                  <div className="flex gap-4 justify-start">
                      <div className="w-8 h-8 rounded-full bg-brand-lime-bg flex items-center justify-center border border-brand-lime/20 flex-shrink-0">
                          <Bot size={16} className="text-brand-lime-dark" />
                      </div>
                      <TypingIndicator />
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* Fixed Bottom Input */}
          <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[700px] z-20">
              <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-lime to-emerald-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                  
                  <div className="relative flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-full border border-white/50 dark:border-gray-700 shadow-2xl">
                      <button className="p-4 text-gray-400 hover:text-brand-lime transition-colors">
                          <Sparkles size={20} />
                      </button>
                      <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Hỏi tiếp..."
                          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 py-4 text-sm focus:outline-none"
                          autoFocus
                      />
                      <button 
                          onClick={() => handleSend()}
                          className={`p-2 mr-2 rounded-full transition-all ${
                              input.trim() 
                              ? 'bg-brand-lime text-white hover:scale-105 shadow-lg' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                          }`}
                      >
                          <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
                      </button>
                  </div>
              </div>
              <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-2 font-medium">
                  Weihu AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
              </p>
          </div>
      </div>
  );
};

export default UserChatPage;