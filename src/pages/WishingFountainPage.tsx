import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sparkles,
    Users,
    Zap,
    Clock,
    Trophy,
    Star,
    BookOpen,
    Timer,
    Send
} from 'lucide-react';

// Mock数据 - 常规任务
const regularQuests = [
    {
        id: 'reg_1',
        name: '森林探索',
        rarity: 'SSR',
        duration: '8小时',
        remainingTime: '2小时30分',
        progress: 68,
        requirements: ['SSR角色', '忧蓝属性'],
        rewards: ['金币x5000', '经验x3000', '强化石x5'],
        assignedCharacter: '艾莉娜',
        status: 'ongoing'
    },
    {
        id: 'reg_2',
        name: '古迹调查',
        rarity: 'UR',
        duration: '12小时',
        remainingTime: '10小时15分',
        progress: 15,
        requirements: ['UR角色', '业红属性', '等级50+'],
        rewards: ['金币x8000', '经验x5000', '稀有材料x3'],
        assignedCharacter: '索菲亚',
        status: 'ongoing'
    },
    {
        id: 'reg_3',
        name: '资源采集',
        rarity: 'SR',
        duration: '4小时',
        remainingTime: null,
        progress: 0,
        requirements: ['SR角色'],
        rewards: ['金币x2000', '经验x1000'],
        assignedCharacter: null,
        status: 'available'
    },
    {
        id: 'reg_4',
        name: '秘境寻宝',
        rarity: 'SSR',
        duration: '6小时',
        remainingTime: null,
        progress: 0,
        requirements: ['SSR角色', '苍翠属性'],
        rewards: ['金币x4500', '经验x2500', '符石碎片x10'],
        assignedCharacter: null,
        status: 'available'
    }
];

// Mock数据 - 联合任务
const jointQuests = [
    {
        id: 'joint_1',
        name: '联合讨伐',
        rarity: 'LR',
        duration: '24小时',
        remainingTime: '18小时',
        progress: 25,
        requirements: ['LR角色', '支援角色(好友/公会)'],
        rewards: ['金币x15000', '经验x10000', '传说装备碎片x1'],
        assignedCharacter: '露娜',
        supportCharacter: '好友-米拉',
        status: 'ongoing'
    },
    {
        id: 'joint_2',
        name: '遗迹探险',
        rarity: 'UR',
        duration: '16小时',
        remainingTime: null,
        progress: 0,
        requirements: ['UR角色', '支援角色(公会)'],
        rewards: ['金币x10000', '经验x6000', '高级材料x5'],
        assignedCharacter: null,
        supportCharacter: null,
        status: 'available'
    }
];

// Mock数据 - 游击任务
const guerrillaQuest = {
    id: 'guer_1',
    name: '紧急委托',
    rarity: 'random',
    duration: '3小时',
    remainingTime: null,
    progress: 0,
    requirements: ['任意角色（奖励取决于稀有度和属性）'],
    rewards: ['???（根据派遣角色决定）'],
    assignedCharacter: null,
    status: 'available',
    appeared: true  // 今天已出现
};

export function WishingFountainPage() {
    const getRarityColor = (rarity: string) => {
        const colors: Record<string, string> = {
            'SR': 'bg-blue-500',
            'SSR': 'bg-purple-500',
            'UR': 'bg-yellow-500',
            'LR': 'bg-gradient-to-r from-orange-500 to-red-600',
            'random': 'bg-gradient-to-r from-green-500 to-cyan-500'
        };
        return colors[rarity] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">祈愿之泉</h1>
                <p className="text-muted-foreground mt-1">
                    派遣角色进行远征，经过一定时间后获得奖励
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>祈愿之泉说明：</strong>
                    常规任务每天凌晨4:00更新，联合任务需要好友/公会支援，游击任务每天随机出现1次。
                    可使用钻石进行高速远征立即完成任务。
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="regular" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="regular">常规任务</TabsTrigger>
                    <TabsTrigger value="joint">联合任务</TabsTrigger>
                    <TabsTrigger value="guerrilla">游击任务</TabsTrigger>
                </TabsList>

                {/* 常规任务 */}
                <TabsContent value="regular" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            每天凌晨4:00更新 • 未执行任务将作废
                        </div>
                        <Button variant="outline" size="sm">
                            <span className="mr-1">💎</span>
                            钻石刷新任务
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {regularQuests.map((quest) => (
                            <Card key={quest.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="h-6 w-6 text-primary" />
                                            <div>
                                                <CardTitle className="text-lg">{quest.name}</CardTitle>
                                                <CardDescription>
                                                    持续时间: {quest.duration}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge className={getRarityColor(quest.rarity)}>
                                            {quest.rarity}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* 进度 */}
                                    {quest.status === 'ongoing' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">进度</span>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-semibold">{quest.remainingTime} 剩余</span>
                                                </div>
                                            </div>
                                            <Progress value={quest.progress} className="h-2" />
                                            <div className="text-xs text-muted-foreground">
                                                执行者: {quest.assignedCharacter}
                                            </div>
                                        </div>
                                    )}

                                    {/* 要求 */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">执行条件</div>
                                        <div className="flex flex-wrap gap-2">
                                            {quest.requirements.map((req, index) => (
                                                <Badge key={index} variant="outline">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 奖励 */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">任务奖励</div>
                                        <div className="flex flex-wrap gap-2">
                                            {quest.rewards.map((reward, index) => (
                                                <Badge key={index} variant="secondary">
                                                    <Trophy className="h-3 w-3 mr-1" />
                                                    {reward}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex gap-2 pt-2">
                                        {quest.status === 'ongoing' ? (
                                            <>
                                                <Button variant="outline" className="flex-1">
                                                    <span className="mr-1">💎</span>
                                                    高速完成
                                                </Button>
                                                <Button className="flex-1">
                                                    <Trophy className="mr-2 h-4 w-4" />
                                                    领取奖励
                                                </Button>
                                            </>
                                        ) : (
                                            <Button className="w-full">
                                                <Send className="mr-2 h-4 w-4" />
                                                派遣角色
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 联合任务 */}
                <TabsContent value="joint" className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                        每天凌晨4:00追加新任务 • 未执行任务会保留
                    </div>

                    <div className="grid gap-4">
                        {jointQuests.map((quest) => (
                            <Card key={quest.id} className="hover:shadow-lg transition-shadow border-2 border-primary/20">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="h-6 w-6 text-primary" />
                                            <div>
                                                <CardTitle className="text-lg">{quest.name}</CardTitle>
                                                <CardDescription>
                                                    持续时间: {quest.duration} • 需要支援角色
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge className={getRarityColor(quest.rarity)}>
                                            {quest.rarity}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* 进度 */}
                                    {quest.status === 'ongoing' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">进度</span>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-semibold">{quest.remainingTime} 剩余</span>
                                                </div>
                                            </div>
                                            <Progress value={quest.progress} className="h-2" />
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>执行者: {quest.assignedCharacter}</span>
                                                <span>•</span>
                                                <span>支援: {quest.supportCharacter}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 要求 */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">执行条件</div>
                                        <div className="flex flex-wrap gap-2">
                                            {quest.requirements.map((req, index) => (
                                                <Badge key={index} variant="outline">
                                                    {index === 1 && <Users className="h-3 w-3 mr-1" />}
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 奖励 */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">任务奖励</div>
                                        <div className="flex flex-wrap gap-2">
                                            {quest.rewards.map((reward, index) => (
                                                <Badge key={index} variant="secondary">
                                                    <Trophy className="h-3 w-3 mr-1" />
                                                    {reward}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 操作按钮 */}
                                    <div className="flex gap-2 pt-2">
                                        {quest.status === 'ongoing' ? (
                                            <>
                                                <Button variant="outline" className="flex-1">
                                                    <span className="mr-1">💎</span>
                                                    高速完成
                                                </Button>
                                                <Button className="flex-1">
                                                    <Trophy className="mr-2 h-4 w-4" />
                                                    领取奖励
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="outline" className="flex-1">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    选择支援
                                                </Button>
                                                <Button className="flex-1">
                                                    <Send className="mr-2 h-4 w-4" />
                                                    派遣角色
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 游击任务 */}
                <TabsContent value="guerrilla" className="space-y-4">
                    {guerrillaQuest.appeared ? (
                        <Card className="border-2 border-green-500 shadow-lg">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="h-5 w-5 text-green-500" />
                                    <Badge className="bg-green-500">今日已出现</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Sparkles className="h-8 w-8 text-green-500 animate-pulse" />
                                            <div className="absolute -top-1 -right-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{guerrillaQuest.name}</CardTitle>
                                            <CardDescription className="text-base">
                                                限时出现 • 持续时间: {guerrillaQuest.duration}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className={getRarityColor(guerrillaQuest.rarity)}>
                                        随机任务
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                    <Zap className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800 dark:text-green-200">
                                        <strong>特殊规则：</strong>
                                        游击任务无执行条件限制，任务奖励根据派遣角色的稀有度和属性一致性决定！
                                        稀有度越高、属性匹配度越高，奖励越丰厚。
                                    </AlertDescription>
                                </Alert>

                                {/* 要求 */}
                                <div>
                                    <div className="text-sm font-medium mb-2">执行条件</div>
                                    <Badge variant="outline" className="text-base py-2">
                                        {guerrillaQuest.requirements[0]}
                                    </Badge>
                                </div>

                                {/* 奖励 */}
                                <div>
                                    <div className="text-sm font-medium mb-2">任务奖励</div>
                                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                                            <Trophy className="h-5 w-5" />
                                            <span className="font-semibold">{guerrillaQuest.rewards[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 操作按钮 */}
                                <Button className="w-full" size="lg">
                                    <Send className="mr-2 h-5 w-5" />
                                    派遣角色执行
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="text-6xl mb-4 opacity-20">
                                    <Timer className="h-24 w-24 mx-auto" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">游击任务尚未出现</h3>
                                <p className="text-muted-foreground mb-4">
                                    游击任务每天随机出现1次，请稍后再来查看
                                </p>
                                <Badge variant="secondary">
                                    每日最多出现 1 次
                                </Badge>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
