import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2, Package } from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { useMasterStore } from '@/store/masterStore';
import { useLocalizationStore } from '@/store/localization-store';
import { EquipmentTab } from '@/components/items/tabs/EquipmentTab';
import { ConsumptionTab } from '@/components/items/tabs/ConsumptionTab';
import { MaterialTab } from '@/components/items/tabs/MaterialTab';
import { SphereTab } from '@/components/items/tabs/SphereTab';
import { SetPieceTab } from '@/components/items/tabs/SetPieceTab';
import { UseItemDialog } from '@/components/items/UseItemDialog';
import { UserItemDtoInfo, UserEquipmentDtoInfo, ItemMB } from '@/api/generated';
import { ortegaApi } from '@/api/ortega-client';
import { getItemName } from '@/lib/itemUtils';

export function ItemsPage() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<UserItemDtoInfo[]>([]);
    const [userEquipments, setUserEquipments] = useState<UserEquipmentDtoInfo[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UserItemDtoInfo | null>(null);
    const [selectedItemName, setSelectedItemName] = useState('');
    const { currentAccountId } = useAccountStore();
    const sync = useMasterStore(state => state.sync);
    const getTable = useMasterStore(state => state.getTable);
    const t = useLocalizationStore((state) => state.t);

    const loadData = async () => {
        try {
            setLoading(true);

            // 确保Master数据已加载
            await sync();

            // 直接调用API获取用户数据
            const userData = await ortegaApi.user.getUserData({});

            // 设置道具数据
            if (userData.userSyncData) {
                setItems(userData.userSyncData.userItemDtoInfo || []);
                setUserEquipments(userData.userSyncData.userEquipmentDtoInfos || []);
            }
        } catch (error) {
            console.error('Failed to load items data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentAccountId) {
            setLoading(false);
            return;
        }

        loadData();
    }, [currentAccountId]);

    const handleUseItem = async (item: UserItemDtoInfo) => {
        // 获取道具名称
        const itemTable = await getTable<ItemMB>('ItemTable');
        const masterTables = { ItemTable: itemTable };
        const name = getItemName(item.itemType, item.itemId, masterTables, t);

        setSelectedItem(item);
        setSelectedItemName(name);
        setDialogOpen(true);
    };

    const handleUseSuccess = () => {
        // 刷新数据
        loadData();
    };

    const totalUniqueItems = items.filter((item) => item.itemCount > 0).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full p-6 space-y-6">
            {/* 页面标题 */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold">{t('[CommonFooterItemBoxButtonLabel]') || '道具仓库'}</h1>
                </div>
                <p className="text-muted-foreground">
                    管理你的道具 • {totalUniqueItems} 种道具
                </p>
            </div>

            {/* Tab导航和内容 */}
            <Card className="p-6">
                <Tabs defaultValue="equipment" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="equipment">
                            {t('[ItemBoxTabEquipment]') || '装备'}
                        </TabsTrigger>
                        <TabsTrigger value="consumption">
                            {t('[ItemBoxTabConsumption]') || '消耗品'}
                        </TabsTrigger>
                        <TabsTrigger value="material">
                            {t('[ItemBoxTabMaterial]') || '材料'}
                        </TabsTrigger>
                        <TabsTrigger value="sphere">
                            {t('[ItemBoxTabSphere]') || '符石'}
                        </TabsTrigger>
                        <TabsTrigger value="setpiece">
                            {t('[ItemBoxTabSetPiece]') || '套装残片'}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="equipment" className="space-y-4">
                        <EquipmentTab
                            items={items}
                            userEquipments={userEquipments}
                        />
                    </TabsContent>

                    <TabsContent value="consumption" className="space-y-4">
                        <ConsumptionTab
                            items={items}
                            onUseItem={handleUseItem}
                        />
                    </TabsContent>

                    <TabsContent value="material" className="space-y-4">
                        <MaterialTab items={items} />
                    </TabsContent>

                    <TabsContent value="sphere" className="space-y-4">
                        <SphereTab items={items} />
                    </TabsContent>

                    <TabsContent value="setpiece" className="space-y-4">
                        <SetPieceTab items={items} />
                    </TabsContent>
                </Tabs>
            </Card>

            {/* 使用道具对话框 */}
            <UseItemDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                item={selectedItem}
                itemName={selectedItemName}
                onSuccess={handleUseSuccess}
            />
        </div>
    );
}
