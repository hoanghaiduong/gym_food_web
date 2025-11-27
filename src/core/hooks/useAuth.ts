import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import thêm useSelector
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '@/features/auth/authSlice';
import { RootState } from '@/redux/store'; // Import RootState để lấy type

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  
  // 1. Lấy thông tin User và Token từ Redux ngay tại đây
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  // Kiểm tra xem đã đăng nhập chưa
  const isAuthenticated = !!token; 

  // 2. Hàm Logout (Giữ nguyên logic cũ)
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap(); 
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]);

  // 3. Trả về tất cả mọi thứ liên quan đến Auth
  return { 
      user,           // Thông tin user (tên, avatar...)
      isAuthenticated,// Check xem đã login chưa (true/false)
      isLoading,      // Đang loading login/logout không
      logout          // Hàm đăng xuất
  };
};