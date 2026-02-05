import { useState, useEffect } from 'react';
import { ItemCard } from '../ItemCard';
import { UserItemDtoInfo, ItemType, SphereMB } from '@/api/generated';
import { getItemName } from '@/lib/itemUtils';
import { useMasterStore } from '@/store/masterStore';
import { useLocalizationStore } from '@/store/localization-store';

interface SphereTabProps {
    items: UserItemDtoInfo[];
}

interface SphereItem {
    itemId: number;
    itemType: ItemType;
    itemCount: number;
    playerId: number;
    name: string;
    rarity: string;
}

export function SphereTab({ items }: SphereTabProps) {
    const { getTable } = useMasterStore();
    const t = useLocalizationStore((state) => state.t);
    const [sphereItems, setSphereItems] = useState<SphereItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSphereItems = async () => {
            try {
                setLoading(true);

                // 异步加载Master表
                const sphereTable = await getTable<SphereMB>('SphereTable');

                const masterTables = {
                    SphereTable: sphereTable,
                };

                // 过滤和格式化数据
                const formattedItems = items
                    .filter((item) => item.itemType === ItemType.Sphere && item.itemCount > 0)
                    .map((item) => ({
                        ...item,
                        name: getItemName(item.itemType, item.itemId, masterTables, t),
                        rarity: '',
                    }))
                    .sort((a, b) => b.itemCount - a.itemCount);

                setSphereItems(formattedItems);
            } catch (error) {
                console.error('Failed to load sphere items:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSphereItems();
    }, [items, getTable, t]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (sphereItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4 opacity-20">💎</div>
                <p>暂无符石道具</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sphereItems.map((item) => (
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
