import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    UIEquipment,
    getRarityColor,
    getRarityName,
    getSlotIcon,
    getSlotName,
    formatStatName,
    formatStatValue,
    getRuneSlotUsage,
    canEnhance
} from '@/lib/equipmentUtils';
import { Swords, TrendingUp, Sparkles, XCircle } from 'lucide-react';

interface EquipmentCardProps {
    equipment: UIEquipment;
    onViewDetails?: (equipment: UIEquipment) => void;
    onEnhance?: (equipment: UIEquipment) => void;
    onEquip?: (equipment: UIEquipment) => void;
    onUnequip?: (equipment: UIEquipment) => void;
}

export function EquipmentCard({
    equipment,
    onViewDetails,
    onEnhance,
    onEquip,
    onUnequip
}: EquipmentCardProps) {
    const runeUsage = getRuneSlotUsage(equipment);
    const rarityName = getRarityName(equipment.rarity);

    return (
        <Card
            className="hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => onViewDetails?.(equipment)}
        >
            {/* 套装标识 */}
            {equipment.setName && (
                <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary">
                        {equipment.setName}
                    </Badge>
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="text-4xl">{getSlotIcon(equipment.slotType)}</div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">
                                {equipment.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <span>{getSlotName(equipment.slotType)}</span>
                                {equipment.equippedByName && (
                                    <>
                                        <span>•</span>
                                        <span className="text-green-600">由 {equipment.equippedByName} 装备</span>
                                    </>
                                )}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        <Badge className={`${getRarityColor(equipment.rarity)} text-white font-bold`}>
                            {rarityName}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            Lv.{equipment.level}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* 战斗力 */}
                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                    <span className="text-sm font-medium flex items-center gap-1">
                        <Swords className="w-4 h-4" />
                        战斗力
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {equipment.power.toLocaleString()}
                    </span>
                </div>

                {/* 强化等级 */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col items-center p-1.5 bg-muted rounded">
                        <span className="text-muted-foreground">强化</span>
                        <span className="font-semibold">{equipment.reinforcementLv || 0}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-muted rounded">
                        <span className="text-muted-foreground">圣装</span>
                        <span className="font-semibold text-yellow-600">Lv.{equipment.legendSacredTreasureLv || 0}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-muted rounded">
                        <span className="text-muted-foreground">魔装</span>
                        <span className="font-semibold text-purple-600">Lv.{equipment.matchlessSacredTreasureLv || 0}</span>
                    </div>
                </div>

                {/* 基础属性 */}
                {equipment.master?.battleParameterChangeInfo && (
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground font-medium">基础属性</div>
                        <div className="flex justify-between text-xs bg-muted/50 px-2 py-1 rounded">
                            <span className="text-muted-foreground">
                                {formatStatName(equipment.master.battleParameterChangeInfo.battleParameterType)}
                            </span>
                            <span className="font-semibold">
                                {formatStatValue(
                                    equipment.master.battleParameterChangeInfo.battleParameterType,
                                    equipment.master.battleParameterChangeInfo.value
                                )}
                            </span>
                        </div>
                    </div>
                )}

                {/* 符石插槽 */}
                {runeUsage.total > 0 && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-xs text-muted-foreground">符石插槽</span>
                        <div className="flex items-center gap-1.5">
                            {[...Array(runeUsage.total)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs ${index < runeUsage.used
                                        ? 'border-purple-500 bg-purple-100 dark:bg-purple-900 text-purple-600'
                                        : 'border-gray-300 bg-gray-100 dark:bg-gray-800'
                                        }`}
                                >
                                    {index < runeUsage.used ? '◆' : '◇'}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                    {equipment.characterGuid ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                onUnequip?.(equipment);
                            }}
                        >
                            <XCircle className="w-4 h-4 mr-1" />
                            卸下
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEquip?.(equipment);
                            }}
                        >
                            装备
                        </Button>
                    )}

                    {canEnhance(equipment) && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEnhance?.(equipment);
                            }}
                        >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            强化
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
