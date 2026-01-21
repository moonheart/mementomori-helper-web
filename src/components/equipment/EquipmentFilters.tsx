import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EquipmentRarity, EquipmentSlot } from '@/mocks/types';
import { SLOT_CONFIG } from '@/constants/equipment';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface EquipmentFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedSlot: EquipmentSlot | 'all';
    onSlotChange: (slot: EquipmentSlot | 'all') => void;
    selectedRarities: EquipmentRarity[];
    onRaritiesChange: (rarities: EquipmentRarity[]) => void;
    equippedFilter: 'all' | 'equipped' | 'unequipped';
    onEquippedFilterChange: (filter: 'all' | 'equipped' | 'unequipped') => void;
    setFilter: string | 'all';
    onSetFilterChange: (setId: string | 'all') => void;
    sortBy: 'level' | 'rarity' | 'enhance' | 'power';
    onSortChange: (sort: 'level' | 'rarity' | 'enhance' | 'power') => void;
    onReset: () => void;
}

export function EquipmentFilters({
    searchQuery,
    onSearchChange,
    selectedSlot,
    onSlotChange,
    selectedRarities,
    onRaritiesChange,
    equippedFilter,
    onEquippedFilterChange,
    setFilter,
    onSetFilterChange,
    sortBy,
    onSortChange,
    onReset
}: EquipmentFiltersProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const rarities: EquipmentRarity[] = ['LR', 'UR', 'SSR', 'SR', 'R', 'S', 'A', 'D'];

    const toggleRarity = (rarity: EquipmentRarity) => {
        if (selectedRarities.includes(rarity)) {
            onRaritiesChange(selectedRarities.filter(r => r !== rarity));
        } else {
            onRaritiesChange([...selectedRarities, rarity]);
        }
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        selectedSlot !== 'all' ||
        selectedRarities.length > 0 ||
        equippedFilter !== 'all' ||
        setFilter !== 'all';

    return (
        <div className="space-y-4">
            {/* 搜索和基础筛选 */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* 搜索框 */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="搜索装备名称..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* 排序 */}
                <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="power">战斗力</SelectItem>
                        <SelectItem value="rarity">稀有度</SelectItem>
                        <SelectItem value="level">等级</SelectItem>
                        <SelectItem value="enhance">强化等级</SelectItem>
                    </SelectContent>
                </Select>

                {/* 高级筛选按钮 */}
                <Button
                    variant={showAdvanced ? "default" : "outline"}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="whitespace-nowrap"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    高级筛选
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2">
                            {[searchQuery && 1, selectedSlot !== 'all' && 1, selectedRarities.length, equippedFilter !== 'all' && 1, setFilter !== 'all' && 1].filter(Boolean).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 1), 0)}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* 部位筛选 */}
            <Tabs value={selectedSlot} onValueChange={(value: any) => onSlotChange(value)}>
                <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    {(Object.keys(SLOT_CONFIG) as EquipmentSlot[]).map(slot => (
                        <TabsTrigger key={slot} value={slot}>
                            <span className="mr-1">{SLOT_CONFIG[slot].icon}</span>
                            <span className="hidden sm:inline">{SLOT_CONFIG[slot].name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* 高级筛选面板 */}
            {showAdvanced && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                    {/* 稀有度筛选 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">稀有度筛选</label>
                        <div className="flex flex-wrap gap-2">
                            {rarities.map(rarity => (
                                <Badge
                                    key={rarity}
                                    variant={selectedRarities.includes(rarity) ? "default" : "outline"}
                                    className={`cursor-pointer ${selectedRarities.includes(rarity)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                        }`}
                                    onClick={() => toggleRarity(rarity)}
                                >
                                    {rarity}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* 装备状态筛选 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">装备状态</label>
                        <Tabs value={equippedFilter} onValueChange={(value: any) => onEquippedFilterChange(value)}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="all">全部</TabsTrigger>
                                <TabsTrigger value="equipped">已装备</TabsTrigger>
                                <TabsTrigger value="unequipped">未装备</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* 套装筛选 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">套装筛选</label>
                        <Select value={setFilter} onValueChange={onSetFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="选择套装" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部套装</SelectItem>
                                <SelectItem value="flame_set">炎之审判</SelectItem>
                                <SelectItem value="guardian_set">守护者之誓</SelectItem>
                                <SelectItem value="mystic_set">神秘咏唱</SelectItem>
                                <SelectItem value="none">无套装</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 重置按钮 */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="w-full"
                        >
                            <X className="h-4 w-4 mr-2" />
                            重置所有筛选
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
