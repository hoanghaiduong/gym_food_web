import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Bot, ArrowUp, Menu, Plus, 
  MessageSquare, X, Clock, ShieldCheck, Trash2, AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/core/contexts/ThemeContext';
import { chatService } from '@/core/services/chatService'; 
import ReactMarkdown from 'react-markdown'; // [NEW] Import thư viện Markdown
import remarkGfm from 'remark-gfm'; // [NEW] Import plugin hỗ trợ GFM

// --- Types ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  group: 'Today' | 'Yesterday' | 'Previous 7 Days';
}

// --- Mock Data ---
const SUGGESTIONS = [
    "Phở bò bao nhiêu calo?",
    "Thực đơn tăng cơ giảm mỡ",
    "Ăn gì trước khi tập?",
    "Cách tính macro đơn giản"
];

const MOCK_HISTORY: ChatSession[] = [
  { id: '1', title: 'Phở bò calories', group: 'Today' },
  { id: '2', title: 'Lịch tập gym nữ', group: 'Today' },
];

// --- Components ---
const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl w-fit border border-white/20 shadow-sm animate-in fade-in slide-in-from-bottom-2">
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
);

const UserChatPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false); 
  const [isStreaming, setIsStreaming] = useState(false); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isStreaming]);

  // --- Handlers ---

  const simulateTypingResponse = (fullText: string) => {
    setIsStreaming(true);
    const botMsgId = Date.now().toString();
    
    setMessages(prev => [
      ...prev, 
      { id: botMsgId, role: 'assistant', content: '', isStreaming: true }
    ]);

    let i = -1;
    const speed = 10; 

    const intervalId = setInterval(() => {
      i++;
      if (i === fullText.length - 1) {
        clearInterval(intervalId);
        setIsStreaming(false);
        setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
        ));
      }

      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsgIndex = newMsgs.findIndex(m => m.id === botMsgId);
        if (lastMsgIndex !== -1) {
             newMsgs[lastMsgIndex] = {
                 ...newMsgs[lastMsgIndex],
                 content: fullText.substring(0, i + 1)
             };
        }
        return newMsgs;
      });

    }, speed);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping || isStreaming) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true); 

    try {
      const data = await chatService.sendMessage(text);
      setIsTyping(false);
      
      if (data && data.answer) {
          simulateTypingResponse(data.answer);
      } else {
          simulateTypingResponse("Xin lỗi, tôi không nhận được phản hồi từ máy chủ.");
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: "⚠️ Hệ thống đang bận hoặc gặp lỗi kết nối. Vui lòng thử lại sau." 
        }
      ]);
    }
  };

  const handleNewChat = () => {
    if(isTyping || isStreaming) return; 
    setMessages([]);
    if (isMobile) setIsSidebarOpen(false);
  };

  // --- Sub-components ---
  const SidebarComponent = () => (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside 
        className={`flex flex-col h-full bg-white/60 dark:bg-[#050505]/60 backdrop-blur-2xl border-r border-white/20 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isMobile ? 'fixed top-0 left-0 bottom-0 z-50 w-[300px]' : 'relative'} ${isSidebarOpen ? 'translate-x-0 w-[300px]' : isMobile ? '-translate-x-full' : 'w-0 overflow-hidden opacity-0'}`}
      >
        <div className="p-5 flex flex-col gap-4">
           {isMobile && (
             <div className="flex justify-end">
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-500"><X size={20} /></button>
             </div>
           )}
           <button 
              onClick={handleNewChat}
              className="flex items-center justify-center gap-2 w-full bg-[#84CC16] hover:bg-[#65A30D] text-white font-bold py-3.5 rounded-full shadow-lg shadow-[#84CC16]/20 transition-all hover:scale-[1.02] active:scale-95"
           >
              <Plus size={18} strokeWidth={3} />
              <span>New Chat</span>
           </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6 hide-scrollbar">
           {['Today'].map(group => (
                <div key={group}>
                    <h4 className="px-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{group}</h4>
                    <div className="space-y-1">
                        {MOCK_HISTORY.map(item => (
                             <button key={item.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 text-left group transition-colors">
                                <MessageSquare size={16} className="text-gray-400 group-hover:text-[#84CC16] transition-colors shrink-0" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{item.title}</span>
                             </button>
                        ))}
                    </div>
                </div>
           ))}
        </div>
        <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-600">
                <span className="flex items-center gap-1.5"><Clock size={12} /> History Saved</span>
                <button className="hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
        </div>
      </aside>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent relative">
      <SidebarComponent />

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white/0 backdrop-blur-[2px]">
           <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border border-white/20 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300">
                   <Menu size={20} />
                </button>
              )}
              <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSidebarOpen && !isMobile ? 'opacity-0' : 'opacity-100'}`}>
                 <div className="w-8 h-8 bg-[#84CC16] rounded-lg flex items-center justify-center shadow-lg shadow-[#84CC16]/20">
                    <div className="w-3 h-3 bg-white rounded-sm" />
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white tracking-tight">weihu</span>
              </div>
           </div>
           <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/20 hover:bg-white/80 dark:hover:bg-black/70 transition-all group">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-[#84CC16]">Admin</span>
              <ShieldCheck size={14} className="text-gray-400 group-hover:text-[#84CC16]" />
           </Link>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar pt-20 pb-4 px-4 md:px-0">
           {messages.length === 0 ? (
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
                    {SUGGESTIONS.map((sug) => (
                        <button
                           key={sug}
                           onClick={() => handleSend(sug)}
                           className="px-5 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#84CC16] hover:text-[#84CC16] dark:hover:text-[#84CC16] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                           {sug}
                        </button>
                    ))}
                </div>
             </div>
           ) : (
             <div className="max-w-3xl mx-auto w-full space-y-6 pb-32 pt-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-[#F7FEE7] dark:bg-[#84CC16]/10 flex items-center justify-center border border-[#84CC16]/20 flex-shrink-0 mt-1">
                              <Bot size={16} className="text-[#65A30D] dark:text-[#84CC16]" />
                          </div>
                      )}
                      
                      {/* --- KHU VỰC HIỂN THỊ TIN NHẮN ĐÃ NÂNG CẤP --- */}
                      <div className={`
                        max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden
                        ${msg.role === 'user' 
                          ? 'bg-[#65A30D] text-white rounded-tr-sm shadow-md shadow-[#65A30D]/20' 
                          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                        }
                      `}>
                          {msg.role === 'user' ? (
                              // Tin nhắn người dùng (Plain Text)
                              <p>{msg.content}</p>
                          ) : (
                              // Tin nhắn Bot (Markdown Render)
                              <div className="markdown-content">
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Tùy chỉnh CSS cho từng thẻ Markdown
                                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1" {...props} />,
                                        li: ({node, ...props}) => <li className="" {...props} />,
                                        strong: ({node, ...props}) => <span className="font-bold text-[#65A30D] dark:text-[#84CC16]" {...props} />, // In đậm màu xanh
                                        a: ({node, ...props}) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-6" {...props} />,
                                        h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-500 my-2" {...props} />,
                                        code: ({node, ...props}) => <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                                    }}
                                  >
                                    {msg.content}
                                  </ReactMarkdown>
                                  {/* Con trỏ nhấp nháy khi đang gõ */}
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
           )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/50 z-20 pointer-events-none">
            <div className="max-w-3xl mx-auto pointer-events-auto">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#84CC16] to-emerald-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-full border border-white/50 dark:border-gray-700 shadow-2xl">
                        <button className="p-4 text-gray-400 hover:text-[#84CC16] transition-colors">
                            <Sparkles size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={messages.length === 0 ? "Nhập câu hỏi của bạn..." : "Hỏi tiếp..."}
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
                            {messages.length === 0 ? <ArrowUp size={20} strokeWidth={2.5} /> : <Send size={18} className="ml-0.5" />}
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-3 font-medium">
                    Weihu AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default UserChatPage;