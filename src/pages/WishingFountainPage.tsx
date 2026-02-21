import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sparkles,
    Users,
    Zap,
    Clock,
    Trophy,
    BookOpen,
    Timer,
    Send,
    Loader2,
    CheckCircle2,
    Flashlight
} from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { bountyQuestService } from '@/api/bounty-quest-service';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useItemName } from '@/hooks/useItemName';
import { useMasterTable } from '@/hooks/useMasterData';
import { useTimeManager } from '@/hooks/useTimeManager';
import { ItemType } from '@/api/generated/itemType';
import { BountyQuestType } from '@/api/generated/bountyQuestType';
import { BountyQuestRarityFlags } from '@/api/generated/bountyQuestRarityFlags';
import { ElementType } from '@/api/generated/elementType';
import { CharacterRarityFlags } from '@/api/generated/characterRarityFlags';
import { BountyQuestConditionType } from '@/api/generated/bountyQuestConditionType';
import { BountyQuestInfo } from '@/api/generated/bountyQuestInfo';
import { UserBountyQuestDtoInfo } from '@/api/generated/userBountyQuestDtoInfo';
import { BountyQuestConditionInfo } from '@/api/generated/bountyQuestConditionInfo';
import { UserItem } from '@/api/generated/userItem';
import { TimeServerMB } from '@/api/generated/timeServerMB';

interface ProcessedQuest {
    id: number;
    name: string;
    type: BountyQuestType;
    rarity: BountyQuestRarityFlags;
    startTime: number;
    endTime: number;
    rewardEndTime: number;
    isReward: boolean;
    requirements: {
        type: BountyQuestConditionType;
        element?: ElementType;
        rarity?: CharacterRarityFlags;
        count: number;
    }[];
    rewards: {
        itemType: ItemType;
        itemId: number;
        count: number;
    }[];
    status: 'NotStarted' | 'OnGoing' | 'NotReceived' | 'Received';
    remainingMs: number;
    progress: number;
    durationMs: number;
}

export function WishingFountainPage() {
    const { t } = useTranslation();
    const timeManager = useTimeManager();
    const [loading, setLoading] = useState(true);
    const [dispatching, setDispatching] = useState<number | string | null>(null);
    const [quests, setQuests] = useState<ProcessedQuest[]>([]);
    const [serverTime, setServerTime] = useState(() => timeManager.getServerNowMs());

    const { data: timeServers } = useMasterTable<TimeServerMB>('TimeServerTable');
    const { getItemName } = useItemName();

    // 初始化服务器时间偏移
    useEffect(() => {
        const initTime = async () => {
            try {
                const res = await ortegaApi.user.getUserData({});
                if (res.userSyncData && timeServers) {
                    const ts = timeServers.find(s => s.timeServerType === res.userSyncData?.timeServerId);
                    if (ts) {
                        timeManager.setDiffFromUtc(ts.differenceDateTimeFromUtc);
                    }
                }
            } catch (error) {
                console.error('Failed to init time manager:', error);
            }
        };
        if (timeServers) {
            initTime();
        }
    }, [timeServers]);

    const fetchQuests = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await ortegaApi.bountyQuest.getList({});

            const templates: BountyQuestInfo[] = response.bountyQuestInfos || [];
            const userQuests: UserBountyQuestDtoInfo[] = response.userBountyQuestDtoInfos || [];

            const nowMs = timeManager.getServerNowMs();

            const processed = templates.map((tpl: BountyQuestInfo) => {
                const instance = userQuests.find((uq: UserBountyQuestDtoInfo) => uq.bountyQuestId === tpl.bountyQuestId);

                let status: ProcessedQuest['status'] = 'NotStarted';
                let startTime = 0;
                let endTime = 0;
                let rewardEndTime = 0;
                let isReward = false;

                if (instance) {
                    startTime = instance.bountyQuestLimitStartTime;
                    endTime = instance.bountyQuestEndTime;
                    rewardEndTime = instance.rewardEndTime;
                    isReward = instance.isReward;

                    if (endTime > 0) {
                        if (nowMs < endTime) {
                            status = 'OnGoing';
                        } else if (!isReward) {
                            status = 'NotReceived';
                        } else {
                            status = 'Received';
                        }
                    }
                }

                const durationMs = tpl.bountyQuestClearTime;
                const remainingMs = status === 'OnGoing' ? Math.max(0, endTime - nowMs) :
                    status === 'NotReceived' ? Math.max(0, rewardEndTime - nowMs) : 0;

                const progress = status === 'Received' || status === 'NotReceived' ? 100 :
                    status === 'OnGoing' ? Math.min(100, Math.floor(((durationMs - remainingMs) / durationMs) * 100)) : 0;

                return {
                    id: tpl.bountyQuestId,
                    name: t(tpl.bountyQuestNameKey),
                    type: tpl.bountyQuestType,
                    rarity: tpl.bountyQuestRarity,
                    startTime,
                    endTime,
                    rewardEndTime,
                    isReward,
                    requirements: tpl.bountyQuestConditionInfos.map((c: BountyQuestConditionInfo) => ({
                        type: c.bountyQuestConditionType,
                        element: c.elementType,
                        rarity: c.rarity,
                        count: c.requireCount
                    })),
                    rewards: tpl.rewardItems.map((r: UserItem) => ({
                        itemType: r.itemType,
                        itemId: r.itemId,
                        count: r.itemCount
                    })),
                    status,
                    remainingMs,
                    progress,
                    durationMs
                } as ProcessedQuest;
            });

            setQuests(processed);
        } catch (error) {
            console.error('Failed to fetch bounty quests:', error);
            toast({ title: '获取任务失败', description: '请检查网络连接或重试', variant: 'destructive' });
        } finally {
            if (!silent) setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchQuests();
    }, [fetchQuests]);

    // 每秒更新当前时间，实现倒计时效果
    useEffect(() => {
        const timer = setInterval(() => {
            const nowMs = timeManager.getServerNowMs();
            setServerTime(nowMs);

            setQuests(prev => prev.map(q => {
                if (q.status === 'OnGoing') {
                    const rem = Math.max(0, q.endTime - nowMs);
                    if (rem === 0) {
                        return { ...q, status: 'NotReceived', remainingMs: Math.max(0, q.rewardEndTime - nowMs), progress: 100 };
                    }
                    const durationMs = q.durationMs;
                    const prog = Math.min(100, Math.floor(((durationMs - rem) / durationMs) * 100));
                    return { ...q, remainingMs: rem, progress: prog };
                } else if (q.status === 'NotReceived') {
                    const rem = Math.max(0, q.rewardEndTime - nowMs);
                    return { ...q, remainingMs: rem };
                }
                return q;
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleReward = async (id?: number) => {
        try {
            const ids = id ? [id] : quests.filter(q => q.status === 'NotReceived').map(q => q.id);
            if (ids.length === 0) return;

            await ortegaApi.bountyQuest.reward({
                bountyQuestIds: ids,
                isQuick: false,
                consumeCurrency: 0
            });

            toast({ title: '奖励领取成功', description: `已领取 ${ids.length} 个任务的奖励` });
            fetchQuests(true);
        } catch (error) {
            console.error('Failed to claim rewards:', error);
            toast({ title: '领取失败', description: '请稍后再试', variant: 'destructive' });
        }
    };

    const handleDispatch = async (id?: number, type?: BountyQuestType) => {
        try {
            const dispatchKey = id ? id : (type === BountyQuestType.Solo ? 'solo' : type === BountyQuestType.Team ? 'team' : 'guerrilla');
            setDispatching(dispatchKey);

            const res = await bountyQuestService.dispatch({
                bountyQuestId: id,
                bountyQuestType: type
            });

            if (res.successCount > 0) {
                toast({
                    title: '派遣成功',
                    description: `成功派遣 ${res.successCount} 个任务`
                });
                fetchQuests(true);
            } else {
                toast({
                    title: '未派遣任何任务',
                    description: '请检查角色是否充足或任务状态',
                    variant: 'destructive'
                });
            }
        } catch (error: unknown) {
            console.error('Failed to dispatch quests:', error);
            const axiosError = error as { response?: { data?: { message?: string } } };
            const errorMessage = axiosError.response?.data?.message || (error instanceof Error ? error.message : '请重试');
            toast({
                title: '派遣失败',
                description: errorMessage,
                variant: 'destructive'
            });
        } finally {
            setDispatching(null);
        }
    };

    const handleRemake = async () => {
        try {
            await ortegaApi.bountyQuest.remake({});
            toast({ title: '任务已刷新', description: '常规任务列表已更新' });
            fetchQuests(true);
        } catch (error) {
            console.error('Failed to remake quests:', error);
            toast({ title: '刷新失败', description: '钻石不足或请求异常', variant: 'destructive' });
        }
    };

    const getRarityColor = (rarity: BountyQuestRarityFlags) => {
        if (rarity & BountyQuestRarityFlags.LR) return 'bg-gradient-to-r from-orange-500 to-red-600';
        if (rarity & BountyQuestRarityFlags.UR) return 'bg-yellow-500';
        if (rarity & BountyQuestRarityFlags.SSR) return 'bg-purple-500';
        if (rarity & BountyQuestRarityFlags.SR) return 'bg-blue-500';
        return 'bg-gray-500';
    };

    const getRarityName = (rarity: BountyQuestRarityFlags) => {
        if (rarity & BountyQuestRarityFlags.LR) return 'LR';
        if (rarity & BountyQuestRarityFlags.UR) return 'UR';
        if (rarity & BountyQuestRarityFlags.SSR) return 'SSR';
        if (rarity & BountyQuestRarityFlags.SR) return 'SR';
        return 'R';
    };

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}小时${m}分`;
        if (m > 0) return `${m}分${s}秒`;
        return `${s}秒`;
    };

    const getStatusInfo = (quest: ProcessedQuest) => {
        switch (quest.status) {
            case 'OnGoing':
                return {
                    label: t('进行中'),
                    color: 'text-blue-500',
                    badge: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
                    timeLabel: timeManager.formatTimeSpan(quest.remainingMs)
                };
            case 'NotReceived':
                return {
                    label: t('待领取'),
                    color: 'text-orange-500',
                    badge: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
                    timeLabel: timeManager.formatTimeSpan(quest.remainingMs)
                };
            case 'Received':
                return {
                    label: t('已领取'),
                    color: 'text-green-500',
                    badge: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
                    timeLabel: ''
                };
            default:
                return {
                    label: t('未开始'),
                    color: 'text-muted-foreground',
                    badge: 'bg-muted text-muted-foreground',
                    timeLabel: ''
                };
        }
    };

    const renderQuestCard = (quest: ProcessedQuest) => {
        const statusInfo = getStatusInfo(quest);
        const isDispatching = dispatching === quest.id;

        return (
            <Card key={quest.id} className={`hover:shadow-lg transition-shadow ${quest.type === BountyQuestType.Team ? 'border-2 border-primary/20' : ''} ${quest.status === 'Received' ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {quest.type === BountyQuestType.Team ? (
                                <Users className="h-6 w-6 text-primary" />
                            ) : (
                                <Sparkles className="h-6 w-6 text-primary" />
                            )}
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {quest.name}
                                    {quest.status === 'Received' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                </CardTitle>
                                <CardDescription>
                                    持续时间: {formatDuration(quest.durationMs)}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className={getRarityColor(quest.rarity)}>
                                {getRarityName(quest.rarity)}
                            </Badge>
                            <Badge variant="outline" className={statusInfo.badge}>
                                {statusInfo.label} {statusInfo.timeLabel}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 进度 */}
                    {quest.status === 'OnGoing' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">执行进度</span>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-semibold">{statusInfo.timeLabel} 剩余</span>
                                </div>
                            </div>
                            <Progress value={quest.progress} className="h-2" />
                        </div>
                    )}

                    {/* 要求 */}
                    <div>
                        <div className="text-sm font-medium mb-2">执行条件</div>
                        <div className="flex flex-wrap gap-2">
                            {quest.requirements.map((req, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {req.type === BountyQuestConditionType.Rarity && req.rarity && getRarityName(req.rarity as unknown as BountyQuestRarityFlags) + '角色'}
                                    {req.type === BountyQuestConditionType.Element && req.element && (
                                        t(`[ElementType${ElementType[req.element]}]`)
                                    )}
                                    {req.count > 1 ? ` x${req.count}` : ''}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* 奖励 */}
                    <div>
                        <div className="text-sm font-medium mb-2">任务奖励</div>
                        <div className="flex flex-wrap gap-2">
                            {quest.type === BountyQuestType.Guerrilla ? (
                                <Badge variant="secondary" className="text-xs">
                                    <Zap className="h-3 w-3 mr-1 text-green-500" />
                                    {t('[ItemRewardDetailDialogLotteryRateLabel]')}
                                </Badge>
                            ) : (
                                quest.rewards.map((reward, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        <Trophy className="h-3 w-3 mr-1" />
                                        {getItemName(reward.itemType, reward.itemId)} x{reward.count}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                        {quest.status === 'NotReceived' ? (
                            <Button className="w-full" onClick={() => handleReward(quest.id)}>
                                <Trophy className="mr-2 h-4 w-4" />
                                领取奖励
                            </Button>
                        ) : quest.status === 'OnGoing' ? (
                            <Button variant="outline" className="w-full">
                                <span className="mr-1">💎</span>
                                高速完成
                            </Button>
                        ) : quest.status === 'Received' ? (
                            <Button className="w-full" disabled variant="ghost">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                已领取
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                disabled={isDispatching || dispatching !== null}
                                onClick={() => handleDispatch(quest.id)}
                            >
                                {isDispatching ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                                自动派遣
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">同步任务数据中...</span>
            </div>
        );
    }

    const soloQuests = quests.filter(q => q.type === BountyQuestType.Solo);
    const teamQuests = quests.filter(q => q.type === BountyQuestType.Team);
    const guerrillaQuests = quests.filter(q => q.type === BountyQuestType.Guerrilla);

    const hasAvailableSolo = soloQuests.some(q => q.status === 'NotStarted');
    const hasAvailableTeam = teamQuests.some(q => q.status === 'NotStarted');
    const hasAvailableGuerrilla = guerrillaQuests.some(q => q.status === 'NotStarted');

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">祈愿之泉</h1>
                    <p className="text-muted-foreground mt-1">
                        当前服务器时间: {new Date(serverTime).toLocaleTimeString()}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => handleReward()}
                    disabled={quests.every(q => q.status !== 'NotReceived')}
                >
                    <Trophy className="mr-2 h-4 w-4" />
                    一键领取
                </Button>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>祈愿之泉说明：</strong>
                    常规任务每天凌晨4:00更新，联合任务需要好友/公会支援，游击任务随机出现。
                    完成远征可获得金币、经验、强化石等奖励。
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="regular" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="regular">常规任务 ({soloQuests.length})</TabsTrigger>
                    <TabsTrigger value="joint">联合任务 ({teamQuests.length})</TabsTrigger>
                    <TabsTrigger value="guerrilla">游击任务 ({guerrillaQuests.length})</TabsTrigger>
                </TabsList>

                {/* 常规任务 */}
                <TabsContent value="regular" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            每天凌晨4:00更新 • 未执行任务将刷新
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDispatch(undefined, BountyQuestType.Solo)}
                                disabled={!hasAvailableSolo || dispatching !== null}
                            >
                                {dispatching === 'solo' ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Flashlight className="mr-2 h-3 w-3" />}
                                一键派遣
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleRemake}>
                                <span className="mr-1">💎</span>
                                刷新列表
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4">
                        {soloQuests.length > 0 ? (
                            soloQuests.map(renderQuestCard)
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                暂无常规任务
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* 联合任务 */}
                <TabsContent value="joint" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            联合任务需要支援角色参与 • 奖励更加丰厚
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDispatch(undefined, BountyQuestType.Team)}
                            disabled={!hasAvailableTeam || dispatching !== null}
                        >
                            {dispatching === 'team' ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Flashlight className="mr-2 h-3 w-3" />}
                            一键派遣
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4">
                        {teamQuests.length > 0 ? (
                            teamQuests.map(renderQuestCard)
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                暂无联合任务
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* 游击任务 */}
                <TabsContent value="guerrilla" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            游击任务随机出现，奖励丰厚
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDispatch(undefined, BountyQuestType.Guerrilla)}
                            disabled={!hasAvailableGuerrilla || dispatching !== null}
                        >
                            {dispatching === 'guerrilla' ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Flashlight className="mr-2 h-3 w-3" />}
                            一键派遣
                        </Button>
                    </div>
                    {guerrillaQuests.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4">
                            {guerrillaQuests.map(renderQuestCard)}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="text-6xl mb-4 opacity-20">
                                    <Timer className="h-24 w-24 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">目前没有游击任务</h3>
                                <p className="text-muted-foreground mb-4">
                                    游击任务随机出现，请稍后再来查看
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
