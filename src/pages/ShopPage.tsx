import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    ShoppingCart,
    Gem,
    Coins,
    Heart,
    Trophy,
    Clock,
    Sparkles,
    BookOpen,
    Tag
} from 'lucide-react';

// Mock数据 - 钻石商城
const diamondPackages = [
    { id: 1, name: '初心礼包', diamonds: 120, bonus: 20, price: '￥6', hot: false, firstDouble: true },
    { id: 2, name: '每日特惠', diamonds: 680, bonus: 80, price: '￥30', hot: true, firstDouble: true },
    { id: 3, name: '豪华礼包', diamonds: 1980, bonus: 300, price: '￥98', hot: true, firstDouble: true },
    { id: 4, name: '至尊礼包', diamonds: 6480, bonus: 1200, price: '￥328', hot: false, firstDouble: true }
];

// Mock数据 - 金币商店
const goldShopItems = [
    { id: 1, name: '强化石箱', quantity: '×50', price: 50000, currency: 'gold', stock: '∞' },
    { id: 2, name: 'SSR装备碎片', quantity: '×5', price: 100000, currency: 'gold', stock: '5/5' },
    { id: 3, name: '经验药水', quantity: '×20', price: 30000, currency: 'gold', stock: '∞' },
    { id: 4, name: '角色碎片', quantity: '×10', price: 150000, currency: 'gold', stock: '3/3' }
];

// Mock数据 - 友情点商店
const friendshipShopItems = [
    { id: 1, name: '友情召唤券', quantity: '×1', price: 100, currency: 'friendship', stock: '∞' },
    { id: 2, name: '强化石', quantity: '×10', price: 50, currency: 'friendship', stock: '∞' },
    { id: 3, name: 'SR装备箱', quantity: '×1', price: 200, currency: 'friendship', stock: '10/10' },
    { id: 4, name: '金币', quantity: '×10000', price: 80, currency: 'friendship', stock: '∞' }
];

// Mock数据 - 竞技场商店
const arenaShopItems = [
    { id: 1, name: 'UR装备碎片', quantity: '×3', price: 500, currency: 'arena', stock: '5/5' },
    { id: 2, name: 'SSR装备箱', quantity: '×1', price: 300, currency: 'arena', stock: '∞' },
    { id: 3, name: '专属角色碎片', quantity: '×5', price: 400, currency: 'arena', stock: '10/10' }
];

// Mock数据 - 特别兑换
const specialExchangeItems = [
    {
        id: 1,
        name: '限定时装-星河',
        description: '限时兑换',
        price: 2980,
        currency: 'diamond',
        timeLeft: '23:45:12',
        limited: true,
        rarity: 'legendary'
    },
    {
        id: 2,
        name: 'LR角色选择箱',
        description: '每月限购1次',
        price: 4980,
        currency: 'diamond',
        stock: '0/1',
        rarity: 'legendary'
    }
];

// Mock用户货币
const userCurrency = {
    diamond: 8520,
    gold: 1250000,
    friendship: 3200,
    arenaPoints: 1850
};

export function ShopPage() {
    const getCurrencyIcon = (currency: string) => {
        const icons: Record<string, JSX.Element> = {
            'gold': <Coins className="h-4 w-4 text-yellow-600" />,
            'friendship': <Heart className="h-4 w-4 text-pink-500" />,
            'arena': <Trophy className="h-4 w-4 text-purple-500" />,
            'diamond': <Gem className="h-4 w-4 text-cyan-500" />
        };
        return icons[currency] || <Coins className="h-4 w-4" />;
    };

    const getCurrencyName = (currency: string) => {
        const names: Record<string, string> = {
            'gold': '金币',
            'friendship': '友情点',
            'arena': '竞技点',
            'diamond': '钻石'
        };
        return names[currency] || currency;
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000) {
            return `${(amount / 10000).toFixed(1)}万`;
        }
        return amount.toLocaleString();
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">商城</h1>
                <p className="text-muted-foreground mt-1">
                    购买资源，提升实力
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>商城说明：</strong>
                    使用不同货币购买各类资源和道具。部分商品有库存限制，每日或每周刷新。
                </AlertDescription>
            </Alert>

            {/* 货币显示 */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Gem className="h-5 w-5 text-cyan-500" />
                                <span className="text-sm text-muted-foreground">钻石</span>
                            </div>
                            <span className="font-bold text-cyan-600">
                                {userCurrency.diamond.toLocaleString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-yellow-600" />
                                <span className="text-sm text-muted-foreground">金币</span>
                            </div>
                            <span className="font-bold text-yellow-700">
                                {formatCurrency(userCurrency.gold)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-pink-500" />
                                <span className="text-sm text-muted-foreground">友情点</span>
                            </div>
                            <span className="font-bold text-pink-600">
                                {userCurrency.friendship.toLocaleString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-purple-500" />
                                <span className="text-sm text-muted-foreground">竞技点</span>
                            </div>
                            <span className="font-bold text-purple-600">
                                {userCurrency.arenaPoints.toLocaleString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="diamond" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="diamond">钻石商城</TabsTrigger>
                    <TabsTrigger value="gold">金币商店</TabsTrigger>
                    <TabsTrigger value="friendship">友情商店</TabsTrigger>
                    <TabsTrigger value="arena">竞技商店</TabsTrigger>
                    <TabsTrigger value="special">特别兑换</TabsTrigger>
                </TabsList>

                {/* 钻石商城 */}
                <TabsContent value="diamond" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {diamondPackages.map((pkg) => (
                            <Card
                                key={pkg.id}
                                className={`relative overflow-hidden ${pkg.hot ? 'border-2 border-orange-500' : ''
                                    }`}
                            >
                                {pkg.hot && (
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            热卖
                                        </Badge>
                                    </div>
                                )}
                                {pkg.firstDouble && (
                                    <div className="absolute top-2 left-2">
                                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                                            首充双倍
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="text-center pt-8">
                                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <Gem className="h-8 w-8 text-cyan-500" />
                                        <span className="text-4xl font-bold text-cyan-600">
                                            {pkg.diamonds}
                                        </span>
                                    </div>
                                    {pkg.bonus > 0 && (
                                        <div className="text-sm text-orange-600">
                                            +{pkg.bonus} 额外赠送
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            {pkg.price}
                                        </div>
                                    </div>
                                    <Button className="w-full" size="lg">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        购买
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 金币商店 */}
                <TabsContent value="gold" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>金币商店</CardTitle>
                                    <CardDescription>使用金币购买资源</CardDescription>
                                </div>
                                <Badge variant="outline">
                                    每日刷新
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {goldShopItems.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{item.stock}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getCurrencyIcon(item.currency)}
                                                    <span className="font-bold text-yellow-700">
                                                        {item.price.toLocaleString()}
                                                    </span>
                                                </div>
                                                <Button size="sm">
                                                    购买
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 友情商店 */}
                <TabsContent value="friendship" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-6 w-6 text-pink-500" />
                                友情商店
                            </CardTitle>
                            <CardDescription>使用友情点兑换道具</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {friendshipShopItems.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{item.stock}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getCurrencyIcon(item.currency)}
                                                    <span className="font-bold text-pink-600">
                                                        {item.price.toLocaleString()}
                                                    </span>
                                                </div>
                                                <Button size="sm">
                                                    兑换
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 竞技商店 */}
                <TabsContent value="arena" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-6 w-6 text-purple-500" />
                                竞技商店
                            </CardTitle>
                            <CardDescription>使用竞技点兑换稀有道具</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {arenaShopItems.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{item.stock}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {getCurrencyIcon(item.currency)}
                                                    <span className="font-bold text-purple-600">
                                                        {item.price.toLocaleString()}
                                                    </span>
                                                </div>
                                                <Button size="sm">
                                                    兑换
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 特别兑换 */}
                <TabsContent value="special" className="space-y-4">
                    {specialExchangeItems.map((item) => (
                        <Card
                            key={item.id}
                            className="border-2 border-gradient-to-r from-purple-500 to-pink-500"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">{item.name}</h3>
                                            <Badge className="bg-gradient-to-r from-orange-500 to-red-600">
                                                {item.rarity === 'legendary' ? '传说' : '稀有'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {item.description}
                                        </p>
                                        {item.timeLeft && (
                                            <div className="flex items-center gap-2 text-sm text-orange-600">
                                                <Clock className="h-4 w-4" />
                                                剩余时间: {item.timeLeft}
                                            </div>
                                        )}
                                        {item.stock && (
                                            <div className="text-sm text-muted-foreground mt-2">
                                                本月已购买: {item.stock}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right space-y-3">
                                        <div className="flex items-center justify-end gap-2">
                                            {getCurrencyIcon(item.currency)}
                                            <span className="text-2xl font-bold text-cyan-600">
                                                {item.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                            <Tag className="mr-2 h-4 w-4" />
                                            立即兑换
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
