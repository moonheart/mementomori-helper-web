import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Building2,
    Flame,
    Droplet,
    Wind,
    Mountain,
    ChevronUp,
    Star,
    Trophy,
    Lock,
    Unlock,
    BookOpen,
    Coins,
    Sparkles
} from 'lucide-react';

// Mock数据 - 无穷之塔
const mockInfiniteTower = {
    currentFloor: 45,
    maxFloor: 100,
    todayClears: 2,
    freeAttempts: 3,
    rewards: {
        gold: 45200,
        items: 12
    }
};

// Mock数据 - 属性塔
const elementalTowers = [
    {
        id: 'melancholy',
        name: '忧蓝之塔',
        element: '忧蓝',
        icon: Droplet,
        color: 'blue',
        available: true,
        currentFloor: 28,
        maxFloor: 50,
        todayClears: 7
    },
    {
        id: 'crimson',
        name: '业红之塔',
        element: '业红',
        icon: Flame,
        color: 'red',
        available: false,
        currentFloor: 25,
        maxFloor: 50,
        todayClears: 0
    },
    {
        id: 'verdant',
        name: '苍翠之塔',
        element: '苍翠',
        icon: Wind,
        color: 'green',
        available: false,
        currentFloor: 30,
        maxFloor: 50,
        todayClears: 0
    },
    {
        id: 'aureate',
        name: '流金之塔',
        element: '流金',
        icon: Mountain,
        color: 'yellow',
        available: false,
        currentFloor: 22,
        maxFloor: 50,
        todayClears: 0
    }
];

// Mock楼层数据
const mockFloors = [
    { floor: 45, cleared: false, stars: 0, power: 45000, rewards: ['金币x1000', '经验药水x2'] },
    { floor: 44, cleared: true, stars: 3, power: 44000, rewards: ['金币x980', '经验药水x2'] },
    { floor: 43, cleared: true, stars: 3, power: 43000, rewards: ['金币x960', '经验药水x2'] },
    { floor: 42, cleared: true, stars: 2, power: 42000, rewards: ['金币x940', '经验药水x1'] },
    { floor: 41, cleared: true, stars: 3, power: 41000, rewards: ['金币x920', '经验药水x2'] }
];

export function TowerPage() {
    const getElementColor = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'from-blue-500 to-cyan-500',
            red: 'from-red-500 to-orange-500',
            green: 'from-green-500 to-emerald-500',
            yellow: 'from-yellow-500 to-amber-500'
        };
        return colors[color] || 'from-gray-500 to-gray-600';
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">无穷之塔</h1>
                <p className="text-muted-foreground mt-1">
                    挑战塔层，获取丰厚奖励
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>塔系统说明：</strong>
                    无穷之塔每天3次免费挑战，通关新楼层不消耗次数。
                    属性塔每天开放不同属性，每天最多通关10层，仅可使用对应属性角色。
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="infinite" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="infinite">无穷之塔</TabsTrigger>
                    <TabsTrigger value="elemental">属性塔</TabsTrigger>
                </TabsList>

                {/* 无穷之塔 */}
                <TabsContent value="infinite" className="space-y-6">
                    {/* 进度概览 */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <Building2 className="h-48 w-48" />
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-6 w-6" />
                                    当前进度
                                </CardTitle>
                                <CardDescription>挑战更高的楼层</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">当前楼层</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-primary">
                                                {mockInfiniteTower.currentFloor}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                / {mockInfiniteTower.maxFloor}
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={(mockInfiniteTower.currentFloor / mockInfiniteTower.maxFloor) * 100}
                                        className="h-3"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg">
                                        <div className="text-xs text-muted-foreground mb-1">累计金币</div>
                                        <div className="text-lg font-bold">{mockInfiniteTower.rewards.gold.toLocaleString()}</div>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                                        <div className="text-xs text-muted-foreground mb-1">累计道具</div>
                                        <div className="text-lg font-bold">{mockInfiniteTower.rewards.items} 件</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-6 w-6" />
                                    今日挑战
                                </CardTitle>
                                <CardDescription>管理挑战次数</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">免费次数</span>
                                        <Badge variant="secondary" className="text-base">
                                            {mockInfiniteTower.todayClears} / {mockInfiniteTower.freeAttempts}
                                        </Badge>
                                    </div>
                                    <Progress
                                        value={(mockInfiniteTower.todayClears / mockInfiniteTower.freeAttempts) * 100}
                                        className="h-2"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        每天凌晨4:00重置 • 通关新楼层不消耗次数
                                    </p>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button className="w-full" size="lg">
                                        <ChevronUp className="mr-2 h-5 w-5" />
                                        继续挑战 (第{mockInfiniteTower.currentFloor}层)
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" size="sm">
                                            <Coins className="mr-1 h-4 w-4" />
                                            使用挑战券
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <span className="mr-1">💎</span>
                                            钻石购买
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 楼层列表 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>楼层进度</CardTitle>
                            <CardDescription>查看各楼层状态和奖励</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {mockFloors.map((floor) => (
                                    <div
                                        key={floor.floor}
                                        className={`p-4 rounded-lg border transition-all ${floor.cleared
                                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                                            : floor.floor === mockInfiniteTower.currentFloor
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 dark:border-gray-800'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center justify-center w-14 h-14 rounded-full ${floor.cleared
                                                    ? 'bg-green-500 text-white'
                                                    : floor.floor === mockInfiniteTower.currentFloor
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-gray-200 dark:bg-gray-800'
                                                    }`}>
                                                    <span className="text-lg font-bold">{floor.floor}</span>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">第 {floor.floor} 层</span>
                                                        {floor.cleared ? (
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        className={`h-4 w-4 ${star <= floor.stars
                                                                            ? 'text-yellow-500 fill-yellow-500'
                                                                            : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : floor.floor === mockInfiniteTower.currentFloor ? (
                                                            <Badge>进行中</Badge>
                                                        ) : (
                                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <span>推荐战力: {floor.power.toLocaleString()}</span>
                                                        <span>•</span>
                                                        <span>{floor.rewards.join(' • ')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {floor.cleared ? (
                                                <Button variant="outline" size="sm">
                                                    重新挑战
                                                </Button>
                                            ) : floor.floor === mockInfiniteTower.currentFloor ? (
                                                <Button size="sm">
                                                    <ChevronUp className="mr-1 h-4 w-4" />
                                                    挑战
                                                </Button>
                                            ) : (
                                                <Button size="sm" disabled>
                                                    <Lock className="mr-1 h-4 w-4" />
                                                    未解锁
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 属性塔 */}
                <TabsContent value="elemental" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {elementalTowers.map((tower) => {
                            const Icon = tower.icon;
                            return (
                                <Card
                                    key={tower.id}
                                    className={`relative overflow-hidden transition-all ${tower.available
                                        ? 'border-2 border-primary shadow-lg'
                                        : 'opacity-60'
                                        }`}
                                >
                                    <div className={`absolute top-0 right-0 w-full h-2 bg-gradient-to-r ${getElementColor(tower.color)}`} />

                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-lg bg-gradient-to-br ${getElementColor(tower.color)}`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle>{tower.name}</CardTitle>
                                                    <CardDescription>
                                                        {tower.available ? '今日开放' : '今日未开放'}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            {tower.available ? (
                                                <Badge className="bg-green-500">
                                                    <Unlock className="h-3 w-3 mr-1" />
                                                    开放中
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    未开放
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">当前进度</span>
                                                <span className="font-semibold">
                                                    {tower.currentFloor} / {tower.maxFloor} 层
                                                </span>
                                            </div>
                                            <Progress
                                                value={(tower.currentFloor / tower.maxFloor) * 100}
                                                className="h-2"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <span className="text-sm text-muted-foreground">今日通关</span>
                                            <Badge variant={tower.todayClears >= 10 ? "default" : "secondary"}>
                                                {tower.todayClears} / 10 层
                                            </Badge>
                                        </div>

                                        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
                                            <div className="text-xs text-muted-foreground mb-1">规则</div>
                                            <div className="text-sm">
                                                • 仅可使用<span className="font-semibold text-primary">{tower.element}</span>属性角色
                                            </div>
                                            <div className="text-sm">
                                                • 每天最多通关10层
                                            </div>
                                        </div>

                                        {tower.available ? (
                                            <Button className="w-full">
                                                <ChevronUp className="mr-2 h-4 w-4" />
                                                开始挑战
                                            </Button>
                                        ) : (
                                            <Button className="w-full" disabled>
                                                <Lock className="mr-2 h-4 w-4" />
                                                今日未开放
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* 属性塔说明 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                属性塔轮换安排
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-sm text-muted-foreground mb-2">周一/周五</div>
                                    <Droplet className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                                    <div className="font-semibold">忧蓝之塔</div>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-sm text-muted-foreground mb-2">周二/周六</div>
                                    <Flame className="h-8 w-8 mx-auto mb-2 text-red-500" />
                                    <div className="font-semibold">业红之塔</div>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-sm text-muted-foreground mb-2">周三/周日</div>
                                    <Wind className="h-8 w-8 mx-auto mb-2 text-green-500" />
                                    <div className="font-semibold">苍翠之塔</div>
                                </div>
                                <div className="p-4 border rounded-lg text-center">
                                    <div className="text-sm text-muted-foreground mb-2">周四</div>
                                    <Mountain className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                                    <div className="font-semibold">流金之塔</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
