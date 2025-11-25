import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/core/services/authService';
import { AuthState, LoginPayload, RegisterPayload } from './types';
import api from '@/core/api/api'; // Sử dụng instance api chung

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// --- THUNKS ---

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterPayload, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Đăng ký thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: LoginPayload, thunkAPI) => {
    try {
      // 1. Lấy Token
      const data = await authService.login(userData);
      const accessToken = data.access_token;

      // 2. Dùng Token vừa có để lấy thông tin User ngay lập tức
      // SỬA LỖI Ở ĐÂY: Dùng đúng đường dẫn /api/v2/auth/me
      const userResponse = await api.get('/api/v2/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // 3. Trả về cả Token và User info
      return {
        tokens: data,
        user: userResponse.data
      };
      
    } catch (error: any) {
      console.error("Login Error:", error); // Log lỗi ra console để debug
      const message = error.response?.data?.detail || 'Đăng nhập thất bại';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout', 
  async (_, thunkAPI) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    }
  }
);

// --- SLICE ---

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.tokens.access_token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;