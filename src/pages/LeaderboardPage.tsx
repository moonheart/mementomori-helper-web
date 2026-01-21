import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Trophy,
    Crown,
    TrendingUp,
    Users,
    Swords,
    Star,
    Award,
    BookOpen
} from 'lucide-react';

// Mock数据 - 战力排行榜
const powerRankings = [
    { rank: 1, name: '永恒君王', power: 285000, level: 90, avatar: '👑' },
    { rank: 2, name: '光耀女皇', power: 278000, level: 89, avatar: '⭐' },
    { rank: 3, name: '暗影领主', power: 265000, level: 88, avatar: '🌙' },
    { rank: 4, name: '烈焰战神', power: 252000, level: 87, avatar: '🔥' },
    { rank: 5, name: '冰霜女神', power: 248000, level: 86, avatar: '❄️' },
    { rank: 156, name: '你', power: 128000, level: 75, avatar: '😊', isMe: true }
];

// Mock数据 - 角色排行榜
const characterRankings = [
    { rank: 1, player: '永恒君王', character: '露娜', rarity: 'LR', power: 58000, level: 90 },
    { rank: 2, player: '光耀女皇', character: '索菲亚', rarity: 'UR', power: 55000, level: 89 },
    { rank: 3, player: '暗影领主', character: '艾莉娜', rarity: 'UR', power: 53000, level: 88 }
];

// Mock数据 - 公会排行榜
const guildRankings = [
    { rank: 1, name: '永恒殿堂', members: 30, totalPower: 7200000, level: 25 },
    { rank: 2, name: '光明圣殿', members: 30, totalPower: 6800000, level: 24 },
    { rank: 3, name: '暗影军团', members: 28, totalPower: 6500000, level: 23 },
    { rank: 18, name: '我的公会', members: 25, totalPower: 3200000, level: 18, isMe: true }
];

// Mock数据 - 竞技场排行榜
const arenaRankings = [
    { rank: 1, name: '竞技之王', points: 2450, winRate: 85, streak: 15 },
    { rank: 2, name: '战斗女神', points: 2280, winRate: 82, streak: 12 },
    { rank: 3, name: '无敌战士', points: 2150, winRate: 79, streak: 8 }
];

// Mock数据 - 无穷之塔排行榜
const towerRankings = [
    { rank: 1, name: '登峰造极', floor: 100, stars: 300, clearTime: '2小时15分' },
    { rank: 2, name: '塔之征服', floor: 98, stars: 294, clearTime: '2小时30分' },
    { rank: 3, name: '云端行者', floor: 95, stars: 285, clearTime: '2小时45分' }
];

export function LeaderboardPage() {
    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-500';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-orange-600';
        return 'text-muted-foreground';
    };

    const getRankBg = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
        if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500';
        if (rank === 3) return 'bg-gradient-to-r from-orange-600 to-red-600';
        return 'bg-muted';
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">排行榜</h1>
                <p className="text-muted-foreground mt-1">
                    查看各类排名，与顶尖玩家竞争
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>排行榜说明：</strong>
                    排行榜每天更新，不同类型排行榜有不同的评分标准。
                    排名靠前的玩家可获得丰厚奖励和专属称号。
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="power" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="power">战力</TabsTrigger>
                    <TabsTrigger value="character">角色</TabsTrigger>
                    <TabsTrigger value="arena">竞技场</TabsTrigger>
                    <TabsTrigger value="guild">公会</TabsTrigger>
                    <TabsTrigger value="tower">无穷之塔</TabsTrigger>
                </TabsList>

                {/* 战力排行榜 */}
                <TabsContent value="power" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-6 w-6 text-yellow-500" />
                                        战力排行榜
                                    </CardTitle>
                                    <CardDescription>根据玩家总战力排名</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    查看奖励
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {powerRankings.map((player) => (
                                    <div
                                        key={player.rank}
                                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${player.isMe
                                                ? 'border-2 border-primary bg-primary/5'
                                                : player.rank <= 3
                                                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950'
                                                    : 'border'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-3xl font-bold ${getRankColor(player.rank)} min-w-[60px] text-center`}>
                                                {player.rank <= 3 ? (
                                                    <div className="flex items-center justify-center">
                                                        {player.rank === 1 && <Crown className="h-8 w-8 fill-current" />}
                                                        {player.rank === 2 && <Award className="h-8 w-8 fill-current" />}
                                                        {player.rank === 3 && <Star className="h-8 w-8 fill-current" />}
                                                    </div>
                                                ) : (
                                                    `#${player.rank}`
                                                )}
                                            </div>
                                            <div className="text-4xl">{player.avatar}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-lg">{player.name}</span>
                                                    {player.isMe && <Badge>你</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>Lv.{player.level}</span>
                                                    <span>•</span>
                                                    <span className="font-semibold text-primary">
                                                        战力: {player.power.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {!player.isMe && (
                                            <Button size="sm" variant="outline">
                                                查看详情
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 角色排行榜 */}
                <TabsContent value="character" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-purple-500" />
                                角色排行榜
                            </CardTitle>
                            <CardDescription>根据单个角色战力排名</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {characterRankings.map((entry) => (
                                    <div
                                        key={entry.rank}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${entry.rank <= 3
                                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950'
                                                : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-2xl font-bold ${getRankColor(entry.rank)} min-w-[50px] text-center`}>
                                                #{entry.rank}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{entry.character}</span>
                                                    <Badge className={
                                                        entry.rarity === 'LR' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                                                            entry.rarity === 'UR' ? 'bg-yellow-500' :
                                                                'bg-purple-500'
                                                    }>
                                                        {entry.rarity}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>所有者: {entry.player}</span>
                                                    <span>•</span>
                                                    <span>Lv.{entry.level}</span>
                                                    <span>•</span>
                                                    <span className="text-primary font-semibold">
                                                        战力: {entry.power.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 竞技场排行榜 */}
                <TabsContent value="arena" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Swords className="h-6 w-6 text-red-500" />
                                竞技场排行榜
                            </CardTitle>
                            <CardDescription>根据竞技场积分排名</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {arenaRankings.map((entry) => (
                                    <div
                                        key={entry.rank}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${entry.rank <= 3
                                                ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950'
                                                : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-2xl font-bold ${getRankColor(entry.rank)} min-w-[50px] text-center`}>
                                                #{entry.rank}
                                            </div>
                                            <div>
                                                <div className="font-semibold mb-1">{entry.name}</div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="text-primary font-semibold">{entry.points} pt</span>
                                                    <span>•</span>
                                                    <span>胜率: {entry.winRate}%</span>
                                                    <span>•</span>
                                                    <span className="text-yellow-600">{entry.streak}连胜</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 公会排行榜 */}
                <TabsContent value="guild" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-blue-500" />
                                公会排行榜
                            </CardTitle>
                            <CardDescription>根据公会总战力排名</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {guildRankings.map((guild) => (
                                    <div
                                        key={guild.rank}
                                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${guild.isMe
                                                ? 'border-2 border-primary bg-primary/5'
                                                : guild.rank <= 3
                                                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950'
                                                    : 'border'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-2xl font-bold ${getRankColor(guild.rank)} min-w-[50px] text-center`}>
                                                #{guild.rank}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-lg">{guild.name}</span>
                                                    {guild.isMe && <Badge>我的公会</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>Lv.{guild.level}</span>
                                                    <span>•</span>
                                                    <span>{guild.members}/30 成员</span>
                                                    <span>•</span>
                                                    <span className="text-primary font-semibold">
                                                        总战力: {guild.totalPower.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 无穷之塔排行榜 */}
                <TabsContent value="tower" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                                无穷之塔排行榜
                            </CardTitle>
                            <CardDescription>根据通关层数和星数排名</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {towerRankings.map((entry) => (
                                    <div
                                        key={entry.rank}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${entry.rank <= 3
                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
                                                : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`text-2xl font-bold ${getRankColor(entry.rank)} min-w-[50px] text-center`}>
                                                #{entry.rank}
                                            </div>
                                            <div>
                                                <div className="font-semibold mb-1">{entry.name}</div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="text-primary font-semibold">第{entry.floor}层</span>
                                                    <span>•</span>
                                                    <span className="text-yellow-600">{entry.stars}星</span>
                                                    <span>•</span>
                                                    <span>用时: {entry.clearTime}</span>
                                                </div>
                                            </div>
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
