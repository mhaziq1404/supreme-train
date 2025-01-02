import { apiPost, apiGet, apiDelete } from './client.js';
import { API_CONFIG } from './config.js';

export const friendService = {
    async addFriend(userId) {
        return await apiPost(`${API_CONFIG.ENDPOINTS.USERS}/friends/${userId}`);
    },

    async removeFriend(userId) {
        return await apiDelete(`${API_CONFIG.ENDPOINTS.USERS}/friends/${userId}`);
    },

    async getFriends() {
        return await apiGet(`${API_CONFIG.ENDPOINTS.USERS}/friends`);
    },

    async getFriendRequests() {
        return await apiGet(`${API_CONFIG.ENDPOINTS.USERS}/friends/requests`);
    }
};