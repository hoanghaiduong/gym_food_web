import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authReducer from '@/features/auth/authSlice';

// 1. Cấu hình Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Chỉ lưu slice 'auth', các slice khác (như chat) sẽ reset khi F5
};

const rootReducer = combineReducers({
  auth: authReducer,
  // chat: chatReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 2. Tạo Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua check serializable cho các actions của redux-persist để tránh lỗi console
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 3. Tạo Persistor (để dùng trong main.tsx)
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;