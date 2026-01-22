import axios from 'axios';
import { useAccountStore } from '@/store/accountStore';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add user ID header from current account
        const currentAccountId = useAccountStore.getState().currentAccountId;
        if (currentAccountId) {
            config.headers['X-User-Id'] = currentAccountId.toString();
        }

        // Keep existing auth token logic (if needed)
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 - redirect to account management page
        if (error.response?.status === 401) {
            // Clear current account
            useAccountStore.getState().setCurrentAccount(null);
            // Redirect to accounts page
            window.location.href = '/accounts';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
