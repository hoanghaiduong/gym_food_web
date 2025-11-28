import React, { useState, useEffect, useRef } from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { chatService } from "@/core/services/chatService";

// Import các Component
import ChatSidebar from "@/features/public/chat/components/ChatSidebar";
import ChatArea from "@/features/public/chat/components/ChatArea";
import ChatInput from "@/features/public/chat/components/ChatInput";
import ConfirmModal from "./ui/ConfirmModal";

// Hooks & Context
import { useChatHistory } from "@/features/public/chat/hooks/useChatHistory";
import { useUI } from "@/core/contexts/UIContext";
import { useAuth } from "@/core/hooks/useAuth";

const UserChatPage: React.FC = () => {
  // --- STATE LAYOUT ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- STATE CHAT ---
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // [MỚI] State lưu Session ID hiện tại đang chat
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // --- HOOKS ---
  const { user } = useAuth();
  const { startLoading, stopLoading } = useUI();
  const {
    groupedHistory,
    loading: historyLoading,
    hasMore,
    fetchNextPage,
    clearHistory,
    reload: reloadHistory, // Đổi tên cho rõ
    logout,
    getSessionMessages, // [MỚI] Hàm lấy chi tiết tin nhắn
  } = useChatHistory();

  // --- EFFECTS ---
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- HANDLERS ---

  // 1. Xử lý Logout
  const handleConfirmLogout = async () => {
    startLoading();
    await logout();
    setShowLogoutModal(false);
    stopLoading();
  };

  // 2. Xử lý xóa lịch sử
  const handleConfirmClear = async () => {
    const success = await clearHistory();
    if (success) {
      setMessages([]);
      setCurrentSessionId(null); // Reset session hiện tại
      setShowClearModal(false);
    }
  };

  // 3. Tạo hiệu ứng gõ chữ (Streaming giả lập)
  const simulateTypingResponse = (fullText: string) => {
    setIsStreaming(true);
    const botMsgId = Date.now().toString();
    
    // Thêm tin nhắn rỗng của bot trước
    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: "assistant", content: "", isStreaming: true },
    ]);

    let i = -1;
    // Tăng tốc độ gõ lên một chút (5ms) cho mượt
    const intervalId = setInterval(() => {
      i++;
      if (i === fullText.length - 1) {
        clearInterval(intervalId);
        setIsStreaming(false);
        
        // Cập nhật trạng thái xong
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
        
        // Quan trọng: Reload sidebar để hiện session mới lên đầu
        reloadHistory(); 
      }
      
      // Cập nhật nội dung từng ký tự
      setMessages((prev) => {
        const newMsgs = [...prev];
        const idx = newMsgs.findIndex((m) => m.id === botMsgId);
        if (idx !== -1) {
          newMsgs[idx] = {
            ...newMsgs[idx],
            content: fullText.substring(0, i + 1),
          };
        }
        return newMsgs;
      });
    }, 5);
  };

  // 4. Xử lý Gửi tin nhắn
  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping || isStreaming) return;

    // Thêm tin nhắn User vào UI ngay lập tức
    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Gọi API Chat (Gửi kèm session_id nếu đang chat tiếp)
      const payload = { 
          question: text,
          session_id: currentSessionId // Nếu null -> Backend tự tạo mới
      };
      
      const response = await chatService.sendMessage(payload); // Sửa service nhận object
      
      // Backend trả về: { answer: "...", session_id: "new-uuid", ... }
      const data = response?.data; // Cấu trúc chuẩn: response.data.data
      console.log("Chat response data:", data);
      setIsTyping(false);

      if (data) {
          // Cập nhật session_id mới nếu backend trả về (trường hợp tạo mới)
          if (data.session_id) {
              setCurrentSessionId(data.session_id);
          }
          // Hiển thị câu trả lời
          simulateTypingResponse(data.answer);
      } else {
          throw new Error("Empty response");
      }

    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "⚠️ Lỗi kết nối hoặc hệ thống đang bận.",
        },
      ]);
    }
  };

  // 5. Xử lý chọn lịch sử từ Sidebar
  const handleSelectHistory = async (session: any) => {
    if (isTyping || isStreaming) return;

    // Set ID để các tin nhắn sau nối vào session này
    setCurrentSessionId(session.id);

    // UI Loading giả (hoặc thật nếu muốn)
    setMessages([]); 
    startLoading(); // Hoặc set local loading state

    try {
        // Gọi API lấy chi tiết tin nhắn
        const historyMessages = await getSessionMessages(session.id);
        
        // Format lại để khớp với UI
        // Backend trả về: [{ role: 'user', content: '...' }, ...]
        const formattedMsgs = historyMessages.map((msg: any, index: number) => ({
            id: `${session.id}-${index}`, // Tạo ID giả định danh
            role: msg.role,
            content: msg.content,
            isStreaming: false
        }));

        setMessages(formattedMsgs);
    } catch (err) {
        console.error("Load history error", err);
    } finally {
        stopLoading();
        if (isMobile) setIsSidebarOpen(false);
    }
  };

  // 6. Xử lý tạo chat mới
  const handleNewChat = () => {
      setMessages([]);
      setCurrentSessionId(null); // Reset về null để tạo session mới
      if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent relative">
      {/* Modals */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        title="Xóa toàn bộ lịch sử?"
        message="Hành động này sẽ xóa vĩnh viễn tất cả các cuộc hội thoại cũ."
      />
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Đăng xuất?"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
      />

      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={() => setIsSidebarOpen(false)}
        
        // Actions
        onLogout={() => setShowLogoutModal(true)}
        onNewChat={handleNewChat} // [FIX] Dùng hàm handleNewChat chuẩn
        onSelectHistory={handleSelectHistory} // [FIX] Dùng hàm load chi tiết
        onClearHistory={() => setShowClearModal(true)}
        
        // Data
        groupedHistory={groupedHistory}
        loading={historyLoading}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white/0 backdrop-blur-[2px]">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border border-white/20 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300"
              >
                <Menu size={20} />
              </button>
            )}
            <div
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                isSidebarOpen && !isMobile ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="w-8 h-8 bg-[#84CC16] rounded-lg flex items-center justify-center shadow-lg shadow-[#84CC16]/20">
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white tracking-tight">
                Gym Food AI
              </span>
            </div>
          </div>

          {/* User Info / Admin Link */}
          <Link
            to={user?.role === 'admin' ? "/admin" : "#"} // Chỉ link nếu là admin
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/20 transition-all group ${
                user?.role === 'admin' ? 'hover:bg-white/80 cursor-pointer' : 'cursor-default'
            }`}
          >
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-[#84CC16]">
              {user ? `${user.full_name || user.username} (${user.role})` : "Guest"}
            </span>
            {user?.role === 'admin' && (
                <ShieldCheck
                size={14}
                className="text-gray-400 group-hover:text-[#84CC16]"
                />
            )}
          </Link>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar pt-20 pb-4 px-4 md:px-0">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            onSuggestionClick={handleSend}
          />
        </div>

        {/* Input Area */}
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={() => handleSend()}
          isTyping={isTyping}
          isStreaming={isStreaming}
          isNewChat={messages.length === 0}
        />
      </main>
    </div>
  );
};

export default UserChatPage;