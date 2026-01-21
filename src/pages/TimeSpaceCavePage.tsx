import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    MapPin,
    Sparkles,
    Shield,
    Heart,
    Clock,
    Trophy,
    Users,
    Skull,
    BookOpen,
    ChevronRight,
    Star,
    Swords
} from 'lucide-react';

// Mock数据 - 当前进度
const caveProgress = {
    currentLayer: 2,
    currentPlatform: 5,
    totalLayers: 3,
    refreshIn: '26小时30分',
    hardModeUnlocked: true,
    hardModeSelected: false,
    recoveryFruitsUsed: 8,
    maxRecoveryFruits: 20
};

// Mock数据 - 增援角色
const reinforcements = [
    { id: 1, name: '暗影刺客', rarity: 'SSR', selected: true },
    { id: 2, name: '光明牧师', rarity: 'UR', selected: true },
    { id: 3, name: '火焰法师', rarity: 'SR', selected: false }
];

// Mock数据 - 已获得加护
const blessings = [
    { id: 1, name: '战士之力', effect: '攻击力 +15%', tier: 'common', count: 2 },
    { id: 2, name: '生命祝福', effect: '最大生命值 +20%', tier: 'rare', count: 1 },
    { id: 3, name: '暴击强化', effect: '暴击伤害 +30%', tier: 'epic', count: 1 },
    { id: 4, name: '护盾守护', effect: '战斗开始时获得护盾', tier: 'legendary', count: 1 }
];

// Mock数据 - 当前层的石台选择
const platformChoices = [
    { id: 1, type: 'battle', difficulty: 'normal', enemy: '暗影守卫', power: 135000, rewards: ['金币x5000', '加护选择'] },
    { id: 2, type: 'battle', difficulty: 'hard', enemy: '精英战士', power: 148000, rewards: ['金币x8000', '稀有加护选择'] },
    { id: 3, type: 'treasure', difficulty: 'unknown', content: '神秘宝箱', rewards: ['随机奖励'] }
];

// Mock数据 - 未探索补偿
const compensationBonus = {
    active: true,
    missedTimes: 2,
    bonusPercentage: 160,  // 80% x 2
    hasCovenantPrivilege: false
};

export function TimeSpaceCavePage() {
    const getBlessingTierColor = (tier: string) => {
        const colors: Record<string, string> = {
            'common': 'bg-gray-500',
            'rare': 'bg-blue-500',
            'epic': 'bg-purple-500',
            'legendary': 'bg-orange-500'
        };
        return colors[tier] || 'bg-gray-500';
    };

    const getDifficultyColor = (difficulty: string) => {
        const colors: Record<string, string> = {
            'normal': 'text-green-500',
            'hard': 'text-red-500',
            'unknown': 'text-purple-500'
        };
        return colors[difficulty] || 'text-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">时空洞窟</h1>
                <p className="text-muted-foreground mt-1">
                    探索3层洞窟，选择路线获取加护和奖励
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>时空洞窟说明：</strong>
                    共有3层，每48小时刷新。移动到新石台后，同列其他石台会崩塌。
                    战斗后可选择加护提升能力，最多使用20颗回复果实。
                </AlertDescription>
            </Alert>

            {/* 刷新倒计时和进度 */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-6 w-6 text-primary" />
                            刷新倒计时
                        </CardTitle>
                        <CardDescription>每48小时刷新一次</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-4">
                            <div className="text-4xl font-bold text-primary mb-2">
                                {caveProgress.refreshIn}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                刷新后进度、加护、增援全部重置
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-6 w-6" />
                            当前进度
                        </CardTitle>
                        <CardDescription>探索进度</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">当前层数</span>
                                <Badge variant="secondary" className="text-base">
                                    第 {caveProgress.currentLayer} / {caveProgress.totalLayers} 层
                                </Badge>
                            </div>
                            <Progress
                                value={(caveProgress.currentLayer / caveProgress.totalLayers) * 100}
                                className="h-2"
                            />
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">当前石台</div>
                            <div className="font-semibold">第 {caveProgress.currentPlatform} 号石台</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 未探索补偿 */}
            {compensationBonus.active && (
                <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        <strong>未探索补偿激活！</strong>
                        错过 {compensationBonus.missedTimes} 次探索，本轮奖励增加 <strong>{compensationBonus.bonusPercentage}%</strong>
                        {!compensationBonus.hasCovenantPrivilege && ' (购买盟约特权可提升至200%)'}
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="explore" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="explore">探索</TabsTrigger>
                    <TabsTrigger value="blessings">加护</TabsTrigger>
                    <TabsTrigger value="reinforcements">增援</TabsTrigger>
                    <TabsTrigger value="items">道具</TabsTrigger>
                </TabsList>

                {/* 探索选项 */}
                <TabsContent value="explore" className="space-y-6">
                    {/* 困难模式选择 */}
                    {caveProgress.currentLayer === 2 && caveProgress.hardModeUnlocked && (
                        <Card className="border-2 border-orange-500">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Skull className="h-6 w-6 text-orange-500" />
                                    <CardTitle className="text-orange-600 dark:text-orange-400">
                                        困难模式
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    第3层可选择困难模式，敌人更强，奖励更多
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
                                    <div className="text-sm mb-2">
                                        • 敌人难度大幅提升<br />
                                        • 获得更多战斗奖励<br />
                                        • 主线冒险8-14通关后解锁
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={!caveProgress.hardModeSelected ? "default" : "outline"}
                                        className="w-full"
                                    >
                                        普通模式
                                    </Button>
                                    <Button
                                        variant={caveProgress.hardModeSelected ? "default" : "outline"}
                                        className="w-full bg-orange-600 hover:bg-orange-700"
                                    >
                                        <Skull className="mr-2 h-4 w-4" />
                                        困难模式
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* 石台选择 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>选择下一个石台</CardTitle>
                            <CardDescription>
                                移动到新石台后，同列其他石台将崩塌
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                {platformChoices.map((platform) => (
                                    <Card
                                        key={platform.id}
                                        className="hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant={platform.type === 'battle' ? 'destructive' : 'default'}>
                                                    {platform.type === 'battle' ? '战斗' : '宝箱'}
                                                </Badge>
                                                {platform.type === 'battle' && (
                                                    <span className={`text-sm font-semibold ${getDifficultyColor(platform.difficulty)}`}>
                                                        {platform.difficulty === 'normal' ? '普通' : '困难'}
                                                    </span>
                                                )}
                                            </div>
                                            <CardTitle className="text-lg">
                                                {platform.type === 'battle' ? platform.enemy : platform.content}
                                            </CardTitle>
                                            {platform.power && (
                                                <CardDescription>
                                                    推荐战力: {platform.power.toLocaleString()}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-2">奖励</div>
                                                <div className="space-y-1">
                                                    {platform.rewards.map((reward, index) => (
                                                        <div key={index} className="text-sm flex items-center gap-2">
                                                            <Star className="h-3 w-3 text-yellow-500" />
                                                            {reward}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <Button className="w-full" size="sm">
                                                <ChevronRight className="mr-1 h-4 w-4" />
                                                前往
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 加护列表 */}
                <TabsContent value="blessings" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {blessings.map((blessing) => (
                            <Card key={blessing.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getBlessingTierColor(blessing.tier)}`}>
                                                <Sparkles className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{blessing.name}</CardTitle>
                                                <CardDescription>{blessing.effect}</CardDescription>
                                            </div>
                                        </div>
                                        {blessing.count > 1 && (
                                            <Badge>x{blessing.count}</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertDescription>
                            加护仅在时空洞窟内有效，洞窟刷新后将全部重置
                        </AlertDescription>
                    </Alert>
                </TabsContent>

                {/* 增援角色 */}
                <TabsContent value="reinforcements" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        {reinforcements.map((char) => (
                            <Card
                                key={char.id}
                                className={char.selected ? 'border-2 border-primary' : ''}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge className={
                                            char.rarity === 'UR' ? 'bg-yellow-500' :
                                                char.rarity === 'SSR' ? 'bg-purple-500' :
                                                    'bg-blue-500'
                                        }>
                                            {char.rarity}
                                        </Badge>
                                        {char.selected && (
                                            <Badge variant="outline" className="border-primary">
                                                已选择
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg">{char.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className="w-full"
                                        variant={char.selected ? "outline" : "default"}
                                        size="sm"
                                    >
                                        {char.selected ? '取消选择' : '选择增援'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Alert>
                        <Users className="h-4 w-4" />
                        <AlertDescription>
                            增援角色仅在时空洞窟内可用，洞窟刷新后消失
                        </AlertDescription>
                    </Alert>
                </TabsContent>

                {/* 道具 */}
                <TabsContent value="items" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-6 w-6 text-red-500" />
                                回复的果实
                            </CardTitle>
                            <CardDescription>
                                使用后复活并治愈所有角色
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">使用次数</span>
                                    <Badge variant={caveProgress.recoveryFruitsUsed >= 15 ? "destructive" : "secondary"} className="text-base">
                                        {caveProgress.recoveryFruitsUsed} / {caveProgress.maxRecoveryFruits}
                                    </Badge>
                                </div>
                                <Progress
                                    value={(caveProgress.recoveryFruitsUsed / caveProgress.maxRecoveryFruits) * 100}
                                    className="h-3"
                                />
                                <div className="text-xs text-muted-foreground">
                                    剩余 {caveProgress.maxRecoveryFruits - caveProgress.recoveryFruitsUsed} 颗 • 洞窟刷新后重置
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 rounded-lg border">
                                <div className="flex items-center gap-3 mb-3">
                                    <Heart className="h-8 w-8 text-red-500" />
                                    <div>
                                        <div className="font-semibold">回复效果</div>
                                        <div className="text-sm text-muted-foreground">
                                            复活所有倒下的角色并恢复全部生命值
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full" variant="destructive">
                                    <Heart className="mr-2 h-4 w-4" />
                                    使用回复果实
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
