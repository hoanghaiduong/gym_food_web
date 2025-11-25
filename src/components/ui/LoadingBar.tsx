import React, { useEffect, useState } from 'react';
import { useUI } from '@/core/contexts/UIContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; // Đảm bảo import đúng đường dẫn store

const LoadingBar: React.FC = () => {
  // 1. Lấy trạng thái loading từ UI Context (dùng cho các tác vụ thủ công)
  const { isLoading: isUILoading } = useUI();

  // 2. Lấy trạng thái loading từ Redux Auth (dùng cho Login/Register)
  const { isLoading: isAuthLoading } = useSelector((state: RootState) => state.auth);

  // 3. Gom lại: Chỉ cần 1 trong 2 cái đang load thì hiện bar
  const isLoading = isUILoading || isAuthLoading;

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      // Hiệu ứng Trickle: chạy nhanh lúc đầu, chậm dần, không bao giờ tới 100% nếu chưa xong
      interval = setInterval(() => {
        setProgress((prev) => {
          const remaining = 90 - prev;
          if (remaining <= 0) return 90;
          const increment = Math.max(Math.random() * (remaining / 5), 0.5);
          return prev + increment;
        });
      }, 200);
    } else {
      // Khi đã xong (isLoading = false)
      if (isVisible) {
        setProgress(100);
        // Đợi thanh chạy hết tới 100% rồi mới ẩn đi
        setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 400); 
      }
    }

    return () => clearInterval(interval);
  }, [isLoading, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      {/* Thanh Loading */}
      <div 
        className="h-full bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 shadow-[0_0_10px_#84CC16] transition-all ease-out duration-300"
        style={{ width: `${progress}%` }}
      />
      
      {/* Hiệu ứng đầu thanh phát sáng */}
      <div 
        className="absolute top-0 right-0 h-1 w-[100px] bg-gradient-to-r from-transparent to-white opacity-50 shadow-[0_0_10px_#fff]"
        style={{ 
            left: `calc(${progress}% - 100px)`,
            display: progress === 100 ? 'none' : 'block'
        }} 
      />
    </div>
  );
};

export default LoadingBar;