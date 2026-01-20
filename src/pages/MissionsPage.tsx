import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockMissions } from '@/mocks/data';
import { Trophy, Gift, CheckCircle2 } from 'lucide-react';

export function MissionsPage() {
    const dailyMissions = mockMissions.filter(m => m.type === 'daily');
    const weeklyMissions = mockMissions.filter(m => m.type === 'weekly');

    const completedDaily = dailyMissions.filter(m => m.completed).length;
    const completedWeekly = weeklyMissions.filter(m => m.completed).length;

    const renderMissionCard = (mission: typeof mockMissions[0]) => {
        const progress = (mission.progress / mission.target) * 100;
        const canClaim = mission.completed && !mission.claimed;

        return (
            <Card key={mission.id} className={canClaim ? 'border-primary' : ''}>
                <CardContent className="flex items-center gap-4 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${canClaim ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {mission.completed ? <CheckCircle2 className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="font-semibold">{mission.title}</h3>
                                <p className="text-sm text-muted-foreground">{mission.description}</p>
                            </div>
                            {mission.completed && (
                                <Badge variant={canClaim ? 'default' : 'secondary'}>
                                    {canClaim ? '可领取' : '已领取'}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1">
                                <Progress value={progress} />
                            </div>
                            <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                                {mission.progress}/{mission.target}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            <Gift className="h-4 w-4 text-muted-foreground" />
                            <div className="flex gap-2">
                                {mission.rewards.map((reward, idx) => (
                                    <Badge key={idx} variant="outline">
                                        {reward.type === 'diamond' && '💎'}
                                        {reward.type === 'gold' && '🪙'}
                                        {reward.type === 'exp' && '⭐'}
                                        {' '}
                                        {reward.amount.toLocaleString()}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {canClaim && (
                        <Button>领取</Button>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">任务系统</h1>
                <p className="text-muted-foreground">完成任务获取丰厚奖励</p>
            </div>

            {/* Progress Overview */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>每日任务</CardTitle>
                        <CardDescription>
                            已完成 {completedDaily} / {dailyMissions.length} 个任务
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedDaily / dailyMissions.length) * 100} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>每周任务</CardTitle>
                        <CardDescription>
                            已完成 {completedWeekly} / {weeklyMissions.length} 个任务
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(completedWeekly / weeklyMissions.length) * 100} />
                    </CardContent>
                </Card>
            </div>

            {/* Missions Tabs */}
            <Tabs defaultValue="daily">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="daily">每日</TabsTrigger>
                    <TabsTrigger value="weekly">每周</TabsTrigger>
                    <TabsTrigger value="main">主线</TabsTrigger>
                    <TabsTrigger value="achievement">成就</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-4 mt-6">
                    {dailyMissions.map(renderMissionCard)}
                </TabsContent>

                <TabsContent value="weekly" className="space-y-4 mt-6">
                    {weeklyMissions.length > 0 ? (
                        weeklyMissions.map(renderMissionCard)
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            暂无每周任务
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="main" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                        主线任务敬请期待
                    </div>
                </TabsContent>

                <TabsContent value="achievement" className="mt-6">
                    <div className="text-center py-12 text-muted-foreground">
                        成就系统敬请期待
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
