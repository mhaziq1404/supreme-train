// Auth utility to handle authentication state and checks
export const auth = {
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    logout() {
        localStorage.removeItem('token');
        window.location.hash = '/login';
    },

    // List of routes that don't require authentication
    publicRoutes: ['/', '/login', '/register', '/404'],

    requiresAuth(path) {
        return !this.publicRoutes.includes(path);
    }
};