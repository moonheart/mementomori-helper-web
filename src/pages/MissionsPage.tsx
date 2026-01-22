import { useEffect, useState } from 'react';
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
    Clock,
    BookOpen,
    Star,
    Target,
    Coins,
    Sparkles,
    Loader2
} from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { missionApi } from '@/api/mission-service';
import { MissionGroupType } from '@/api/generated';
// 使用浏览器alert替代toast，或者可以安装sonner: pnpm add sonner

export function MissionsPage() {
    const { currentAccountId } = useAccountStore();
    const [loading, setLoading] = useState(false);
    const [missionData, setMissionData] = useState<any>(null);
    const [claiming, setClaiming] = useState<Set<number>>(new Set());

    // 获取任务信息
    const fetchMissionInfo = async () => {
        if (!currentAccountId) {
            alert('请先登录账户');
            return;
        }

        setLoading(true);
        try {
            const response = await missionApi.getMissionInfo(
                currentAccountId,
                [
                    MissionGroupType.Daily,
                    MissionGroupType.Weekly,
                    MissionGroupType.Main
                ]
            );

            if (response.data.success) {
                setMissionData(response.data.missionInfoDict);
            } else {
                alert(response.data.message || '获取任务信息失败');
            }
        } catch (error: any) {
            console.error('Failed to fetch mission info:', error);
            alert(error.response?.data?.message || '获取任务信息失败');
        } finally {
            setLoading(false);
        }
    };

    // 领取任务奖励
    const handleClaimMission = async (missionId: number) => {
        if (!currentAccountId) {
            alert('请先登录账户');
            return;
        }

        setClaiming(prev => new Set(prev).add(missionId));
        try {
            const response = await missionApi.claimMissionRewards({
                userId: currentAccountId,
                missionIds: [missionId]
            });

            if (response.data.success) {
                alert('领取成功！');
                // 刷新任务信息
                await fetchMissionInfo();
            } else {
                alert(response.data.message || '领取失败');
            }
        } catch (error: any) {
            console.error('Failed to claim mission:', error);
            alert(error.response?.data?.message || '领取失败');
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
        if (!currentAccountId) {
            alert('请先登录账户');
            return;
        }

        try {
            const response = await missionApi.claimActivityReward({
                userId: currentAccountId,
                missionGroupType,
                requiredCount
            });

            if (response.data.success) {
                alert('领取功勋奖励成功！');
                // 刷新任务信息
                await fetchMissionInfo();
            } else {
                alert(response.data.message || '领取功勋奖励失败');
            }
        } catch (error: any) {
            console.error('Failed to claim activity reward:', error);
            alert(error.response?.data?.message || '领取功勋奖励失败');
        }
    };

    // 页面加载时获取任务信息
    useEffect(() => {
        if (currentAccountId) {
            fetchMissionInfo();
        }
    }, [currentAccountId]);

    const getRewardIcon = (type: string) => {
        const icons: Record<string, React.ReactElement> = {
            'diamond': <span className="text-cyan-500">💎</span>,
            'gold': <Coins className="h-4 w-4 text-yellow-600" />,
            'exp': <Star className="h-4 w-4 text-purple-500" />,
            'merit': <Trophy className="h-4 w-4 text-orange-500" />
        };
        return icons[type] || <Gift className="h-4 w-4" />;
    };

    const getTierBadge = (tier: string) => {
        const badges: Record<string, React.ReactElement> = {
            'platinum': <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500">铂金</Badge>,
            'gold': <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">黄金</Badge>,
            'silver': <Badge className="bg-gradient-to-r from-gray-400 to-gray-500">白银</Badge>
        };
        return badges[tier] || <Badge>普通</Badge>;
    };

    const renderMissionCard = (mission: any, showProgress = true) => {
        const progress = mission.target ? (mission.progress / mission.target) * 100 : 100;
        const canClaim = mission.completed && !mission.claimed;
        const isClaiming = claiming.has(mission.id);

        return (
            <Card key={mission.id} className={canClaim ? 'border-2 border-primary' : ''}>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${canClaim ? 'bg-primary text-primary-foreground' : mission.completed ? 'bg-green-100 dark:bg-green-950' : 'bg-muted'}`}>
                        {mission.completed ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Target className="h-6 w-6" />}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-semibold">{mission.title}</h3>
                                <p className="text-sm text-muted-foreground">{mission.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {mission.tier && getTierBadge(mission.tier)}
                                {mission.completed && (
                                    <Badge variant={canClaim ? 'default' : 'secondary'}>
                                        {canClaim ? '可领取' : '已领取'}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {showProgress && mission.target && (
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex-1">
                                    <Progress value={progress} />
                                </div>
                                <span className="text-sm text-muted-foreground min-w-[70px] text-right">
                                    {mission.progress}/{mission.target}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                            <Gift className="h-4 w-4 text-muted-foreground" />
                            <div className="flex gap-2 flex-wrap">
                                {mission.rewards?.map((reward: any, idx: number) => (
                                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                        {getRewardIcon(reward.type)}
                                        {reward.amount.toLocaleString()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {canClaim && (
                        <Button onClick={() => handleClaimMission(mission.id)} disabled={isClaiming}>
                            {isClaiming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    领取中...
                                </>
                            ) : (
                                <>
                                    <Gift className="mr-2 h-4 w-4" />
                                    领取
                                </>
                            )}
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    };

    // 如果没有登录
    if (!currentAccountId) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>未登录</CardTitle>
                        <CardDescription>
                            请先登录账户以查看任务信息
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // 加载中
    if (loading && !missionData) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">加载任务信息中...</p>
                </div>
            </div>
        );
    }

    // Mock数据供显示（真实API返回后会替换）
    const dailyMissions = [
        { id: 1, title: '完成3次高速战斗', description: '进行高速战斗获取资源', progress: 3, target: 3, completed: true, claimed: false, rewards: [{ type: 'gold', amount: 50000 }, { type: 'merit', amount: 20 }] },
    ];

    const weeklyMissions = [
        { id: 2, title: '完成20次高速战斗', progress: 15, target: 20, completed: false, rewards: [{ type: 'gold', amount: 200000 }, { type: 'merit', amount: 100 }] },
    ];

    const mainMissions = [
        { id: 3, title: '通关主线8-10', description: '推进主线冒险进度', completed: true, rewards: [{ type: 'diamond', amount: 300 }, { type: 'exp', amount: 5000 }] },
    ];

    const achievements = [
        { id: 4, title: '角色收集家', description: '获得50个不同角色', progress: 42, target: 50, tier: 'gold', completed: false, rewards: [{ type: 'diamond', amount: 1000 }] },
    ];

    const totalMerit = 135;
    const meritBoxes = [
        { id: 1, required: 50, rewards: [{ type: 'gold', amount: 10000 }], claimed: false },
        { id: 2, required: 100, rewards: [{ type: 'diamond', amount: 50 }], claimed: false },
        { id: 3, required: 200, rewards: [{ type: 'gold', amount: 50000 }], claimed: true },
        { id: 4, required: 300, rewards: [{ type: 'diamond', amount: 100 }], claimed: false }
    ];

    const completedDaily = dailyMissions.filter(m => m.completed).length;
    const completedWeekly = weeklyMissions.filter(m => m.completed).length;

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">任务系统</h1>
                    <p className="text-muted-foreground mt-1">
                        完成任务获取丰厚奖励
                    </p>
                </div>
                <Button onClick={fetchMissionInfo} disabled={loading} variant="outline">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            刷新中...
                        </>
                    ) : (
                        '刷新任务'
                    )}
                </Button>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>任务说明：</strong>
                    每日任务每天4:00重置，每周任务周一4:00重置。完成任务获得功勋银币，累积功勋可开启宝箱奖励。
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

                    <div className="grid gap-3 grid-cols-4">
                        {meritBoxes.map((box) => {
                            const canOpen = totalMerit >= box.required && !box.claimed;
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
                                    <div className="text-xs font-semibold">
                                        {box.required} 功勋
                                    </div>
                                    <div className="text-xs mt-1 opacity-75">
                                        {box.claimed ? '已领取' : canOpen ? '可开启' : '未解锁'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 进度概览 */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            每日任务
                        </CardTitle>
                        <CardDescription>
                            已完成 {completedDaily} / {dailyMissions.length} 个
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedDaily / dailyMissions.length) * 100} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-purple-500" />
                            每周任务
                        </CardTitle>
                        <CardDescription>
                            已完成 {completedWeekly} / {weeklyMissions.length} 个
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedWeekly / weeklyMissions.length) * 100} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            成就
                        </CardTitle>
                        <CardDescription>
                            已完成 {achievements.filter(a => a.completed).length} / {achievements.length} 个
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(achievements.filter(a => a.completed).length / achievements.length) * 100} />
                    </CardContent>
                </Card>
            </div>

            {/* 任务标签页 */}
            <Tabs defaultValue="daily">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="daily">每日</TabsTrigger>
                    <TabsTrigger value="weekly">每周</TabsTrigger>
                    <TabsTrigger value="main">主线</TabsTrigger>
                    <TabsTrigger value="achievement">成就</TabsTrigger>
                </TabsList>

                {/* 每日任务 */}
                <TabsContent value="daily" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">每日任务</h3>
                            <p className="text-sm text-muted-foreground">每天4:00（服务器时间）重置</p>
                        </div>
                        <Button variant="outline" size="sm">
                            一键领取
                        </Button>
                    </div>
                    {dailyMissions.map(m => renderMissionCard(m))}
                </TabsContent>

                {/* 每周任务 */}
                <TabsContent value="weekly" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">每周任务</h3>
                            <p className="text-sm text-muted-foreground">每周一4:00（服务器时间）重置</p>
                        </div>
                    </div>
                    {weeklyMissions.map(m => renderMissionCard(m))}
                </TabsContent>

                {/* 主线任务 */}
                <TabsContent value="main" className="space-y-4 mt-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">主线任务</h3>
                        <p className="text-sm text-muted-foreground">根据游戏进度解锁，一次性任务</p>
                    </div>
                    {mainMissions.map(m => renderMissionCard(m, false))}
                </TabsContent>

                {/* 成就任务 */}
                <TabsContent value="achievement" className="space-y-4 mt-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">成就系统</h3>
                        <p className="text-sm text-muted-foreground">长期目标，挑战自我</p>
                    </div>
                    {achievements.map(a => renderMissionCard(a))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
