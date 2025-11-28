import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';
import api from '@/core/api/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/hooks/useAuth';

// 1. Cập nhật Interface khớp với Backend ChatSessionResponse
export interface ChatSession {
  id: string;          // UUID từ backend
  user_id: string;
  title: string;       // Tiêu đề cuộc hội thoại
  created_at: string;
  updated_at: string;  // Dùng cái này để sort
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export const useChatHistory = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  // Đổi tên state thành sessions cho đúng ngữ nghĩa
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false); 
  const LIMIT = 20;

  // --- HÀM FETCH DANH SÁCH SESSION (SIDEBAR) ---
  const fetchSessions = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;
    if (!isRefresh && !hasMore) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const currentOffset = isRefresh ? 0 : offsetRef.current;

      // [UPDATE] Gọi API lấy danh sách Sessions
      const response = await api.get('/api/v2/history/sessions', {
        params: { limit: LIMIT, offset: currentOffset }
      });
      console.log(response.data.data)
      if (response.data?.code === 200) {
        const newData: ChatSession[] = response.data.data || [];
        if (isRefresh) {
          setSessions(newData);
          offsetRef.current = LIMIT; 
          setHasMore(true);
        } else {
          setSessions(prev => [...prev, ...newData]);
          offsetRef.current += LIMIT; 
        }

        if (newData.length < LIMIT) {
            setHasMore(false);
        }
      } else {
         setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setHasMore(false); 
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]); 

  // --- [MỚI] HÀM LẤY CHI TIẾT TIN NHẮN CỦA 1 SESSION ---
  // Hàm này dùng khi user click vào 1 item trên Sidebar
  const getSessionMessages = async (sessionId: string) => {
      try {
          const response = await api.get(`/api/v2/history/sessions/${sessionId}`);
          if (response.data?.code === 200) {
              return response.data.data as ChatMessage[];
          }
          return [];
      } catch (error) {
          console.error(`Failed to load messages for session ${sessionId}`, error);
          return [];
      }
  };

  const clearHistory = async () => {
    if (isFetchingRef.current) return false;
    
    try {
      const response = await api.delete('/api/v2/history/clear');
      if (response.data?.code === 200) {
        setSessions([]);
        offsetRef.current = 0;
        setHasMore(false); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to clear history:", error);
      return false;
    }
  };

  // --- GROUPING LOGIC (Cập nhật cho Session) ---
  const groupedHistory = useMemo(() => {
    const groups: any = { 'Hôm nay': [], 'Hôm qua': [], '7 ngày trước': [], 'Cũ hơn': [] };

    sessions.forEach(session => {
      // Dùng updated_at để group, vì session cũ có thể mới được chat lại
      const date = new Date(session.updated_at || session.created_at); 
      
      if (isToday(date)) {
        groups['Hôm nay'].push(session);
      } else if (isYesterday(date)) {
        groups['Hôm qua'].push(session);
      } else if (isAfter(date, subDays(new Date(), 7))) {
        groups['7 ngày trước'].push(session);
      } else {
        groups['Cũ hơn'].push(session);
      }
    });

    return Object.entries(groups)
      .filter(([_, items]: any) => items.length > 0)
      .map(([label, items]) => ({ label, items }));
  }, [sessions]);

  // --- HÀM XỬ LÝ LOGOUT ---
  const handleLogout = async () => {
      try {
        await authLogout();
        // Sau khi logout có thể redirect hoặc clear state nếu cần
      } catch (error) {
        console.error("Logout failed:", error);
      }
  };

  useEffect(() => {
    fetchSessions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { 
    history: sessions, // Trả về sessions nhưng giữ tên prop history để đỡ sửa code UI cũ nhiều
    groupedHistory, 
    loading, 
    hasMore, 
    fetchNextPage: () => fetchSessions(false), 
    reload: () => fetchSessions(true),
    clearHistory,
    getSessionMessages, // [MỚI] Export hàm này ra để UI dùng
    logout: handleLogout 
  };
};