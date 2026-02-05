import { useState, useEffect } from 'react';
import { ItemCard } from '../ItemCard';
import { UserItemDtoInfo, UserEquipmentDtoInfo, ItemType, EquipmentMB } from '@/api/generated';
import { getItemName } from '@/lib/itemUtils';
import { useMasterStore } from '@/store/masterStore';
import { useLocalizationStore } from '@/store/localization-store';

interface EquipmentTabProps {
    items: UserItemDtoInfo[];
    userEquipments: UserEquipmentDtoInfo[];
}

interface EquipmentItem {
    itemId: number;
    itemType: ItemType;
    itemCount: number;
    playerId: number;
    name: string;
    rarity: string;
}

export function EquipmentTab({ items, userEquipments }: EquipmentTabProps) {
    const { getTable } = useMasterStore();
    const t = useLocalizationStore((state) => state.t);
    const [equipmentItems, setEquipmentItems] = useState<EquipmentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEquipmentItems = async () => {
            try {
                setLoading(true);

                // 异步加载Master表
                const equipmentTable = await getTable<EquipmentMB>('EquipmentTable');

                const masterTables = {
                    EquipmentTable: equipmentTable,
                };

                // 从UserItemDtoInfo获取装备类型的道具
                const itemEquipments = items
                    .filter((item) => item.itemType === ItemType.Equipment && item.itemCount > 0)
                    .map((item) => ({
                        ...item,
                        name: getItemName(item.itemType, item.itemId, masterTables, t),
                        rarity: '',
                    }));

                // 从UserEquipmentDtoInfo获取未装备的装备（characterGuid为空）
                const unequippedEquipments = userEquipments
                    .filter((equip) => !equip.characterGuid || equip.characterGuid === '')
                    .map((equip) => ({
                        itemId: equip.equipmentId,
                        itemType: ItemType.Equipment,
                        itemCount: 1,
                        playerId: equip.playerId,
                        name: getItemName(ItemType.Equipment, equip.equipmentId, masterTables, t),
                        rarity: '',
                    }));

                // 合并并按数量排序
                const allEquipments = [...itemEquipments, ...unequippedEquipments]
                    .sort((a, b) => b.itemCount - a.itemCount);

                setEquipmentItems(allEquipments);
            } catch (error) {
                console.error('Failed to load equipment items:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEquipmentItems();
    }, [items, userEquipments, getTable, t]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (equipmentItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4 opacity-20">⚔️</div>
                <p>暂无装备道具</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {equipmentItems.map((item, index) => (
                <ItemCard
                    key={`${item.itemType}-${item.itemId}-${index}`}
                    name={item.name}
                    rarity={item.rarity}
                    count={item.itemCount}
                />
            ))}
        </div>
    );
}
