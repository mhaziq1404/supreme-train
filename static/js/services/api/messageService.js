import { apiGet, apiPost, apiPut, apiDelete } from './client.js';
import { API_CONFIG } from './config.js';

export const messageService = {
    async getMessages(userId) {
        return await apiGet(`${API_CONFIG.ENDPOINTS.MESSAGES}/${userId || ''}`);
    },

    async syncChats(chats) {
        return await apiPost(`${API_CONFIG.ENDPOINTS.MESSAGES}/sync`, {
            chats: Array.from(chats.entries()).map(([userId, messages]) => ({
                userId,
                messages
            }))
        });
    },

    async sendMessage(recipientId, content) {
        return await apiPost(API_CONFIG.ENDPOINTS.MESSAGES, {
            recipientId,
            content
        });
    },

    async markAsRead(messageId) {
        return await apiPut(`${API_CONFIG.ENDPOINTS.MESSAGES}/${messageId}/read`);
    },

    async deleteMessage(messageId) {
        return await apiDelete(`${API_CONFIG.ENDPOINTS.MESSAGES}/${messageId}`);
    },

    async getUnreadCount() {
        return await apiGet(`${API_CONFIG.ENDPOINTS.MESSAGES}/unread/count`);
    }
};