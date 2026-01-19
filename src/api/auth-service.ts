import apiClient from './axios-client';
import type { AccountDto, AddAccountRequest, LoginRequest, LoginResponse, AutoLoginResponse, WorldInfo } from './generated';

// Auth API
export const authApi = {
    // Account management
    getAccounts: () => apiClient.get<AccountDto[]>('/api/auth/accounts'),
    addAccount: (request: AddAccountRequest) => apiClient.post<AccountDto>('/api/auth/accounts', request),
    deleteAccount: (userId: number) => apiClient.delete(`/api/auth/accounts/${userId}`),

    // Login
    login: (request: LoginRequest) => apiClient.post<LoginResponse>('/api/auth/login', request),
    autoLogin: () => apiClient.post<AutoLoginResponse>('/api/auth/auto-login'),
    getPlayerWorlds: (userId: number) => apiClient.get<WorldInfo[]>(`/api/auth/accounts/${userId}/worlds`),
};
