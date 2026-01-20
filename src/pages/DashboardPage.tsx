import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPlayerInfo, mockCurrency, mockMissions, mockCharacters } from '@/mocks/data';
import { ArrowRight, Trophy, Users, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
    const navigate = useNavigate();
    const expProgress = (mockPlayerInfo.exp / mockPlayerInfo.maxExp) * 100;
    const staminaProgress = (mockCurrency.stamina / mockCurrency.maxStamina) * 100;

    const unfinishedMissions = mockMissions.filter(m => !m.completed).length;
    const unclaimedRewards = mockMissions.filter(m => m.completed && !m.claimed).length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">仪表板</h1>
                <p className="text-muted-foreground">欢迎回来，{mockPlayerInfo.name}！</p>
            </div>

            {/* Player Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">等级进度</CardTitle>
                        <Badge>Lv.{mockPlayerInfo.level}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Progress value={expProgress} />
                            <p className="text-xs text-muted-foreground">
                                {mockPlayerInfo.exp} / {mockPlayerInfo.maxExp} EXP
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">体力值</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Progress value={staminaProgress} className="[&>div]:bg-green-500" />
                            <p className="text-xs text-muted-foreground">
                                {mockCurrency.stamina} / {mockCurrency.maxStamina}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">未完成任务</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unfinishedMissions}</div>
                        <p className="text-xs text-muted-foreground">
                            {unclaimedRewards} 个奖励待领取
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">角色数量</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockCharacters.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {mockCharacters.filter(c => c.rarity === 'UR').length} UR角色
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>快捷操作</CardTitle>
                    <CardDescription>常用功能快速入口</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Button
                            variant="outline"
                            className="h-auto flex-col gap-2 py-4"
                            onClick={() => navigate('/missions')}
                        >
                            <Trophy className="h-6 w-6" />
                            <div className="text-center">
                                <div className="font-semibold">任务</div>
                                <div className="text-xs text-muted-foreground">完成每日任务</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto flex-col gap-2 py-4"
                            onClick={() => navigate('/shop')}
                        >
                            <ShoppingBag className="h-6 w-6" />
                            <div className="text-center">
                                <div className="font-semibold">商店</div>
                                <div className="text-xs text-muted-foreground">购买道具</div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto flex-col gap-2 py-4"
                            onClick={() => navigate('/gacha')}
                        >
                            <div className="text-2xl">✨</div>
                            <div className="text-center">
                                <div className="font-semibold">抽卡</div>
                                <div className="text-xs text-muted-foreground">获取新角色</div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>未完成任务</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/missions')}>
                                查看全部
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockMissions.slice(0, 3).map((mission) => (
                                <div
                                    key={mission.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{mission.title}</div>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Progress
                                                value={(mission.progress / mission.target) * 100}
                                                className="h-1.5 w-32"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {mission.progress}/{mission.target}
                                            </span>
                                        </div>
                                    </div>
                                    {mission.completed && !mission.claimed && (
                                        <Badge variant="default">可领取</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>我的角色</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/characters')}>
                                查看全部
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockCharacters.slice(0, 3).map((character) => (
                                <div
                                    key={character.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{character.name}</span>
                                                <Badge variant={character.rarity === 'UR' ? 'default' : 'secondary'}>
                                                    {character.rarity}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Lv.{character.level}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
