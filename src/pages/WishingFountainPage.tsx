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
    Star
} from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useMasterTable } from '@/hooks/useMasterData';
import { BountyQuestType } from '@/api/generated/bountyQuestType';
import { BountyQuestRarityFlags } from '@/api/generated/bountyQuestRarityFlags';
import { ItemMB } from '@/api/generated/itemMB';
import { ElementType } from '@/api/generated/elementType';
import { CharacterRarityFlags } from '@/api/generated/characterRarityFlags';
import { BountyQuestConditionType } from '@/api/generated/bountyQuestConditionType';
import { BountyQuestInfo } from '@/api/generated/bountyQuestInfo';
import { UserBountyQuestDtoInfo } from '@/api/generated/userBountyQuestDtoInfo';
import { BountyQuestConditionInfo } from '@/api/generated/bountyQuestConditionInfo';
import { UserItem } from '@/api/generated/userItem';

interface ProcessedQuest {
    id: number;
    name: string;
    type: BountyQuestType;
    rarity: BountyQuestRarityFlags;
    startTime: number;
    endTime: number;
    isReward: boolean;
    requirements: {
        type: BountyQuestConditionType;
        element?: ElementType;
        rarity?: CharacterRarityFlags;
        count: number;
    }[];
    rewards: {
        itemId: number;
        count: number;
    }[];
    status: 'available' | 'ongoing' | 'completed';
    remainingSeconds: number;
    progress: number;
    durationSeconds: number;
}

export function WishingFountainPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [quests, setQuests] = useState<ProcessedQuest[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [now, setNow] = useState(Math.floor(Date.now() / 1000));

    const { data: itemMaster } = useMasterTable<ItemMB[]>('ItemMB');

    const fetchQuests = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await ortegaApi.bountyQuest.getList({});
            
            const templates: BountyQuestInfo[] = response.bountyQuestInfos || [];
            const userQuests: UserBountyQuestDtoInfo[] = response.userBountyQuestDtoInfos || [];

            const currentTime = Math.floor(Date.now() / 1000);

            const processed = templates.map((tpl: BountyQuestInfo) => {
                const instance = userQuests.find((uq: UserBountyQuestDtoInfo) => uq.bountyQuestId === tpl.bountyQuestId);
                
                let status: ProcessedQuest['status'] = 'available';
                let startTime = 0;
                let endTime = 0;
                let isReward = false;

                if (instance) {
                    startTime = instance.bountyQuestLimitStartTime;
                    endTime = instance.bountyQuestEndTime;
                    isReward = instance.isReward;

                    if (isReward) {
                        status = 'available'; // 已领取完奖励的任务在UI上标记为可派遣（虽然实际上可能需要等到刷新）
                    } else if (currentTime >= endTime) {
                        status = 'completed';
                    } else {
                        status = 'ongoing';
                    }
                }

                const durationSeconds = tpl.bountyQuestClearTime;
                const remainingSeconds = Math.max(0, endTime - currentTime);
                const progress = status === 'completed' ? 100 : 
                           status === 'ongoing' ? Math.min(100, Math.floor(((durationSeconds - remainingSeconds) / durationSeconds) * 100)) : 0;

                return {
                    id: tpl.bountyQuestId,
                    name: t(`[BountyQuestName_${tpl.bountyQuestId}]`) || tpl.bountyQuestNameKey,
                    type: tpl.bountyQuestType,
                    rarity: tpl.bountyQuestRarity,
                    startTime,
                    endTime,
                    isReward,
                    requirements: tpl.bountyQuestConditionInfos.map((c: BountyQuestConditionInfo) => ({
                        type: c.bountyQuestConditionType,
                        element: c.elementType,
                        rarity: c.rarity,
                        count: c.requireCount
                    })),
                    rewards: tpl.rewardItems.map((r: UserItem) => ({
                        itemId: r.itemId,
                        count: r.itemCount
                    })),
                    status,
                    remainingSeconds,
                    progress,
                    durationSeconds
                } as ProcessedQuest;
            });

            // 过滤掉已领取的任务
            setQuests(processed.filter((q: ProcessedQuest) => !q.isReward));
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
            const currentTime = Math.floor(Date.now() / 1000);
            setNow(currentTime);
            
            setQuests(prev => prev.map(q => {
                if (q.status === 'ongoing') {
                    const rem = Math.max(0, q.endTime - currentTime);
                    if (rem === 0) {
                        return { ...q, status: 'completed', remainingSeconds: 0, progress: 100 };
                    }
                    const prog = Math.min(100, Math.floor(((q.durationSeconds - rem) / q.durationSeconds) * 100));
                    return { ...q, remainingSeconds: rem, progress: prog };
                }
                return q;
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleReward = async (id?: number) => {
        try {
            const ids = id ? [id] : quests.filter(q => q.status === 'completed').map(q => q.id);
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

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}小时${m}分`;
        if (m > 0) return `${m}分${s}秒`;
        return `${s}秒`;
    };

    const getItemName = (id: number) => {
        const item = itemMaster?.find(i => i.itemId === id);
        return item ? (t(item.nameKey) || item.displayName) : `道具ID:${id}`;
    };

    const renderQuestCard = (quest: ProcessedQuest) => (
        <Card key={quest.id} className={`hover:shadow-lg transition-shadow ${quest.type === BountyQuestType.Team ? 'border-2 border-primary/20' : ''}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {quest.type === BountyQuestType.Team ? (
                            <Users className="h-6 w-6 text-primary" />
                        ) : (
                            <Sparkles className="h-6 w-6 text-primary" />
                        )}
                        <div>
                            <CardTitle className="text-lg">{quest.name}</CardTitle>
                            <CardDescription>
                                持续时间: {formatDuration(quest.durationSeconds)}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge className={getRarityColor(quest.rarity)}>
                        {getRarityName(quest.rarity)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 进度 */}
                {quest.status === 'ongoing' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">进度</span>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">{formatDuration(quest.remainingSeconds)} 剩余</span>
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
                            <Badge key={index} variant="outline">
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
                        {quest.rewards.map((reward, index) => (
                            <Badge key={index} variant="secondary">
                                <Trophy className="h-3 w-3 mr-1" />
                                {getItemName(reward.itemId)} x{reward.count}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                    {quest.status === 'completed' ? (
                        <Button className="w-full" onClick={() => handleReward(quest.id)}>
                            <Trophy className="mr-2 h-4 w-4" />
                            领取奖励
                        </Button>
                    ) : quest.status === 'ongoing' ? (
                        <Button variant="outline" className="w-full">
                            <span className="mr-1">💎</span>
                            高速完成
                        </Button>
                    ) : (
                        <Button className="w-full" disabled>
                            <Send className="mr-2 h-4 w-4" />
                            派遣角色 (暂未开放)
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

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

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">祈愿之泉</h1>
                    <p className="text-muted-foreground mt-1">
                        派遣角色进行远征，获取丰厚奖励
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => handleReward()}
                    disabled={quests.every(q => q.status !== 'completed')}
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
                        <Button variant="outline" size="sm" onClick={handleRemake}>
                            <span className="mr-1">💎</span>
                            刷新列表
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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
                    <div className="text-sm text-muted-foreground mb-4">
                        联合任务需要支援角色参与 • 奖励更加丰厚
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
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
                    {guerrillaQuests.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {guerrillaQuests.map(q => (
                                <Card key={q.id} className="border-2 border-green-500 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="h-5 w-5 text-green-500" />
                                            <Badge className="bg-green-500">特殊任务</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Sparkles className="h-8 w-8 text-green-500 animate-pulse" />
                                                    <div className="absolute -top-1 -right-1">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl">{q.name}</CardTitle>
                                                    <CardDescription>
                                                        持续时间: {formatDuration(q.durationSeconds)}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge className={getRarityColor(q.rarity)}>
                                                {getRarityName(q.rarity)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                            <Zap className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-800 dark:text-green-200">
                                                游击任务随机出现，奖励受派遣角色的稀有度和属性一致性影响。
                                            </AlertDescription>
                                        </Alert>

                                        {/* 奖励 */}
                                        <div>
                                            <div className="text-sm font-medium mb-2">基础奖励</div>
                                            <div className="flex flex-wrap gap-2">
                                                {q.rewards.map((reward, index) => (
                                                    <Badge key={index} variant="secondary" className="text-base py-1">
                                                        <Trophy className="h-4 w-4 mr-2" />
                                                        {getItemName(reward.itemId)} x{reward.count}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <Button className="w-full" size="lg" disabled>
                                            <Send className="mr-2 h-5 w-5" />
                                            派遣执行 (暂未开放)
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
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
