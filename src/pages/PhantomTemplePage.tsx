import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Users,
    Trophy,
    Clock,
    Star,
    BookOpen,
    Crown,
    Zap,
    Loader2,
    Swords,
    RefreshCw,
    History
} from 'lucide-react';
import { useLocalRaidInfo, useLocalRaidBattleLogs } from '@/hooks/useLocalRaidInfo';
import { useItemName } from '@/hooks/useItemName';
import { useTranslation } from '@/hooks/useTranslation';
import { LocalRaidQuestInfo } from '@/api/generated/localRaidQuestInfo';
import { LocalRaidEnemyInfo } from '@/api/generated/localRaidEnemyInfo';
import { ElementType } from '@/api/generated/elementType';
import { clsx } from 'clsx';

// 格式化时间为 HH:MM 格式
function formatTimeNumber(timeNum: number | null): string {
    if (timeNum === null) return '--:--';
    const hours = Math.floor(timeNum / 100);
    const minutes = timeNum % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// 获取属性颜色
function getElementColor(elementType: ElementType): string {
    const colors: Record<number, string> = {
        [ElementType.Blue]: 'text-blue-500',
        [ElementType.Red]: 'text-red-500',
        [ElementType.Green]: 'text-green-500',
        [ElementType.Yellow]: 'text-yellow-500',
        [ElementType.Light]: 'text-amber-300',
        [ElementType.Dark]: 'text-purple-500',
    };
    return colors[elementType] || 'text-gray-500';
}

// 获取属性名称
function getElementName(elementType: ElementType): string {
    const names: Record<number, string> = {
        [ElementType.Blue]: '忧蓝',
        [ElementType.Red]: '业红',
        [ElementType.Green]: '苍翠',
        [ElementType.Yellow]: '流金',
        [ElementType.Light]: '光',
        [ElementType.Dark]: '暗',
    };
    return names[elementType] || '无';
}

export function PhantomTemplePage() {
    const { t } = useTranslation();
    const { getItemName } = useItemName();
    const {
        loading,
        questInfos,
        remainingCount,
        bonusTimeInfo,
        getTempleName,
        getQuestEnemies,
        isQuestCleared,
        refresh
    } = useLocalRaidInfo();

    const { logs: battleLogs, loading: logsLoading, refresh: refreshLogs } = useLocalRaidBattleLogs();

    const [selectedQuest, setSelectedQuest] = useState<LocalRaidQuestInfo | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // 打开任务详情
    const openDetail = (quest: LocalRaidQuestInfo) => {
        setSelectedQuest(quest);
        setDetailOpen(true);
    };

    // 渲染奖励
    const renderRewards = (rewards: { itemType: number; itemId: number; itemCount: number }[]) => {
        if (!rewards || rewards.length === 0) return null;
        return rewards.map((item, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
                {getItemName(item.itemType, item.itemId)} x{item.itemCount.toLocaleString()}
            </Badge>
        ));
    };

    // 渲染敌人列表
    const renderEnemies = (enemies: LocalRaidEnemyInfo[]) => {
        return enemies.map((enemy) => (
            <div
                key={enemy.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-lg font-bold">
                    {enemy.enemyRank}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{t(enemy.nameKey)}</div>
                    <div className="text-sm text-muted-foreground">
                        Lv.{enemy.enemyRank} • 战力 {enemy.battlePower.toLocaleString()}
                    </div>
                </div>
                <Badge variant="outline" className={getElementColor(enemy.elementType)}>
                    {getElementName(enemy.elementType)}
                </Badge>
            </div>
        ));
    };

    // 渲染星级
    const renderStars = (level: number) => {
        return Array.from({ length: Math.min(level, 9) }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-red-500 fill-red-500" />
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">加载幻影神殿数据中...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">幻影神殿</h1>
                    <p className="text-muted-foreground mt-1">
                        组队探索神殿，挑战强大敌人获取奖励
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { refresh(); refreshLogs(); }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    刷新
                </Button>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>幻影神殿说明：</strong>
                    最多3人组队，24小时开放。每天最多6次挑战，难度越高奖励越丰厚。
                    特定时段(12:30-13:30、19:30-20:30)挑战可获得额外奖励。
                </AlertDescription>
            </Alert>

            {/* 加成时段提示 */}
            {bonusTimeInfo.inBonus && (
                <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-500">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        <strong>奖励加成时段！</strong>
                        当前时段挑战可获得 {bonusTimeInfo.bonusRate}% 额外奖励
                    </AlertDescription>
                </Alert>
            )}

            {/* 状态卡片 */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Swords className="h-5 w-5" />
                            今日挑战
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">剩余次数</span>
                                <Badge variant="secondary" className="text-base">
                                    {remainingCount} / 6
                                </Badge>
                            </div>
                            <Progress
                                value={(remainingCount / 6) * 100}
                                className="h-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Crown className="h-5 w-5 text-purple-500" />
                            幻影等级
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-2">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                Lv.--
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                随世界开设时长提升
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="h-5 w-5 text-orange-500" />
                            奖励加成
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-2">
                            {bonusTimeInfo.inBonus ? (
                                <div className="text-sm font-semibold text-green-600">
                                    加成进行中 ({bonusTimeInfo.bonusRate}%)
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        下个时段
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {formatTimeNumber(bonusTimeInfo.nextBonusTime)}:00
                                    </div>
                                </>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                                12:30-13:30 / 19:30-20:30
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="quests" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="quests">探索任务</TabsTrigger>
                    <TabsTrigger value="logs">战斗记录</TabsTrigger>
                </TabsList>

                {/* 探索任务 */}
                <TabsContent value="quests" className="space-y-4">
                    {questInfos.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                暂无开放的探索任务
                            </CardContent>
                        </Card>
                    ) : (
                        questInfos.map((quest) => {
                            const templeName = t(getTempleName(quest.localRaidBannerId));
                            const isCleared = isQuestCleared(quest.id);
                            const enemies = getQuestEnemies(quest);

                            return (
                                <Card
                                    key={quest.id}
                                    className={clsx(
                                        "hover:shadow-lg transition-all",
                                        isCleared && "border-green-200 dark:border-green-800"
                                    )}
                                >
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                                                    <Swords className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CardTitle className="text-lg">{templeName}</CardTitle>
                                                        {!isCleared && (
                                                            <Badge className="bg-red-500 text-xs">首次</Badge>
                                                        )}
                                                        {isCleared && (
                                                            <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                                                                已通关
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <CardDescription>
                                                        推荐战力: {quest.recommendedBattlePower.toLocaleString()}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {renderStars(quest.level)}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* 敌人预览 */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>敌人: {enemies.length} 名</span>
                                            <span>•</span>
                                            <span>
                                                总战力: {enemies.reduce((sum, e) => sum + e.battlePower, 0).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* 奖励预览 */}
                                        <div>
                                            <div className="text-sm font-medium mb-2">确定奖励</div>
                                            <div className="flex flex-wrap gap-2">
                                                {renderRewards(quest.fixedBattleRewards)}
                                            </div>
                                        </div>

                                        {/* 首次通关奖励 */}
                                        {!isCleared && quest.firstBattleRewards.length > 0 && (
                                            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200">
                                                <div className="text-sm font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                                                    首次通关奖励
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {renderRewards(quest.firstBattleRewards)}
                                                </div>
                                            </div>
                                        )}

                                        {/* 操作按钮 */}
                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => openDetail(quest)}
                                            >
                                                <Trophy className="mr-2 h-4 w-4" />
                                                查看详情
                                            </Button>
                                            <Button className="flex-1" disabled>
                                                <Users className="mr-2 h-4 w-4" />
                                                挑战（暂未开放）
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>

                {/* 战斗记录 */}
                <TabsContent value="logs" className="space-y-4">
                    {logsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2">加载战斗记录...</span>
                        </div>
                    ) : battleLogs.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <div>暂无战斗记录</div>
                            </CardContent>
                        </Card>
                    ) : (
                        battleLogs.map((log, index) => {
                            const isWin = log.battleEndInfo?.winGroupType === 1; // Attacker = 1
                            return (
                                <Card key={index}>
                                    <CardContent className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                                    isWin ? "bg-green-500" : "bg-red-500"
                                                )}>
                                                    <Trophy className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        任务 ID: {log.questId}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {log.battleEndInfo?.endTurn || 0} 回合
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className={isWin ? "bg-green-500" : "bg-red-500"}>
                                                {isWin ? "胜利" : "失败"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>

            {/* 任务详情弹窗 */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedQuest && t(getTempleName(selectedQuest.localRaidBannerId))}
                        </DialogTitle>
                        <DialogDescription>
                            推荐战力: {selectedQuest?.recommendedBattlePower.toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedQuest && (
                        <div className="space-y-6">
                            {/* 敌方阵容 */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Swords className="h-5 w-5" />
                                    敌方阵容
                                </h3>
                                <div className="space-y-2">
                                    {renderEnemies(getQuestEnemies(selectedQuest))}
                                </div>
                            </div>

                            {/* 战利品 */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Trophy className="h-5 w-5" />
                                    战利品
                                </h3>
                                <div className="space-y-4">
                                    {/* 首次奖励 */}
                                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200">
                                        <div className="text-sm font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                                            首次通关奖励
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {renderRewards(selectedQuest.firstBattleRewards)}
                                        </div>
                                    </div>

                                    {/* 确定奖励 */}
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="text-sm font-medium mb-2">确定奖励</div>
                                        <div className="flex flex-wrap gap-2">
                                            {renderRewards(selectedQuest.fixedBattleRewards)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 组队大厅提示 */}
                            <div className="p-4 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <div className="text-sm">组队功能暂未开放</div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
