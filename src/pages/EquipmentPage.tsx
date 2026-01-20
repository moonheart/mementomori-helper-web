import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEquipment } from '@/mocks/data';
import { Search, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';

export function EquipmentPage() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');

    const filteredEquipment = mockEquipment.filter(eq => {
        const matchesSearch = eq.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = selectedType === 'all' || eq.type === selectedType;
        return matchesSearch && matchesType;
    });

    const getRarityColor = (rarity: string) => {
        const colors = {
            SR: 'bg-blue-500',
            SSR: 'bg-purple-500',
            UR: 'bg-yellow-500'
        };
        return colors[rarity as keyof typeof colors] || 'bg-gray-500';
    };

    const getTypeIcon = (type: string) => {
        const icons = {
            weapon: '⚔️',
            armor: '🛡️',
            accessory: '💍'
        };
        return icons[type as keyof typeof icons] || '📦';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">装备管理</h1>
                <p className="text-muted-foreground">管理和强化你的装备</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="搜索装备..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Tabs value={selectedType} onValueChange={setSelectedType}>
                    <TabsList>
                        <TabsTrigger value="all">全部</TabsTrigger>
                        <TabsTrigger value="weapon">武器</TabsTrigger>
                        <TabsTrigger value="armor">防具</TabsTrigger>
                        <TabsTrigger value="accessory">饰品</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Equipment Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEquipment.map((equipment) => (
                    <Card key={equipment.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{getTypeIcon(equipment.type)}</div>
                                    <div>
                                        <CardTitle className="text-lg">{equipment.name}</CardTitle>
                                        <CardDescription>
                                            {equipment.type === 'weapon' && '武器'}
                                            {equipment.type === 'armor' && '防具'}
                                            {equipment.type === 'accessory' && '饰品'}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge className={getRarityColor(equipment.rarity)}>
                                        {equipment.rarity}
                                    </Badge>
                                    <Badge variant="outline">Lv.{equipment.level}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Stats */}
                            <div className="rounded-lg border p-3">
                                <div className="text-sm text-muted-foreground mb-2">属性</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(equipment.stats).map(([stat, value]) => (
                                        <div key={stat} className="flex justify-between">
                                            <span className="text-sm text-muted-foreground capitalize">{stat}:</span>
                                            <span className="text-sm font-semibold">+{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Equipped Status */}
                            {equipment.equippedBy ? (
                                <Badge variant="secondary" className="w-full justify-center">
                                    已装备
                                </Badge>
                            ) : (
                                <Button variant="outline" className="w-full">
                                    装备
                                </Button>
                            )}

                            {/* Enhance Button */}
                            {equipment.level < equipment.maxLevel && (
                                <Button className="w-full">
                                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                                    强化
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredEquipment.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">未找到匹配的装备</p>
                </div>
            )}
        </div>
    );
}
