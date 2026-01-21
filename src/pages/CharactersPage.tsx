import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockCharacters } from '@/mocks/data';
import type { Character } from '@/mocks/types';
import { Search, Grid, List, Swords, Zap, BookOpen, TrendingUp, Lock, Star, ArrowUp, Shield, Sparkles, Users, ChevronRight, Heart } from 'lucide-react';

export function CharactersPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [selectedElement, setSelectedElement] = useState<string>('all');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const filteredCharacters = mockCharacters.filter(char => {
        const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
        const matchesRarity = selectedRarity === 'all' || char.rarity === selectedRarity;
        const matchesElement = selectedElement === 'all' || char.element === selectedElement;
        const matchesClass = selectedClass === 'all' || char.role === selectedClass;
        return matchesSearch && matchesRarity && matchesElement && matchesClass;
    });

    // 统计数据
    const stats = {
        total: mockCharacters.length,
        lrCount: mockCharacters.filter(c => c.rarity === 'LR' || c.rarity === 'UR').length,
        avgLevel: Math.round(mockCharacters.reduce((sum, c) => sum + c.level, 0) / mockCharacters.length),
        maxPower: Math.max(...mockCharacters.map(c => c.stats.hp + c.stats.atk + c.stats.def))
    };

    const getElementData = (element: string) => {
        const data = {
            fire: { name: '业红', color: 'text-red-500', bg: 'bg-red-500/10', icon: '🔥' },
            water: { name: '忧蓝', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: '💧' },
            wind: { name: '苍翠', color: 'text-green-500', bg: 'bg-green-500/10', icon: '🍃' },
            earth: { name: '流金', color: 'text-yellow-600', bg: 'bg-yellow-500/10', icon: '⚡' },
            light: { name: '天光', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: '☀️' },
            dark: { name: '幽冥', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: '🌙' }
        };
        return data[element as keyof typeof data] || { name: element, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: '❓' };
    };

    const getClassData = (role: string) => {
        const data = {
            warrior: { name: '战士', color: 'text-red-600', icon: Swords, desc: '物理攻击 • 剑' },
            mage: { name: '法师', color: 'text-purple-600', icon: BookOpen, desc: '魔法攻击 • 魔导书' },
            ranger: { name: '射手', color: 'text-green-600', icon: Zap, desc: '物理攻击 • 枪炮' }
        };
        return data[role as keyof typeof data] || { name: role, color: 'text-gray-600', icon: Swords, desc: '' };
    };

    const getRarityData = (rarity: string) => {
        const data = {
            N: { color: 'bg-gray-400', text: 'text-gray-700', max: 1 },
            R: { color: 'bg-green-500', text: 'text-green-700', max: 50 },
            'R+': { color: 'bg-green-600', text: 'text-green-700', max: 60 },
            SR: { color: 'bg-blue-500', text: 'text-blue-700', max: 80 },
            'SR+': { color: 'bg-blue-600', text: 'text-blue-700', max: 100 },
            SSR: { color: 'bg-purple-500', text: 'text-purple-700', max: 120 },
            'SSR+': { color: 'bg-purple-600', text: 'text-purple-700', max: 140 },
            UR: { color: 'bg-yellow-500', text: 'text-yellow-700', max: 180 },
            'UR+': { color: 'bg-yellow-600', text: 'text-yellow-700', max: 200 },
            LR: { color: 'bg-orange-500', text: 'text-orange-700', max: 240 }
        };
        return data[rarity as keyof typeof data] || { color: 'bg-gray-500', text: 'text-gray-700', max: 1 };
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">角色管理</h1>
                <p className="text-muted-foreground">管理和强化你的角色 • 稀有度: N → R → R+ → SR → SR+ → SSR → SSR+ → UR → UR+ → LR</p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">持有角色</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">高稀有度</p>
                                <p className="text-2xl font-bold">{stats.lrCount}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">平均等级</p>
                                <p className="text-2xl font-bold">{stats.avgLevel}</p>
                            </div>
                            <ArrowUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">最高战力</p>
                                <p className="text-2xl font-bold">{stats.maxPower.toLocaleString()}</p>
                            </div>
                            <Swords className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="搜索角色..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                            <SelectTrigger>
                                <SelectValue placeholder="稀有度" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部稀有度</SelectItem>
                                <SelectItem value="LR">LR</SelectItem>
                                <SelectItem value="UR+">UR+</SelectItem>
                                <SelectItem value="UR">UR</SelectItem>
                                <SelectItem value="SSR+">SSR+</SelectItem>
                                <SelectItem value="SSR">SSR</SelectItem>
                                <SelectItem value="SR+">SR+</SelectItem>
                                <SelectItem value="SR">SR</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedElement} onValueChange={setSelectedElement}>
                            <SelectTrigger>
                                <SelectValue placeholder="属性" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部属性</SelectItem>
                                <SelectItem value="fire">🔥 业红</SelectItem>
                                <SelectItem value="water">💧 忧蓝</SelectItem>
                                <SelectItem value="wind">🍃 苍翠</SelectItem>
                                <SelectItem value="earth">⚡ 流金</SelectItem>
                                <SelectItem value="light">☀️ 天光</SelectItem>
                                <SelectItem value="dark">🌙 幽冥</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="类型" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部类型</SelectItem>
                                <SelectItem value="warrior">⚔️ 战士</SelectItem>
                                <SelectItem value="ranger">🏹 射手</SelectItem>
                                <SelectItem value="mage">📖 法师</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            找到 {filteredCharacters.length} 个角色
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="h-4 w-4 mr-2" />
                                网格
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4 mr-2" />
                                列表
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Characters Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCharacters.map((character) => {
                        const elementData = getElementData(character.element);
                        const classData = getClassData(character.role);
                        const rarityData = getRarityData(character.rarity);
                        const ClassIcon = classData.icon;

                        const handleCardClick = () => {
                            setSelectedCharacter(character);
                            setDetailDialogOpen(true);
                        };

                        return (
                            <Card key={character.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
                                <div className={`h-40 ${rarityData.color} bg-gradient-to-br flex items-center justify-center relative`}>
                                    <div className="absolute top-3 left-3">
                                        <Badge className={rarityData.color}>{character.rarity}</Badge>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="outline" className="bg-white/90">Lv.{character.level}</Badge>
                                    </div>
                                    <div className="text-6xl">👤</div>
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                                        <span className="text-2xl">{elementData.icon}</span>
                                        <ClassIcon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">{character.name}</CardTitle>
                                    <CardDescription>
                                        <span className={classData.color}>{classData.name}</span> • <span className={elementData.color}>{elementData.name}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <div className="text-muted-foreground text-xs">生命值</div>
                                            <div className="font-semibold">{character.stats.hp.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">攻击力</div>
                                            <div className="font-semibold">{character.stats.atk.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">防御力</div>
                                            <div className="font-semibold">{character.stats.def.toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">速度</div>
                                            <div className="font-semibold">{character.stats.spd}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">等级进度</span>
                                            <span className="font-medium">{character.level}/{rarityData.max}</span>
                                        </div>
                                        <Progress value={(character.level / rarityData.max) * 100} className="h-1.5" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCharacters.map((character) => {
                        const elementData = getElementData(character.element);
                        const classData = getClassData(character.role);
                        const rarityData = getRarityData(character.rarity);
                        const ClassIcon = classData.icon;

                        const handleCardClick = () => {
                            setSelectedCharacter(character);
                            setDetailDialogOpen(true);
                        };

                        return (
                            <Card key={character.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
                                <CardContent className="flex items-center gap-6 p-6">
                                    <div className={`h-28 w-28 rounded-lg ${rarityData.color} bg-gradient-to-br flex items-center justify-center text-4xl shrink-0 relative`}>
                                        <div className="absolute top-2 right-2">
                                            <span className="text-lg">{elementData.icon}</span>
                                        </div>
                                        👤
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="text-xl font-bold">{character.name}</h3>
                                            <Badge className={rarityData.color}>{character.rarity}</Badge>
                                            <Badge variant="outline">Lv.{character.level}/{rarityData.max}</Badge>
                                            <div className="flex items-center gap-1.5">
                                                <ClassIcon className={`h-4 w-4 ${classData.color}`} />
                                                <span className={`text-sm ${classData.color}`}>{classData.name}</span>
                                            </div>
                                            <span className={`text-sm ${elementData.color}`}>
                                                {elementData.icon} {elementData.name}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-4 mt-3">
                                            <div>
                                                <div className="text-xs text-muted-foreground">生命值</div>
                                                <div className="text-lg font-semibold">{character.stats.hp.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">攻击力</div>
                                                <div className="text-lg font-semibold">{character.stats.atk.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">防御力</div>
                                                <div className="text-lg font-semibold">{character.stats.def.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">速度</div>
                                                <div className="text-lg font-semibold">{character.stats.spd}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">进度</div>
                                                <Progress value={(character.level / rarityData.max) * 100} className="h-2 mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm">强化</Button>
                                        <Button size="sm" variant="outline">详情</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {filteredCharacters.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">未找到匹配的角色</p>
                        <p className="text-sm text-muted-foreground mt-2">尝试调整筛选条件</p>
                    </CardContent>
                </Card>
            )}

            {/* Character Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedCharacter && (() => {
                        const elementData = getElementData(selectedCharacter.element);
                        const classData = getClassData(selectedCharacter.role);
                        const rarityData = getRarityData(selectedCharacter.rarity);
                        const ClassIcon = classData.icon;

                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-start gap-6">
                                        <div className={`h-32 w-32 rounded-lg ${rarityData.color} bg-gradient-to-br flex items-center justify-center text-6xl shrink-0 relative`}>
                                            <div className="absolute top-2 left-2">
                                                <Badge className={rarityData.color}>{selectedCharacter.rarity}</Badge>
                                            </div>
                                            <div className="absolute bottom-2 right-2">
                                                <span className="text-2xl">{elementData.icon}</span>
                                            </div>
                                            👤
                                        </div>
                                        <div className="flex-1">
                                            <DialogTitle className="text-3xl mb-2">{selectedCharacter.name}</DialogTitle>
                                            <DialogDescription asChild>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <ClassIcon className={`h-5 w-5 ${classData.color}`} />
                                                            <span className={classData.color}>{classData.name}</span>
                                                        </div>
                                                        <span>•</span>
                                                        <span className={elementData.color}>{elementData.icon} {elementData.name}</span>
                                                        <span>•</span>
                                                        <Badge variant="outline">Lv.{selectedCharacter.level}/{rarityData.max}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{classData.desc}</p>
                                                </div>
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <Tabs defaultValue="overview" className="mt-6">
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="overview">概览</TabsTrigger>
                                        <TabsTrigger value="equipment">装备</TabsTrigger>
                                        <TabsTrigger value="evolution">进化</TabsTrigger>
                                        <TabsTrigger value="bonding">羁绊</TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">能力数值</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">生命值 (HP)</div>
                                                        <div className="text-2xl font-bold">{selectedCharacter.stats.hp.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">攻击力 (ATK)</div>
                                                        <div className="text-2xl font-bold">{selectedCharacter.stats.atk.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">防御力 (DEF)</div>
                                                        <div className="text-2xl font-bold">{selectedCharacter.stats.def.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">速度 (SPD)</div>
                                                        <div className="text-2xl font-bold">{selectedCharacter.stats.spd}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Sparkles className="h-5 w-5 text-yellow-500" />
                                                    技能
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge>主动技能</Badge>
                                                        <span className="font-semibold">神圣之光</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">对单体敌人造成150%攻击力的伤害,并附加3回合的灼烧效果。</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">被动技能</Badge>
                                                        <span className="font-semibold">元素精通</span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">战斗开始时,提升全体友军{elementData.name}属性伤害15%。</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">等级进度</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">当前等级</span>
                                                    <span className="font-medium">{selectedCharacter.level} / {rarityData.max}</span>
                                                </div>
                                                <Progress value={(selectedCharacter.level / rarityData.max) * 100} className="h-2" />
                                                <p className="text-xs text-muted-foreground">
                                                    提升等级可以增强角色的各项能力数值
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Equipment Tab */}
                                    <TabsContent value="equipment" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Shield className="h-5 w-5" />
                                                    装备槽位
                                                </CardTitle>
                                                <CardDescription>装备武具可大幅提升角色战力</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid gap-4">
                                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                                        <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-2xl">
                                                            ⚔️
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">武器: {classData.name === '战士' ? '烈焰之剑' : classData.name === '法师' ? '元素魔导书' : '风暴长枪'}</div>
                                                            <div className="text-sm text-muted-foreground">攻击力 +{Math.floor(selectedCharacter.stats.atk * 0.2)}</div>
                                                            <Badge variant="outline" className="mt-1">Lv.{selectedCharacter.level}</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                                        <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">
                                                            🛡️
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">防具: 守护之铠</div>
                                                            <div className="text-sm text-muted-foreground">防御力 +{Math.floor(selectedCharacter.stats.def * 0.2)}, 生命值 +{Math.floor(selectedCharacter.stats.hp * 0.1)}</div>
                                                            <Badge variant="outline" className="mt-1">Lv.{selectedCharacter.level}</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                                        <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                                                            💎
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold">饰品: {elementData.name}之护符</div>
                                                            <div className="text-sm text-muted-foreground">{elementData.name}属性伤害 +15%, 速度 +{Math.floor(selectedCharacter.stats.spd * 0.1)}</div>
                                                            <Badge variant="outline" className="mt-1">Lv.{selectedCharacter.level}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Evolution Tab */}
                                    <TabsContent value="evolution" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                                    进化路径
                                                </CardTitle>
                                                <CardDescription>使用相同角色或同属性角色作为材料进行进化</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>稀有度进化路径:</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {['N', 'R', 'R+', 'SR', 'SR+', 'SSR', 'SSR+', 'UR', 'UR+', 'LR'].map((rarity, idx) => {
                                                            const isCurrentOrPast = ['N', 'R', 'R+', 'SR', 'SR+', 'SSR', 'SSR+', 'UR', 'UR+', 'LR'].indexOf(selectedCharacter.rarity) >= idx;
                                                            const isCurrent = rarity === selectedCharacter.rarity;
                                                            return (
                                                                <div key={rarity} className="flex items-center gap-2">
                                                                    <Badge
                                                                        className={`${getRarityData(rarity).color} ${isCurrent ? 'ring-2 ring-offset-2 ring-yellow-500' : ''} ${!isCurrentOrPast && 'opacity-30'}`}
                                                                    >
                                                                        {rarity}
                                                                    </Badge>
                                                                    {idx < 9 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="bg-muted p-4 rounded-lg mt-4">
                                                        <div className="text-sm font-semibold mb-2">下一阶段进化需求</div>
                                                        {selectedCharacter.rarity === 'LR' ? (
                                                            <p className="text-sm text-muted-foreground">已达到最高稀有度</p>
                                                        ) : (
                                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                                <p>• 消耗1个相同{selectedCharacter.rarity}角色</p>
                                                                <p>• 或消耗5个同属性{selectedCharacter.rarity}角色</p>
                                                                <p>• 金币: 500,000</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Bonding Tab */}
                                    <TabsContent value="bonding" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-blue-500" />
                                                    等级联结
                                                </CardTitle>
                                                <CardDescription>将角色放入等级联结栏位可快速强化</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                        <span className="text-sm text-muted-foreground">联结状态</span>
                                                        <Badge variant="outline">未联结</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        将角色设置为等级联结对象,可提升至基石角色的最低等级。
                                                        基石角色为队伍中等级最高的5名角色。
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Heart className="h-5 w-5 text-pink-500" />
                                                    最爱
                                                </CardTitle>
                                                <CardDescription>可将角色设为最爱,最多可设置5名</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                        <span className="text-sm text-muted-foreground">最爱状态</span>
                                                        <Badge variant="outline">未设置</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        设为最爱的角色将出现在主页,并播放该角色的抒情诗作为主页BGM。
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex gap-3 mt-6">
                                    <Button className="flex-1" size="lg">
                                        <Star className="h-4 w-4 mr-2" />
                                        强化
                                    </Button>
                                    <Button className="flex-1" variant="outline" size="lg">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        进化
                                    </Button>
                                    <Button className="flex-1" variant="outline" size="lg">
                                        <Shield className="h-4 w-4 mr-2" />
                                        装备
                                    </Button>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
