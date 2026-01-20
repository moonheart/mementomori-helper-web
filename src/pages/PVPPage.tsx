import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPVPOpponents, mockBattles } from '@/mocks/data';
import { Swords, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

export function PVPPage() {
    const playerRank = 2458;
    const playerPoints = 2850;
    const winRate = 65;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">竞技场</h1>
                <p className="text-muted-foreground">挑战其他玩家，提升排名</p>
            </div>

            {/* Player Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">当前排名</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">#{playerRank}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">积分</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{playerPoints}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">胜率</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{winRate}%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="opponents">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="opponents">挑战</TabsTrigger>
                    <TabsTrigger value="history">记录</TabsTrigger>
                    <TabsTrigger value="rewards">奖励</TabsTrigger>
                </TabsList>

                {/* Opponents List */}
                <TabsContent value="opponents" className="space-y-4 mt-6">
                    {mockPVPOpponents.map((opponent) => (
                        <Card key={opponent.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl">
                                        {opponent.name[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-lg">{opponent.name}</span>
                                            <Badge variant="outline">Lv.{opponent.level}</Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            排名 #{opponent.rank} • 战力 {opponent.power.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <Button>
                                    <Swords className="mr-2 h-4 w-4" />
                                    挑战
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Battle History */}
                <TabsContent value="history" className="space-y-4 mt-6">
                    {mockBattles.map((battle) => (
                        <Card key={battle.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${battle.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                        {battle.result === 'win' ? (
                                            <Trophy className="h-6 w-6 text-white" />
                                        ) : (
                                            <Swords className="h-6 w-6 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold mb-1">
                                            vs {battle.opponentName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {battle.timestamp.toLocaleString('zh-CN')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {battle.rankChange > 0 ? (
                                        <>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            <span className="text-green-500 font-semibold">+{battle.rankChange}</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown className="h-4 w-4 text-red-500" />
                                            <span className="text-red-500 font-semibold">{battle.rankChange}</span>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Season Rewards */}
                <TabsContent value="rewards" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>赛季奖励</CardTitle>
                            <CardDescription>根据赛季结束时的排名获得奖励</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { rank: '1-10', rewards: '💎 5000 + 🏆 专属称号' },
                                    { rank: '11-50', rewards: '💎 3000 + ⭐ 经验药水x10' },
                                    { rank: '51-100', rewards: '💎 2000 + ⭐ 经验药水x5' },
                                    { rank: '101-500', rewards: '💎 1000 + 🪙 金币x100000' },
                                    { rank: '500+', rewards: '💎 500 + 🪙 金币x50000' }
                                ].map((tier, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                                        <span className="font-medium">排名 {tier.rank}</span>
                                        <span className="text-sm text-muted-foreground">{tier.rewards}</span>
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
