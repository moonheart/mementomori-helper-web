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
    Star,
    Target,
    Coins,
    Loader2
} from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { ortegaApi } from '@/api/ortega-client';
import { MissionGroupType, MissionStatusType, GetMissionInfoResponse, MissionActivityRewardStatusType, UserMissionDtoInfo, MissionInfo } from '@/api/generated';

interface UIStoreMission {
    id: number;
    title: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
    claimed: boolean;
    rewards: Array<{ type: string; amount: number }>;
}

export function MissionsPage() {
    const { currentAccountId } = useAccountStore();
    const [loading, setLoading] = useState(false);
    const [missionData, setMissionData] = useState<GetMissionInfoResponse | null>(null);
    const [claiming, setClaiming] = useState<Set<number>>(new Set());

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
            await fetchMissionInfo();
        } catch (error) {
            console.error('Failed to claim activity reward:', error);
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

    // 辅助函数：将接口原始数据转换为 UI 模型
    const mapMissions = (groupType: MissionGroupType): UIStoreMission[] => {
        const groupInfo = getGroupInfo(groupType);
        if (!groupInfo || !groupInfo.userMissionDtoInfoDict) return [];
        
        const missions: UIStoreMission[] = [];

        // 遍历字典中的所有 MissionType
        Object.values(groupInfo.userMissionDtoInfoDict).forEach((dtoList) => {
            if (!dtoList) return;
            (dtoList as UserMissionDtoInfo[]).forEach((dto) => {
                const isClaimed = (dto.missionStatusHistory?.[MissionStatusType.Received]?.length ?? 0) > 0;
                const isCompleted = isClaimed || (dto.missionStatusHistory?.[MissionStatusType.NotReceived]?.length ?? 0) > 0;
                
                const missionId = 
                    dto.missionStatusHistory?.[MissionStatusType.NotReceived]?.[0] || 
                    dto.missionStatusHistory?.[MissionStatusType.Progress]?.[0] || 
                    dto.missionStatusHistory?.[MissionStatusType.Received]?.[0] || 
                    dto.achievementType;

                missions.push({
                    id: missionId,
                    title: `任务 ${dto.achievementType}`,
                    description: `成就类型: ${dto.achievementType}`,
                    progress: dto.progressCount,
                    target: 0, 
                    completed: isCompleted,
                    claimed: isClaimed,
                    rewards: []
                });
            });
        });

        return missions;
    };

    const dailyMissions = useMemo(() => mapMissions(MissionGroupType.Daily), [missionData]);
    const weeklyMissions = useMemo(() => mapMissions(MissionGroupType.Weekly), [missionData]);
    const mainMissions = useMemo(() => mapMissions(MissionGroupType.Main), [missionData]);

    const activityInfo = useMemo(() => getGroupInfo(MissionGroupType.Daily)?.userMissionActivityDtoInfo, [missionData]);
    const totalMerit = activityInfo?.progressCount || 0;
    
    // 功勋宝箱
    const meritBoxes = useMemo(() => {
        if (!activityInfo?.rewardStatusDict) return [];
        
        return Object.entries(activityInfo.rewardStatusDict)
            .map(([count, status]) => ({
                id: Number(count),
                required: Number(count),
                status: Number(status),
                claimed: Number(status) === MissionActivityRewardStatusType.Received
            }))
            .sort((a, b) => a.required - b.required);
    }, [activityInfo]);

    const getRewardIcon = (type: string) => {
        const icons: Record<string, React.ReactElement> = {
            'diamond': <span className="text-cyan-500">💎</span>,
            'gold': <Coins className="h-4 w-4 text-yellow-600" />,
            'exp': <Star className="h-4 w-4 text-purple-500" />,
            'merit': <Trophy className="h-4 w-4 text-orange-500" />
        };
        return icons[type] || <Gift className="h-4 w-4" />;
    };

    const renderMissionCard = (mission: UIStoreMission, showProgress = true) => {
        const progress = mission.target ? (mission.progress / mission.target) * 100 : 0;
        const canClaim = mission.completed && !mission.claimed;
        const isClaiming = claiming.has(mission.id);

        return (
            <Card key={`${mission.id}-${mission.title}`} className={canClaim ? 'border-2 border-primary shadow-md' : ''}>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${canClaim ? 'bg-primary text-primary-foreground' : mission.completed ? 'bg-green-100 dark:bg-green-950 text-green-600' : 'bg-muted'}`}>
                        {mission.completed ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-semibold">{mission.title}</h3>
                                <p className="text-sm text-muted-foreground">{mission.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {mission.completed && (
                                    <Badge variant={canClaim ? 'default' : 'secondary'}>
                                        {canClaim ? '可领取' : '已领取'}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {showProgress && mission.target > 0 && (
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex-1">
                                    <Progress value={progress} />
                                </div>
                                <span className="text-sm text-muted-foreground min-w-[70px] text-right">
                                    {mission.progress}/{mission.target}
                                </span>
                            </div>
                        )}

                        {mission.rewards.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                                <Gift className="h-4 w-4 text-muted-foreground" />
                                <div className="flex gap-2 flex-wrap">
                                    {mission.rewards.map((reward, idx) => (
                                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                            {getRewardIcon(reward.type)}
                                            {reward.amount.toLocaleString()}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {canClaim && (
                        <Button onClick={() => handleClaimMission(mission.id)} disabled={isClaiming}>
                            {isClaiming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gift className="mr-2 h-4 w-4" />}
                            领取
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    };

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
                <Button onClick={fetchMissionInfo} disabled={loading} variant="outline">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    刷新
                </Button>
            </div>

            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>任务说明：</strong>
                    每日任务每天4:00重置，每周任务周一4:00重置。
                </AlertDescription>
            </Alert>

            {/* 功勋进度 */}
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-orange-500" />
                        功勋银币
                    </CardTitle>
                    <CardDescription>完成任务获得功勋，开启宝箱领取奖励</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">当前功勋</span>
                        <span className="text-2xl font-bold text-orange-600">{totalMerit}</span>
                    </div>

                    <div className="grid gap-3 grid-cols-5">
                        {meritBoxes.map((box) => {
                            const canOpen = box.status === MissionActivityRewardStatusType.NotReceived;
                            return (
                                <div
                                    key={box.id}
                                    className={`p-4 rounded-lg text-center transition-all ${box.claimed
                                        ? 'bg-muted opacity-50'
                                        : canOpen
                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white cursor-pointer hover:scale-105'
                                            : 'bg-muted'
                                        }`}
                                    onClick={() => canOpen && handleClaimActivityReward(MissionGroupType.Daily, box.required)}
                                >
                                    <div className="text-2xl mb-2">
                                        {box.claimed ? '✅' : canOpen ? '🎁' : '🔒'}
                                    </div>
                                    <div className="text-xs font-semibold">{box.required} 功勋</div>
                                    <div className="text-xs mt-1 opacity-75">
                                        {box.claimed ? '已领取' : canOpen ? '可开启' : '未解锁'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="daily">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="daily">每日</TabsTrigger>
                    <TabsTrigger value="weekly">每周</TabsTrigger>
                    <TabsTrigger value="main">主线</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4 mt-6">
                    {dailyMissions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">暂无每日任务</div>
                    ) : (
                        dailyMissions.map(m => renderMissionCard(m))
                    )}
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4 mt-6">
                    {weeklyMissions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">暂无每周任务</div>
                    ) : (
                        weeklyMissions.map(m => renderMissionCard(m))
                    )}
                </TabsContent>

                <TabsContent value="main" className="space-y-4 mt-6">
                    {mainMissions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">暂无主线任务</div>
                    ) : (
                        mainMissions.map(m => renderMissionCard(m, false))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
