import { useState, useMemo } from 'react';
import { mockEquipment } from '@/mocks/data';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { EquipmentFilters } from '@/components/equipment/EquipmentFilters';
import type { Equipment, EquipmentRarity, EquipmentSlot } from '@/mocks/types';
import { sortEquipment } from '@/lib/equipmentUtils';
import { Book } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function EquipmentPage() {
    // 筛选状态
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | 'all'>('all');
    const [selectedRarities, setSelectedRarities] = useState<EquipmentRarity[]>([]);
    const [equippedFilter, setEquippedFilter] = useState<'all' | 'equipped' | 'unequipped'>('all');
    const [setFilter, setSetFilter] = useState<string | 'all'>('all');
    const [sortBy, setSortBy] = useState<'level' | 'rarity' | 'enhance' | 'power'>('power');

    // 筛选和排序装备
    const filteredAndSortedEquipment = useMemo(() => {
        let filtered = mockEquipment.filter(eq => {
            // 搜索筛选
            if (searchQuery && !eq.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // 部位筛选
            if (selectedSlot !== 'all' && eq.slot !== selectedSlot) {
                return false;
            }

            // 稀有度筛选
            if (selectedRarities.length > 0 && !selectedRarities.includes(eq.rarity)) {
                return false;
            }

            // 装备状态筛选
            if (equippedFilter === 'equipped' && !eq.equippedBy) {
                return false;
            }
            if (equippedFilter === 'unequipped' && eq.equippedBy) {
                return false;
            }

            // 套装筛选
            if (setFilter !== 'all') {
                if (setFilter === 'none' && eq.setId) {
                    return false;
                }
                if (setFilter !== 'none' && eq.setId !== setFilter) {
                    return false;
                }
            }

            return true;
        });

        // 排序
        return sortEquipment(filtered, sortBy);
    }, [mockEquipment, searchQuery, selectedSlot, selectedRarities, equippedFilter, setFilter, sortBy]);

    // 重置所有筛选
    const handleReset = () => {
        setSearchQuery('');
        setSelectedSlot('all');
        setSelectedRarities([]);
        setEquippedFilter('all');
        setSetFilter('all');
    };

    // 装备操作处理
    const handleViewDetails = (equipment: Equipment) => {
        console.log('查看装备详情:', equipment);
        // TODO: 打开详情对话框
    };

    const handleEnhance = (equipment: Equipment) => {
        console.log('强化装备:', equipment);
        // TODO: 打开强化界面
    };

    const handleEquip = (equipment: Equipment) => {
        console.log('装备:', equipment);
        // TODO: 装备到角色
    };

    const handleUnequip = (equipment: Equipment) => {
        console.log('卸下装备:', equipment);
        // TODO: 从角色卸下
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">装备管理</h1>
                <p className="text-muted-foreground mt-1">
                    管理和强化你的装备 • {filteredAndSortedEquipment.length} / {mockEquipment.length} 件装备
                </p>
            </div>

            {/* 帮助提示 */}
            <Alert>
                <Book className="h-4 w-4" />
                <AlertDescription>
                    <strong>装备系统说明：</strong>
                    装备分为武器、头部、身体、腿部、手部和饰品6个部位。稀有度越高属性越强，可通过强化、神装强化(圣装/魔装)和符石镶嵌提升战斗力。
                    装备同一套装可激活套装效果。
                </AlertDescription>
            </Alert>

            {/* 筛选器 */}
            <EquipmentFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSlot={selectedSlot}
                onSlotChange={setSelectedSlot}
                selectedRarities={selectedRarities}
                onRaritiesChange={setSelectedRarities}
                equippedFilter={equippedFilter}
                onEquippedFilterChange={setEquippedFilter}
                setFilter={setFilter}
                onSetFilterChange={setSetFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onReset={handleReset}
            />

            {/* 装备网格 */}
            {filteredAndSortedEquipment.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedEquipment.map((equipment) => (
                        <EquipmentCard
                            key={equipment.id}
                            equipment={equipment}
                            onViewDetails={handleViewDetails}
                            onEnhance={handleEnhance}
                            onEquip={handleEquip}
                            onUnequip={handleUnequip}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="text-6xl mb-4 opacity-20">📦</div>
                    <h3 className="text-lg font-semibold mb-2">未找到匹配的装备</h3>
                    <p className="text-muted-foreground mb-4">
                        尝试调整筛选条件或重置筛选
                    </p>
                    <button
                        onClick={handleReset}
                        className="text-primary hover:underline"
                    >
                        重置所有筛选
                    </button>
                </div>
            )}
        </div>
    );
}
