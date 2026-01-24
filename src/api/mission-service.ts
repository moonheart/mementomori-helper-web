import { ortegaApi } from './ortega-client';
import type {
    MissionGroupType,
    GetMissionInfoResponse,
    RewardMissionResponse,
    RewardMissionActivityResponse,
} from './generated';

/**
 * Mission API - 直接调用 Ortega 代理接口
 * 移除对中间层控制器 /api/mission 的依赖
 */
export const missionApi = {
    /**
     * 获取任务信息
     * @param missionGroupTypes 任务组类型列表
     * @returns 任务详细信息
     */
    getMissionInfo: (missionGroupTypes?: MissionGroupType[]): Promise<GetMissionInfoResponse> => {
        return ortegaApi.mission.getMissionInfo({
            targetMissionGroupList: missionGroupTypes || []
        });
    },

    /**
     * 领取任务奖励
     * @param missionIds 任务 ID 列表
     * @returns 领取结果
     */
    claimMissionRewards: (missionIds: number[]): Promise<RewardMissionResponse> =>
        ortegaApi.mission.rewardMission({
            targetMissionIdList: missionIds
        }),

    /**
     * 领取活跃度/功勋奖励
     * @param missionGroupType 任务组类型
     * @param requiredCount 所需功勋数量
     * @returns 领取结果
     */
    claimActivityReward: (missionGroupType: MissionGroupType, requiredCount: number): Promise<RewardMissionActivityResponse> =>
        ortegaApi.mission.rewardMissionActivity({
            missionGroupType,
            requiredCount
        }),
};
