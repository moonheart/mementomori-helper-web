import apiClient from './axios-client';
import type {
    ApiGetMissionInfoRequest,
    ApiGetMissionInfoResponse,
    ApiClaimMissionRequest,
    ApiClaimMissionResponse,
    ApiClaimActivityRewardRequest,
    ApiClaimActivityRewardResponse,
    MissionGroupType
} from './generated';

// Mission API
export const missionApi = {
    // 获取任务信息
    getMissionInfo: (userId: number, missionGroupTypes?: MissionGroupType[]) => {
        const params = new URLSearchParams();
        params.append('userId', userId.toString());
        if (missionGroupTypes && missionGroupTypes.length > 0) {
            missionGroupTypes.forEach(type => {
                params.append('missionGroupTypes', type.toString());
            });
        }
        return apiClient.get<ApiGetMissionInfoResponse>(`/api/mission/info?${params.toString()}`);
    },

    // 领取任务奖励
    claimMissionRewards: (request: ApiClaimMissionRequest) =>
        apiClient.post<ApiClaimMissionResponse>('/api/mission/claim', request),

    // 领取活跃度/功勋奖励
    claimActivityReward: (request: ApiClaimActivityRewardRequest) =>
        apiClient.post<ApiClaimActivityRewardResponse>('/api/mission/claim-activity', request),
};
