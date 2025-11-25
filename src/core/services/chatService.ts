import { publicApi } from '@/core/api/api';

export const chatService = {
  sendMessage: async (question: string) => {
    const response = await publicApi.post('/api/v2/chat', { question });
    return response.data;
  }
};