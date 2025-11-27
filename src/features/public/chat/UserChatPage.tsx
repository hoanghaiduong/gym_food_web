import React, { useState, useEffect } from "react";
import { Menu, ShieldCheck, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { chatService } from "@/core/services/chatService";

// Import các Component đã tách
import ChatSidebar from "@/features/public/chat/components/ChatSidebar";
import ChatArea from "@/features/public/chat/components/ChatArea";
import ChatInput from "@/features/public/chat/components/ChatInput";
import { useChatHistory } from "@/features/public/chat/hooks/useChatHistory";
import ConfirmModal from "./ui/ConfirmModal";
import { useUI } from "@/core/contexts/UIContext";
import { useAuth } from "@/core/hooks/useAuth";

const UserChatPage: React.FC = () => {
  // State Layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // State Chat
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const {user}=useAuth();
  // Sử dụng Hook
  const {
    groupedHistory,
    loading,
    hasMore,
    fetchNextPage,
    clearHistory,
    reload,
    logout,
  } = useChatHistory();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { startLoading, stopLoading } = useUI();
  // 2. Tạo hàm xử lý xác nhận logout
  const handleConfirmLogout = async () => {
    startLoading();
    await logout(); // Gọi hàm logout từ hook useChatHistory
    setShowLogoutModal(false);
    stopLoading();
  };
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

  // Handlers
  const simulateTypingResponse = (fullText: string) => {
    setIsStreaming(true);
    const botMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: "assistant", content: "", isStreaming: true },
    ]);

    let i = -1;
    const intervalId = setInterval(() => {
      i++;
      if (i === fullText.length - 1) {
        clearInterval(intervalId);
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
        reload(); // Reload lại history sau khi chat xong
      }
      setMessages((prev) => {
        const newMsgs = [...prev];
        const idx = newMsgs.findIndex((m) => m.id === botMsgId);
        if (idx !== -1)
          newMsgs[idx] = {
            ...newMsgs[idx],
            content: fullText.substring(0, i + 1),
          };
        return newMsgs;
      });
    }, 10);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping || isStreaming) return;
    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await chatService.sendMessage(text);
      setIsTyping(false);
      simulateTypingResponse(data?.data?.answer || "Xin lỗi, lỗi kết nối.");
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "⚠️ Lỗi kết nối.",
        },
      ]);
    }
  };

  const handleSelectHistory = (item: any) => {
    if (isTyping || isStreaming) return;
    setMessages([
      { id: `q-${item.id}`, role: "user", content: item.question },
      { id: `a-${item.id}`, role: "assistant", content: item.answer },
    ]);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleConfirmClear = async () => {
    if (await clearHistory()) {
      setMessages([]);
      setShowClearModal(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent relative">
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        title="Xóa lịch sử chat?"
        message="Hành động này sẽ xóa toàn bộ các cuộc hội thoại trước đây của bạn và không thể khôi phục."
      />
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Đăng xuất?"
        message="Bạn có chắc chắn muốn đăng xuất?"
      />
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onLogout={() => setShowLogoutModal(true)}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={() => {
          setMessages([]);
          if (isMobile) setIsSidebarOpen(false);
        }}
        onSelectHistory={handleSelectHistory}
        onClearHistory={() => setShowClearModal(true)}
        groupedHistory={groupedHistory}
        loading={loading}
        hasMore={hasMore}
        fetchNextPage={fetchNextPage}
      />

      {/* Main Layout */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
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
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-white/20 hover:bg-white/80 dark:hover:bg-black/70 transition-all group"
          >
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-[#84CC16]">
              {user&& user?.full_name +"| Role: "+user?.role}
            </span>
            <ShieldCheck
              size={14}
              className="text-gray-400 group-hover:text-[#84CC16]"
            />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth hide-scrollbar pt-20 pb-4 px-4 md:px-0">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            onSuggestionClick={handleSend}
          />
        </div>

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
