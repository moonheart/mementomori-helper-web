import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockCharacters } from '@/mocks/data';
import type { Character } from '@/mocks/types';
import { Search, Filter, Grid, List } from 'lucide-react';

export function CharactersPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');

    const filteredCharacters = mockCharacters.filter(char => {
        const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
        const matchesRarity = selectedRarity === 'all' || char.rarity === selectedRarity;
        return matchesSearch && matchesRarity;
    });

    const getElementColor = (element: string) => {
        const colors = {
            fire: 'text-red-500',
            water: 'text-blue-500',
            wind: 'text-green-500',
            earth: 'text-yellow-600',
            light: 'text-yellow-400',
            dark: 'text-purple-500'
        };
        return colors[element as keyof typeof colors] || 'text-gray-500';
    };

    const getRarityColor = (rarity: string) => {
        const colors = {
            SR: 'bg-blue-500',
            SSR: 'bg-purple-500',
            UR: 'bg-yellow-500'
        };
        return colors[rarity as keyof typeof colors] || 'bg-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">角色管理</h1>
                <p className="text-muted-foreground">管理和强化你的角色</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="搜索角色..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Tabs value={selectedRarity} onValueChange={setSelectedRarity}>
                    <TabsList>
                        <TabsTrigger value="all">全部</TabsTrigger>
                        <TabsTrigger value="UR">UR</TabsTrigger>
                        <TabsTrigger value="SSR">SSR</TabsTrigger>
                        <TabsTrigger value="SR">SR</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Characters Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCharacters.map((character) => (
                        <Card key={character.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            <div className={`h-48 ${getRarityColor(character.rarity)} bg-gradient-to-br flex items-center justify-center relative`}>
                                <div className="absolute top-4 right-4">
                                    <Badge className={getRarityColor(character.rarity)}>{character.rarity}</Badge>
                                </div>
                                <div className="text-6xl">👤</div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{character.name}</CardTitle>
                                    <Badge variant="outline">Lv.{character.level}</Badge>
                                </div>
                                <CardDescription className={getElementColor(character.element)}>
                                    {character.element.toUpperCase()} • {character.role.toUpperCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">HP</div>
                                        <div className="font-semibold">{character.stats.hp.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">ATK</div>
                                        <div className="font-semibold">{character.stats.atk.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">DEF</div>
                                        <div className="font-semibold">{character.stats.def.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">SPD</div>
                                        <div className="font-semibold">{character.stats.spd}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCharacters.map((character) => (
                        <Card key={character.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="flex items-center gap-6 p-6">
                                <div className={`h-24 w-24 rounded-lg ${getRarityColor(character.rarity)} bg-gradient-to-br flex items-center justify-center text-4xl shrink-0`}>
                                    👤
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{character.name}</h3>
                                        <Badge className={getRarityColor(character.rarity)}>{character.rarity}</Badge>
                                        <Badge variant="outline">Lv.{character.level}</Badge>
                                        <span className={`text-sm ${getElementColor(character.element)}`}>
                                            {character.element.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        <div>
                                            <div className="text-sm text-muted-foreground">HP</div>
                                            <div className="text-lg font-semibold">{character.stats.hp.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">ATK</div>
                                            <div className="text-lg font-semibold">{character.stats.atk.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">DEF</div>
                                            <div className="text-lg font-semibold">{character.stats.def.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">SPD</div>
                                            <div className="text-lg font-semibold">{character.stats.spd}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {filteredCharacters.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">未找到匹配的角色</p>
                </div>
            )}
        </div>
    );
}
