import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Shield,
    Trophy,
    Swords,
    Crown,
    Star,
    TrendingUp,
    Users,
    Award,
    BookOpen,
    Zap
} from 'lucide-react';

// Mock数据 - 古竞技场
const ancientArena = {
    myRank: 127,
    totalPlayers: 50000,
    freeChallenges: 3,
    maxFreeChallenges: 5,
    power: 125000,
    todayRewardClaimed: false
};

// Mock对手列表
const opponents = [
    { rank: 85, name: '暗影之刃', power: 132000, element: '业红', canChallenge: true },
    { rank: 92, name: '星辰守护', power: 128500, element: '忧蓝', canChallenge: true },
    { rank: 105, name: '风之使者', power: 126800, element: '苍翠', canChallenge: true },
    { rank: 143, name: '烈焰战士', power: 123500, element: '业红', canChallenge: false }
];

// Mock数据 - 巅峰竞技场
const apexArena = {
    qualified: true,
    seasonDay: 3,  // 周四
    myRank: 18,
    myPoints: 1650,
    myTier: '皇室',
    freeChallenges: 7,
    maxFreeChallenges: 10,
    winStreak: 5,
    seasonEndsIn: '3天12小时'
};

// 阶级配置
const tierConfig = [
    { name: '骑士', minPoints: 0, maxPoints: 1049, color: 'text-gray-500', icon: Shield },
    { name: '圣骑士', minPoints: 1050, maxPoints: 1399, color: 'text-blue-500', icon: Shield },
    { name: '大十字', minPoints: 1400, maxPoints: 1599, color: 'text-purple-500', icon: Award },
    { name: '皇室', minPoints: 1600, maxPoints: 1799, rankReq: 30, color: 'text-yellow-500', icon: Crown },
    { name: '传说', minPoints: 1800, maxPoints: 2199, rankReq: 10, color: 'text-orange-500', icon: Star },
    { name: '世界霸主', minPoints: 2200, rankReq: 1, color: 'text-red-500', icon: Trophy }
];

// Mock排行榜
const apexLeaderboard = [
    { rank: 1, name: '永恒之王', points: 2450, tier: '世界霸主', streak: 15 },
    { rank: 2, name: '光辉女皇', points: 2280, tier: '传说', streak: 12 },
    { rank: 3, name: '暗夜君主', points: 2150, tier: '传说', streak: 8 },
    { rank: 18, name: '玩家自己', points: 1650, tier: '皇室', streak: 5, isMe: true },
];

export function ArenaPage() {
    const getElementColor = (element: string) => {
        const colors: Record<string, string> = {
            '忧蓝': 'text-blue-500',
            '业红': 'text-red-500',
            '苍翠': 'text-green-500',
            '流金': 'text-yellow-500'
        };
        return colors[element] || 'text-gray-500';
    };

    const getCurrentTier = (points: number, rank: number) => {
        for (let i = tierConfig.length - 1; i >= 0; i--) {
            const tier = tierConfig[i];
            if (points >= tier.minPoints) {
                if (tier.rankReq && rank > tier.rankReq) {
                    continue;
                }
                if (tier.maxPoints && points > tier.maxPoints) {
                    continue;
                }
                return tier;
            }
        }
        return tierConfig[0];
    };

    const currentTier = getCurrentTier(apexArena.myPoints, apexArena.myRank);

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">竞技场</h1>
                <p className="text-muted-foreground mt-1">
                    与其他玩家对战，争夺排名和荣耀
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>竞技场说明：</strong>
                    古竞技场每天5次免费挑战，胜利可互换排名。
                    巅峰竞技场仅限古竞技场前50名玩家参加，周赛制，通过积分和排名晋升阶级。
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="ancient" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ancient">古竞技场</TabsTrigger>
                    <TabsTrigger value="apex">巅峰竞技场</TabsTrigger>
                </TabsList>

                {/* 古竞技场 */}
                <TabsContent value="ancient" className="space-y-6">
                    {/* 我的排名 */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                    我的排名
                                </CardTitle>
                                <CardDescription>当前竞技场排名</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    <div className="text-6xl font-bold text-primary mb-2">
                                        #{ancientArena.myRank}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        / {ancientArena.totalPlayers.toLocaleString()} 玩家
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-muted-foreground">战力</span>
                                        <span className="font-semibold">{ancientArena.power.toLocaleString()}</span>
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
                                <CardDescription>每天凌晨4:00重置</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">免费次数</span>
                                        <Badge variant="secondary" className="text-base">
                                            {ancientArena.freeChallenges} / {ancientArena.maxFreeChallenges}
                                        </Badge>
                                    </div>
                                    <Progress
                                        value={(ancientArena.freeChallenges / ancientArena.maxFreeChallenges) * 100}
                                        className="h-2"
                                    />
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button className="w-full" size="lg">
                                        <Zap className="mr-2 h-5 w-5" />
                                        刷新对手
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <span className="mr-1">💎</span>
                                        购买挑战次数
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 对手列表 */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>可挑战对手</CardTitle>
                                    <CardDescription>击败对手可互换排名</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Trophy className="mr-2 h-4 w-4" />
                                    查看排行榜
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {opponents.map((opponent, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${opponent.canChallenge
                                                ? 'hover:border-primary hover:shadow-md'
                                                : 'opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <Badge variant="outline" className="mb-1">
                                                    #{opponent.rank}
                                                </Badge>
                                                {opponent.rank < ancientArena.myRank && (
                                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{opponent.name}</div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>战力: {opponent.power.toLocaleString()}</span>
                                                    <span>•</span>
                                                    <span className={getElementColor(opponent.element)}>
                                                        {opponent.element}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {opponent.canChallenge ? (
                                            <Button>
                                                <Swords className="mr-2 h-4 w-4" />
                                                挑战
                                            </Button>
                                        ) : (
                                            <Button disabled>
                                                排名更低
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 奖励说明 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>每日奖励</CardTitle>
                            <CardDescription>根据每天20:30的排名发放</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="h-8 w-8 text-yellow-500" />
                                        <div>
                                            <div className="font-semibold">今日排名奖励</div>
                                            <div className="text-sm text-muted-foreground">
                                                {ancientArena.todayRewardClaimed ? '已领取' : '未领取'}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        disabled={ancientArena.todayRewardClaimed}
                                        variant={ancientArena.todayRewardClaimed ? "outline" : "default"}
                                    >
                                        {ancientArena.todayRewardClaimed ? '已领取' : '领取奖励'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 巅峰竞技场 */}
                <TabsContent value="apex" className="space-y-6">
                    {apexArena.qualified ? (
                        <>
                            {/* 我的信息 */}
                            <div className="grid gap-6 md:grid-cols-3">
                                <Card className="border-2 border-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {currentTier.icon && <currentTier.icon className={`h-6 w-6 ${currentTier.color}`} />}
                                            我的阶级
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-2">
                                            <div className={`text-4xl font-bold ${currentTier.color} mb-2`}>
                                                {apexArena.myTier}
                                            </div>
                                            <div className="text-sm text-muted-foreground mb-4">
                                                积分: {apexArena.myPoints} pt
                                            </div>
                                            <Badge variant="outline" className="text-base">
                                                排名 #{apexArena.myRank}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Star className="h-6 w-6 text-yellow-500" />
                                            连胜记录
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-2">
                                            <div className="text-4xl font-bold text-yellow-500 mb-2">
                                                {apexArena.winStreak}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                连胜中
                                            </div>
                                            {apexArena.winStreak >= 3 && (
                                                <Badge className="mt-3 bg-yellow-500">
                                                    <Zap className="h-3 w-3 mr-1" />
                                                    额外积分加成
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Swords className="h-6 w-6" />
                                            挑战次数
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">免费次数</span>
                                                <Badge variant="secondary">
                                                    {apexArena.freeChallenges} / {apexArena.maxFreeChallenges}
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={(apexArena.freeChallenges / apexArena.maxFreeChallenges) * 100}
                                                className="h-2"
                                            />
                                            <div className="text-xs text-muted-foreground">
                                                每天20:30重置
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 赛季信息 */}
                            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-6 w-6 text-purple-600" />
                                        赛季信息
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">赛季进度</div>
                                            <div className="font-semibold">第 {apexArena.seasonDay}/6 天</div>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">赛季结束</div>
                                            <div className="font-semibold">{apexArena.seasonEndsIn}</div>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">赛季时间</div>
                                            <div className="font-semibold">周二-周日</div>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">对战时间</div>
                                            <div className="font-semibold">21:00-20:30</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 排行榜 */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>综合排行榜</CardTitle>
                                            <CardDescription>赛季总积分排名前50</CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            查看世界榜
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {apexLeaderboard.map((player) => (
                                            <div
                                                key={player.rank}
                                                className={`flex items-center justify-between p-4 rounded-lg border ${player.isMe
                                                        ? 'border-primary bg-primary/5'
                                                        : player.rank <= 3
                                                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950'
                                                            : ''
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`text-2xl font-bold ${player.rank === 1 ? 'text-yellow-500' :
                                                            player.rank === 2 ? 'text-gray-400' :
                                                                player.rank === 3 ? 'text-orange-600' :
                                                                    'text-muted-foreground'
                                                        }`}>
                                                        #{player.rank}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">{player.name}</span>
                                                            {player.isMe && <Badge>你</Badge>}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <span>{player.tier}</span>
                                                            <span>•</span>
                                                            <span>{player.points} pt</span>
                                                            {player.streak > 0 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="text-yellow-600">
                                                                        {player.streak}连胜
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {!player.isMe && (
                                                    <Button size="sm">
                                                        <Swords className="mr-1 h-4 w-4" />
                                                        挑战
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 阶级列表 */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>阶级晋升</CardTitle>
                                    <CardDescription>根据积分和排名晋升阶级</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {tierConfig.map((tier, index) => {
                                            const TierIcon = tier.icon;
                                            const isCurrent = tier.name === apexArena.myTier;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-lg border ${isCurrent ? 'border-primary bg-primary/5' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <TierIcon className={`h-6 w-6 ${tier.color}`} />
                                                        <span className={`text-lg font-semibold ${tier.color}`}>
                                                            {tier.name}
                                                        </span>
                                                        {isCurrent && <Badge>当前</Badge>}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {tier.minPoints}
                                                        {tier.maxPoints && ` - ${tier.maxPoints}`}
                                                        {tier.minPoints >= 1400 ? '+ pt' : ' pt'}
                                                        {tier.rankReq && ` • 排名前${tier.rankReq}名`}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <Shield className="h-24 w-24 mb-4 text-muted-foreground opacity-20" />
                                <h3 className="text-lg font-semibold mb-2">未达到参赛条件</h3>
                                <p className="text-muted-foreground mb-4 max-w-md">
                                    巅峰竞技场仅限于古竞技场排名前50的玩家参加
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">条件1</Badge>
                                        <span>玩家等级达到50以上</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">条件2</Badge>
                                        <span>古竞技场排名前50以内</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
