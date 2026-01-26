import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Sparkles, Box, X, RotateCcw, Plus } from 'lucide-react';
import { useItemName } from '@/hooks/useItemName';
import { ShopConfig } from '@/api/generated/shopConfig';
import { GachaConfigModel } from '@/api/generated/gachaConfigModel';
import { ItemsConfig } from '@/api/generated/itemsConfig';
import { GachaRelicType } from '@/api/generated/gachaRelicType';
import { AutoUseItemType } from '@/api/generated/autoUseItemType';
import { ItemType } from '@/api/generated/itemType';

interface ResourceSectionProps {
    shop: ShopConfig;
    gacha: GachaConfigModel;
    items: ItemsConfig;
    onUpdateShop: (config: ShopConfig) => void;
    onUpdateGacha: (config: GachaConfigModel) => void;
    onUpdateItems: (config: ItemsConfig) => void;
}

export function ResourceSection({
    shop,
    gacha,
    items,
    onUpdateShop,
    onUpdateGacha,
    onUpdateItems,
}: ResourceSectionProps) {
   const { getItemName } = useItemName();

   const handleItemTypeToggle = (type: AutoUseItemType) => {
        const current = items.autoUseItemTypes;
        const next = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        onUpdateItems({ ...items, autoUseItemTypes: next });
    };

    const resetShopDefaults = () => {
        onUpdateShop({
            autoBuyItems: [
                {
                    buyItem: { itemType: ItemType.EquipmentRarityCrystal, itemId: 1, itemCount: 5 },
                    shopTabId: 1,
                    minDiscountPercent: 20,
                    consumeItem: { itemType: ItemType.CurrencyFree, itemId: 1, itemCount: 0 },
                },
                {
                    buyItem: { itemType: ItemType.None, itemId: 0, itemCount: 0 },
                    shopTabId: 1,
                    minDiscountPercent: 0,
                    consumeItem: { itemType: ItemType.Gold, itemId: 1, itemCount: 0 },
                },
            ],
        });
    };

    const removeShopItem = (idx: number) => {
        const nextItems = [...shop.autoBuyItems];
        nextItems.splice(idx, 1);
        onUpdateShop({ ...shop, autoBuyItems: nextItems });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <CardTitle>商店自动购买 (Shop)</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetShopDefaults}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            重置默认
                        </Button>
                    </div>
                    <CardDescription>配置在商店自动购买的物品与折扣</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const next = [...(shop.autoBuyItems || []), {
                                    buyItem: { itemType: ItemType.None, itemId: 0, itemCount: 0 },
                                    shopTabId: 1,
                                    minDiscountPercent: 0,
                                    consumeItem: { itemType: ItemType.Gold, itemId: 1, itemCount: 0 }
                                }];
                                onUpdateShop({ ...shop, autoBuyItems: next });
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            添加购买项
                        </Button>
                    </div>
                    <div className="grid gap-3">
                        {(shop.autoBuyItems || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        购买: {item.buyItem?.itemId === 0 ? '任意物品' : getItemName(item.buyItem.itemType, item.buyItem.itemId)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        消耗: {getItemName(item.consumeItem.itemType, item.consumeItem.itemId)} | 折扣 {'>='} {item.minDiscountPercent}%
                                    </span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeShopItem(idx)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {(shop.autoBuyItems || []).length === 0 && (
                            <p className="text-sm text-muted-foreground italic text-center py-4">未配置自动购买项</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <CardTitle>自动抽卡 (Gacha)</CardTitle>
                        </div>
                        <CardDescription>配置自动免费抽卡与圣遗物目标</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>圣遗物愿望目标</Label>
                            <Select
                                value={(gacha.targetRelicType ?? GachaRelicType.None).toString()}
                                onValueChange={(val) => onUpdateGacha({ ...gacha, targetRelicType: parseInt(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={GachaRelicType.None.toString()}>无</SelectItem>
                                    <SelectItem value={GachaRelicType.ChaliceOfHeavenly.toString()}>天之杯</SelectItem>
                                    <SelectItem value={GachaRelicType.SilverOrderOfTheBlueSky.toString()}>青空银令</SelectItem>
                                    <SelectItem value={GachaRelicType.DivineWingsOfDesire.toString()}>欲求神翼</SelectItem>
                                    <SelectItem value={GachaRelicType.FruitOfTheGarden.toString()}>庭院果实</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="auto-gacha-relic" className="flex flex-col space-y-1">
                                <span>自动抽取圣遗物</span>
                                <span className="font-normal text-xs text-muted-foreground">满足条件时自动执行10连抽 (最多3次)</span>
                            </Label>
                            <Switch
                                id="auto-gacha-relic"
                                checked={gacha.autoGachaRelic}
                                onCheckedChange={(checked) => onUpdateGacha({ ...gacha, autoGachaRelic: checked })}
                            />
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <Label>自动抽卡消耗物品</Label>
                            <div className="grid gap-2">
                                {(gacha.autoGachaConsumeUserItems || []).map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded border p-2 text-sm">
                                        <span>{getItemName(item.itemType, item.itemId)}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const next = [...gacha.autoGachaConsumeUserItems];
                                                next.splice(idx, 1);
                                                onUpdateGacha({ ...gacha, autoGachaConsumeUserItems: next });
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const next = [...(gacha.autoGachaConsumeUserItems || []), { itemType: ItemType.FriendPoint, itemId: 1, itemCount: 0 }];
                                        onUpdateGacha({ ...gacha, autoGachaConsumeUserItems: next });
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    添加消耗物品
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Box className="h-5 w-5 text-primary" />
                            <CardTitle>物品使用 (Items)</CardTitle>
                        </div>
                        <CardDescription>配置允许自动化任务自动消耗的物品类型</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(AutoUseItemType)
                                .filter(key => isNaN(Number(key)))
                                .map((key) => {
                                    const value = AutoUseItemType[key as keyof typeof AutoUseItemType];
                                    return (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`item-${key}`}
                                                checked={(items.autoUseItemTypes || []).includes(value)}
                                                onCheckedChange={() => handleItemTypeToggle(value)}
                                            />
                                            <Label
                                                htmlFor={`item-${key}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {key}
                                            </Label>
                                        </div>
                                    );
                                })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
