import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Swords, Mountain } from 'lucide-react';
import { useItemName } from '@/hooks/useItemName';
import { ItemType } from '@/api/generated/itemType';
import { PvpOption } from '@/api/generated/pvpOption';
import { DungeonBattleConfig } from '@/api/generated/dungeonBattleConfig';
import { TargetSelectStrategy } from '@/api/generated/targetSelectStrategy';
import { CharacterFilterStrategy } from '@/api/generated/characterFilterStrategy';

interface BattleSectionProps {
    battleLeague: PvpOption;
    legendLeague: PvpOption;
    dungeonBattle: DungeonBattleConfig;
    onUpdatePvp: (key: 'battleLeague' | 'legendLeague', config: PvpOption) => void;
    onUpdateDungeon: (config: DungeonBattleConfig) => void;
}

export function BattleSection({
    battleLeague,
    legendLeague,
    dungeonBattle,
    onUpdatePvp,
    onUpdateDungeon,
}: BattleSectionProps) {
   const { getItemName } = useItemName();

   const renderPvpSettings = (title: string, config: PvpOption, type: 'battleLeague' | 'legendLeague') => {
        const handleStrategyChange = (val: string) => {
            onUpdatePvp(type, { ...config, selectStrategy: parseInt(val) });
        };

        const handleExcludeIdsChange = (val: string) => {
            const ids = val.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            onUpdatePvp(type, { ...config, excludePlayerIds: ids });
        };

        const removeFilter = (index: number) => {
            const newFilters = [...config.characterFilters];
            newFilters.splice(index, 1);
            onUpdatePvp(type, { ...config, characterFilters: newFilters });
        };

        const addFilter = () => {
            const newFilters = [...config.characterFilters, { characterId: 0, filterStrategy: CharacterFilterStrategy.Character }];
            onUpdatePvp(type, { ...config, characterFilters: newFilters });
        };

        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Swords className="h-5 w-5 text-primary" />
                        <CardTitle>{title}</CardTitle>
                    </div>
                    <CardDescription>配置 PVP 自动战斗策略和排除目标</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>对手选择策略</Label>
                        <Select
                            value={config.selectStrategy?.toString() ?? TargetSelectStrategy.Random.toString()}
                            onValueChange={handleStrategyChange}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TargetSelectStrategy.Random.toString()}>随机</SelectItem>
                                <SelectItem value={TargetSelectStrategy.LowestBattlePower.toString()}>最低战力</SelectItem>
                                <SelectItem value={TargetSelectStrategy.HighestBattlePower.toString()}>最高战力</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>排除玩家 ID (逗号分隔)</Label>
                        <Input
                            value={(config.excludePlayerIds || []).join(', ')}
                            onChange={(e) => handleExcludeIdsChange(e.target.value)}
                            placeholder="例如: 12345, 67890"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>角色过滤器 (排除包含特定角色的队伍)</Label>
                            <Button variant="outline" size="sm" onClick={addFilter}>
                                <Plus className="mr-2 h-4 w-4" />
                                添加角色
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {(config.characterFilters || []).map((filter, idx) => (
                                <Badge key={idx} variant="secondary" className="flex items-center space-x-1 py-1.5 px-3">
                                    <span>{getItemName(ItemType.Character, filter.characterId)}</span>
                                    <X
                                        className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => removeFilter(idx)}
                                    />
                                </Badge>
                            ))}
                            {(config.characterFilters || []).length === 0 && (
                                <p className="text-sm text-muted-foreground italic">未配置角色过滤</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {renderPvpSettings('竞技场 (Arena)', battleLeague, 'battleLeague')}
                {renderPvpSettings('传说联赛 (Legend)', legendLeague, 'legendLeague')}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Mountain className="h-5 w-5 text-primary" />
                        <CardTitle>时空洞窟 (Dungeon)</CardTitle>
                    </div>
                    <CardDescription>配置自动挑战时空洞窟时的行为偏好</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                        <Label className="flex flex-col space-y-1">
                            <span>优先宝箱</span>
                            <span className="font-normal text-xs text-muted-foreground text-wrap">在选择格子时优先选择带有宝箱的路径</span>
                        </Label>
                        <Switch
                            checked={dungeonBattle.preferTreasureChest}
                            onCheckedChange={(checked) => onUpdateDungeon({ ...dungeonBattle, preferTreasureChest: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                        <Label className="flex flex-col space-y-1">
                            <span>自动脱装</span>
                            <span className="font-normal text-xs text-muted-foreground text-wrap">在特殊事件中自动卸载装备以降低评分（如果逻辑需要）</span>
                        </Label>
                        <Switch
                            checked={dungeonBattle.autoRemoveEquipment}
                            onCheckedChange={(checked) => onUpdateDungeon({ ...dungeonBattle, autoRemoveEquipment: checked })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>最大使用回复物品次数 (0-99)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={99}
                            value={dungeonBattle.maxUseRecoveryItem}
                            onChange={(e) => onUpdateDungeon({ ...dungeonBattle, maxUseRecoveryItem: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>地牢商店目标物品 (带折扣阈值)</Label>
                        <div className="grid gap-2">
                            {(dungeonBattle.shopTargetItems || []).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between rounded border p-2 text-sm">
                                    <span>{getItemName(item.itemType, item.itemId)} | 最低折扣: {item.minDiscountPercent}%</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const next = [...dungeonBattle.shopTargetItems];
                                            next.splice(idx, 1);
                                            onUpdateDungeon({ ...dungeonBattle, shopTargetItems: next });
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const next = [...(dungeonBattle.shopTargetItems || []), { itemId: 1, itemType: 34, minDiscountPercent: 0, itemCount: 1 }];
                                    onUpdateDungeon({ ...dungeonBattle, shopTargetItems: next });
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                添加商店目标
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
