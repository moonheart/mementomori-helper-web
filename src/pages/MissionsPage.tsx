import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Trophy,
    Gift,
    CheckCircle2,
    Clock,
    BookOpen,
    Star,
    Target,
    Coins,
    Sparkles
} from 'lucide-react';

// Mock数据 - 每日任务
const dailyMissions = [
    { id: 1, title: '完成3次高速战斗', description: '进行高速战斗获取资源', progress: 3, target: 3, completed: true, claimed: false, rewards: [{ type: 'gold', amount: 50000 }, { type: 'merit', amount: 20 }] },
    { id: 2, title: '挑战无穷之塔', description: '挑战无穷之塔任意层', progress: 1, target: 1, completed: true, claimed: true, rewards: [{ type: 'merit', amount: 30 }] },
    { id: 3, title: '祈愿之泉任务', description: '派遣3次角色远征', progress: 2, target: 3, completed: false, claimed: false, rewards: [{ type: 'gold', amount: 30000 }, { type: 'merit', amount: 15 }] },
    { id: 4, title: '竞技场挑战', description: '进行2次竞技场战斗', progress: 1, target: 2, completed: false, claimed: false, rewards: [{ type: 'diamond', amount: 50 }, { type: 'merit', amount: 25 }] },
    { id: 5, title: '公会签到', description: '前往公会界面签到', progress: 1, target: 1, completed: true, claimed: false, rewards: [{ type: 'merit', amount: 40 }] }
];

// Mock数据 - 每周任务
const weeklyMissions = [
    { id: 1, title: '完成20次高速战斗', progress: 15, target: 20, completed: false, rewards: [{ type: 'gold', amount: 200000 }, { type: 'merit', amount: 100 }] },
    { id: 2, title: '通关无穷之塔10层', progress: 10, target: 10, completed: true, claimed: false, rewards: [{ type: 'diamond', amount: 200 }, { type: 'merit', amount: 150 }] },
    { id: 3, title: '幻影神殿挑战', progress: 12, target: 15, completed: false, rewards: [{ type: 'gold', amount: 300000 }, { type: 'merit', amount: 120 }] }
];

// Mock数据 - 主线任务
const mainMissions = [
    { id: 1, title: '通关主线8-10', description: '推进主线冒险进度', completed: true, rewards: [{ type: 'diamond', amount: 300 }, { type: 'exp', amount: 5000 }] },
    { id: 2, title: '达到玩家等级75', description: '提升玩家等级', progress: 75, target: 75, completed: true, rewards: [{ type: 'diamond', amount: 500 }] },
    { id: 3, title: '通关主线10-5', description: '继续推进主线', progress: 0, target: 1, completed: false, rewards: [{ type: 'diamond', amount: 500 }, { type: 'gold', amount: 100000 }] }
];

// Mock数据 - 成就任务
const achievements = [
    { id: 1, title: '角色收集家', description: '获得50个不同角色', progress: 42, target: 50, tier: 'gold', rewards: [{ type: 'diamond', amount: 1000 }] },
    { id: 2, title: '强化大师', description: '强化装备100次', progress: 100, target: 100, tier: 'gold', completed: true, claimed: false, rewards: [{ type: 'gold', amount: 500000 }] },
    { id: 3, title: '竞技场战神', description: '竞技场获得100次胜利', progress: 78, target: 100, tier: 'silver', rewards: [{ type: 'diamond', amount: 500 }] },
    { id: 4, title: '塔之征服者', description: '通关无穷之塔100层', progress: 85, target: 100, tier: 'platinum', rewards: [{ type: 'diamond', amount: 2000 }] }
];

// 功勋宝箱
const meritBoxes = [
    { id: 1, required: 50, rewards: [{ type: 'gold', amount: 10000 }], claimed: false },
    { id: 2, required: 100, rewards: [{ type: 'diamond', amount: 50 }], claimed: false },
    { id: 3, required: 200, rewards: [{ type: 'gold', amount: 50000 }], claimed: true },
    { id: 4, required: 300, rewards: [{ type: 'diamond', amount: 100 }], claimed: false }
];

export function MissionsPage() {
    const completedDaily = dailyMissions.filter(m => m.completed).length;
    const completedWeekly = weeklyMissions.filter(m => m.completed).length;
    const totalMerit = 135; // 当前功勋值

    const getRewardIcon = (type: string) => {
        const icons: Record<string, JSX.Element> = {
            'diamond': <span className="text-cyan-500">💎</span>,
            'gold': <Coins className="h-4 w-4 text-yellow-600" />,
            'exp': <Star className="h-4 w-4 text-purple-500" />,
            'merit': <Trophy className="h-4 w-4 text-orange-500" />
        };
        return icons[type] || <Gift className="h-4 w-4" />;
    };

    const getTierBadge = (tier: string) => {
        const badges: Record<string, JSX.Element> = {
            'platinum': <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500">铂金</Badge>,
            'gold': <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">黄金</Badge>,
            'silver': <Badge className="bg-gradient-to-r from-gray-400 to-gray-500">白银</Badge>
        };
        return badges[tier] || <Badge>普通</Badge>;
    };

    const renderMissionCard = (mission: any, showProgress = true) => {
        const progress = mission.target ? (mission.progress / mission.target) * 100 : 100;
        const canClaim = mission.completed && !mission.claimed;

        return (
            <Card key={mission.id} className={canClaim ? 'border-2 border-primary' : ''}>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${canClaim ? 'bg-primary text-primary-foreground' : mission.completed ? 'bg-green-100 dark:bg-green-950' : 'bg-muted'}`}>
                        {mission.completed ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <Target className="h-6 w-6" />}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-semibold">{mission.title}</h3>
                                <p className="text-sm text-muted-foreground">{mission.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {mission.tier && getTierBadge(mission.tier)}
                                {mission.completed && (
                                    <Badge variant={canClaim ? 'default' : 'secondary'}>
                                        {canClaim ? '可领取' : '已领取'}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {showProgress && mission.target && (
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex-1">
                                    <Progress value={progress} />
                                </div>
                                <span className="text-sm text-muted-foreground min-w-[70px] text-right">
                                    {mission.progress}/{mission.target}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                            <Gift className="h-4 w-4 text-muted-foreground" />
                            <div className="flex gap-2 flex-wrap">
                                {mission.rewards.map((reward: any, idx: number) => (
                                    <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                        {getRewardIcon(reward.type)}
                                        {reward.amount.toLocaleString()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {canClaim && (
                        <Button>
                            <Gift className="mr-2 h-4 w-4" />
                            领取
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">任务系统</h1>
                <p className="text-muted-foreground mt-1">
                    完成任务获取丰厚奖励
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>任务说明：</strong>
                    每日任务每天4:00重置，每周任务周一4:00重置。完成任务获得功勋银币，累积功勋可开启宝箱奖励。
                </AlertDescription>
            </Alert>

            {/* 功勋进度 */}
            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-orange-500" />
                        功勋银币
                    </CardTitle>
                    <CardDescription>完成任务获得功勋，开启宝箱领取奖励</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">当前功勋</span>
                        <span className="text-2xl font-bold text-orange-600">{totalMerit}</span>
                    </div>

                    <div className="grid gap-3 grid-cols-4">
                        {meritBoxes.map((box) => {
                            const canOpen = totalMerit >= box.required && !box.claimed;
                            return (
                                <div
                                    key={box.id}
                                    className={`p-4 rounded-lg text-center transition-all ${box.claimed
                                            ? 'bg-muted opacity-50'
                                            : canOpen
                                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white cursor-pointer hover:scale-105'
                                                : 'bg-muted'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">
                                        {box.claimed ? '✅' : canOpen ? '🎁' : '🔒'}
                                    </div>
                                    <div className="text-xs font-semibold">
                                        {box.required} 功勋
                                    </div>
                                    <div className="text-xs mt-1 opacity-75">
                                        {box.claimed ? '已领取' : canOpen ? '可开启' : '未解锁'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 进度概览 */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            每日任务
                        </CardTitle>
                        <CardDescription>
                            已完成 {completedDaily} / {dailyMissions.length} 个
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedDaily / dailyMissions.length) * 100} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-purple-500" />
                            每周任务
                        </CardTitle>
                        <CardDescription>
                            已完成 {completedWeekly} / {weeklyMissions.length} 个
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedWeekly / weeklyMissions.length) * 100} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            成就
                        </CardTitle>
                        <CardDescription>
                            已完成 {achievements.filter(a => a.completed).length} / {achievements.length} 个
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(achievements.filter(a => a.completed).length / achievements.length) * 100} />
                    </CardContent>
                </Card>
            </div>

            {/* 任务标签页 */}
            <Tabs defaultValue="daily">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="daily">每日</TabsTrigger>
                    <TabsTrigger value="weekly">每周</TabsTrigger>
                    <TabsTrigger value="main">主线</TabsTrigger>
                    <TabsTrigger value="achievement">成就</TabsTrigger>
                </TabsList>

                {/* 每日任务 */}
                <TabsContent value="daily" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">每日任务</h3>
                            <p className="text-sm text-muted-foreground">每天4:00（服务器时间）重置</p>
                        </div>
                        <Button variant="outline" size="sm">
                            一键领取
                        </Button>
                    </div>
                    {dailyMissions.map(m => renderMissionCard(m))}
                </TabsContent>

                {/* 每周任务 */}
                <TabsContent value="weekly" className="space-y-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold">每周任务</h3>
                            <p className="text-sm text-muted-foreground">每周一4:00（服务器时间）重置</p>
                        </div>
                    </div>
                    {weeklyMissions.map(m => renderMissionCard(m))}
                </TabsContent>

                {/* 主线任务 */}
                <TabsContent value="main" className="space-y-4 mt-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">主线任务</h3>
                        <p className="text-sm text-muted-foreground">根据游戏进度解锁，一次性任务</p>
                    </div>
                    {mainMissions.map(m => renderMissionCard(m, false))}
                </TabsContent>

                {/* 成就任务 */}
                <TabsContent value="achievement" className="space-y-4 mt-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">成就系统</h3>
                        <p className="text-sm text-muted-foreground">长期目标，挑战自我</p>
                    </div>
                    {achievements.map(a => renderMissionCard(a))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
