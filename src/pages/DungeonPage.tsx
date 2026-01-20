import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockDungeons } from '@/mocks/data';
import { Zap, Trophy, Repeat } from 'lucide-react';

export function DungeonPage() {
    const getDifficultyColor = (difficulty: string) => {
        const colors = {
            easy: 'bg-green-500',
            normal: 'bg-blue-500',
            hard: 'bg-purple-500',
            nightmare: 'bg-red-500'
        };
        return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
    };

    const getDifficultyText = (difficulty: string) => {
        const texts = {
            easy: '简单',
            normal: '普通',
            hard: '困难',
            nightmare: '噩梦'
        };
        return texts[difficulty as keyof typeof texts] || difficulty;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">副本系统</h1>
                <p className="text-muted-foreground">挑战副本获取奖励</p>
            </div>

            {/* Dungeons Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockDungeons.map((dungeon) => (
                    <Card key={dungeon.id} className="hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center relative">
                            <Badge className={`absolute top-4 right-4 ${getDifficultyColor(dungeon.difficulty)}`}>
                                {getDifficultyText(dungeon.difficulty)}
                            </Badge>
                            <div className="text-white text-center">
                                <div className="text-5xl mb-2">🏰</div>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle>{dungeon.name}</CardTitle>
                            <CardDescription>
                                推荐战力: {dungeon.recommendedPower.toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cost & Attempts */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Zap className="h-4 w-4 text-green-500" />
                                        <span className="text-muted-foreground">消耗体力</span>
                                    </div>
                                    <span className="font-semibold">{dungeon.staminaCost}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">今日挑战次数</span>
                                    <span className="font-semibold">
                                        {dungeon.attempts.used}/{dungeon.attempts.max}
                                    </span>
                                </div>
                                <Progress
                                    value={(dungeon.attempts.used / dungeon.attempts.max) * 100}
                                    className="h-2"
                                />
                            </div>

                            {/* Rewards */}
                            <div className="rounded-lg border p-3">
                                <div className="text-sm text-muted-foreground mb-2">奖励</div>
                                <div className="flex flex-wrap gap-2">
                                    {dungeon.rewards.map((reward, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {reward.type === 'gold' && '🪙'}
                                            {reward.type === 'equipment' && '⚔️'}
                                            {reward.type === 'diamond' && '💎'}
                                            {' '}
                                            {reward.amount > 1 ? reward.amount.toLocaleString() : ''}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    disabled={dungeon.attempts.used >= dungeon.attempts.max}
                                >
                                    <Repeat className="mr-2 h-4 w-4" />
                                    扫荡
                                </Button>
                                <Button
                                    disabled={dungeon.attempts.used >= dungeon.attempts.max}
                                >
                                    <Trophy className="mr-2 h-4 w-4" />
                                    挑战
                                </Button>
                            </div>

                            {dungeon.attempts.used >= dungeon.attempts.max && (
                                <p className="text-center text-sm text-muted-foreground">
                                    今日挑战次数已用完
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add more dungeons button */}
            <Card className="border-dashed">
                <CardContent className="flex items-center justify-center p-12">
                    <div className="text-center text-muted-foreground">
                        <p className="mb-2">更多副本即将开放</p>
                        <p className="text-sm">敬请期待</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
