import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sword,
    Zap,
    Trophy,
    Users,
    Star,
    Clock,
    Target,
    TrendingUp,
    Shield,
    Coins,
    BookOpen
} from 'lucide-react';

// Mock数据
const mockStages = [
    { id: 1, name: '1-1 序章', cleared: true, stars: 3, power: 5000 },
    { id: 2, name: '1-2 初遇', cleared: true, stars: 3, power: 5500 },
    { id: 3, name: '1-3 试炼', cleared: true, stars: 2, power: 6000 },
    { id: 4, name: '1-4 挑战', cleared: true, stars: 1, power: 6500 },
    { id: 5, name: '1-5 突破', cleared: false, stars: 0, power: 7000 },
];

const mockBattleStats = {
    gold: 125830,
    exp: 15600,
    items: 45,
    time: '2小时15分'
};

const mockRescuedCitizens = {
    total: 1250,
    byRegion: [
        { name: '忧蓝之国', count: 280, bonus: '+15% 金币' },
        { name: '业红之国', count: 195, bonus: '+12% 经验' },
        { name: '苍翠之国', count: 340, bonus: '+18% 掉落' },
        { name: '流金之国', count: 220, bonus: '+14% 金币' },
        { name: '天光之国', count: 125, bonus: '+10% 经验' },
        { name: '幽冥之国', count: 90, bonus: '+8% 掉落' }
    ]
};

export function BattlePage() {
    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">主线冒险</h1>
                <p className="text-muted-foreground mt-1">
                    挑战关卡、挑战首领、进行自动战斗获取资源
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>主线冒险系统：</strong>
                    通关关卡解锁新内容，已通关的关卡可进行自动战斗获取资源。
                    使用高速战斗可立即获得2小时的自动战斗收益。每次挑战首领可获得战利品。
                </AlertDescription>
            </Alert>

            {/* 主要功能区 */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* 自动战斗 */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>自动战斗</CardTitle>
                                <CardDescription>持续获取资源</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">已进行</span>
                                <span className="font-semibold">{mockBattleStats.time}</span>
                            </div>
                            <Progress value={75} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                <Coins className="h-4 w-4 text-yellow-600" />
                                <div>
                                    <div className="text-xs text-muted-foreground">金币</div>
                                    <div className="font-semibold">{mockBattleStats.gold.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                <Star className="h-4 w-4 text-purple-600" />
                                <div>
                                    <div className="text-xs text-muted-foreground">经验</div>
                                    <div className="font-semibold">{mockBattleStats.exp.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full">
                            <Target className="mr-2 h-4 w-4" />
                            领取收益
                        </Button>
                    </CardContent>
                </Card>

                {/* 高速战斗 */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>高速战斗</CardTitle>
                                <CardDescription>立即获得2小时收益</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="text-sm text-muted-foreground mb-1">预计获得</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-orange-600">~83K</span>
                                <span className="text-sm text-muted-foreground">金币</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                +其他战利品
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">今日次数</span>
                                <Badge variant="secondary">2 / 5</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">消耗</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold">50</span>
                                    <span className="text-muted-foreground">钻石</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" variant="default">
                            <Zap className="mr-2 h-4 w-4" />
                            开始高速战斗
                        </Button>
                    </CardContent>
                </Card>

                {/* 挑战首领 */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                <Trophy className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <CardTitle>挑战首领</CardTitle>
                                <CardDescription>击败首领获取奖励</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">当前首领</span>
                                <Badge className="bg-red-500">Boss 5</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-red-600" />
                                <div className="flex-1">
                                    <div className="text-sm font-semibold">暗影领主</div>
                                    <div className="text-xs text-muted-foreground">推荐战力: 7000</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">免费挑战</span>
                                <Badge variant="secondary">3 / 3</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                每天凌晨4:00重置
                            </div>
                        </div>

                        <Button className="w-full" variant="destructive">
                            <Sword className="mr-2 h-4 w-4" />
                            挑战首领
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 关卡列表与领民数据 */}
            <Tabs defaultValue="stages" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="stages">关卡进度</TabsTrigger>
                    <TabsTrigger value="stats">战斗数据</TabsTrigger>
                    <TabsTrigger value="citizens">领民数据</TabsTrigger>
                </TabsList>

                {/* 关卡进度 */}
                <TabsContent value="stages" className="space-y-4">
                    <div className="grid gap-4">
                        {mockStages.map((stage) => (
                            <Card key={stage.id} className={stage.cleared ? 'border-green-200 dark:border-green-800' : ''}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stage.cleared
                                                        ? 'bg-green-100 dark:bg-green-900'
                                                        : 'bg-gray-100 dark:bg-gray-800'
                                                    }`}>
                                                    {stage.cleared ? (
                                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                                    ) : (
                                                        <Target className="h-6 w-6 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{stage.name}</h3>
                                                    {stage.cleared && (
                                                        <Badge variant="secondary">已通关</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm text-muted-foreground">
                                                        推荐战力: {stage.power.toLocaleString()}
                                                    </span>
                                                    {stage.cleared && (
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-4 w-4 ${star <= stage.stars
                                                                            ? 'text-yellow-500 fill-yellow-500'
                                                                            : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {stage.cleared && (
                                                <Button variant="outline" size="sm">
                                                    自动战斗
                                                </Button>
                                            )}
                                            <Button size="sm" variant={stage.cleared ? 'secondary' : 'default'}>
                                                {stage.cleared ? '重新挑战' : '开始挑战'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 战斗数据 */}
                <TabsContent value="stats" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>自动战斗统计</CardTitle>
                            <CardDescription>
                                离线期间的自动战斗收益、高速战斗收益将取决于这些数值
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Coins className="h-5 w-5 text-yellow-600" />
                                        <span className="text-sm font-medium text-muted-foreground">金币/小时</span>
                                    </div>
                                    <div className="text-2xl font-bold">62,915</div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-5 w-5 text-purple-600" />
                                        <span className="text-sm font-medium text-muted-foreground">经验/小时</span>
                                    </div>
                                    <div className="text-2xl font-bold">7,800</div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-medium text-muted-foreground">道具/小时</span>
                                    </div>
                                    <div className="text-2xl font-bold">22 件</div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium text-muted-foreground">效率</span>
                                    </div>
                                    <div className="text-2xl font-bold">98%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 领民数据 */}
                <TabsContent value="citizens" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>解救的领民</CardTitle>
                                    <CardDescription>
                                        通关主线冒险关卡可解救领民，增加自动战斗收益
                                    </CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary">
                                        {mockRescuedCitizens.total}
                                    </div>
                                    <div className="text-sm text-muted-foreground">总人数</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {mockRescuedCitizens.byRegion.map((region, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{region.name}</span>
                                            </div>
                                            <Badge variant="outline">{region.count}</Badge>
                                        </div>
                                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            {region.bonus}
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
