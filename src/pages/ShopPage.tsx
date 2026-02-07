import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    Gem,
    Coins,
    Heart,
    Trophy,
    Clock,
    BookOpen,
    Tag,
    Loader2
} from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAccountStore } from '@/store/accountStore';
import { useMasterStore } from '@/store/masterStore';
import { TradeShopTabInfo } from '@/api/generated/tradeShopTabInfo';
import { ItemType } from '@/api/generated/itemType';
import { TradeShopItem } from '@/api/generated/tradeShopItem';
import { TradeShopTabMB } from '@/api/generated/tradeShopTabMB';
import { UserItemDtoInfo } from '@/api/generated/userItemDtoInfo';
import { useItemName } from '@/hooks/useItemName';
import { getUserItemCount } from '@/lib/itemUtils';

export function ShopPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const currentAccount = useAccountStore(state => state.accounts.find(a => a.userId === state.currentAccountId));
    const getTable = useMasterStore(state => state.getTable);
    const { getItemName } = useItemName();

    const [loading, setLoading] = useState(false);
    const [tradeShopTabMasterMap, setTradeShopTabMasterMap] = useState<Record<number, TradeShopTabMB>>({});
    const [weeklyShopTabs, setWeeklyShopTabs] = useState<TradeShopTabInfo[]>([]);
    const [tradeShopTabs, setTradeShopTabs] = useState<TradeShopTabInfo[]>([]);
    const [userItems, setUserItems] = useState<UserItemDtoInfo[]>([]);
    const [userBalance, setUserBalance] = useState({
        diamond: 0,
        gold: 0,
        friendship: 0,
        arenaPoints: 0,
        activityMedals: 0
    });

    // 获取 tab 中涉及的所有消耗道具类型
    const getTabConsumeItems = useCallback((tab: TradeShopTabInfo) => {
        const itemMap = new Map<string, { itemType: ItemType; itemId: number }>();
        tab.tradeShopItems?.forEach(item => {
            if (item.consumeItem1) {
                const key = `${item.consumeItem1.itemType}-${item.consumeItem1.itemId}`;
                if (!itemMap.has(key)) {
                    itemMap.set(key, { itemType: item.consumeItem1.itemType, itemId: item.consumeItem1.itemId });
                }
            }
            if (item.consumeItem2) {
                const key = `${item.consumeItem2.itemType}-${item.consumeItem2.itemId}`;
                if (!itemMap.has(key)) {
                    itemMap.set(key, { itemType: item.consumeItem2.itemType, itemId: item.consumeItem2.itemId });
                }
            }
        });
        return Array.from(itemMap.values());
    }, []);

    const loadData = useCallback(async () => {
        if (!currentAccount) return;
        setLoading(true);
        try {
            const [tradeShopRes, userRes, weeklyRes] = await Promise.all([
                ortegaApi.tradeShop.getList({}),
                ortegaApi.user.getUserData({}),
                ortegaApi.weeklyTopics.getWeeklyTopicsInfo({})
            ]);

            setTradeShopTabs(tradeShopRes.tradeShopTabInfoList || []);

            // 加载 Master 数据
            const tradeShopTabTable = await getTable<TradeShopTabMB>('TradeShopTabTable');

            const masterMap: Record<number, TradeShopTabMB> = {};
            tradeShopTabTable.forEach((m) => {
                masterMap[m.id] = m;
            });
            setTradeShopTabMasterMap(masterMap);

            // 处理 WeeklyTopics 中的商店数据
            if (weeklyRes.shopData?.tradeShopItemList) {
                const groups: Record<number, TradeShopItem[]> = {};
                weeklyRes.shopData.tradeShopItemList.forEach(item => {
                    const tabId = Math.floor(item.tradeShopItemId / 10000);
                    if (!groups[tabId]) groups[tabId] = [];
                    groups[tabId].push(item);
                });

                const weeklyTabs = Object.entries(groups).map(([tabId, items]) => ({
                    tradeShopTabId: parseInt(tabId),
                    tradeShopItems: items,
                    expirationTimeStamp: weeklyRes.shopData.expirationTimeStamp,
                    lastFreeManualUpdateTime: 0
                } as TradeShopTabInfo));
                setWeeklyShopTabs(weeklyTabs);
            }

            const syncData = userRes.userSyncData;
            if (syncData) {
                const items = syncData.userItemDtoInfo || [];
                setUserItems(items);

                setUserBalance({
                    diamond: items.find(i => i.itemType === ItemType.CurrencyFree)?.itemCount || 0,
                    gold: items.find(i => i.itemType === ItemType.Gold)?.itemCount || 0,
                    friendship: items.find(i => i.itemType === ItemType.FriendPoint)?.itemCount || 0,
                    arenaPoints: items.find(i => i.itemType === ItemType.ExchangePlaceItem && i.itemId === 1)?.itemCount || 0, // 竞技点通常是特定ID的ExchangePlaceItem
                    activityMedals: items.find(i => i.itemType === ItemType.ActivityMedal)?.itemCount || 0
                });
            }
        } catch (error) {
            console.error('Failed to load shop data:', error);
            toast({
                title: '加载失败',
                description: '无法获取商城数据，请稍后再试',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [currentAccount, toast]);

    useEffect(() => {
        if (currentAccount) {
            loadData();
        }
    }, [loadData, currentAccount]);

    const handleBuyTradeItem = async (tabId: number, item: TradeShopItem) => {
        try {
            await ortegaApi.tradeShop.buyItem({
                tradeShopTabId: tabId,
                tradeShopItemInfos: [{
                    tradeShopItemId: item.tradeShopItemId,
                    dedicatedItemId: item.dedicatedItemId,
                    tradeCount: 1
                }],
                tradeShopSphereId: 0,
                tradeSphereCount: 0
            });

            toast({
                title: '购买成功',
                description: `已获得 ${getItemName(item.giveItem.itemType, item.giveItem.itemId)}`,
            });

            // 重新加载数据以更新余额和库存
            loadData();
        } catch (error) {
            console.error('Buy item failed:', error);
            toast({
                title: '购买失败',
                description: '交易未能完成，请检查余额或库存',
                variant: 'destructive',
            });
        }
    };

    const getCurrencyIcon = (itemType: ItemType) => {
        switch (itemType) {
            case ItemType.Gold:
                return <Coins className="h-4 w-4 text-yellow-600" />;
            case ItemType.FriendPoint:
                return <Heart className="h-4 w-4 text-pink-500" />;
            case ItemType.CurrencyFree:
            case ItemType.CurrencyPaid:
                return <Gem className="h-4 w-4 text-cyan-500" />;
            case ItemType.ActivityMedal:
                return <Trophy className="h-4 w-4 text-orange-500" />;
            default:
                return <Tag className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        }
        return amount.toString();
    };

    if (loading && tradeShopTabs.length === 0 && weeklyShopTabs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">加载商城数据中...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">商城</h1>
                    <p className="text-muted-foreground mt-1">
                        购买资源，提升实力
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                    <Clock className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    刷新数据
                </Button>
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
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Gem className="h-5 w-5 text-cyan-500" />
                                <span className="text-sm text-muted-foreground">钻石</span>
                            </div>
                            <span className="font-bold text-cyan-600">
                                {userBalance.diamond.toLocaleString()}
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
                                {formatCurrency(userBalance.gold)}
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
                                {userBalance.friendship.toLocaleString()}
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
                                {userBalance.arenaPoints.toLocaleString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-orange-500" />
                                <span className="text-sm text-muted-foreground">勋章</span>
                            </div>
                            <span className="font-bold text-orange-600">
                                {userBalance.activityMedals.toLocaleString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue={([...tradeShopTabs, ...weeklyShopTabs])[0]?.tradeShopTabId?.toString()} className="space-y-6">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="inline-flex w-auto min-w-full justify-start">
                        {([...tradeShopTabs, ...weeklyShopTabs]).map((tab) => (
                            <TabsTrigger key={tab.tradeShopTabId} value={tab.tradeShopTabId.toString()} className="whitespace-nowrap">
                                {(() => {
                                    const mb = tradeShopTabMasterMap[tab.tradeShopTabId];
                                    return mb ? (t(mb.tabNameKey) || mb.memo) : `商店 #${tab.tradeShopTabId}`;
                                })()}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {([...tradeShopTabs, ...weeklyShopTabs]).map((tab) => {
                    const consumeItems = getTabConsumeItems(tab);
                    return (
                    <TabsContent key={tab.tradeShopTabId} value={tab.tradeShopTabId.toString()} className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            {(() => {
                                                const mb = tradeShopTabMasterMap[tab.tradeShopTabId];
                                                return mb ? (t(mb.tabNameKey) || mb.memo) : `商店 #${tab.tradeShopTabId}`;
                                            })()}
                                        </CardTitle>
                                        <CardDescription>
                                            {tab.expirationTimeStamp > 0
                                                ? `限时兑换，截止时间: ${new Date(tab.expirationTimeStamp * 1000).toLocaleString()}`
                                                : '常驻资源兑换'
                                            }
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* 显示该 tab 涉及的消耗道具持有数量 */}
                                        {consumeItems.length > 0 && (
                                            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
                                                {consumeItems.map((consumeItem, idx) => {
                                                    const count = getUserItemCount(userItems, consumeItem.itemType, consumeItem.itemId, 
                                                        consumeItem.itemType === ItemType.CurrencyFree || consumeItem.itemType === ItemType.CurrencyPaid);
                                                    return (
                                                        <div key={`${consumeItem.itemType}-${consumeItem.itemId}`} className="flex items-center gap-1.5">
                                                            {idx > 0 && <Separator orientation="vertical" className="h-4 mx-1" />}
                                                            {getCurrencyIcon(consumeItem.itemType)}
                                                            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                                                                {getItemName(consumeItem.itemType, consumeItem.itemId)}
                                                            </span>
                                                            <span className="text-sm font-semibold">
                                                                {count.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {tab.expirationTimeStamp > 0 && (
                                            <Badge className="bg-orange-500">限时活动</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {tab.tradeShopItems?.map((item) => (
                                        <Card key={item.tradeShopItemId}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <div className="font-semibold">{getItemName(item.giveItem.itemType, item.giveItem.itemId)}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ×{item.giveItem.itemCount}
                                                        </div>
                                                    </div>
                                                    <Badge variant={item.tradeCount >= item.limitTradeCount && item.limitTradeCount > 0 ? "destructive" : "secondary"}>
                                                        {item.limitTradeCount > 0 ? `${item.tradeCount}/${item.limitTradeCount}` : '∞'}
                                                    </Badge>
                                                </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col gap-1">
                                                    {item.consumeItem1 ? (
                                                        <div className="flex items-center gap-2">
                                                            {getCurrencyIcon(item.consumeItem1.itemType)}
                                                            <span className="text-sm text-muted-foreground">
                                                                {getItemName(item.consumeItem1.itemType, item.consumeItem1.itemId)}
                                                            </span>
                                                            <span className="font-bold">
                                                                ×{item.consumeItem1.itemCount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-green-600">免费</span>
                                                    )}
                                                    {item.consumeItem2 && (
                                                        <div className="flex items-center gap-2">
                                                            {getCurrencyIcon(item.consumeItem2.itemType)}
                                                            <span className="text-sm text-muted-foreground">
                                                                {getItemName(item.consumeItem2.itemType, item.consumeItem2.itemId)}
                                                            </span>
                                                            <span className="font-bold">
                                                                ×{item.consumeItem2.itemCount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                    <Button
                                                        size="sm"
                                                        disabled={item.tradeCount >= item.limitTradeCount && item.limitTradeCount > 0}
                                                        onClick={() => handleBuyTradeItem(tab.tradeShopTabId, item)}
                                                    >
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
                );})}
            </Tabs>
        </div>
    );
}
