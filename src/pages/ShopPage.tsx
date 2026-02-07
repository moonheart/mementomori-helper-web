import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
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
import { TradeShopType } from '@/api/generated/tradeShopType';
import { SphereMB } from '@/api/generated/sphereMB';
import { TradeShopSphereMB } from '@/api/generated/tradeShopSphereMB';
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
    const [sphereList, setSphereList] = useState<SphereMB[]>([]);
    const [tradeShopSphereMap, setTradeShopSphereMap] = useState<Record<number, TradeShopSphereMB>>({});

    // 符石购买状态
    const [sphereBuyState, setSphereBuyState] = useState<Record<number, { lv: number; count: number }>>({});

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
            const [tradeShopTabTable, sphereTable, tradeShopSphereTable] = await Promise.all([
                getTable<TradeShopTabMB>('TradeShopTabTable'),
                getTable<SphereMB>('SphereTable'),
                getTable<TradeShopSphereMB>('TradeShopSphereTable')
            ]);

            const masterMap: Record<number, TradeShopTabMB> = {};
            tradeShopTabTable.forEach((m) => {
                masterMap[m.id] = m;
            });
            setTradeShopTabMasterMap(masterMap);

            // 设置符石列表
            setSphereList(sphereTable);

            // 设置符石商店等级映射
            const sphereMap: Record<number, TradeShopSphereMB> = {};
            tradeShopSphereTable.forEach((m) => {
                sphereMap[m.sphereLevel] = m;
            });
            setTradeShopSphereMap(sphereMap);

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

    // 获取符石购买状态
    const getSphereBuyState = (sphereId: number) => {
        return sphereBuyState[sphereId] || { lv: 1, count: 1 };
    };

    // 更新符石购买状态
    const updateSphereBuyState = (sphereId: number, updates: Partial<{ lv: number; count: number }>) => {
        setSphereBuyState(prev => ({
            ...prev,
            [sphereId]: { ...getSphereBuyState(sphereId), ...updates }
        }));
    };

    // 计算符石最大可购买数量
    const getMaxSphereBuyCount = (sphere: SphereMB, lv: number) => {
        const tradeShopSphereMb = tradeShopSphereMap[lv];
        if (!tradeShopSphereMb) return 0;

        let canBuyCount = 0;

        // 检查消耗物品1
        if (tradeShopSphereMb.consumeItem1) {
            const availableCount = getUserItemCount(
                userItems,
                tradeShopSphereMb.consumeItem1.itemType,
                tradeShopSphereMb.consumeItem1.itemId,
                tradeShopSphereMb.consumeItem1.itemType === ItemType.CurrencyFree || tradeShopSphereMb.consumeItem1.itemType === ItemType.CurrencyPaid
            );
            canBuyCount = Math.floor(availableCount / tradeShopSphereMb.consumeItem1.itemCount);
        }

        // 检查消耗物品2
        if (tradeShopSphereMb.consumeItem2 && canBuyCount > 0) {
            const availableCount = getUserItemCount(
                userItems,
                tradeShopSphereMb.consumeItem2.itemType,
                tradeShopSphereMb.consumeItem2.itemId,
                tradeShopSphereMb.consumeItem2.itemType === ItemType.CurrencyFree || tradeShopSphereMb.consumeItem2.itemType === ItemType.CurrencyPaid
            );
            const canBuyCount2 = Math.floor(availableCount / tradeShopSphereMb.consumeItem2.itemCount);
            canBuyCount = Math.min(canBuyCount, canBuyCount2);
        }

        return canBuyCount;
    };

    // 检查符石是否可以购买
    const canBuySphere = (lv: number) => {
        const tradeShopSphereMb = tradeShopSphereMap[lv];
        if (!tradeShopSphereMb) return false;

        // 检查消耗物品1
        if (tradeShopSphereMb.consumeItem1) {
            const availableCount = getUserItemCount(
                userItems,
                tradeShopSphereMb.consumeItem1.itemType,
                tradeShopSphereMb.consumeItem1.itemId,
                tradeShopSphereMb.consumeItem1.itemType === ItemType.CurrencyFree || tradeShopSphereMb.consumeItem1.itemType === ItemType.CurrencyPaid
            );
            if (availableCount < tradeShopSphereMb.consumeItem1.itemCount) return false;
        }

        // 检查消耗物品2
        if (tradeShopSphereMb.consumeItem2) {
            const availableCount = getUserItemCount(
                userItems,
                tradeShopSphereMb.consumeItem2.itemType,
                tradeShopSphereMb.consumeItem2.itemId,
                tradeShopSphereMb.consumeItem2.itemType === ItemType.CurrencyFree || tradeShopSphereMb.consumeItem2.itemType === ItemType.CurrencyPaid
            );
            if (availableCount < tradeShopSphereMb.consumeItem2.itemCount) return false;
        }

        return true;
    };

    // 获取符石购买消耗文本
    const getSphereConsumeText = (lv: number, count: number) => {
        const tradeShopSphereMb = tradeShopSphereMap[lv];
        if (!tradeShopSphereMb) return '';

        let text = '';
        if (tradeShopSphereMb.consumeItem1) {
            const name = getItemName(tradeShopSphereMb.consumeItem1.itemType, tradeShopSphereMb.consumeItem1.itemId);
            const totalCount = tradeShopSphereMb.consumeItem1.itemCount * count;
            text = `${name} × ${totalCount.toLocaleString()}`;
        }

        if (tradeShopSphereMb.consumeItem2) {
            const name = getItemName(tradeShopSphereMb.consumeItem2.itemType, tradeShopSphereMb.consumeItem2.itemId);
            const totalCount = tradeShopSphereMb.consumeItem2.itemCount * count;
            text += ` ${name} × ${totalCount.toLocaleString()}`;
        }

        return text;
    };

    // 检查普通商品是否可以购买
    const canBuyTradeItem = (item: TradeShopItem) => {
        // 检查库存限制
        if (item.limitTradeCount > 0 && item.tradeCount >= item.limitTradeCount) {
            return false;
        }

        // 检查消耗道具1
        if (item.consumeItem1) {
            const availableCount = getUserItemCount(
                userItems,
                item.consumeItem1.itemType,
                item.consumeItem1.itemId,
                item.consumeItem1.itemType === ItemType.CurrencyFree || item.consumeItem1.itemType === ItemType.CurrencyPaid
            );
            if (availableCount < item.consumeItem1.itemCount) return false;
        }

        // 检查消耗道具2
        if (item.consumeItem2) {
            const availableCount = getUserItemCount(
                userItems,
                item.consumeItem2.itemType,
                item.consumeItem2.itemId,
                item.consumeItem2.itemType === ItemType.CurrencyFree || item.consumeItem2.itemType === ItemType.CurrencyPaid
            );
            if (availableCount < item.consumeItem2.itemCount) return false;
        }

        return true;
    };

    // 处理符石购买
    const handleBuySphere = async (tabId: number, sphere: SphereMB) => {
        const state = getSphereBuyState(sphere.id);
        const targetSphere = sphereList.find(s => s.categoryId === sphere.categoryId && s.lv === state.lv);

        if (!targetSphere) {
            toast({
                title: '购买失败',
                description: '未找到对应等级的符石',
                variant: 'destructive',
            });
            return;
        }

        try {
            await ortegaApi.tradeShop.buyItem({
                tradeShopTabId: tabId,
                tradeShopItemInfos: [],
                tradeShopSphereId: targetSphere.id,
                tradeSphereCount: state.count
            });

            toast({
                title: '购买成功',
                description: `已获得 ${getItemName(ItemType.Sphere, targetSphere.id)} × ${state.count}`,
            });

            // 重新加载数据以更新余额
            loadData();
        } catch (error) {
            console.error('Buy sphere failed:', error);
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
                    const tabMaster = tradeShopTabMasterMap[tab.tradeShopTabId];
                    const isSphereShop = tabMaster?.tradeShopType === TradeShopType.Sphere;

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
                                        {isSphereShop ? (
                                            // 符石商店显示所有等级的消耗道具
                                            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
                                                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lv, idx) => {
                                                    const tradeShopSphereMb = tradeShopSphereMap[lv];
                                                    if (!tradeShopSphereMb || !tradeShopSphereMb.consumeItem1) return null;
                                                    
                                                    const consumeItem = tradeShopSphereMb.consumeItem1;
                                                    const count = getUserItemCount(userItems, consumeItem.itemType, consumeItem.itemId,
                                                        consumeItem.itemType === ItemType.CurrencyFree || consumeItem.itemType === ItemType.CurrencyPaid);
                                                    
                                                    // 去重：检查前面的等级是否已经显示过相同的道具
                                                    const isDuplicate = [1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, idx).some(prevLv => {
                                                        const prevMb = tradeShopSphereMap[prevLv];
                                                        return prevMb?.consumeItem1?.itemType === consumeItem.itemType && 
                                                               prevMb?.consumeItem1?.itemId === consumeItem.itemId;
                                                    });
                                                    if (isDuplicate) return null;
                                                    
                                                    return (
                                                        <div key={`sphere-${lv}`} className="flex items-center gap-1.5">
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
                                                }).filter(Boolean)}
                                            </div>
                                        ) : consumeItems.length > 0 && (
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
                                {isSphereShop ? (
                                    // 符石商店特殊渲染
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {sphereList.filter(s => s.lv === 1).map((sphere) => {
                                            const state = getSphereBuyState(sphere.id);
                                            const maxCount = getMaxSphereBuyCount(sphere, state.lv);
                                            const buyEnabled = canBuySphere(state.lv) && maxCount > 0;

                                            return (
                                                <Card key={sphere.id}>
                                                    <CardHeader className="pb-3">
                                                        <CardTitle className="text-base">{t(sphere.nameKey)}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        {/* 等级选择 */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">{t('[EquipmentSphereSynthesisSphereLv]')}</span>
                                                                <span className="font-semibold">Lv.{state.lv}</span>
                                                            </div>
                                                            <Slider
                                                                value={[state.lv]}
                                                                onValueChange={(values: number[]) => {
                                                                    const newLv = Math.max(1, Math.min(9, values[0] || 1));
                                                                    updateSphereBuyState(sphere.id, { lv: newLv });
                                                                    // 确保数量不超过最大值
                                                                    const newMax = getMaxSphereBuyCount(sphere, newLv);
                                                                    if (state.count > newMax && newMax > 0) {
                                                                        updateSphereBuyState(sphere.id, { count: newMax });
                                                                    }
                                                                }}
                                                                min={1}
                                                                max={9}
                                                                step={1}
                                                            />
                                                        </div>

                                                        {/* 数量选择 */}
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-muted-foreground">购买数量</span>
                                                                <span className="font-semibold">{state.count} / {maxCount}</span>
                                                            </div>
                                                            <Slider
                                                                value={[state.count]}
                                                                onValueChange={(values: number[]) => updateSphereBuyState(sphere.id, { count: Math.max(1, Math.min(maxCount || 1, values[0] || 1)) })}
                                                                min={1}
                                                                max={maxCount || 1}
                                                                step={1}
                                                                disabled={maxCount === 0}
                                                            />
                                                        </div>

                                                        {/* 消耗显示 */}
                                                        <div className="text-sm text-muted-foreground">
                                                            消耗: {getSphereConsumeText(state.lv, state.count)}
                                                        </div>
                                                    </CardContent>
                                                    <CardContent className="pt-0">
                                                        <Button
                                                            className="w-full"
                                                            disabled={!buyEnabled}
                                                            onClick={() => handleBuySphere(tab.tradeShopTabId, sphere)}
                                                        >
                                                            {buyEnabled ? '购买' : '资源不足'}
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // 普通商店渲染
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                                        {(() => {
                                                            const canBuy = canBuyTradeItem(item);
                                                            const isSoldOut = item.limitTradeCount > 0 && item.tradeCount >= item.limitTradeCount;
                                                            return (
                                                                <Button
                                                                    size="sm"
                                                                    disabled={!canBuy}
                                                                    onClick={() => handleBuyTradeItem(tab.tradeShopTabId, item)}
                                                                >
                                                                    {isSoldOut ? '已售罄' : (canBuy ? '兑换' : '资源不足')}
                                                                </Button>
                                                            );
                                                        })()}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                );})}
            </Tabs>
        </div>
    );
}
