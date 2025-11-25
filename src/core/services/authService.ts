import api from '@/core/api/api';
import { LoginPayload, RegisterPayload } from '@/features/auth/types';

// Prefix chung dựa trên hình ảnh Swagger bạn gửi
const AUTH_URL = '/api/v2/auth';

const authService = {
  // 1. Đăng ký
  register: async (userData: RegisterPayload) => {
    // POST /api/v2/auth/register
    const response = await api.post(`${AUTH_URL}/register`, userData);
    return response.data;
  },

  // 2. Đăng nhập
  login: async (userData: LoginPayload) => {
    // POST /api/v2/auth/login
    const response = await api.post(`${AUTH_URL}/login`, userData);
    return response.data;
  },

  // 3. Lấy thông tin user (Me)
  getMe: async () => {
    // GET /api/v2/auth/me
    const response = await api.get(`${AUTH_URL}/me`);
    return response.data;
  },

  // 4. Đăng xuất
  logout: async () => {
    // POST /api/v2/auth/logout
    const response = await api.post(`${AUTH_URL}/logout`);
    return response.data;
  },
  
  // 5. Refresh Token (nếu cần dùng sau này)
  refreshToken: async (token: string) => {
    const response = await api.post(`${AUTH_URL}/refresh`, { refresh_token: token });
    return response.data;
  }
};

export default authService;