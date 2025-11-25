// src/features/auth/types.ts

// 1. Dữ liệu User (Trả về từ /me hoặc /register)
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

// 2. Dữ liệu trả về khi Login thành công (Token)
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// 3. Payload gửi lên để Login
export interface LoginPayload {
  username: string; // Backend yêu cầu field này là 'username'
  password: string;
}

// 4. Payload gửi lên để Đăng ký
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

// 5. State của Auth trong Redux Store
export interface AuthState {
  user: User | null;
  token: string | null;        // Access Token dùng để gọi API
  refreshToken?: string | null; // (Tùy chọn) Lưu nếu cần xử lý refresh token ở client
  isLoading: boolean;
  error: string | null;
}
// Giống Redux Action
export type AuthAction = 
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' };

