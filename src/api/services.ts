import apiClient from './axios-client';
import type { AccountInfo, AddAccountRequest } from './generated/account-info';
import type { PlayerInfo, CharacterInfo, CharacterDetailInfo } from './generated/player-info';
import type { ShopItem, BuyItemRequest, BuyItemResponse, AutoBuyConfig } from './generated/shop-item';

// Auth API
export const authApi = {
    getAccounts: () => apiClient.get<AccountInfo[]>('/api/auth/accounts'),
    addAccount: (request: AddAccountRequest) => apiClient.post<AccountInfo>('/api/auth/accounts', request),
    deleteAccount: (id: number) => apiClient.delete(`/api/auth/accounts/${id}`),
    activateAccount: (id: number) => apiClient.post(`/api/auth/accounts/${id}/activate`),
};

// Player API
export const playerApi = {
    getCurrentPlayer: () => apiClient.get<PlayerInfo>('/api/players/current'),
    getCharacters: () => apiClient.get<CharacterInfo[]>('/api/players/characters'),
    getCharacterDetail: (guid: string) => apiClient.get<CharacterDetailInfo>(`/api/players/characters/${guid}`),
};

// Shop API
export const shopApi = {
    getShopItems: () => apiClient.get<ShopItem[]>('/api/shop/items'),
    buyItem: (request: BuyItemRequest) => apiClient.post<BuyItemResponse>('/api/shop/buy', request),
    getAutoBuyConfig: () => apiClient.get<AutoBuyConfig>('/api/shop/auto-buy-config'),
    updateAutoBuyConfig: (config: AutoBuyConfig) => apiClient.put('/api/shop/auto-buy-config', config),
};
