import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Equipment } from '@/mocks/types';
import {
    getRarityColor,
    getSlotIcon,
    getSlotName,
    formatStatName,
    formatStatValue,
    calculateEquipmentPower,
    getRuneSlotUsage,
    canEnhance
} from '@/lib/equipmentUtils';
import { Swords, TrendingUp, Sparkles, XCircle } from 'lucide-react';

interface EquipmentCardProps {
    equipment: Equipment;
    onViewDetails?: (equipment: Equipment) => void;
    onEnhance?: (equipment: Equipment) => void;
    onEquip?: (equipment: Equipment) => void;
    onUnequip?: (equipment: Equipment) => void;
}

export function EquipmentCard({
    equipment,
    onViewDetails,
    onEnhance,
    onEquip,
    onUnequip
}: EquipmentCardProps) {
    const power = calculateEquipmentPower(equipment);
    const runeUsage = getRuneSlotUsage(equipment);

    return (
        <Card
            className="hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => onViewDetails?.(equipment)}
        >
            {/* 专属武器标识 */}
            {equipment.isExclusive && (
                <div className="absolute top-2 right-2 z-10">
                    <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Sparkles className="w-3 h-3 mr-1" />
                        专属
                    </Badge>
                </div>
            )}

            {/* 套装标识 */}
            {equipment.setName && !equipment.isExclusive && (
                <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary">
                        {equipment.setName}
                    </Badge>
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="text-4xl">{getSlotIcon(equipment.slot)}</div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">
                                {equipment.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <span>{getSlotName(equipment.slot)}</span>
                                {equipment.equippedBy && (
                                    <>
                                        <span>•</span>
                                        <span className="text-green-600">已装备</span>
                                    </>
                                )}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        <Badge className={`${getRarityColor(equipment.rarity)} text-white font-bold`}>
                            {equipment.rarity}
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
                        {power.toLocaleString()}
                    </span>
                </div>

                {/* 强化等级 */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col items-center p-1.5 bg-muted rounded">
                        <span className="text-muted-foreground">强化</span>
                        <span className="font-semibold">{equipment.enhanceLevel}/{equipment.maxEnhanceLevel}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-muted rounded">
                        <span className="text-muted-foreground">圣装</span>
                        <span className="font-semibold text-yellow-600">Lv.{equipment.holyLevel}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-muted rounded">
                        <span className="text-muted-foreground">魔装</span>
                        <span className="font-semibold text-purple-600">Lv.{equipment.demonLevel}</span>
                    </div>
                </div>

                {/* 基础属性 */}
                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground font-medium">基础属性</div>
                    <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(equipment.baseStats).slice(0, 4).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between text-xs bg-muted/50 px-2 py-1 rounded">
                                <span className="text-muted-foreground">{formatStatName(stat)}</span>
                                <span className="font-semibold">{formatStatValue(stat, value)}</span>
                            </div>
                        ))}
                    </div>
                    {Object.keys(equipment.baseStats).length > 4 && (
                        <div className="text-xs text-center text-muted-foreground">
                            +{Object.keys(equipment.baseStats).length - 4}项属性
                        </div>
                    )}
                </div>

                {/* 符石插槽 */}
                {equipment.maxRuneSlots > 0 && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-xs text-muted-foreground">符石插槽</span>
                        <div className="flex items-center gap-1.5">
                            {[...Array(equipment.maxRuneSlots)].map((_, index) => (
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
                    {equipment.equippedBy ? (
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
