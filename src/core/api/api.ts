import { logout } from '@/features/auth/authSlice';
import axios, { AxiosInstance, AxiosError } from 'axios';
let store: any; // Biến local để giữ store
export const injectStore = (_store: any) => {
  store = _store;
};
// Default config
const API_BASE_URL = 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    // 👇 2. SỬA ĐOẠN NÀY: Lấy token từ Redux Store thay vì localStorage
    const state = store.getState();
    const accessToken = state.auth.token; // Đảm bảo đường dẫn state.auth.token đúng với rootReducer của bạn

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // (Giữ nguyên logic admin key nếu cần)
    const adminKey = localStorage.getItem('x-admin-key');
    if (adminKey) {
      config.headers['x-admin-key'] = adminKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Auth Errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('[API] Unauthorized. Clearing Redux state...');
      
   // Dispatch logout từ store local
      if (store) {
          // Import action logout ở đây hoặc dùng string 'auth/logout' nếu lười import để tránh cycle
          // Tốt nhất là import { logout } from authSlice ở đầu file (authSlice ko import api ở top level nên ok)
          // Nhưng để an toàn tuyệt đối, bạn có thể dispatch object trực tiếp nếu biết type:
          // store.dispatch({ type: 'auth/logout' }); 
          
          // Hoặc dùng cách import action creator (thường action creator nhẹ, không gây loop)
          // store.dispatch(logout()); 
          
          // Cách an toàn nhất để tránh loop tại đây là dùng Event hoặc dispatch action raw
           store.dispatch({ type: 'auth/logout' });
      }
      // (Tùy chọn) Vẫn dispatch event nếu bạn có logic khác lắng nghe ở index.tsx
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

// --- Public API Instance (No Auth Interceptors) ---
// Used for status checks and initial handshakes
export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;