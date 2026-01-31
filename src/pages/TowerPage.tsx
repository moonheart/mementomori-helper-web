import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Building2,
    Flame,
    Droplet,
    Wind,
    Mountain,
    ChevronUp,
    Trophy,
    Lock,
    Unlock,
    BookOpen,
    Sparkles,
    Loader2,
    Zap
} from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { toast } from '@/hooks/use-toast';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';
import { useMasterTable } from '@/hooks/useMasterData';
import { TowerBattleQuestMB } from '@/api/generated/towerBattleQuestMB';
import { TowerType } from '@/api/generated/towerType';
import { UserTowerBattleDtoInfo } from '@/api/generated/userTowerBattleDtoInfo';
import { UserItem } from '@/api/generated/userItem';
import { useItemName } from '@/hooks/useItemName';

// 塔类型配置
const TOWER_CONFIGS = {
    [TowerType.Infinite]: {
        name: '无穷之塔',
        icon: Building2,
        color: 'gray',
        element: '全属性'
    },
    [TowerType.Blue]: {
        name: '忧蓝之塔',
        icon: Droplet,
        color: 'blue',
        element: '忧蓝'
    },
    [TowerType.Red]: {
        name: '业红之塔',
        icon: Flame,
        color: 'red',
        element: '业红'
    },
    [TowerType.Green]: {
        name: '苍翠之塔',
        icon: Wind,
        color: 'green',
        element: '苍翠'
    },
    [TowerType.Yellow]: {
        name: '流金之塔',
        icon: Mountain,
        color: 'yellow',
        element: '流金'
    },
    [TowerType.None]: {
        name: '未知',
        icon: Building2,
        color: 'gray',
        element: '无'
    }
};

export function TowerPage() {
    const { getItemName } = useItemName();
    const [userTowerProgress, setUserTowerProgress] = useState<UserTowerBattleDtoInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: towerQuests, loading: masterLoading } = useMasterTable<TowerBattleQuestMB[]>('TowerBattleQuestTable');

    // 获取各塔的所有楼层并按 Floor 升序排列
    const allTowerQuests = useMemo(() => {
        const map: Record<number, TowerBattleQuestMB[]> = {};
        console.log('towerQuests', towerQuests);
        (towerQuests || []).forEach(q => {
            const typeNum = Number(q.towerType);
            if (!map[typeNum]) map[typeNum] = [];
            map[typeNum].push(q);
        });
        Object.values(map).forEach(list => list.sort((a, b) => a.floor - b.floor));
        return map;
    }, [towerQuests]);

    // 获取当前开放的塔
    const availableTowers = useMemo(() => {
        const now = new Date();
        const adjustedNow = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4:00 AM 重置
        const day = adjustedNow.getDay();

        const available = [TowerType.Infinite];
        switch (day) {
            case 0: available.push(TowerType.Blue, TowerType.Red, TowerType.Green, TowerType.Yellow); break;
            case 1: available.push(TowerType.Blue); break;
            case 2: available.push(TowerType.Red); break;
            case 3: available.push(TowerType.Green); break;
            case 4: available.push(TowerType.Yellow); break;
            case 5: available.push(TowerType.Blue, TowerType.Red); break;
            case 6: available.push(TowerType.Yellow, TowerType.Green); break;
        }
        return available;
    }, []);

    const fetchUserData = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await ortegaApi.user.getUserData({});
            if (response.userSyncData?.userTowerBattleDtoInfos) {
                setUserTowerProgress(response.userSyncData.userTowerBattleDtoInfos);
            }
        } catch (error) {
            console.error('Failed to fetch tower progress:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChallenge = async (type: TowerType, questId: number) => {
        try {
            const res = await ortegaApi.towerBattle.start({
                targetTowerType: type,
                towerBattleQuestId: questId
            });
            
            const isWin = res.battleResult?.simulationResult?.battleEndInfo?.winGroupType === BattleFieldCharacterGroupType.Attacker;
            
            if (isWin) {
                toast({ title: '挑战成功', description: `已通关第 ${questId} 层` });
            } else {
                toast({ title: '挑战失败', description: '战力不足，请提升后再试', variant: 'destructive' });
            }
            fetchUserData(true);
        } catch (error) {
            console.error('Tower battle failed:', error);
            toast({ title: '挑战异常', description: '服务器请求失败', variant: 'destructive' });
        }
    };

    const handleQuickChallenge = async (type: TowerType, questId: number) => {
        try {
            await ortegaApi.towerBattle.quick({
                targetTowerType: type,
                towerBattleQuestId: questId,
                quickCount: 1
            });
            toast({ title: '快速挑战成功', description: '已获得挑战奖励' });
            fetchUserData(true);
        } catch (error) {
            console.error('Tower quick failed:', error);
            toast({ title: '挑战失败', description: '挑战次数不足或请求异常', variant: 'destructive' });
        }
    };

    const getElementColor = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'from-blue-500 to-cyan-500',
            red: 'from-red-500 to-orange-500',
            green: 'from-green-500 to-emerald-500',
            yellow: 'from-yellow-500 to-amber-500'
        };
        return colors[color] || 'from-gray-500 to-gray-600';
    };

    const renderRewards = (rewards: UserItem[]) => {
        if (!rewards || rewards.length === 0) return null;
        return rewards.map((item, idx) => (
            <span key={idx}>
                {getItemName(item.itemType, item.itemId,) || `道具ID:${item.itemId}`} x{item.itemCount}
                {idx < rewards.length - 1 ? ' • ' : ''}
            </span>
        ));
    };

    if (loading || masterLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">加载塔数据中...</span>
            </div>
        );
    }

    const infiniteProgress = userTowerProgress.find(p => p.towerType === TowerType.Infinite);
    const elementalProgress = userTowerProgress.filter(p => p.towerType !== TowerType.Infinite);

    // 根据 Blazor 代码，maxTowerBattleId 实际上就是楼层数 (Floor)
    const currentInfiniteFloor = infiniteProgress?.maxTowerBattleId || 0;
    const infiniteQuests = allTowerQuests[TowerType.Infinite] || [];
    
    // 快速挑战次数
    const remainingQuickCount = Math.max(0, 3 - (infiniteProgress?.todayBattleCount || 0));

    // 下一关 Master 数据
    const nextInfiniteQuest = infiniteQuests.find(q => q.floor === currentInfiniteFloor + 1);

    // 显示当前楼层及前后几层
    const displayInfiniteQuests = [...infiniteQuests]
        .filter(q => q.floor <= currentInfiniteFloor + 1 && q.floor > currentInfiniteFloor - 4)
        .sort((a, b) => b.floor - a.floor)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">无穷之塔</h1>
                <p className="text-muted-foreground mt-1">
                    挑战塔层，获取丰厚奖励
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>塔系统说明：</strong>
                    无穷之塔每天有快速挑战机会，通关新楼层不消耗次数。
                    属性塔每天开放不同属性，每天最多通关10层，仅可使用对应属性角色。
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="infinite" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="infinite">无穷之塔</TabsTrigger>
                    <TabsTrigger value="elemental">属性塔</TabsTrigger>
                </TabsList>

                {/* 无穷之塔 */}
                <TabsContent value="infinite" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <Building2 className="h-48 w-48" />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-6 w-6" />
                                    当前进度
                                </CardTitle>
                                <CardDescription>已挑战至最高层</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">当前楼层</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-primary">
                                                {currentInfiniteFloor}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                / {infiniteQuests[infiniteQuests.length - 1]?.floor || '???'}
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={(currentInfiniteFloor / (infiniteQuests[infiniteQuests.length - 1]?.floor || 1)) * 100}
                                        className="h-3"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-6 w-6" />
                                    今日状态
                                </CardTitle>
                                <CardDescription>今日挑战统计</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">今日新通关</span>
                                        <Badge variant="secondary" className="text-base">
                                            {infiniteProgress?.todayClearNewFloorCount || 0} 层
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">今日已挑战</span>
                                        <Badge variant="secondary" className="text-base">
                                            {infiniteProgress?.todayBattleCount || 0} 次
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        每天凌晨4:00重置 • 通关新楼层不消耗次数
                                    </p>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={() => {
                                            if (nextInfiniteQuest) {
                                                handleChallenge(TowerType.Infinite, nextInfiniteQuest.id);
                                            }
                                        }}
                                    >
                                        <ChevronUp className="mr-2 h-5 w-5" />
                                        继续挑战 (第{currentInfiniteFloor + 1}层)
                                    </Button>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        disabled={remainingQuickCount <= 0}
                                        onClick={() => {
                                            const currentQuest = infiniteQuests.find(q => q.floor === currentInfiniteFloor);
                                            if (currentQuest) {
                                                handleQuickChallenge(TowerType.Infinite, currentQuest.id);
                                            }
                                        }}
                                    >
                                        <Zap className="mr-2 h-4 w-4" />
                                        快速挑战 ({remainingQuickCount}次可用)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>楼层进度</CardTitle>
                            <CardDescription>查看最近楼层状态和奖励</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {displayInfiniteQuests.map((quest) => {
                                    const isCleared = quest.floor <= currentInfiniteFloor;
                                    const isCurrent = quest.floor === currentInfiniteFloor + 1;
                                    
                                    return (
                                        <div
                                            key={quest.id}
                                            className={`p-4 rounded-lg border transition-all ${isCleared
                                                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                                                : isCurrent
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-200 dark:border-gray-800'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full ${isCleared
                                                        ? 'bg-green-500 text-white'
                                                        : isCurrent
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-gray-200 dark:bg-gray-800'
                                                        }`}>
                                                        <span className="text-lg font-bold">{quest.floor}</span>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold">第 {quest.floor} 层</span>
                                                            {isCleared ? (
                                                                <Badge variant="outline" className="border-green-500 text-green-500">已通关</Badge>
                                                            ) : isCurrent ? (
                                                                <Badge>挑战中</Badge>
                                                            ) : (
                                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <span>推荐战力: {quest.baseClearPartyDeckPower?.toLocaleString()}</span>
                                                            <span>•</span>
                                                            <span>{renderRewards(quest.battleRewardsFirst)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {isCurrent && (
                                                    <Button size="sm" onClick={() => handleChallenge(TowerType.Infinite, quest.id)}>
                                                        <ChevronUp className="mr-1 h-4 w-4" />
                                                        挑战
                                                    </Button>
                                                )}
                                                {!isCleared && !isCurrent && (
                                                    <Button size="sm" disabled variant="ghost">
                                                        <Lock className="mr-1 h-4 w-4" />
                                                        未解锁
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 属性塔 */}
                <TabsContent value="elemental" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {[TowerType.Blue, TowerType.Red, TowerType.Green, TowerType.Yellow].map((type) => {
                            const config = TOWER_CONFIGS[type];
                            const progress = elementalProgress.find(p => p.towerType === type);
                            const isAvailable = availableTowers.includes(type);
                            const Icon = config.icon;
                            
                            const towerQuestsOfType = allTowerQuests[type] || [];
                            const currentFloor = progress?.maxTowerBattleId || 0;
                            const maxFloor = towerQuestsOfType.length > 0 ? towerQuestsOfType[towerQuestsOfType.length - 1].floor : 0;

                            return (
                                <Card
                                    key={type}
                                    className={`relative overflow-hidden transition-all ${isAvailable
                                        ? 'border-2 border-primary shadow-lg'
                                        : 'opacity-60'
                                        }`}
                                >
                                    <div className={`absolute top-0 right-0 w-full h-2 bg-gradient-to-r ${getElementColor(config.color)}`} />

                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-lg bg-gradient-to-br ${getElementColor(config.color)}`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle>{config.name}</CardTitle>
                                                    <CardDescription>
                                                        {isAvailable ? '今日开放' : '今日未开放'}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            {isAvailable ? (
                                                <Badge className="bg-green-500">
                                                    <Unlock className="h-3 w-3 mr-1" />
                                                    开放中
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    未开放
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">当前进度</span>
                                                <span className="font-semibold">
                                                    {currentFloor} / {maxFloor} 层
                                                </span>
                                            </div>
                                            <Progress
                                                value={maxFloor > 0 ? (currentFloor / maxFloor) * 100 : 0}
                                                className="h-2"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span className="text-sm text-muted-foreground">今日新通关</span>
                                            <Badge variant={(progress?.todayClearNewFloorCount || 0) >= 10 ? "default" : "secondary"}>
                                                {progress?.todayClearNewFloorCount || 0} / 10 层
                                            </Badge>
                                        </div>

                                        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
                                            <div className="text-xs text-muted-foreground mb-1">规则</div>
                                            <div className="text-sm">
                                                • 仅可使用<span className="font-semibold text-primary">{config.element}</span>属性角色
                                            </div>
                                            <div className="text-sm">
                                                • 每天最多通关10层
                                            </div>
                                        </div>

                                        {isAvailable ? (
                                            <Button
                                                className="w-full"
                                                onClick={() => {
                                                    const nextQuest = towerQuestsOfType.find(q => q.floor === currentFloor + 1);
                                                    if (nextQuest) {
                                                        handleChallenge(type, nextQuest.id);
                                                    }
                                                }}
                                            >
                                                <ChevronUp className="mr-2 h-4 w-4" />
                                                开始挑战 (第{currentFloor + 1}层)
                                            </Button>
                                        ) : (
                                            <Button className="w-full" disabled>
                                                <Lock className="mr-2 h-4 w-4" />
                                                今日未开放
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* 属性塔说明 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                属性塔轮换安排 (4:00 AM 重置)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
                                <div className="p-3 border rounded-lg text-center">
                                    <div className="text-muted-foreground mb-1">周一 / 周五 / 周日</div>
                                    <Droplet className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                                    <div className="font-semibold">忧蓝之塔</div>
                                </div>
                                <div className="p-3 border rounded-lg text-center">
                                    <div className="text-muted-foreground mb-1">周二 / 周五 / 周日</div>
                                    <Flame className="h-6 w-6 mx-auto mb-1 text-red-500" />
                                    <div className="font-semibold">业红之塔</div>
                                </div>
                                <div className="p-3 border rounded-lg text-center">
                                    <div className="text-muted-foreground mb-1">周三 / 周六 / 周日</div>
                                    <Wind className="h-6 w-6 mx-auto mb-1 text-green-500" />
                                    <div className="font-semibold">苍翠之塔</div>
                                </div>
                                <div className="p-3 border rounded-lg text-center">
                                    <div className="text-muted-foreground mb-1">周四 / 周六 / 周日</div>
                                    <Mountain className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                                    <div className="font-semibold">流金之塔</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
