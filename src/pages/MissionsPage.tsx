import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Trophy,
    Gift,
    CheckCircle2,
    BookOpen,
    Target,
    Loader2
} from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { ortegaApi } from '@/api/ortega-client';
import { MissionGroupType, MissionStatusType, MissionGetMissionInfoResponse, MissionActivityRewardStatusType, UserMissionDtoInfo, MissionInfo, TotalActivityMedalRewardMB } from '@/api/generated';
import { useMasterData, useMasterTable } from '@/hooks/useMasterData';
import { useLocalizationStore } from '@/store/localization-store';

interface UIStoreMission {
    id: number;
    missionType: number;
    status: MissionStatusType;
    progress: number;
    // 以下通过 Master 数据填充
    title?: string;
    description?: string;
    target?: number;
}

/**
 * 提取任务卡片组件以使用 useMasterData
 */
function MissionRow({ mission, onClaim, isClaiming }: { 
    mission: UIStoreMission, 
    onClaim: () => void,
    isClaiming: boolean
}) {
    const { data: mb } = useMasterData('MissionTable', mission.id);
    const t = useLocalizationStore(state => state.t);
    
    const title = mb ? t(mb.nameKey) : `任务 ${mission.id}`;
    const description = mb ? t(mb.descriptionKey) : `类型: ${mission.missionType}`;
    const target = mb ? mb.requireValue : 0;

    const isCompleted = mission.status === MissionStatusType.NotReceived || mission.status === MissionStatusType.Received;
    const isClaimed = mission.status === MissionStatusType.Received;
    const canClaim = mission.status === MissionStatusType.NotReceived;

    const progress = target ? (mission.progress / target) * 100 : 0;

    return (
        <Card className={canClaim ? 'border-2 border-primary shadow-md h-full' : 'h-full'}>
            <CardContent className="flex flex-col gap-3 p-4 h-full">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${canClaim ? 'bg-primary text-primary-foreground' : isClaimed ? 'bg-green-100 dark:bg-green-950 text-green-600' : 'bg-muted'}`}>
                        {isClaimed ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{description}</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-end space-y-3">
                    <div className="flex items-center justify-between">
                        {isCompleted ? (
                            <Badge variant={canClaim ? 'default' : 'secondary'}>
                                {canClaim ? '可领取' : '已领取'}
                            </Badge>
                        ) : mission.status === MissionStatusType.Locked ? (
                            <Badge variant="outline">未解锁</Badge>
                        ) : (
                            <Badge variant="outline">进行中</Badge>
                        )}
                    </div>

                    {mission.status === MissionStatusType.Progress && target > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>进度</span>
                                <span>{mission.progress}/{target}</span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                        </div>
                    )}

                    {canClaim && (
                        <Button className="w-full mt-2" size="sm" onClick={onClaim} disabled={isClaiming}>
                            {isClaiming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gift className="mr-2 h-4 w-4" />}
                            领取奖励
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function MissionsPage() {
    const { currentAccountId } = useAccountStore();
    const [loading, setLoading] = useState(false);
    const [missionData, setMissionData] = useState<MissionGetMissionInfoResponse | null>(null);
    const [claiming, setClaiming] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState('daily');
    const { data: totalActivityMedalRewardTable } = useMasterTable<TotalActivityMedalRewardMB>('TotalActivityMedalRewardTable');

    // 获取任务信息
    const fetchMissionInfo = async () => {
        if (!currentAccountId) return;

        setLoading(true);
        try {
            const response = await ortegaApi.mission.getMissionInfo({
                targetMissionGroupList: [
                    MissionGroupType.Daily,
                    MissionGroupType.Weekly,
                    MissionGroupType.Main
                ]
            });
            setMissionData(response);
        } catch (error) {
            console.error('Failed to fetch mission info:', error);
        } finally {
            setLoading(false);
        }
    };

    // 领取任务奖励
    const handleClaimMission = async (missionId: number) => {
        setClaiming(prev => new Set(prev).add(missionId));
        try {
            await ortegaApi.mission.rewardMission({
                targetMissionIdList: [missionId]
            });
            await fetchMissionInfo();
        } catch (error) {
            console.error('Failed to claim mission:', error);
        } finally {
            setClaiming(prev => {
                const newSet = new Set(prev);
                newSet.delete(missionId);
                return newSet;
            });
        }
    };

    // 领取功勋奖励
    const handleClaimActivityReward = async (missionGroupType: MissionGroupType, requiredCount: number) => {
        try {
            await ortegaApi.mission.rewardMissionActivity({
                missionGroupType,
                requiredCount
            });
        } catch (error) {
            console.error('Failed to claim activity reward:', error);
        }
    };

    // 一键领取所有可领取的奖励
    const handleClaimAll = async () => {
        if (!missionData || loading) return;

        setLoading(true);
        try {
            // 1. 领取普通任务奖励
            const allClaimableMissions = [...dailyMissions, ...weeklyMissions, ...mainMissions]
                .filter(m => m.status === MissionStatusType.NotReceived)
                .map(m => m.id);

            if (allClaimableMissions.length > 0) {
                await ortegaApi.mission.rewardMission({
                    targetMissionIdList: allClaimableMissions
                });
            }

            // 2. 领取功勋奖励
            const claimableMeritBoxes = meritBoxes.filter(box => box.status === MissionActivityRewardStatusType.NotReceived);
            for (const box of claimableMeritBoxes) {
                // 目前只处理 Daily 和 Weekly 的功勋
                await handleClaimActivityReward(MissionGroupType.Daily, box.required);
            }
            
            // 尝试领取周常功勋
            const weeklyGroupInfo = getGroupInfo(MissionGroupType.Weekly);
            if (weeklyGroupInfo?.userMissionActivityDtoInfo?.rewardStatusDict) {
                const weeklyActivityInfo = weeklyGroupInfo.userMissionActivityDtoInfo;
                const weeklyMeritBoxes = Object.entries(weeklyActivityInfo.rewardStatusDict)
                    .map(([rewardIdStr, status]) => {
                        const rewardId = Number(rewardIdStr);
                        const rewardMb = Object.values(totalActivityMedalRewardTable || {}).find(mb => mb.id === rewardId);
                        return {
                            required: rewardMb?.requiredActivityMedalCount ?? 0,
                            status: Number(status)
                        };
                    })
                    .filter(box => box.status === MissionActivityRewardStatusType.NotReceived);
                
                for (const box of weeklyMeritBoxes) {
                    await handleClaimActivityReward(MissionGroupType.Weekly, box.required);
                }
            }

            // 刷新数据
            await fetchMissionInfo();
        } catch (error) {
            console.error('Failed to claim all rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    // 页面加载时获取任务信息
    useEffect(() => {
        if (currentAccountId) {
            fetchMissionInfo();
        }
    }, [currentAccountId]);

    // 辅助函数：安全地从字典获取任务组信息 (兼容数字和字符串 Key)
    const getGroupInfo = (groupType: MissionGroupType): MissionInfo | undefined => {
        if (!missionData?.missionInfoDict) return undefined;
        const dict = missionData.missionInfoDict as Record<string | number, MissionInfo>;
        return dict[groupType] || dict[MissionGroupType[groupType]];
    };

    /**
     * 参考 Blazor 的逻辑解析任务状态
     */
    const mapMissions = (groupType: MissionGroupType): UIStoreMission[] => {
        const groupInfo = getGroupInfo(groupType);
        if (!groupInfo || !groupInfo.userMissionDtoInfoDict) return [];
        
        const missions: UIStoreMission[] = [];

        Object.values(groupInfo.userMissionDtoInfoDict).forEach((dtoList) => {
            if (!dtoList) return;
            (dtoList as UserMissionDtoInfo[]).forEach((dto) => {
                const history = dto.missionStatusHistory as Record<string | number, number[]>;
                if (!history) return;

                // 辅助获取 ID 列表 (兼容 Key)
                const getList = (type: MissionStatusType) => history[type] || history[MissionStatusType[type]] || [];

                let status: MissionStatusType | null = null;
                let missionId: number | null = null;

                const progressList = getList(MissionStatusType.Progress);
                const notReceivedList = getList(MissionStatusType.NotReceived);
                const lockedList = getList(MissionStatusType.Locked);
                const receivedList = getList(MissionStatusType.Received);

                // 优先级顺序：进行中 > 可领取 > 未解锁 > 已领取 (针对日常/周常)
                if (progressList.length > 0) {
                    status = MissionStatusType.Progress;
                    missionId = progressList[progressList.length - 1];
                } else if (notReceivedList.length > 0) {
                    status = MissionStatusType.NotReceived;
                    missionId = notReceivedList[notReceivedList.length - 1];
                } else if (lockedList.length > 0) {
                    status = MissionStatusType.Locked;
                    missionId = lockedList[lockedList.length - 1];
                } else if (receivedList.length > 0) {
                    status = MissionStatusType.Received;
                    missionId = receivedList[receivedList.length - 1];
                }

                if (missionId !== null && status !== null) {
                    missions.push({
                        id: missionId,
                        missionType: dto.missionType,
                        status: status,
                        progress: dto.progressCount
                    });
                }
            });
        });

        return missions;
    };

    const dailyMissions = useMemo(() => mapMissions(MissionGroupType.Daily), [missionData]);
    const weeklyMissions = useMemo(() => mapMissions(MissionGroupType.Weekly), [missionData]);
    const mainMissions = useMemo(() => mapMissions(MissionGroupType.Main), [missionData]);

    const currentGroupType = activeTab === 'daily' ? MissionGroupType.Daily :
                           activeTab === 'weekly' ? MissionGroupType.Weekly :
                           MissionGroupType.Main;

    const activityInfo = useMemo(() => getGroupInfo(currentGroupType)?.userMissionActivityDtoInfo, [missionData, currentGroupType]);
    const totalMerit = activityInfo?.progressCount || 0;
    
    // 功勋宝箱
    const meritBoxes = useMemo(() => {
        if (!activityInfo?.rewardStatusDict || !totalActivityMedalRewardTable) return [];

        const tableArray = Object.values(totalActivityMedalRewardTable);

        return Object.entries(activityInfo.rewardStatusDict)
            .map(([rewardIdStr, status]) => {
                const rewardId = Number(rewardIdStr);
                const rewardMb = tableArray.find(mb => mb.id === rewardId);
                const required = rewardMb?.requiredActivityMedalCount ?? 0;

                return {
                    id: rewardId,
                    required: required,
                    status: Number(status),
                    claimed: Number(status) === MissionActivityRewardStatusType.Received
                };
            })
            .sort((a, b) => a.required - b.required);
    }, [activityInfo, totalActivityMedalRewardTable]);

    if (!currentAccountId) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>未登录</CardTitle>
                        <CardDescription>请先登录账户以查看任务信息</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (loading && !missionData) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">加载中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">任务系统</h1>
                    <p className="text-muted-foreground mt-1">完成任务获取丰厚奖励</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleClaimAll} variant="secondary" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        一键领取
                    </Button>
                    <Button onClick={fetchMissionInfo} disabled={loading} variant="outline">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        刷新
                    </Button>
                </div>
            </div>

            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    每日任务每天4:00重置，每周任务周一4:00重置。
                </AlertDescription>
            </Alert>

            {/* 功勋进度 */}
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="h-5 w-5 text-orange-500" />
                        功勋奖励
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">当前功勋: <span className="font-bold text-orange-600">{totalMerit}</span></span>
                    </div>

                    <div className="grid gap-2 grid-cols-5">
                        {meritBoxes.map((box) => {
                            const canOpen = box.status === MissionActivityRewardStatusType.NotReceived;
                            return (
                                <div
                                    key={box.id}
                                    className={`p-2 rounded-md text-center transition-all border ${box.claimed
                                        ? 'bg-muted opacity-50'
                                        : canOpen
                                            ? 'bg-yellow-100 border-yellow-400 text-yellow-800 cursor-pointer hover:scale-105'
                                            : 'bg-muted border-transparent'
                                        }`}
                                    onClick={() => {
                                        if (canOpen) {
                                            handleClaimActivityReward(currentGroupType, box.required)
                                                .then(() => fetchMissionInfo());
                                        }
                                    }}
                                >
                                    <div className="text-xl mb-1">
                                        {box.claimed ? '✅' : canOpen ? '🎁' : '🔒'}
                                    </div>
                                    <div className="text-[10px] font-semibold">{box.required}</div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="daily">每日</TabsTrigger>
                    <TabsTrigger value="weekly">每周</TabsTrigger>
                    <TabsTrigger value="main">主线</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {dailyMissions.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted-foreground">暂无每日任务</div>
                    ) : (
                        dailyMissions.map(m => (
                            <MissionRow 
                                key={m.id} 
                                mission={m} 
                                onClaim={() => handleClaimMission(m.id)}
                                isClaiming={claiming.has(m.id)}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="weekly" className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {weeklyMissions.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted-foreground">暂无每周任务</div>
                    ) : (
                        weeklyMissions.map(m => (
                            <MissionRow 
                                key={m.id} 
                                mission={m} 
                                onClaim={() => handleClaimMission(m.id)}
                                isClaiming={claiming.has(m.id)}
                            />
                        ))
                    )}
                </TabsContent>

                <TabsContent value="main" className="grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {mainMissions.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted-foreground">暂无主线任务</div>
                    ) : (
                        mainMissions.map(m => (
                            <MissionRow 
                                key={m.id} 
                                mission={m} 
                                onClaim={() => handleClaimMission(m.id)}
                                isClaiming={claiming.has(m.id)}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
