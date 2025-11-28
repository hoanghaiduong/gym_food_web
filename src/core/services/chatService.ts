import api from '@/core/api/api';

// Định nghĩa kiểu dữ liệu cho Payload
interface ChatPayload {
  question: string;
  session_id?: string | null; 
}

export const chatService = {
  /**
   * Gửi tin nhắn tới AI.
   * Hỗ trợ 2 kiểu tham số:
   * 1. String (Legacy): "Câu hỏi..."
   * 2. Object (New): { question: "...", session_id: "..." }
   */
  sendMessage: async (payload: string | ChatPayload) => {
    // Kiểm tra nếu payload là string thì tự đóng gói lại thành object
    const data = typeof payload === 'string' 
      ? { question: payload } 
      : payload;

    const response = await api.post('/api/v2/chat', data);
    return response.data;
  }
};