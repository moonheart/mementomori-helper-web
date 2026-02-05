import { useState, useEffect } from 'react';
import { ItemCard } from '../ItemCard';
import { UserItemDtoInfo, ItemType, EquipmentCompositeMB, EquipmentMB } from '@/api/generated';
import { getItemName } from '@/lib/itemUtils';
import { useMasterStore } from '@/store/masterStore';
import { useLocalizationStore } from '@/store/localization-store';

interface SetPieceTabProps {
    items: UserItemDtoInfo[];
}

interface SetPieceItem {
    itemId: number;
    itemType: ItemType;
    itemCount: number;
    playerId: number;
    name: string;
    rarity: string;
}

export function SetPieceTab({ items }: SetPieceTabProps) {
    const { getTable } = useMasterStore();
    const t = useLocalizationStore((state) => state.t);
    const [setPieceItems, setSetPieceItems] = useState<SetPieceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSetPieceItems = async () => {
            try {
                setLoading(true);

                // 异步加载Master表
                const equipmentCompositeTable = await getTable<EquipmentCompositeMB>('EquipmentCompositeTable');
                const equipmentTable = await getTable<EquipmentMB>('EquipmentTable');

                const masterTables = {
                    EquipmentCompositeTable: equipmentCompositeTable,
                    EquipmentTable: equipmentTable,
                };

                // 过滤和格式化数据
                const formattedItems = items
                    .filter((item) => item.itemType === ItemType.EquipmentFragment && item.itemCount > 0)
                    .map((item) => ({
                        ...item,
                        name: getItemName(item.itemType, item.itemId, masterTables, t),
                        rarity: '',
                    }))
                    .sort((a, b) => b.itemCount - a.itemCount);

                setSetPieceItems(formattedItems);
            } catch (error) {
                console.error('Failed to load set piece items:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSetPieceItems();
    }, [items, getTable, t]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (setPieceItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4 opacity-20">🧩</div>
                <p>暂无套装残片道具</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {setPieceItems.map((item) => (
                <ItemCard
                    key={`${item.itemType}-${item.itemId}`}
                    name={item.name}
                    rarity={item.rarity}
                    count={item.itemCount}
                />
            ))}
        </div>
    );
}
