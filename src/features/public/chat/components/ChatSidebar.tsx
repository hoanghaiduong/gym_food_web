import React, { useRef, useEffect } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Loader2,
  LogOut,
  MoreHorizontal,
  PanelLeftClose,
  UserCircle2
} from "lucide-react";

import { useAuth } from '@/core/hooks/useAuth';
import { ChatSession } from "../hooks/useChatHistory";

interface ChatSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectHistory: (item: ChatSession) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  groupedHistory: any[];
  loading: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  isMobile,
  onClose,
  onNewChat,
  onSelectHistory,
  onClearHistory,
  onLogout,
  groupedHistory,
  loading,
  hasMore,
  fetchNextPage,
}) => {
  const observerTarget = useRef(null);
  const { user } = useAuth(); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchNextPage]);

  const renderTimeGroup = (label: string) => label;

  return (
    <>
      {/* 1. Backdrop cho Mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 2. Sidebar Container - Glassmorphism style synced with UserLayout */}
      <aside
        className={`
            flex flex-col h-full 
            bg-white/60 dark:bg-black/60 backdrop-blur-xl
            border-r border-white/20 dark:border-white/5
            transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-40
            ${isMobile ? "fixed top-0 left-0 bottom-0 w-[280px]" : "relative"} 
            ${isOpen ? "translate-x-0 w-[280px]" : isMobile ? "-translate-x-full" : "w-0 overflow-hidden opacity-0"}
        `}
      >
        {/* --- HEADER --- */}
        <div className="p-4 flex items-center gap-2 flex-shrink-0">
          {/* Nút New Chat: Dùng Brand Color Lime */}
          <button
            onClick={onNewChat}
            className="
                flex-1 group flex items-center gap-3 px-3 py-3 
                bg-[#84CC16]/10 dark:bg-[#84CC16]/20 
                hover:bg-[#84CC16]/20 dark:hover:bg-[#84CC16]/30
                border border-[#84CC16]/30 dark:border-[#84CC16]/20
                rounded-xl shadow-sm hover:shadow-md transition-all duration-200
            "
          >
            <div className="p-1 bg-[#84CC16] rounded-full">
                <Plus size={14} className="text-white" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Cuộc trò chuyện mới</span>
          </button>

          {/* Nút Collapse */}
          <button
            onClick={onClose}
            className="
                p-3 rounded-xl 
                text-gray-500 hover:bg-black/5 dark:hover:bg-white/10
                transition-all duration-200
            "
            title="Đóng sidebar"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        {/* --- BODY: History List --- */}
        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-6 hide-scrollbar hover:overflow-y-auto">
          {groupedHistory.map((group: any) => (
            <div key={group.label} className="animate-in fade-in duration-500">
              <h4 className="px-3 text-[11px] font-bold text-[#84CC16] uppercase tracking-wide mb-2 mt-4 opacity-80">
                {renderTimeGroup(group.label)}
              </h4>
              <div className="space-y-1">
                {group.items.map((item: ChatSession) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectHistory(item)}
                    className="
                        group w-full flex items-center gap-3 px-3 py-3 rounded-lg 
                        text-gray-700 dark:text-gray-300 
                        hover:bg-white/50 dark:hover:bg-white/5
                        border border-transparent hover:border-[#84CC16]/20
                        transition-all text-left relative overflow-hidden
                    "
                  >
                    <MessageSquare size={16} className="text-gray-400 group-hover:text-[#84CC16] transition-colors shrink-0" />
                    <p className="text-sm truncate w-full pr-2 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                        {item.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div ref={observerTarget} className="flex justify-center py-2 h-10">
            {loading && <Loader2 size={18} className="animate-spin text-[#84CC16]" />}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="p-3 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-black/20 flex flex-col gap-2">
            
            {/* 1. Nút Xóa lịch sử */}
            <button
                onClick={onClearHistory}
                className="
                    w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg 
                    text-xs font-semibold text-gray-500 dark:text-gray-400
                    hover:text-red-600 dark:hover:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/10 
                    transition-all duration-200
                "
            >
                <Trash2 size={14} />
                <span>Xóa toàn bộ lịch sử</span>
            </button>

            {/* 2. User Profile Card */}
            <div className="flex items-center justify-between group p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer relative border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
                
                <div className="flex items-center gap-3 min-w-0">
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="User" 
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#84CC16]/20"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-[#84CC16] flex items-center justify-center text-white font-bold shadow-md shadow-[#84CC16]/20">
                            {user?.username?.[0]?.toUpperCase() || <UserCircle2 size={20}/>}
                        </div>
                    )}
                    
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                            {user?.full_name || user?.username || "Người dùng"}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || "Free Plan"}
                        </span>
                    </div>
                </div>

                <div className="relative group/logout">
                    <button className="p-2 text-gray-400 hover:text-[#84CC16] transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                    
                    {/* Tooltip Logout */}
                    <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            onLogout();
                        }}
                        className="
                            absolute bottom-full right-0 mb-2 w-32 
                            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                            rounded-lg shadow-xl p-1 opacity-0 invisible group-hover/logout:opacity-100 group-hover/logout:visible 
                            transition-all duration-200 transform translate-y-2 group-hover/logout:translate-y-0
                            z-50
                        "
                    >
                        <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer">
                            <LogOut size={14} />
                            Đăng xuất
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;