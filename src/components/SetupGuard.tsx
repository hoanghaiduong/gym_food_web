import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SetupGuardProps {
  children: React.ReactNode;
}

const SetupGuard: React.FC<SetupGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [isChecking, setIsChecking] = useState(true);

  // 1. Lấy token và user từ Redux store
  const { token, user } = useSelector((state: RootState) => state.auth);
  
  // 2. Kiểm tra quyền Admin
  // (Lưu ý: Backend phải trả về field 'role' trong object user)
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const localSetupStatus = localStorage.getItem('system_setup_status');
        
        // Check Auth: Có token redux HOẶC có key admin tạm thời (lúc setup)
        const hasAuthToken = !!token || !!localStorage.getItem('x-admin-key');
        
        const isSetupComplete = localSetupStatus === 'completed';
        const path = location.pathname;

        // --- KỊCH BẢN 1: HỆ THỐNG CHƯA CÀI ĐẶT ---
        if (!isSetupComplete) {
            // Bắt buộc phải vào trang /setup
            if (path !== '/setup') {
                navigate('/setup', { replace: true });
            }
        } 
        // --- KỊCH BẢN 2: HỆ THỐNG ĐÃ CÀI ĐẶT XONG ---
        else {
            // Đã xong mà cố truy cập /setup -> Đá về Login
            if (path === '/setup') {
                 navigate('/login', { replace: true });
                 return;
            }

            // Định nghĩa các nhóm route
            const isAuthRoute = path.startsWith('/login') || 
                                path.startsWith('/register') || 
                                path.startsWith('/forgot-password');
            
            // Các route chỉ dành cho Admin
            const isAdminRoute = path.startsWith('/dashboard') ||
                                 path.startsWith('/knowledge') ||
                                 path.startsWith('/bot-config') ||
                                 path.startsWith('/theme-studio') ||
                                 path.startsWith('/logs') ||
                                 path.startsWith('/settings') ||
                                 path.startsWith('/playground');

            // --- TRƯỜNG HỢP A: CHƯA ĐĂNG NHẬP ---
            if (!hasAuthToken) {
                 // Nếu cố truy cập trang Admin -> Đá về Login
                 if (isAdminRoute) {
                    navigate('/login', { replace: true });
                 }
                 // Các trang public (/, /chat...) thì cho phép truy cập
            }
            // --- TRƯỜNG HỢP B: ĐÃ ĐĂNG NHẬP ---
            else {
                 // 1. Đang ở trang Auth (Login/Register)
                 if (isAuthRoute) {
                     if (isAdmin) {
                         // Admin -> Vào Dashboard
                         navigate('/dashboard', { replace: true });
                     } else {
                         // User thường -> Về trang chủ Chat
                         navigate('/', { replace: true });
                     }
                 }
                 // 2. Đang cố vào trang Admin
                 else if (isAdminRoute) {
                     if (!isAdmin) {
                         // Có token nhưng không phải admin -> Đá về trang chủ (hoặc trang 403)
                         console.warn("Unauthorized access attempt to Admin area");
                         navigate('/', { replace: true });
                     }
                 }
                 // 3. Các trang khác (/) -> Cho phép cả Admin lẫn User
            }
        }
      } catch (error) {
        console.error("Guard Error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSystem();
  }, [navigate, location.pathname, token, isAdmin]);

  if (isChecking) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#030712]' : 'bg-[#F9FAFB]'}`}>
         <Loader2 size={48} className="text-brand-lime animate-spin mb-4" />
      </div>
    );
  }

  return <>{children}</>;
};

export default SetupGuard;