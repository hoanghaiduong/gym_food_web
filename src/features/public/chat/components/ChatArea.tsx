import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl w-fit border border-white/20 shadow-sm animate-in fade-in slide-in-from-bottom-2">
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
);

interface ChatAreaProps {
  messages: any[];
  isTyping: boolean;
  onSuggestionClick: (txt: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping, onSuggestionClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Giao diện khi chưa có tin nhắn (Empty State)
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 pb-20">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#84CC16]/20 blur-[60px] rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl flex items-center justify-center border border-white/20">
                <Bot size={48} className="text-[#84CC16]" />
            </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4 tracking-tight">
            Hôm nay bạn muốn <span className="text-[#84CC16]">ăn gì?</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-10 text-lg px-4">
            Trợ lý AI chuyên gia về dinh dưỡng Gym & Thể hình.
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl px-4">
            {["Phở bò bao nhiêu calo?", "Thực đơn tăng cơ giảm mỡ", "Ăn gì trước khi tập?", "Cách tính macro đơn giản"].map((sug) => (
                <button
                   key={sug}
                   onClick={() => onSuggestionClick(sug)}
                   className="px-5 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#84CC16] hover:text-[#84CC16] dark:hover:text-[#84CC16] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                   {sug}
                </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6 pb-32 pt-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#F7FEE7] dark:bg-[#84CC16]/10 flex items-center justify-center border border-[#84CC16]/20 flex-shrink-0 mt-1">
                      <Bot size={16} className="text-[#65A30D] dark:text-[#84CC16]" />
                  </div>
              )}
              <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden ${msg.role === 'user' ? 'bg-[#65A30D] text-white rounded-tr-sm shadow-md shadow-[#65A30D]/20' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'}`}>
                  {msg.role === 'user' ? <p>{msg.content}</p> : (
                      <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1" {...props} />,
                                strong: ({node, ...props}) => <span className="font-bold text-[#65A30D] dark:text-[#84CC16]" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" {...props} />,
                                code: ({node, ...props}) => <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                            }}>
                            {msg.content}
                          </ReactMarkdown>
                          {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-[#84CC16] align-middle animate-pulse"></span>}
                      </div>
                  )}
              </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#F7FEE7] dark:bg-[#84CC16]/10 flex items-center justify-center border border-[#84CC16]/20 flex-shrink-0">
                  <Bot size={16} className="text-[#65A30D] dark:text-[#84CC16]" />
              </div>
              <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;