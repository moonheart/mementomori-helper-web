import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sword,
    Zap,
    Trophy,
    Users,
    Star,
    Clock,
    Target,
    TrendingUp,
    Shield,
    Coins,
    BookOpen,
    Loader2
} from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { useMasterTable } from '@/hooks/useMasterData';
import { useTranslation } from '@/hooks/useTranslation';
import { UserSyncData } from '@/api/generated/userSyncData';
import { UserBattleAutoDtoInfo } from '@/api/generated/userBattleAutoDtoInfo';
import { QuestMB } from '@/api/generated/questMB';
import { ChapterMB } from '@/api/generated/chapterMB';
import { toast } from '@/hooks/use-toast';
import { QuestQuickExecuteType } from '@/api/generated/questQuickExecuteType';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';

export function BattlePage() {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<UserSyncData | null>(null);
    const [battleAutoData, setBattleAutoData] = useState<UserBattleAutoDtoInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(Date.now());

    // 加载 Master 数据
    const { data: questTable } = useMasterTable<QuestMB>('QuestTable');
    const { data: chapterTable } = useMasterTable<ChapterMB>('ChapterTable');

    const loadUserData = async () => {
        try {
            const [userResponse, autoResponse] = await Promise.all([
                ortegaApi.user.getUserData({}),
                ortegaApi.battle.auto({})
            ]);
            if (userResponse.userSyncData) {
                setUserData(userResponse.userSyncData);
            }
            if (autoResponse.userBattleAuto) {
                setBattleAutoData(autoResponse.userBattleAuto);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            toast({
                title: '加载失败',
                description: '无法获取用户数据，请检查网络连接',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserData();
        // 每分钟更新一次当前时间，用于计算挂机收益
        const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    // 计算逻辑
    const maxQuestId = userData?.userBattleBossDtoInfo?.bossClearMaxQuestId || 0;

    // 当前正在挂机的关卡（通常是已通关的最大关卡）
    const currentQuest = useMemo(() => {
        if (!questTable) return null;
        return questTable.find(q => q.id === maxQuestId) || questTable[0];
    }, [questTable, maxQuestId]);

    // 下一个要挑战的关卡
    const nextQuest = useMemo(() => {
        if (!questTable) return null;
        return questTable.find(q => q.id === maxQuestId + 1);
    }, [questTable, maxQuestId]);

    // 自动战斗时长计算
    const autoBattleStats = useMemo(() => {
        if (!userData || !currentQuest) return { timeStr: '0分钟', minutes: 0, gold: 0, exp: 0, progress: 0 };

        const lastRewardTime = (userData.receivedAutoBattleRewardLastTime || 0) * 1000;
        const diffMs = Math.max(0, currentTime - lastRewardTime);
        const diffMinutes = Math.floor(diffMs / 60000);

        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;

        return {
            timeStr: hours > 0 ? `${hours}小时${mins}${t('[CommonMinuteLabel]')}` : `${mins}${t('[CommonMinuteLabel]')}`,
            minutes: diffMinutes,
            gold: diffMinutes * (currentQuest.goldPerMinute || 0),
            exp: diffMinutes * (currentQuest.minPlayerExp || 0),
            progress: Math.min(100, (diffMinutes / (24 * 60)) * 100) // 假设24小时满溢
        };
    }, [userData, currentQuest, currentTime]);

    // 领民数据汇总
    const citizenStats = useMemo(() => {
        if (!questTable || !chapterTable) return { total: 0, byRegion: [] };

        const stats = chapterTable.map(chapter => {
            const chapterQuests = questTable.filter(q => q.chapterId === chapter.id && q.id <= maxQuestId);
            const population = chapterQuests.reduce((sum, q) => sum + (q.population || 0), 0);
            return {
                name: t(chapter.territoryNameKey) || `章节 ${chapter.id}`,
                count: population,
                bonus: `+${Math.floor(population / 100)}% 收益` // 模拟加成逻辑
            };
        }).filter(s => s.count > 0);

        const total = stats.reduce((sum, s) => sum + s.count, 0);
        return { total, byRegion: stats };
    }, [questTable, chapterTable, maxQuestId, t]);

    // 关卡列表显示逻辑（当前关卡前后5关）
    const displayStages = useMemo(() => {
        if (!questTable || questTable.length === 0) return [];

        const sortedQuests = [...questTable].sort((a, b) => a.id - b.id);
        const currentIndex = sortedQuests.findIndex(q => q.id === maxQuestId);
        const centerIndex = currentIndex >= 0 ? currentIndex : 0;
        const start = Math.max(0, centerIndex - 2);
        const end = Math.min(sortedQuests.length, centerIndex + 3);

        return sortedQuests.slice(start, end).map(q => {
            const chapter = chapterTable?.find(c => c.id === q.chapterId);
            const chapterNameKey = chapter?.nameKey;
            const translatedChapterName = chapterNameKey ? t(chapterNameKey) : '';
            const chapterName = chapterNameKey && translatedChapterName !== chapterNameKey
                ? translatedChapterName
                : `章节 ${q.chapterId}`;

            const stageNumber = q.id % 100 || 100;
            const questNameKey = `[QuestName${q.id}]`;
            const translatedQuestName = t(questNameKey);
            const questName = translatedQuestName !== questNameKey ? translatedQuestName : '';

            return {
                id: q.id,
                name: questName ? `${q.chapterId}-${stageNumber} ${questName}` : `${chapterName} ${q.chapterId}-${stageNumber}`,
                cleared: q.id <= maxQuestId,
                stars: q.id <= maxQuestId ? 3 : 0,
                power: q.baseBattlePower
            };
        });
    }, [questTable, chapterTable, maxQuestId, t]);

    // 操作处理
    const handleClaimReward = async () => {
        try {
            await ortegaApi.battle.rewardAutoBattle({});
            toast({ title: '领取成功', description: '已获得自动战斗收益' });
            loadUserData(); // 刷新数据
        } catch (error) {
            console.error('Claim reward failed:', error);
            toast({ title: '领取失败', description: '接口调用异常', variant: 'destructive' });
        }
    };

    const handleQuickBattle = async () => {
        try {
            // 判断使用免费次数还是消耗钻石
            const useFree = battleAutoData && battleAutoData.quickTodayUseCurrencyCount < 1;
            await ortegaApi.battle.quick({
                questQuickExecuteType: useFree ? QuestQuickExecuteType.Currency : QuestQuickExecuteType.Currency,
                quickCount: 1
            });
            toast({ title: '加速成功', description: '已获得2小时额外收益' });
            loadUserData();
        } catch (error) {
            console.error('Quick battle failed:', error);
            toast({ title: '加速失败', description: '钻石不足或次数已满', variant: 'destructive' });
        }
    };

    const handleChallengeBoss = async () => {
        if (!nextQuest) return;
        try {
            const res = await ortegaApi.battle.boss({ questId: nextQuest.id });
            const isWin = res.battleResult?.simulationResult?.battleEndInfo?.winGroupType === BattleFieldCharacterGroupType.Attacker;

            if (isWin) {
                toast({ title: '挑战成功', description: `已通关 ${nextQuest.id}` });
                loadUserData();
            } else {
                toast({ title: '挑战失败', description: '战力不足，请提升后再试', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Boss battle failed:', error);
            toast({ title: '挑战异常', description: '服务器请求失败', variant: 'destructive' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">{t('[CommonHeaderAutoBattleLabel]')}</h1>
                <p className="text-muted-foreground mt-1">
                    挑战关卡、挑战首领、进行自动战斗获取资源
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>主线冒险系统：</strong>
                    通关关卡解锁新内容，已通关的关卡可进行自动战斗获取资源。
                    使用高速战斗可立即获得2小时的自动战斗收益。每次挑战首领可获得战利品。
                </AlertDescription>
            </Alert>

            {/* 主要功能区 */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* 自动战斗 */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>{t('[AutoBattleQuestButtonAutoBattle]')}</CardTitle>
                                <CardDescription>持续获取资源</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">已进行</span>
                                <span className="font-semibold">{autoBattleStats.timeStr}</span>
                            </div>
                            <Progress value={autoBattleStats.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                <Coins className="h-4 w-4 text-yellow-600" />
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('[ItemName5]')}</div>
                                    <div className="font-semibold">{autoBattleStats.gold.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                <Star className="h-4 w-4 text-purple-600" />
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('[ItemName4]')}</div>
                                    <div className="font-semibold">{autoBattleStats.exp.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleClaimReward}>
                            <Target className="mr-2 h-4 w-4" />
                            {t('[CommonClaimLabel]')}
                        </Button>
                    </CardContent>
                </Card>

                {/* 高速战斗 */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>{t('[AutoBattleButtonQuickForward]')}</CardTitle>
                                <CardDescription>立即获得2小时收益</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="text-sm text-muted-foreground mb-1">预计获得</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-orange-600">
                                    ~{Math.round((currentQuest?.goldPerMinute || 0) * 120 / 1000)}K
                                </span>
                                <span className="text-sm text-muted-foreground">{t('[ItemName5]')}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                +其他战利品
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">免费次数</span>
                                <Badge variant={battleAutoData && battleAutoData.quickTodayUseCurrencyCount >= 1 ? "secondary" : "default"}>
                                    {battleAutoData ? (battleAutoData.quickTodayUseCurrencyCount >= 1 ? '已用完' : '1 / 1') : '--'}
                                </Badge>
                            </div>
                            {userData?.isValidContractPrivilege && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">月卡特权</span>
                                    <Badge variant="secondary">
                                        {battleAutoData ? `${Math.max(0, 2 - battleAutoData.quickTodayUsePrivilegeCount)} / 2` : '--'}
                                    </Badge>
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                每天凌晨4:00重置，后续消耗钻石随次数递增
                            </div>
                        </div>

                        <Button className="w-full" variant="default" onClick={handleQuickBattle}>
                            <Zap className="mr-2 h-4 w-4" />
                            开始高速战斗
                        </Button>
                    </CardContent>
                </Card>

                {/* 挑战首领 */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>{t('[AutoBattleButtonBoss]')}</CardTitle>
                                <CardDescription>击败首领获取奖励</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">当前首领</span>
                                <Badge className="bg-red-500">Boss {nextQuest?.id || 'MAX'}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-red-600" />
                                <div className="flex-1">
                                    <div className="text-sm font-semibold">
                                        {nextQuest ? `${nextQuest.chapterId}-${nextQuest.id % 100 || 100}` : '已全部通关'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        推荐战力: {nextQuest?.baseBattlePower.toLocaleString() || '--'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">免费挑战</span>
                                <Badge variant="secondary">
                                    {3 - (userData?.userBattleBossDtoInfo?.bossTodayWinCount || 0)} / 3
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                每天凌晨4:00重置
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            variant="destructive"
                            disabled={!nextQuest}
                            onClick={handleChallengeBoss}
                        >
                            <Sword className="mr-2 h-4 w-4" />
                            {t('[AutoBattleButtonBoss]')}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 关卡列表与领民数据 */}
            <Tabs defaultValue="stages" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="stages">关卡进度</TabsTrigger>
                    <TabsTrigger value="stats">{t('[DialogAutoBattleStatisticsTabBattle]')}</TabsTrigger>
                    <TabsTrigger value="citizens">{t('[DialogAutoBattleStatisticsTabPopulation]')}</TabsTrigger>
                </TabsList>

                {/* 关卡进度 */}
                <TabsContent value="stages" className="space-y-4">
                    <div className="grid gap-4">
                        {displayStages.map((stage) => (
                            <Card key={stage.id} className={stage.cleared ? 'border-green-200 dark:border-green-800' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stage.cleared
                                                    ? 'bg-green-100 dark:bg-green-900'
                                                    : 'bg-gray-100 dark:bg-gray-800'
                                                    }`}>
                                                    {stage.cleared ? (
                                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                                    ) : (
                                                        <Target className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{stage.name}</h3>
                                                    {stage.cleared && (
                                                        <Badge variant="secondary">已通关</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm text-muted-foreground">
                                                        推荐战力: {stage.power.toLocaleString()}
                                                    </span>
                                                    {stage.cleared && (
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-4 w-4 ${star <= stage.stars
                                                                        ? 'text-yellow-500 fill-yellow-500'
                                                                        : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {stage.cleared && (
                                                <Button variant="outline" size="sm">
                                                    {t('[AutoBattleQuestButtonAutoBattle]')}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant={stage.cleared ? 'secondary' : 'default'}
                                                onClick={() => !stage.cleared && handleChallengeBoss()}
                                            >
                                                {stage.cleared ? '重新挑战' : '开始挑战'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 战斗数据 */}
                <TabsContent value="stats" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>自动战斗统计</CardTitle>
                            <CardDescription>
                                离线期间的自动战斗收益、高速战斗收益将取决于这些数值
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Coins className="h-5 w-5 text-yellow-600" />
                                        <span className="text-sm font-medium text-muted-foreground">金币/小时</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {((currentQuest?.goldPerMinute || 0) * 60).toLocaleString()}
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-5 w-5 text-purple-600" />
                                        <span className="text-sm font-medium text-muted-foreground">经验/小时</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {((currentQuest?.minPlayerExp || 0) * 60).toLocaleString()}
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-medium text-muted-foreground">潜能宝珠/天</span>
                                    </div>
                                    <div className="text-2xl font-bold">{currentQuest?.potentialJewelPerDay || 0}</div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium text-muted-foreground">效率</span>
                                    </div>
                                    <div className="text-2xl font-bold">100%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 领民数据 */}
                <TabsContent value="citizens" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>解救的领民</CardTitle>
                                    <CardDescription>
                                        通关主线冒险关卡可解救领民，增加自动战斗收益
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary">
                                        {citizenStats.total.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">总人数</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {citizenStats.byRegion.map((region, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{region.name}</span>
                                            </div>
                                            <Badge variant="outline">{region.count.toLocaleString()}</Badge>
                                        </div>
                                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            {region.bonus}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
