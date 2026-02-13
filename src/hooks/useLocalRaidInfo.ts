import { useState, useEffect, useCallback, useMemo } from 'react';
import { ortegaApi } from '@/api/ortega-client';
import { useMasterTable } from '@/hooks/useMasterData';
import { LocalRaidBannerMB } from '@/api/generated/localRaidBannerMB';
import { LocalRaidBonusScheduleMB } from '@/api/generated/localRaidBonusScheduleMB';
import { LocalRaidQuestInfo } from '@/api/generated/localRaidQuestInfo';
import { LocalRaidEnemyInfo } from '@/api/generated/localRaidEnemyInfo';
import { LocalRaidBattleLogInfo } from '@/api/generated/localRaidBattleLogInfo';
import { timeManager } from '@/lib/time-manager';

/**
 * 幻影神殿信息 Hook
 * 获取幻影神殿的任务、敌人、奖励等信息
 */
export function useLocalRaidInfo() {
    const [loading, setLoading] = useState(true);
    const [questInfos, setQuestInfos] = useState<LocalRaidQuestInfo[]>([]);
    const [enemyInfos, setEnemyInfos] = useState<LocalRaidEnemyInfo[]>([]);
    const [openQuestIds, setOpenQuestIds] = useState<number[]>([]);
    const [eventQuestIds, setEventQuestIds] = useState<number[]>([]);
    const [clearCountDict, setClearCountDict] = useState<Record<number, number>>({});
    const [challengeCount, setChallengeCount] = useState(0);

    // 获取 Master 数据
    const { data: bannerTable, loading: bannerLoading } = useMasterTable<LocalRaidBannerMB>('LocalRaidBannerTable');
    const { data: bonusScheduleTable, loading: bonusLoading } = useMasterTable<LocalRaidBonusScheduleMB>('LocalRaidBonusScheduleTable');

    // 获取 API 数据
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ortegaApi.localRaid.getLocalRaidInfo({});
            setQuestInfos(response.localRaidQuestInfos || []);
            setEnemyInfos(response.localRaidEnemyInfos || []);
            setOpenQuestIds(response.openLocalRaidQuestIds || []);
            setEventQuestIds(response.openEventLocalRaidQuestIds || []);
            setClearCountDict(response.clearCountDict || {});
            setChallengeCount(response.userSyncData?.localRaidChallengeCount || 0);
        } catch (error) {
            console.error('Failed to fetch local raid info:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 计算剩余次数（每天最多6次）
    const remainingCount = useMemo(() => 6 - challengeCount, [challengeCount]);

    // 判断当前是否在加成时段
    const bonusTimeInfo = useMemo(() => {
        if (!bonusScheduleTable || bonusScheduleTable.length === 0) {
            return { inBonus: false, nextBonusTime: null, bonusRate: 0 };
        }

        const schedule = bonusScheduleTable[0];
        const now = new Date(timeManager.getServerNowMs());
        const currentMinutes = now.getHours() * 100 + now.getMinutes();

        for (const time of schedule.localRaidStartEndTimes) {
            if (currentMinutes >= time.startTime && currentMinutes <= time.endTime) {
                return { 
                    inBonus: true, 
                    nextBonusTime: null, 
                    bonusRate: schedule.rewardBonusRate / 100 
                };
            }
        }

        // 找下一个加成时段
        let nextTime: number | null = null;
        for (const time of schedule.localRaidStartEndTimes) {
            if (time.startTime > currentMinutes) {
                nextTime = time.startTime;
                break;
            }
        }
        // 如果今天没有了，取明天的第一个
        if (nextTime === null && schedule.localRaidStartEndTimes.length > 0) {
            nextTime = schedule.localRaidStartEndTimes[0].startTime;
        }

        return { 
            inBonus: false, 
            nextBonusTime: nextTime, 
            bonusRate: schedule.rewardBonusRate / 100 
        };
    }, [bonusScheduleTable]);

    // 获取殿堂名称
    const getTempleName = useCallback((bannerId: number): string => {
        const banner = bannerTable?.find(b => b.id === bannerId);
        return banner?.nameKey || `殿堂 ${bannerId}`;
    }, [bannerTable]);

    // 获取敌人信息
    const getEnemyInfo = useCallback((enemyId: number): LocalRaidEnemyInfo | undefined => {
        return enemyInfos.find(e => e.id === enemyId);
    }, [enemyInfos]);

    // 获取任务的敌人列表
    const getQuestEnemies = useCallback((quest: LocalRaidQuestInfo): LocalRaidEnemyInfo[] => {
        return quest.localRaidEnemyIds
            .map(id => getEnemyInfo(id))
            .filter((e): e is LocalRaidEnemyInfo => e !== undefined);
    }, [getEnemyInfo]);

    // 判断任务是否已通关
    const isQuestCleared = useCallback((questId: number): boolean => {
        return (clearCountDict[questId] || 0) > 0;
    }, [clearCountDict]);

    return {
        loading: loading || bannerLoading || bonusLoading,
        questInfos,
        enemyInfos,
        openQuestIds,
        eventQuestIds,
        clearCountDict,
        remainingCount,
        challengeCount,
        bonusTimeInfo,
        bannerTable,
        getTempleName,
        getEnemyInfo,
        getQuestEnemies,
        isQuestCleared,
        refresh: fetchData
    };
}

/**
 * 幻影神殿战斗记录 Hook
 */
export function useLocalRaidBattleLogs() {
    const [logs, setLogs] = useState<LocalRaidBattleLogInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ortegaApi.localRaid.getLocalRaidBattleLogs({});
            setLogs(response.localRaidBattleLogInfoList || []);
        } catch (error) {
            console.error('Failed to fetch battle logs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, loading, refresh: fetchLogs };
}
