import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockShopItems } from '@/mocks/data';
import { ShoppingCart, Diamond, Coins } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ShopPage() {
    const [selectedItem, setSelectedItem] = useState<typeof mockShopItems[0] | null>(null);
    const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

    const handlePurchase = (item: typeof mockShopItems[0]) => {
        setSelectedItem(item);
        setPurchaseDialogOpen(true);
    };

    const confirmPurchase = () => {
        console.log('Purchasing:', selectedItem);
        setPurchaseDialogOpen(false);
        setSelectedItem(null);
    };

    const categories = {
        general: mockShopItems.filter(item => item.category === 'general'),
        special: mockShopItems.filter(item => item.category === 'special'),
        premium: mockShopItems.filter(item => item.category === 'premium'),
        limited: mockShopItems.filter(item => item.category === 'limited')
    };

    const renderShopItem = (item: typeof mockShopItems[0]) => {
        const canPurchase = item.purchaseLimit.current < item.purchaseLimit.max;
        const remaining = item.purchaseLimit.max - item.purchaseLimit.current;

        return (
            <Card key={item.id}>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                        {item.category === 'limited' && (
                            <Badge variant="destructive">限时</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="rounded-lg border p-3">
                        <div className="text-sm text-muted-foreground mb-2">包含物品</div>
                        <div className="flex flex-wrap gap-2">
                            {item.items.map((reward, idx) => (
                                <Badge key={idx} variant="secondary">
                                    {reward.type === 'diamond' && '💎'}
                                    {reward.type === 'gold' && '🪙'}
                                    {reward.type === 'exp' && '⭐'}
                                    {' '}
                                    {reward.amount.toLocaleString()}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Price & Purchase */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {item.price.type === 'diamond' && <Diamond className="h-5 w-5 text-blue-500" />}
                            {item.price.type === 'gold' && <Coins className="h-5 w-5 text-yellow-500" />}
                            <span className="text-2xl font-bold">{item.price.amount.toLocaleString()}</span>
                        </div>
                        <Button
                            onClick={() => handlePurchase(item)}
                            disabled={!canPurchase}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {canPurchase ? '购买' : '已售罄'}
                        </Button>
                    </div>

                    {/* Purchase Limit */}
                    <div className="text-sm text-muted-foreground">
                        {canPurchase ? (
                            <>剩余: {remaining} / {item.purchaseLimit.max}</>
                        ) : (
                            <>已达购买上限</>
                        )}
                        {' '}
                        ({item.purchaseLimit.period === 'daily' && '每日'}
                        {item.purchaseLimit.period === 'weekly' && '每周'}
                        {item.purchaseLimit.period === 'total' && '总计'})
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">商店</h1>
                <p className="text-muted-foreground">购买道具和资源</p>
            </div>

            {/* Shop Tabs */}
            <Tabs defaultValue="general">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="general">
                        常规
                        {categories.general.length > 0 && (
                            <Badge variant="secondary" className="ml-2">{categories.general.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="special">
                        特殊
                        {categories.special.length > 0 && (
                            <Badge variant="secondary" className="ml-2">{categories.special.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="premium">
                        高级
                        {categories.premium.length > 0 && (
                            <Badge variant="secondary" className="ml-2">{categories.premium.length}</Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="limited">
                        限时
                        {categories.limited.length > 0 && (
                            <Badge variant="destructive" className="ml-2">{categories.limited.length}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.general.length > 0 ? (
                            categories.general.map(renderShopItem)
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                暂无常规商品
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="special" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.special.length > 0 ? (
                            categories.special.map(renderShopItem)
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                暂无特殊商品
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="premium" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.premium.length > 0 ? (
                            categories.premium.map(renderShopItem)
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                暂无高级商品
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="limited" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.limited.length > 0 ? (
                            categories.limited.map(renderShopItem)
                        ) : (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                暂无限时商品
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Purchase Confirmation Dialog */}
            <AlertDialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认购买</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedItem && (
                                <div className="space-y-3 mt-4">
                                    <div>确定要购买 <span className="font-semibold">{selectedItem.name}</span> 吗？</div>
                                    <div className="flex items-center gap-2 text-lg">
                                        消耗:
                                        {selectedItem.price.type === 'diamond' && <Diamond className="h-5 w-5 text-blue-500" />}
                                        {selectedItem.price.type === 'gold' && <Coins className="h-5 w-5 text-yellow-500" />}
                                        <span className="font-bold">{selectedItem.price.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPurchase}>确认购买</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
