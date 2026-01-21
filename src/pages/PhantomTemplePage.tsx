import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    Trophy,
    Clock,
    Star,
    Swords,
    Zap,
    BookOpen,
    Crown,
    Shield
} from 'lucide-react';

// Mock数据 - 当前状态
const templeStatus = {
    dailyChallenges: 4,
    maxDailyChallenges: 6,
    phantomLevel: 25,
    inBonusTime: false,  // 是否在加成时段
    nextBonusTime: '12:30-13:30'
};

// Mock数据 - 队伍
const myTeam = {
    members: [
        { id: 1, name: '我', power: 128000, role: 'leader' },
        { id: 2, name: '队友A', power: 125000, role: 'member' },
        { id: 3, name: null, power: 0, role: 'empty' }  // 空位
    ],
    isReady: false
};

// Mock数据 - 探索任务
const explorationQuests = [
    {
        id: 1,
        name: '初级探索',
        difficulty: 'easy',
        recommendedPower: 100000,
        rewards: ['金币x3000', '经验x2000', '强化石x3'],
        firstClearBonus: ['额外金币x1000'],
        cleared: true,
        stars: 3
    },
    {
        id: 2,
        name: '中级探索',
        difficulty: 'normal',
        recommendedPower: 120000,
        rewards: ['金币x5000', '经验x3500', '强化石x5', '稀有材料x1'],
        firstClearBonus: ['额外金币x2000', 'SSR装备碎片x1'],
        cleared: true,
        stars: 2
    },
    {
        id: 3,
        name: '高级探索',
        difficulty: 'hard',
        recommendedPower: 140000,
        rewards: ['金币x8000', '经验x6000', '强化石x8', '稀有材料x3'],
        firstClearBonus: ['额外金币x3000', 'UR装备碎片x1'],
        cleared: false,
        stars: 0
    },
    {
        id: 4,
        name: '噩梦探索',
        difficulty: 'nightmare',
        recommendedPower: 160000,
        rewards: ['金币x12000', '经验x10000', '强化石x12', '传说材料x2'],
        firstClearBonus: ['额外金币x5000', 'LR装备碎片x1'],
        cleared: false,
        stars: 0
    }
];

export function PhantomTemplePage() {
    const getDifficultyColor = (difficulty: string) => {
        const colors: Record<string, string> = {
            'easy': 'text-green-500 border-green-500',
            'normal': 'text-blue-500 border-blue-500',
            'hard': 'text-purple-500 border-purple-500',
            'nightmare': 'text-red-500 border-red-500'
        };
        return colors[difficulty] || 'text-gray-500';
    };

    const getDifficultyBg = (difficulty: string) => {
        const colors: Record<string, string> = {
            'easy': 'bg-green-500',
            'normal': 'bg-blue-500',
            'hard': 'bg-purple-500',
            'nightmare': 'bg-red-500'
        };
        return colors[difficulty] || 'bg-gray-500';
    };

    const getDifficultyName = (difficulty: string) => {
        const names: Record<string, string> = {
            'easy': '简单',
            'normal': '普通',
            'hard': '困难',
            'nightmare': '噩梦'
        };
        return names[difficulty] || difficulty;
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">幻影神殿</h1>
                <p className="text-muted-foreground mt-1">
                    组队探索神殿，挑战强大敌人获取奖励
                </p>
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
            {templeStatus.inBonusTime && (
                <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-500">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        <strong>奖励加成时段！</strong>
                        当前时段挑战可获得更多奖励
                    </AlertDescription>
                </Alert>
            )}

            {/* 状态卡片 */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Swords className="h-6 w-6" />
                            今日挑战
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">剩余次数</span>
                                <Badge variant="secondary" className="text-base">
                                    {templeStatus.dailyChallenges} / {templeStatus.maxDailyChallenges}
                                </Badge>
                            </div>
                            <Progress
                                value={(templeStatus.dailyChallenges / templeStatus.maxDailyChallenges) * 100}
                                className="h-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-6 w-6 text-purple-500" />
                            幻影等级
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-2">
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                Lv.{templeStatus.phantomLevel}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                随世界开设时长提升
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-6 w-6 text-orange-500" />
                            奖励加成
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-2">
                            <div className={`text-sm font-semibold mb-2 ${templeStatus.inBonusTime ? 'text-green-600' : 'text-muted-foreground'
                                }`}>
                                {templeStatus.inBonusTime ? '进行中' : '未激活'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                下个时段: {templeStatus.nextBonusTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                19:30-20:30
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="quests" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="quests">探索任务</TabsTrigger>
                    <TabsTrigger value="team">组队</TabsTrigger>
                </TabsList>

                {/* 探索任务 */}
                <TabsContent value="quests" className="space-y-4">
                    {explorationQuests.map((quest) => (
                        <Card
                            key={quest.id}
                            className={`hover:shadow-lg transition-all ${quest.cleared ? 'border-green-200 dark:border-green-800' : ''
                                }`}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${getDifficultyBg(quest.difficulty)}`}>
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CardTitle className="text-lg">{quest.name}</CardTitle>
                                                {quest.cleared && (
                                                    <Badge className="bg-green-500">已通关</Badge>
                                                )}
                                            </div>
                                            <CardDescription>
                                                推荐战力: {quest.recommendedPower.toLocaleString()}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${getDifficultyColor(quest.difficulty)} text-base px-3 py-1`}
                                    >
                                        {getDifficultyName(quest.difficulty)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* 星级 */}
                                {quest.cleared && (
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= quest.stars
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* 奖励 */}
                                <div>
                                    <div className="text-sm font-medium mb-2">基础奖励</div>
                                    <div className="flex flex-wrap gap-2">
                                        {quest.rewards.map((reward, index) => (
                                            <Badge key={index} variant="secondary">
                                                <Trophy className="h-3 w-3 mr-1" />
                                                {reward}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* 首次通关奖励 */}
                                {!quest.cleared && quest.firstClearBonus.length > 0 && (
                                    <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200">
                                        <div className="text-sm font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                                            首次通关奖励
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {quest.firstClearBonus.map((reward, index) => (
                                                <Badge key={index} className="bg-yellow-600">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    {reward}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 操作按钮 */}
                                <div className="flex gap-2 pt-2">
                                    <Button className="flex-1">
                                        <Users className="mr-2 h-4 w-4" />
                                        {quest.cleared ? '再次挑战' : '开始挑战'}
                                    </Button>
                                    {!quest.cleared && (
                                        <Button variant="outline" className="flex-1">
                                            <Users className="mr-2 h-4 w-4" />
                                            快速匹配
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* 组队 */}
                <TabsContent value="team" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>当前队伍</CardTitle>
                            <CardDescription>
                                最多3人组队 • 队伍组建后请尽快开始战斗
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* 队员列表 */}
                            <div className="space-y-3">
                                {myTeam.members.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${member.name ? 'bg-muted/50' : 'border-dashed'
                                            }`}
                                    >
                                        {member.name ? (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                                        <Users className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">{member.name}</span>
                                                            {member.role === 'leader' && (
                                                                <Badge className="bg-yellow-500">
                                                                    <Crown className="h-3 w-3 mr-1" />
                                                                    队长
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            战力: {member.power.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                {member.role !== 'leader' && (
                                                    <Button variant="outline" size="sm">
                                                        移除
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-muted-foreground">空位 {index + 1}</span>
                                                <Button size="sm">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    邀请队友
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* 队伍操作 */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    className="flex-1"
                                    size="lg"
                                    disabled={!myTeam.isReady}
                                >
                                    {myTeam.isReady ? '准备完成' : '等待队员'}
                                </Button>
                                <Button variant="outline" size="lg">
                                    解散队伍
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 快速匹配 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>快速匹配</CardTitle>
                            <CardDescription>
                                自动匹配其他玩家组队
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-6 text-center border-2 border-dashed rounded-lg">
                                <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                                <div className="text-sm text-muted-foreground mb-4">
                                    点击下方按钮开始匹配
                                </div>
                                <Button>
                                    <Zap className="mr-2 h-4 w-4" />
                                    开始匹配
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
