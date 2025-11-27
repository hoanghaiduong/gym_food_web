import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';
import api from '@/core/api/api';
// 1. Import Hook của Redux và Router
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/features/auth/authSlice';
import { useAuth } from '@/core/hooks/useAuth';
// Import action logout
// Nếu bạn có type cho AppDispatch, hãy import nó (nếu không dùng any tạm)
// import { AppDispatch } from '@/redux/store';

export interface HistoryItem {
  id: number | string;
  question: string;
  answer: string;
  created_at: string;
}

export const useChatHistory = () => {
  // 2. Khởi tạo các hooks
  const dispatch = useDispatch<any>(); // Dùng <any> hoặc <AppDispatch> để tránh lỗi TS với AsyncThunk
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false); 
  const LIMIT = 20;

  // --- HÀM FETCH HISTORY (GIỮ NGUYÊN) ---
  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (isFetchingRef.current) return;
    if (!isRefresh && !hasMore) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const currentOffset = isRefresh ? 0 : offsetRef.current;

      const response = await api.get('/api/v2/history/', {
        params: { limit: LIMIT, offset: currentOffset }
      });

      if (response.data?.code === 200) {
        const newData = response.data.data || [];
        
        if (isRefresh) {
          setHistory(newData);
          offsetRef.current = LIMIT; 
          setHasMore(true);
        } else {
          setHistory(prev => [...prev, ...newData]);
          offsetRef.current += LIMIT; 
        }

        if (newData.length < LIMIT) {
            setHasMore(false);
        }
      } else {
         setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHasMore(false); 
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]); 

  const clearHistory = async () => {
    if (isFetchingRef.current) return false;
    
    try {
      const response = await api.delete('/api/v2/history/clear');
      if (response.data?.code === 200) {
        setHistory([]);
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

  const groupedHistory = useMemo(() => {
    const groups: any = { 'Hôm nay': [], 'Hôm qua': [], '7 ngày trước': [], 'Cũ hơn': [] };

    history.forEach(item => {
      const date = new Date(item.created_at);
      if (isToday(date)) {
        groups['Hôm nay'].push(item);
      } else if (isYesterday(date)) {
        groups['Hôm qua'].push(item);
      } else if (isAfter(date, subDays(new Date(), 7))) {
        groups['7 ngày trước'].push(item);
      } else {
        groups['Cũ hơn'].push(item);
      }
    });

    return Object.entries(groups)
      .filter(([_, items]: any) => items.length > 0)
      .map(([label, items]) => ({ label, items }));
  }, [history]);

  const {logout}=useAuth();
  // --- 3. HÀM XỬ LÝ LOGOUT ---
  const handleLogout = async () => {
      try {
        // Gọi Redux action logoutUser
        await logout();
        // Không cần setShowLogoutModal(false) ở đây vì Hook không quản lý UI state đó.
        // Khi navigate chạy, Component chứa Modal sẽ bị unmount.
        
      } catch (error) {
        console.error("Logout failed:", error);
      }
  };

  useEffect(() => {
    fetchHistory(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { 
    history, 
    groupedHistory, 
    loading, 
    hasMore, 
    fetchNextPage: () => fetchHistory(false), 
    reload: () => fetchHistory(true),
    clearHistory,
    logout: handleLogout 
  };
};