import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Zap, Trophy, Users, Swords, MapPin, Gift, Diamond, Coins, Heart, FlaskConical, Package, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ortegaApi } from '@/api/ortega-client';
import { UserSyncData } from '@/api/generated/userSyncData';
import { UserGetUserDataResponse } from '@/api/generated/UsergetUserDataResponse';
import { useLocalizationStore } from '@/store/localization-store';
import { MissionGroupType } from '@/api/generated/missionGroupType';
import { ItemType } from '@/api/generated/itemType';
import { TowerType } from '@/api/generated/towerType';
import { getUserItemCount } from '@/lib/itemUtils';

export function DashboardPage() {
    const navigate = useNavigate();
    const { t } = useLocalizationStore();
    const [userData, setUserData] = useState<UserSyncData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const response = await ortegaApi.user.getUserData({}) as UserGetUserDataResponse;
                if (response && response.userSyncData) {
                    setUserData(response.userSyncData);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    // 从 UserSyncData 派生实时数据
    const bossInfo = userData?.userBattleBossDtoInfo;
    const pvpInfo = userData?.userBattlePvpDtoInfo;
    const towerInfos = userData?.userTowerBattleDtoInfos || [];
    const statusInfo = userData?.userStatusDtoInfo;

    const dailyChecklist = [
        {
            id: 'auto-battle',
            category: '自动战斗',
            icon: Zap,
            items: [
                { name: '高速战斗', current: userData?.shopCurrencyMissionProgressMap?.['HighSpeedBattle'] || 0, max: statusInfo?.vip ? (statusInfo.vip >= 1 ? 5 : 3) : 3, completed: false, link: '/missions' },
                { name: '挑战首领', current: bossInfo?.bossTodayWinCount || 0, max: 3, completed: (bossInfo?.bossTodayWinCount || 0) >= 3, link: '/missions' },
            ]
        },
        {
            id: 'arena',
            category: '竞技场',
            icon: Swords,
            items: [
                { name: '古竞技场', current: pvpInfo?.pvpTodayCount || 0, max: 5, completed: (pvpInfo?.pvpTodayCount || 0) >= 5, link: '/pvp' },
                { name: '巅峰竞技', current: 0, max: 10, completed: false, link: '/pvp' },
            ]
        },
        {
            id: 'tower',
            category: '爬塔',
            icon: MapPin,
            items: [
                { name: '无穷之塔', current: towerInfos.find(t => t.towerType === TowerType.Infinite)?.todayBattleCount || 0, max: 3, completed: (towerInfos.find(t => t.towerType === TowerType.Infinite)?.todayBattleCount || 0) >= 3, link: '/dungeon' },
                { name: '属性塔', current: towerInfos.filter(t => t.towerType !== TowerType.Infinite).reduce((acc, curr) => acc + curr.todayBattleCount, 0), max: 3, completed: (towerInfos.filter(t => t.towerType !== TowerType.Infinite).reduce((acc, curr) => acc + curr.todayBattleCount, 0)) >= 3, link: '/dungeon' },
            ]
        },
        {
            id: 'guild',
            category: '公会',
            icon: Users,
            items: [
                { name: '公会签到', current: statusInfo?.isFirstVisitGuildAtDay ? 0 : 1, max: 1, completed: !statusInfo?.isFirstVisitGuildAtDay, link: '/guild' },
                { name: '公会讨伐战', current: 0, max: 2, completed: false, link: '/guild' },
                { name: '公会树', current: 0, max: 3, completed: false, link: '/guild' },
            ]
        },
        {
            id: 'daily-tasks',
            category: '任务',
            icon: Trophy,
            items: [
                { name: '每日任务', current: userData?.userMissionActivityDtoInfos?.find(m => m.missionGroupType === MissionGroupType.Daily)?.progressCount || 0, max: 500, completed: false, link: '/missions' },
                { name: '每周任务', current: userData?.userMissionActivityDtoInfos?.find(m => m.missionGroupType === MissionGroupType.Weekly)?.progressCount || 0, max: 2000, completed: false, link: '/missions' },
            ]
        },
        {
            id: 'other',
            category: '其他',
            icon: Gift,
            items: [
                { name: '补签次数', current: 0, max: statusInfo?.vip || 0, completed: false, link: '/missions' },
                { name: '祈愿之泉', current: 0, max: 5, completed: false, link: '/missions' },
                { name: '好友对战', current: userData?.todayChallengeFriendBattleCount || 0, max: statusInfo?.vip ? (statusInfo.vip >= 12 ? 500 : statusInfo.vip >= 10 ? 200 : statusInfo.vip >= 8 ? 100 : 50) : 50, completed: (userData?.todayChallengeFriendBattleCount || 0) >= (statusInfo?.vip ? (statusInfo.vip >= 12 ? 500 : statusInfo.vip >= 10 ? 200 : statusInfo.vip >= 8 ? 100 : 50) : 50), link: '/missions' },
            ]
        }
    ];

    // 重要提醒逻辑
    const alerts = [];
    if (userData?.existVipDailyGift) {
        alerts.push({ type: 'success', message: '有可领取的 VIP 每日福利' });
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    // 幻影神殿活跃时段: 12:30-13:30, 19:30-20:30
    const isInPhantomTime = (currentTimeMinutes >= 12 * 60 + 30 && currentTimeMinutes <= 13 * 60 + 30) ||
                             (currentTimeMinutes >= 19 * 60 + 30 && currentTimeMinutes <= 20 * 60 + 30);
    
    if (isInPhantomTime) {
        alerts.push({ type: 'info', message: '幻影神殿当前正处于活跃时段 (报酬增加)' });
    } else {
        alerts.push({ type: 'info', message: '幻影神殿活跃时段: 12:30-13:30, 19:30-20:30' });
    }

    // 公会战备战期间提醒: 7:45～20:30
    const isInGvgPrepareTime = currentTimeMinutes >= 7 * 60 + 45 && currentTimeMinutes <= 20 * 60 + 30;
    if (isInGvgPrepareTime) {
        alerts.push({ type: 'warning', message: '公会战备战期间，记得部署防守部队 (7:45-20:30)' });
    }


    const getProgressColor = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">加载玩家数据中...</span>
            </div>
        );
    }

    const items = userData?.userItemDtoInfo;

    const resourcesReal = [
        {
            name: t('[ItemName4]'), // 钻石
            current: getUserItemCount(items, ItemType.CurrencyFree, 1, true),
            free: getUserItemCount(items, ItemType.CurrencyFree, 1),
            paid: getUserItemCount(items, ItemType.CurrencyPaid, 0),
            icon: <Diamond className="h-5 w-5 text-blue-500" />,
            color: 'text-blue-500'
        },
        {
            name: t('[ItemName5]'), // 金币
            current: getUserItemCount(items, ItemType.Gold, 1),
            icon: <Coins className="h-5 w-5 text-yellow-500" />,
            color: 'text-yellow-500'
        },
        {
            name: t('[ItemName9]'), // 友谊点
            current: getUserItemCount(items, ItemType.FriendPoint, 1),
            icon: <Heart className="h-5 w-5 text-pink-500" />,
            color: 'text-pink-500'
        },
        {
            name: t('[ItemName11]'), // 经验珠
            current: getUserItemCount(items, ItemType.CharacterTrainingMaterial, 2),
            icon: <FlaskConical className="h-5 w-5 text-purple-500" />,
            color: 'text-purple-500'
        },
        {
            name: t('[ItemName10]'), // 潜能果
            current: getUserItemCount(items, ItemType.CharacterTrainingMaterial, 1),
            icon: <Package className="h-5 w-5 text-orange-500" />,
            color: 'text-orange-500'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Resources Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {resourcesReal.map((resource) => (
                    <Card key={resource.name}>
                        <CardContent className="p-4 flex flex-col justify-center h-full">
                            <div className="flex items-center gap-2 mb-1">
                                {resource.icon}
                                <span className="text-xs text-muted-foreground font-medium">{resource.name}</span>
                            </div>
                            <div className={`text-xl font-bold truncate ${resource.color}`}>
                                {resource.current.toLocaleString()}
                            </div>
                            {resource.name === '钻石' && (
                                <div className="mt-1 text-[10px] text-muted-foreground flex gap-2">
                                    <span>免费: {resource.free?.toLocaleString()}</span>
                                    <span>付费: {resource.paid?.toLocaleString()}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">每日清单</h1>
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
