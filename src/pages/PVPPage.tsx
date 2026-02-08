import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Swords, Loader2, RefreshCw, Trophy, Zap, TrendingUp, BookOpen, Crown, Star } from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { useMasterTable } from '@/hooks/useMasterData';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PvpRankingPlayerInfo } from '@/api/generated/pvpRankingPlayerInfo';
import { UserBattlePvpDtoInfo } from '@/api/generated/userBattlePvpDtoInfo';
import { PvpRankingRewardMB } from '@/api/generated/pvpRankingRewardMB';
import { PvpRankingRewardType } from '@/api/generated/pvpRankingRewardType';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';
import { LegendLeagueRankingPlayerInfo } from '@/api/generated/legendLeagueRankingPlayerInfo';
import { UserBattleLegendLeagueDtoInfo } from '@/api/generated/userBattleLegendLeagueDtoInfo';

export function PVPPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [activeMainTab, setActiveMainTab] = useState('ancient');

    // Ancient Arena (Battle League)
    const [pvpInfo, setPvpInfo] = useState<{
        currentRank: number;
        matchingRivalList: PvpRankingPlayerInfo[];
        topRankerList: PvpRankingPlayerInfo[];
    } | null>(null);
    const [userPvpDto, setUserPvpDto] = useState<UserBattlePvpDtoInfo | null>(null);

    // Apex Arena (Legend League)
    const [legendInfo, setLegendInfo] = useState<{
        currentPoint: number;
        currentRanking: number;
        matchingRivalList: LegendLeagueRankingPlayerInfo[];
        topRankerList: LegendLeagueRankingPlayerInfo[];
    } | null>(null);
    const [userLegendDto, setUserLegendDto] = useState<UserBattleLegendLeagueDtoInfo | null>(null);

    const { data: rewardsMaster } = useMasterTable<PvpRankingRewardMB>('PvpRankingRewardTable');

    const fetchPvpData = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const [pvpRes, userRes, legendRes] = await Promise.all([
                ortegaApi.battle.getPvpInfo({ isRankingTab: false }),
                ortegaApi.user.getUserData({}),
                ortegaApi.battle.getLegendLeagueInfo({ isRankingTab: false })
            ]);

            setPvpInfo({
                currentRank: pvpRes.currentRank,
                matchingRivalList: pvpRes.matchingRivalList || [],
                topRankerList: pvpRes.topRankerList || []
            });

            if (userRes.userSyncData) {
                setUserPvpDto(userRes.userSyncData.userBattlePvpDtoInfo);
                setUserLegendDto(userRes.userSyncData.userBattleLegendLeagueDtoInfo);
            }

            setLegendInfo({
                currentPoint: legendRes.currentPoint,
                currentRanking: legendRes.currentRanking,
                matchingRivalList: legendRes.matchingRivalList || [],
                topRankerList: legendRes.topRankerList || []
            });
        } catch (error) {
            console.error('Failed to fetch PVP data:', error);
            toast({
                title: '获取数据失败',
                description: '无法连接到竞技场服务器',
                variant: 'destructive'
            });
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchPvpData();
    }, []);

    const handleChallenge = async (rivalId: number, rivalRank: number) => {
        try {
            const res = await ortegaApi.battle.pvpStart({
                rivalPlayerId: rivalId,
                rivalPlayerRank: rivalRank
            });

            const isWin = res.battleResult?.simulationResult?.battleEndInfo?.winGroupType === BattleFieldCharacterGroupType.Attacker;

            if (isWin) {
                toast({
                    title: '挑战成功!',
                    description: `排名提升至 #${res.afterRank}`,
                });
            } else {
                toast({
                    title: '挑战失败',
                    description: '再接再厉，提升战力后再来吧',
                    variant: 'destructive'
                });
            }
            fetchPvpData(true);
        } catch (error) {
            console.error('PVP challenge failed:', error);
            toast({
                title: '挑战异常',
                description: '请求对战服务器失败',
                variant: 'destructive'
            });
        }
    };

    const handleLegendChallenge = async (rivalId: number) => {
        try {
            const res = await ortegaApi.battle.legendLeagueStart({ rivalPlayerId: rivalId });

            const isWin = res.battleResult?.simulationResult?.battleEndInfo?.winGroupType === BattleFieldCharacterGroupType.Attacker;

            if (isWin) {
                toast({
                    title: '挑战成功!',
                    description: `排名提升至 #${res.ranking}，积分: ${res.point}`,
                });
            } else {
                toast({
                    title: '挑战失败',
                    description: '积分减少',
                    variant: 'destructive'
                });
            }
            fetchPvpData(true);
        } catch (error) {
            console.error('Legend PVP challenge failed:', error);
            toast({
                title: '挑战异常',
                description: '请求对战服务器失败',
                variant: 'destructive'
            });
        }
    };

    const pvpRewards = (rewardsMaster || [])
        .filter(r => r.pvpRankingRewardType === (activeMainTab === 'ancient'
            ? PvpRankingRewardType.BattleLeagueDailyRankingReward
            : PvpRankingRewardType.LegendLeagueDailyRankingReward))
        .sort((a, b) => a.upperLimitRanking - b.upperLimitRanking);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">加载竞技场中...</span>
            </div>
        );
    }

    const freeChallengesRemaining = Math.max(0, 5 - (userPvpDto?.pvpTodayCount || 0));
    const legendChallengesRemaining = Math.max(0, 10 - (userLegendDto?.legendLeagueTodayCount || 0));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">竞技场</h1>
                <p className="text-muted-foreground mt-1">与其他玩家对战，争夺排名和荣耀</p>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="ancient" onValueChange={setActiveMainTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ancient">古竞技场</TabsTrigger>
                    <TabsTrigger value="apex">巅峰竞技场</TabsTrigger>
                </TabsList>

                {/* Ancient Arena */}
                <TabsContent value="ancient" className="space-y-6">
                    <Alert>
                        <BookOpen className="h-4 w-4" />
                        <AlertDescription>
                            <strong>古竞技场说明：</strong>
                            每日 5 次免费挑战，胜利可互换排名。每日 20:30 根据排名发放奖励。
                        </AlertDescription>
                    </Alert>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <Trophy className="h-32 w-32" />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                    我的排名
                                </CardTitle>
                                <CardDescription>当前竞技场实时排名</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    <div className="text-6xl font-bold text-primary mb-2">
                                        #{pvpInfo?.currentRank || '---'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        历史最高: #{userPvpDto?.maxRanking || '---'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Swords className="h-6 w-6" />
                                    今日挑战
                                </CardTitle>
                                <CardDescription>每天凌晨 4:00 重置</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">免费次数</span>
                                        <Badge variant="secondary" className="text-base">
                                            {freeChallengesRemaining} / 5
                                        </Badge>
                                    </div>
                                    <Progress value={(freeChallengesRemaining / 5) * 100} className="h-2" />
                                </div>
                                <div className="pt-2">
                                    <Button className="w-full" size="lg" onClick={() => fetchPvpData(true)}>
                                        <Zap className="mr-2 h-5 w-5" />
                                        刷新对手
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="opponents">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="opponents">挑战</TabsTrigger>
                            <TabsTrigger value="history">记录</TabsTrigger>
                            <TabsTrigger value="rewards">奖励</TabsTrigger>
                        </TabsList>

                        <TabsContent value="opponents" className="space-y-4 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>可挑战对手</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pvpInfo?.matchingRivalList.map((rival) => (
                                            <div key={rival.playerInfo.playerId} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <Badge variant="outline" className="mb-1">#{rival.currentRank}</Badge>
                                                        {rival.currentRank < (pvpInfo?.currentRank || 0) && <TrendingUp className="h-4 w-4 text-green-500" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{rival.playerInfo.playerName}</div>
                                                        <div className="text-sm text-muted-foreground">战力: {rival.battlePower.toLocaleString()} • Lv.{rival.playerInfo.playerLevel}</div>
                                                    </div>
                                                </div>
                                                <Button onClick={() => handleChallenge(rival.playerInfo.playerId, rival.currentRank)} disabled={freeChallengesRemaining === 0}>挑战</Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history" className="space-y-4 mt-6">
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                                <RefreshCw className="h-10 w-10 mb-4 opacity-20" />
                                <p>暂无近期对战记录</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="rewards" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>每日奖励</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pvpRewards.map((tier, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                                                <span className="font-medium">排名 {tier.upperLimitRanking === tier.lowerLimitRanking ? tier.upperLimitRanking : `${tier.upperLimitRanking} - ${tier.lowerLimitRanking}`}</span>
                                                <div className="flex gap-2">
                                                    {tier.rewardList?.map((item, i) => (
                                                        <span key={i} className="text-sm text-muted-foreground">{t(`[ItemName_${item.itemId}]`)} x{item.itemCount}{i < (tier.rewardList?.length || 0) - 1 ? ' • ' : ''}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {/* Apex Arena (Legend League) */}
                <TabsContent value="apex" className="space-y-6">
                    <Alert>
                        <Star className="h-4 w-4" />
                        <AlertDescription>
                            <strong>巅峰竞技场说明：</strong>
                            通过积分和排名晋升阶级。每日 10 次挑战机会，赛季末发放丰厚奖励。
                        </AlertDescription>
                    </Alert>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-2 border-primary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-6 w-6 text-yellow-500" />
                                    我的阶级
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center py-2">
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {legendInfo?.currentPoint || 0} pt
                                </div>
                                <Badge variant="outline" className="text-base">排名 #{legendInfo?.currentRanking || '---'}</Badge>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-6 w-6 text-green-500" />
                                    连胜
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center py-2">
                                <div className="text-4xl font-bold text-green-500 mb-2">
                                    {userLegendDto?.legendLeagueConsecutiveVictoryCount || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">连胜中</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Swords className="h-6 w-6" />
                                    挑战次数
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">剩余挑战</span>
                                    <Badge variant="secondary">{legendChallengesRemaining} / 10</Badge>
                                </div>
                                <Progress value={(legendChallengesRemaining / 10) * 100} className="h-2" />
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="opponents">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="opponents">挑战</TabsTrigger>
                            <TabsTrigger value="history">记录</TabsTrigger>
                            <TabsTrigger value="rewards">奖励</TabsTrigger>
                        </TabsList>

                        <TabsContent value="opponents" className="space-y-4 mt-6">
                            <Card>
                                <CardHeader><CardTitle>匹配对手</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {legendInfo?.matchingRivalList.map((rival) => (
                                            <div key={rival.playerInfo.playerId} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <Badge variant="outline" className="mb-1">#{rival.currentRank}</Badge>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{rival.playerInfo.playerName}</div>
                                                        <div className="text-sm text-muted-foreground">积分: {rival.currentPoint} • 战力: {rival.defenseBattlePower.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <Button onClick={() => handleLegendChallenge(rival.playerInfo.playerId)} disabled={legendChallengesRemaining === 0}>挑战</Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="history" className="space-y-4 mt-6">
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/20">
                                <RefreshCw className="h-10 w-10 mb-4 opacity-20" />
                                <p>暂无近期对战记录</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="rewards" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>赛季奖励</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {pvpRewards.map((tier, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                                                <span className="font-medium">排名 {tier.upperLimitRanking === tier.lowerLimitRanking ? tier.upperLimitRanking : `${tier.upperLimitRanking} - ${tier.lowerLimitRanking}`}</span>
                                                <div className="flex gap-2">
                                                    {tier.rewardList?.map((item, i) => (
                                                        <span key={i} className="text-sm text-muted-foreground">{t(`[ItemName_${item.itemId}]`)} x{item.itemCount}{i < (tier.rewardList?.length || 0) - 1 ? ' • ' : ''}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}
