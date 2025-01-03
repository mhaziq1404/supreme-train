export const API_CONFIG = {
    // BASE_URL: 'https://burro-polished-evenly.ngrok-free.app/api',
    // BASE_URL: 'http://base:8000/api',
    BASE_URL: `${window.location.host}/api`,
    ENDPOINTS: {
        AUTH: '/auth',
        USERS: '/users',
        MATCHES: '/matches',
        TOURNAMENTS: '/tournaments',
        ROOMS: '/rooms/',
        MESSAGES: '/messages',
        STATS: '/stats',
        RANKINGS: '/rankings'
    }
};