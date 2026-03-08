import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
    Users,
    Crown,
    Trophy,
    Swords,
    BookOpen,
    TrendingUp,
    Gift,
    Award
} from 'lucide-react';
import { JSX } from 'react';

// Mock数据 - 公会信息
const guildInfo = {
    name: '永恒殿堂',
    level: 18,
    exp: 45000,
    maxExp: 50000,
    members: 28,
    maxMembers: 30,
    totalPower: 3500000,
    guildPoints: 52000,
    maxGuildPoints: 70000,
    ranking: 8
};

// Mock数据 - 成员列表
const members = [
    { id: 1, name: '公会会长', level: 85, power: 145000, position: 'leader', contribution: 15000, online: true },
    { id: 2, name: '副会长', level: 83, power: 138000, position: 'vice', contribution: 12000, online: false },
    { id: 3, name: '指挥官A', level: 82, power: 135000, position: 'commander', contribution: 11500, online: true },
    { id: 4, name: '精锐成员', level: 80, power: 128000, position: 'elite', contribution: 10200, online: false },
    { id: 5, name: '普通成员', level: 75, power: 120000, position: 'member', contribution: 8500, online: true }
];

// Mock数据 - 公会活动
const guildActivities = {
    guildRaidAvailable: true,
    guildWarQualified: true,
    guildTreeActive: true,
    raidChallenges: 2,
    treeFloor: 45,
    warRanking: 8
};

export function GuildPage() {
    const getPositionBadge = (position: string) => {
        const badges: Record<string, JSX.Element> = {
            'leader': <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500"><Crown className="h-3 w-3 mr-1" />会长</Badge>,
            'vice': <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">副会长</Badge>,
            'commander': <Badge className="bg-blue-500">指挥官</Badge>,
            'elite': <Badge className="bg-green-500">精锐</Badge>,
            'member': <Badge variant="secondary">成员</Badge>
        };
        return badges[position] || <Badge variant="outline">未知</Badge>;
    };

    return (
        <div className="space-y-6">
            {/* 公会状态卡片 */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span className="text-sm text-muted-foreground">成员</span>
                            </div>
                            <span className="font-bold text-blue-600">
                                {guildInfo.members}/{guildInfo.maxMembers}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-muted-foreground">等级</span>
                            </div>
                            <span className="font-bold text-green-600">
                                Lv.{guildInfo.level}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-purple-500" />
                                <span className="text-sm text-muted-foreground">总战力</span>
                            </div>
                            <span className="font-bold text-purple-600">
                                {(guildInfo.totalPower / 10000).toFixed(1)}万
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-orange-500" />
                                <span className="text-sm text-muted-foreground">积分</span>
                            </div>
                            <span className="font-bold text-orange-600">
                                {(guildInfo.guildPoints / 1000).toFixed(1)}K
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 公会经验 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        公会经验
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span>离下一级还需</span>
                        <span className="font-semibold">{guildInfo.maxExp - guildInfo.exp} EXP</span>
                    </div>
                    <Progress value={(guildInfo.exp / guildInfo.maxExp) * 100} className="h-3" />
                    <div className="flex items-center justify-between">
                        <Button>
                            <Gift className="mr-2 h-4 w-4" />
                            签到领取奖励
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            {guildInfo.exp.toLocaleString()} / {guildInfo.maxExp.toLocaleString()}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="members" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="members">成员列表</TabsTrigger>
                    <TabsTrigger value="activities">公会活动</TabsTrigger>
                    <TabsTrigger value="raid">公会讨伐</TabsTrigger>
                    <TabsTrigger value="war">公会战</TabsTrigger>
                </TabsList>

                {/* 成员列表 */}
                <TabsContent value="members" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            共 {guildInfo.members} 位成员
                        </div>
                        <Button variant="outline" size="sm">
                            <Users className="mr-2 h-4 w-4" />
                            招募成员
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {members.map((member) => (
                            <Card key={member.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{member.name}</span>
                                                    {getPositionBadge(member.position)}
                                                    {member.online && <Badge className="bg-green-500">在线</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>Lv.{member.level}</span>
                                                    <span>•</span>
                                                    <span>战力: {member.power.toLocaleString()}</span>
                                                    <span>•</span>
                                                    <span>贡献: {member.contribution.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 公会活动 */}
                <TabsContent value="activities" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className={guildActivities.guildTreeActive ? 'border-2 border-green-500' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-6 w-6 text-green-500" />
                                    公会树
                                </CardTitle>
                                <CardDescription>协力挑战，提升通关层数</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-2xl font-bold text-green-600">
                                    第 {guildActivities.treeFloor} 层
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    每天3次挑战机会
                                </div>
                                <Button className="w-full">前往挑战</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Swords className="h-6 w-6 text-purple-500" />
                                    公会任务
                                </CardTitle>
                                <CardDescription>每周任务，获取丰厚奖励</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm text-muted-foreground">
                                    完成任务获得公会功勋银币
                                </div>
                                <Button className="w-full">查看任务</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 公会讨伐 */}
                <TabsContent value="raid" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>索尼娅讨伐战</CardTitle>
                            <CardDescription>每天2次挑战机会，4:00重置</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">今日挑战</span>
                                <Badge>2/2 次</Badge>
                            </div>
                            <Button className="w-full">
                                <Swords className="mr-2 h-4 w-4" />
                                开始挑战
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                光士讨伐战
                                <Badge className="bg-orange-500">高级</Badge>
                            </CardTitle>
                            <CardDescription>消耗10,000公会积分开放，24小时内2次挑战</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                                <div className="text-sm text-muted-foreground">
                                    仅会长、副会长、指挥官、精锐可开放
                                </div>
                            </div>
                            <Button className="w-full" variant="outline">
                                开放讨伐战 (10K积分)
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 公会战 */}
                <TabsContent value="war" className="space-y-4">
                    {guildActivities.guildWarQualified ? (
                        <>
                            <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-500">
                                <Trophy className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200">
                                    <strong>已获得公会战参战资格！</strong>
                                    公会积分排名前16即可参加公会战
                                </AlertDescription>
                            </Alert>

                            <Card>
                                <CardHeader>
                                    <CardTitle>公会战信息</CardTitle>
                                    <CardDescription>据点争夺战</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">备战期间</div>
                                            <div className="font-semibold">7:45-20:30</div>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <div className="text-sm text-muted-foreground mb-1">开战期间</div>
                                            <div className="font-semibold">20:45-21:30</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        • 每天最多向2座据点宣战<br />
                                        • 据点类型：教会、城堡、神殿<br />
                                        • 角色体力2点/天
                                    </div>
                                    <Button className="w-full">
                                        <Swords className="mr-2 h-4 w-4" />
                                        进入公会战
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <Trophy className="h-16 w-16 mb-4 text-muted-foreground opacity-20" />
                                <h3 className="text-lg font-semibold mb-2">未获得参战资格</h3>
                                <p className="text-muted-foreground mb-4">
                                    公会积分排名需进入前16名
                                </p>
                                <div className="text-sm text-muted-foreground">
                                    当前排名: #{guildInfo.ranking}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
