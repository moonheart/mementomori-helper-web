import apiClient from './axios-client';

/**
 * Ortega API 通用调用函数
 * 用于调用通过代理系统暴露的所有 Ortega 游戏接口
 */
export async function callOrtegaApi<TRequest, TResponse>(
    category: string,
    action: string,
    request: TRequest = {} as TRequest
): Promise<TResponse> {
    const response = await apiClient.post<TResponse>(
        `/api/ortega/${category}/${action}`,
        request
    );
    return response.data;
}

/**
 * 获取所有可用的 Ortega API 列表
 */
export async function getOrtegaApiList(): Promise<{
    total: number;
    apis: Array<{
        uri: string;
        requestType: string;
        responseType: string;
        isRequiredLogin: boolean;
        isIgnoreMaintenance: boolean;
    }>;
}> {
    const response = await apiClient.get('/api/ortega/list');
    return response.data;
}

/**
 * Ortega API 辅助函数 - 简化常用 API 调用
 */
export const ortegaApi = {
    // User 相关
    user: {
        getUserData: (request = {}) =>
            callOrtegaApi('user', 'getUserData', request),
        getMypage: (request = {}) =>
            callOrtegaApi('user', 'getMypage', request),
        loginPlayer: (request: any) =>
            callOrtegaApi('user', 'loginPlayer', request),
    },

    // Mission 相关
    mission: {
        getMissionInfo: (request: any) =>
            callOrtegaApi('mission', 'getMissionInfo', request),
        rewardMission: (request: any) =>
            callOrtegaApi('mission', 'rewardMission', request),
        rewardMissionActivity: (request: any) =>
            callOrtegaApi('mission', 'rewardMissionActivity', request),
    },

    // Shop 相关
    shop: {
        getList: (request = {}) =>
            callOrtegaApi('shop', 'getList', request),
        getProductList: (request = {}) =>
            callOrtegaApi('shop', 'getProductList', request),
        buyProduct: (request: any) =>
            callOrtegaApi('shop', 'buyProduct', request),
    },

    // Battle 相关
    battle: {
        getPvpInfo: (request = {}) =>
            callOrtegaApi('battle', 'getPvpInfo', request),
        pvpStart: (request: any) =>
            callOrtegaApi('battle', 'pvpStart', request),
        quick: (request: any) =>
            callOrtegaApi('battle', 'quick', request),
    },

    // Character 相关
    character: {
        levelUp: (request: any) =>
            callOrtegaApi('character', 'levelUp', request),
        rankUp: (request: any) =>
            callOrtegaApi('character', 'rankUp', request),
    },

    // Equipment 相关
    equipment: {
        reinforcement: (request: any) =>
            callOrtegaApi('equipment', 'reinforcement', request),
        change: (request: any) =>
            callOrtegaApi('equipment', 'change', request),
    },
};

export default ortegaApi;
