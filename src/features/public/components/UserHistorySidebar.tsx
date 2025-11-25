import React from 'react';
import { MessageSquare, Plus, Trash2, X, MoreHorizontal, Clock } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
}

interface UserHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

// Mock Data Generation
const MOCK_HISTORY = [
  { group: 'Today', items: [
    { id: '1', title: 'Phở bò bao nhiêu calo?', timestamp: new Date() },
    { id: '2', title: 'Thực đơn tăng cơ giảm mỡ', timestamp: new Date() },
  ]},
  { group: 'Yesterday', items: [
    { id: '3', title: 'Bài tập ngực tại nhà', timestamp: new Date(Date.now() - 86400000) },
    { id: '4', title: 'Whey protein loại nào tốt?', timestamp: new Date(Date.now() - 86400000) },
  ]},
  { group: 'Previous 7 Days', items: [
    { id: '5', title: 'Cách tính Macro', timestamp: new Date(Date.now() - 86400000 * 3) },
    { id: '6', title: 'Eat clean là gì?', timestamp: new Date(Date.now() - 86400000 * 4) },
    { id: '7', title: 'Lịch tập Gym cho nữ', timestamp: new Date(Date.now() - 86400000 * 5) },
  ]}
];

const UserHistorySidebar: React.FC<UserHistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNewChat, 
  activeChatId, 
  onSelectChat 
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-[280px] lg:w-[300px] flex-shrink-0
        bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-2xl
        border-r border-white/20 dark:border-white/5
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full pt-16 lg:pt-0
      `}>
        
        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
            <X size={20} />
        </button>

        {/* Header: New Chat */}
        <div className="p-5 pb-2">
            <button 
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-2 bg-[#84CC16] hover:bg-[#65A30D] text-white font-bold py-3 rounded-full shadow-lg shadow-[#84CC16]/20 transition-all hover:scale-[1.02] active:scale-95"
            >
                <Plus size={20} strokeWidth={3} />
                <span>New Chat</span>
            </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scroll-smooth hide-scrollbar">
            {MOCK_HISTORY.map((group) => (
                <div key={group.group}>
                    <h4 className="px-3 mb-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {group.group}
                    </h4>
                    <div className="space-y-1">
                        {group.items.map((chat) => {
                            const isActive = activeChatId === chat.id;
                            return (
                                <div 
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`
                                        group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
                                        ${isActive 
                                            ? 'bg-white dark:bg-white/10 shadow-sm border-l-4 border-[#84CC16]' 
                                            : 'hover:bg-gray-100/50 dark:hover:bg-white/5 border-l-4 border-transparent text-gray-600 dark:text-gray-400'
                                        }
                                    `}
                                >
                                    <MessageSquare 
                                        size={16} 
                                        className={`flex-shrink-0 ${isActive ? 'text-[#84CC16]' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} 
                                    />
                                    
                                    <span className={`text-sm font-medium truncate pr-6 ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                                        {chat.title}
                                    </span>

                                    {/* Hover Actions */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                        <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-gray-200/50 dark:border-white/5">
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-600">
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Saved locally
                </span>
                <span>v2.5.0</span>
            </div>
        </div>

      </aside>
    </>
  );
};

export default UserHistorySidebar;