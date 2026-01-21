import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Zap, Trophy, Users, Swords, MapPin, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
    const navigate = useNavigate();

    // Mock数据 - 每日任务清单
    const dailyChecklist = [
        {
            id: 'auto-battle',
            category: '自动战斗',
            icon: Zap,
            items: [
                { name: '高速战斗', current: 2, max: 3, completed: false, link: '/missions' },
                { name: '挑战首领', current: 1, max: 3, completed: false, link: '/missions' },
            ]
        },
        {
            id: 'arena',
            category: '竞技场',
            icon: Swords,
            items: [
                { name: '古竞技场', current: 3, max: 5, completed: false, link: '/pvp' },
                { name: '巅峰竞技', current: 0, max: 10, completed: true, link: '/pvp' },
            ]
        },
        {
            id: 'tower',
            category: '爬塔',
            icon: MapPin,
            items: [
                { name: '无穷之塔', current: 2, max: 3, completed: false, link: '/dungeon' },
                { name: '属性塔(今日忧蓝)', current: 5, max: 10, completed: false, link: '/dungeon' },
            ]
        },
        {
            id: 'guild',
            category: '公会',
            icon: Users,
            items: [
                { name: '公会签到', current: 0, max: 1, completed: true, link: '/guild' },
                { name: '公会讨伐战', current: 1, max: 2, completed: false, link: '/guild' },
                { name: '公会树', current: 2, max: 3, completed: false, link: '/guild' },
            ]
        },
        {
            id: 'daily-tasks',
            category: '任务',
            icon: Trophy,
            items: [
                { name: '每日任务', current: 450, max: 500, completed: false, link: '/missions' },
                { name: '每周任务', current: 1200, max: 2000, completed: false, link: '/missions' },
            ]
        },
        {
            id: 'other',
            category: '其他',
            icon: Gift,
            items: [
                { name: '签到奖励', current: 0, max: 1, completed: true, link: '/missions' },
                { name: '祈愿之泉', current: 3, max: 5, completed: false, link: '/missions' },
                { name: '幻影神殿', current: 4, max: 6, completed: false, link: '/dungeon' },
                { name: '好友赠送', current: 15, max: 20, completed: false, link: '/missions' },
            ]
        }
    ];

    // 重要提醒
    const alerts = [
        { type: 'warning', message: '体力将在2小时后溢出' },
        { type: 'info', message: '幻影神殿活跃时段: 12:30-13:30, 19:30-20:30' },
        { type: 'success', message: '公会战备战期间，记得部署防守队伍' },
    ];

    // 资源状况
    const resources = [
        { name: '体力', current: 380, max: 400, icon: '⚡', color: 'text-green-500' },
        { name: '钻石', current: 15420, icon: '💎', color: 'text-blue-500' },
        { name: '金币', current: 2450000, icon: '🪙', color: 'text-yellow-500' },
    ];

    const getProgressColor = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">每日清单</h1>
                <p className="text-muted-foreground">今天的任务进度 • 重置时间: 凌晨 4:00</p>
            </div>

            {/* Alerts */}
            <div className="space-y-2">
                {alerts.map((alert, idx) => (
                    <div
                        key={idx}
                        className={`rounded-lg border-l-4 p-3 text-sm ${alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
                                alert.type === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' :
                                    'border-green-500 bg-green-50 dark:bg-green-950'
                            }`}
                    >
                        {alert.message}
                    </div>
                ))}
            </div>

            {/* Resources */}
            <div className="grid gap-4 md:grid-cols-3">
                {resources.map((resource) => (
                    <Card key={resource.name}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{resource.name}</p>
                                    <p className={`text-2xl font-bold ${resource.color}`}>
                                        {resource.current.toLocaleString()}
                                        {resource.max && <span className="text-sm text-muted-foreground">/{resource.max}</span>}
                                    </p>
                                </div>
                                <span className="text-4xl">{resource.icon}</span>
                            </div>
                            {resource.max && (
                                <Progress
                                    value={(resource.current / resource.max) * 100}
                                    className="mt-3"
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Daily Checklist */}
            <div className="grid gap-6 md:grid-cols-2">
                {dailyChecklist.map((category) => {
                    const Icon = category.icon;
                    const totalItems = category.items.length;
                    const completedItems = category.items.filter(item => item.completed).length;
                    const categoryProgress = (completedItems / totalItems) * 100;

                    return (
                        <Card key={category.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-primary/10 p-2">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{category.category}</CardTitle>
                                            <CardDescription>
                                                {completedItems}/{totalItems} 已完成
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={categoryProgress === 100 ? 'default' : 'secondary'}>
                                        {Math.round(categoryProgress)}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {category.items.map((item, idx) => {
                                    const progress = (item.current / item.max) * 100;
                                    const isCompleted = item.completed || progress >= 100;

                                    return (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <span className={`text-sm ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        {item.current}/{item.max}
                                                    </span>
                                                    {!isCompleted && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => navigate(item.link)}
                                                            className="h-6 px-2 text-xs"
                                                        >
                                                            前往
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <Progress
                                                value={progress}
                                                className={`h-1 ${getProgressColor(item.current, item.max)}`}
                                            />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>今日总结</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                {dailyChecklist.reduce((acc, cat) =>
                                    acc + cat.items.filter(i => i.completed).length, 0
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">已完成任务</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">
                                {dailyChecklist.reduce((acc, cat) =>
                                    acc + cat.items.filter(i => !i.completed).length, 0
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">待完成任务</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-500">95%</p>
                            <p className="text-sm text-muted-foreground">体力使用率</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-500">12.5M</p>
                            <p className="text-sm text-muted-foreground">今日金币收益</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
