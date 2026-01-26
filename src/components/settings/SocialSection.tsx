import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Users, Tent } from 'lucide-react';
import { useItemName } from '@/hooks/useItemName';
import { FriendManageOption } from '@/api/generated/friendManageOption';
import { LocalRaidConfig } from '@/api/generated/localRaidConfig';
import { ItemType } from '@/api/generated/itemType';
import { BountyQuestOption } from '@/api/generated/bountyQuestOption';
import { BountyQuestAutoConfig } from '@/api/generated/bountyQuestAutoConfig';
import { UserItem } from '@/api/generated/userItem';

interface SocialSectionProps {
    friendManage: FriendManageOption;
    localRaid: LocalRaidConfig;
    bountyQuest: BountyQuestOption;
    bountyQuestAuto: BountyQuestAutoConfig;
    onUpdateFriends: (config: FriendManageOption) => void;
    onUpdateLocalRaid: (config: LocalRaidConfig) => void;
    onUpdateBounty: (config: { option: BountyQuestOption, auto: BountyQuestAutoConfig }) => void;
}

export function SocialSection({
    friendManage,
    localRaid,
    bountyQuest,
    bountyQuestAuto,
    onUpdateFriends,
    onUpdateLocalRaid,
    onUpdateBounty,
}: SocialSectionProps) {
    const { getItemName } = useItemName();

    // 自动初始化逻辑：如果奖励列表为空，自动填充推荐权重
    React.useEffect(() => {
        if (!localRaid.rewardItems || localRaid.rewardItems.length === 0) {
            onUpdateLocalRaid({
                ...localRaid,
                rewardItems: [
                    { itemType: ItemType.ExchangePlaceItem, itemId: 4, itemCount: 0, weight: 4.0 },
                    { itemType: ItemType.CharacterTrainingMaterial, itemId: 2, itemCount: 0, weight: 3.0 },
                    { itemType: ItemType.EquipmentReinforcementItem, itemId: 2, itemCount: 0, weight: 2.5 },
                    { itemType: ItemType.CharacterTrainingMaterial, itemId: 1, itemCount: 0, weight: 2.0 },
                    { itemType: ItemType.EquipmentReinforcementItem, itemId: 1, itemCount: 0, weight: 1.0 },
                ],
            });
        }
    }, [localRaid.rewardItems, localRaid, onUpdateLocalRaid]);


    const bountyQuestRewardItems: UserItem[] = [
        { itemType: ItemType.Gold, itemId: 1, itemCount: 0 },
        { itemType: ItemType.CurrencyFree, itemId: 1, itemCount: 0 },
        { itemType: ItemType.CharacterTrainingMaterial, itemId: 2, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 4, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 5, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 6, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 7, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 8, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 9, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 10, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 27, itemCount: 0 },
        { itemType: ItemType.TreasureChest, itemId: 28, itemCount: 0 }
    ];

    const isItemSelected = (item: UserItem) => {
        return (bountyQuestAuto.targetItems || []).some(t => t.itemId === item.itemId && t.itemType === item.itemType);
    };

    const toggleBountyItem = (item: UserItem) => {
        const current = bountyQuestAuto.targetItems || [];
        const next = isItemSelected(item)
            ? current.filter(t => !(t.itemId === item.itemId && t.itemType === item.itemType))
            : [...current, item];
        onUpdateBounty({ option: bountyQuest, auto: { ...bountyQuestAuto, targetItems: next } });
    };

    const localRaidCommonRewards = [
        { itemType: ItemType.ExchangePlaceItem, itemId: 4, itemCount: 0, weight: 4.0 },
        { itemType: ItemType.CharacterTrainingMaterial, itemId: 2, itemCount: 0, weight: 3.0 },
        { itemType: ItemType.EquipmentReinforcementItem, itemId: 2, itemCount: 0, weight: 2.5 },
        { itemType: ItemType.CharacterTrainingMaterial, itemId: 1, itemCount: 0, weight: 2.0 },
        { itemType: ItemType.EquipmentReinforcementItem, itemId: 1, itemCount: 0, weight: 1.0 },
    ];

    const handleWhitelistAdd = (val: string) => {
        const id = parseInt(val.trim());
        if (!isNaN(id) && !friendManage.autoRemoveWhitelist.includes(id)) {
            onUpdateFriends({
                ...friendManage,
                autoRemoveWhitelist: [...friendManage.autoRemoveWhitelist, id],
            });
        }
    };

    const removeWhitelistItem = (id: number) => {
        onUpdateFriends({
            ...friendManage,
            autoRemoveWhitelist: friendManage.autoRemoveWhitelist.filter(item => item !== id),
        });
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle>好友管理 (Friends)</CardTitle>
                    </div>
                    <CardDescription>配置自动清理和申请逻辑</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                        <Label htmlFor="auto-remove" className="flex flex-col space-y-1">
                            <span>自动移除不活跃好友 (7天)</span>
                            <span className="font-normal text-xs text-muted-foreground">自动清理超过7天未登录的好友</span>
                        </Label>
                        <Switch
                            id="auto-remove"
                            checked={friendManage.autoRemoveInactiveFriend}
                            onCheckedChange={(checked) => onUpdateFriends({ ...friendManage, autoRemoveInactiveFriend: checked })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>移除白名单 (不被自动清理的玩家 ID)</Label>
                        <div className="flex space-x-2">
                            <Input
                                placeholder="输入玩家 ID 并按添加"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleWhitelistAdd(e.currentTarget.value);
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            <Button variant="secondary" onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleWhitelistAdd(input.value);
                                input.value = '';
                            }}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {(friendManage.autoRemoveWhitelist || []).map((id) => (
                                <Badge key={id} variant="secondary" className="py-1 px-2">
                                    {id}
                                    <X
                                        className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeWhitelistItem(id)}
                                    />
                                </Badge>
                            ))}
                            {(friendManage.autoRemoveWhitelist || []).length === 0 && (
                                <p className="text-sm text-muted-foreground italic">无白名单记录</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="auto-accept">自动接受好友请求</Label>
                            <Switch
                                id="auto-accept"
                                checked={friendManage.autoAcceptFriendRequest}
                                onCheckedChange={(checked) => onUpdateFriends({ ...friendManage, autoAcceptFriendRequest: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="auto-send">自动发送好友申请</Label>
                            <Switch
                                id="auto-send"
                                checked={friendManage.autoSendFriendRequest}
                                onCheckedChange={(checked) => onUpdateFriends({ ...friendManage, autoSendFriendRequest: checked })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Tent className="h-5 w-5 text-primary" />
                        <CardTitle>本地团队战 (Local Raid)</CardTitle>
                    </div>
                    <CardDescription>配置自动挑战时的房间策略与奖励权重</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                        <Label htmlFor="self-create" className="flex flex-col space-y-1">
                            <span>房间策略</span>
                            <span className="font-normal text-xs text-muted-foreground text-wrap">
                                {localRaid.selfCreateRoom ? '自己创建房间等待他人加入' : '自动寻找并加入已有房间 (推荐)'}
                            </span>
                        </Label>
                        <Switch
                            id="self-create"
                            checked={localRaid.selfCreateRoom}
                            onCheckedChange={(checked) => onUpdateLocalRaid({ ...localRaid, selfCreateRoom: checked })}
                        />
                    </div>

                    {localRaid.selfCreateRoom && (
                        <div className="space-y-2">
                            <Label>战前等待时间 (秒)</Label>
                            <Input
                                type="number"
                                value={localRaid.waitSeconds}
                                onChange={(e) => onUpdateLocalRaid({ ...localRaid, waitSeconds: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <Label>任务奖励权重配置</Label>
                            <span className="text-xs text-muted-foreground">
                                系统将基于 <b>(报酬数量 / 最大产出) * 权重</b> 选择任务。输入 0 可忽略该项。
                            </span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {localRaidCommonRewards.map((defaultItem, idx) => {
                                // 在 localRaid.rewardItems 中寻找匹配项，如果找不到，说明尚未保存过，此时显示 0 (或者可以在此处实现前端的自动回显)
                                const currentItem = (localRaid.rewardItems || []).find(r => r.itemType === defaultItem.itemType && r.itemId === defaultItem.itemId);
                                const currentWeight = currentItem?.weight ?? 0;

                                return (
                                    <div key={idx} className="flex items-center justify-between space-x-4 rounded-lg border p-3 bg-card/50">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border text-xl shadow-sm">
                                                {defaultItem.itemType === ItemType.ExchangePlaceItem && '🎫'}
                                                {defaultItem.itemType === ItemType.CharacterTrainingMaterial && (defaultItem.itemId === 2 ? '🔮' : '🔴')}
                                                {defaultItem.itemType === ItemType.EquipmentReinforcementItem && (defaultItem.itemId === 2 ? '🧪' : '💧')}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold leading-none mb-1">
                                                    {getItemName(defaultItem.itemType, defaultItem.itemId)}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {defaultItem.itemType === ItemType.ExchangePlaceItem ? '兑换所道具' : '养成/强化材料'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">权重:</span>
                                            <Input
                                                className="h-9 w-24 text-right font-mono"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={currentWeight}
                                                onChange={(e) => {
                                                    const newWeight = parseFloat(e.target.value) || 0;
                                                    
                                                    // 构造新的 rewardItems 列表，确保只包含这 5 项
                                                    const newItems = localRaidCommonRewards.map(baseItem => {
                                                        const isTarget = baseItem.itemType === defaultItem.itemType && baseItem.itemId === defaultItem.itemId;
                                                        const existing = (localRaid.rewardItems || []).find(r => r.itemType === baseItem.itemType && r.itemId === baseItem.itemId);
                                                        
                                                        return {
                                                            ...baseItem,
                                                            weight: isTarget ? newWeight : (existing?.weight ?? 0)
                                                        };
                                                    });
                                                    
                                                    onUpdateLocalRaid({ ...localRaid, rewardItems: newItems });
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => {
                                    onUpdateLocalRaid({
                                        ...localRaid,
                                        rewardItems: localRaidCommonRewards.map(item => ({ ...item })),
                                        selfCreateRoom: false,
                                        waitSeconds: 3
                                    });
                                }}
                            >
                                恢复推荐权重
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Plus className="h-5 w-5 text-primary" />
                        <CardTitle>悬赏任务 (Bounty Quest)</CardTitle>
                    </div>
                    <CardDescription>配置自动刷新与领取策略</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>自动派遣目标项目 (勾选即为自动派遣目标)</Label>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border p-4 sm:grid-cols-3">
                            {bountyQuestRewardItems.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`bounty-item-${idx}`}
                                        checked={isItemSelected(item)}
                                        onCheckedChange={() => toggleBountyItem(item)}
                                    />
                                    <Label
                                        htmlFor={`bounty-item-${idx}`}
                                        className="text-xs font-normal cursor-pointer leading-none"
                                    >
                                        {getItemName(item.itemType, item.itemId)}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>最大自动刷新次数 (消耗钻石)</Label>
                        <Input
                            type="number"
                            className="w-32"
                            value={bountyQuest.maxRefreshCount}
                            onChange={(e) => onUpdateBounty({ option: { ...bountyQuest, maxRefreshCount: parseInt(e.target.value) || 0 }, auto: bountyQuestAuto })}
                        />
                        <p className="text-xs text-muted-foreground">当当前任务中没有上述目标项目时，将尝试刷新任务。设置为 0 则禁用自动刷新。</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
