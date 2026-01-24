import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Grid, List, Swords, Zap, BookOpen, TrendingUp, Star, ArrowUp, Shield, Sparkles, Users, ChevronRight, Loader2 } from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { ortegaApi } from '@/api/ortega-client';
import { useMasterStore } from '@/store/masterStore';
import { useLocalizationStore } from '@/store/localization-store';
import { UserCharacterDtoInfo, CharacterRarityFlags, ElementType, JobFlags, CharacterMB } from '@/api/generated';

// 扩展类型，用于在 UI 中合并数据
interface UICharacter extends UserCharacterDtoInfo {
    master?: CharacterMB;
    name: string;
    element: ElementType;
    job: JobFlags;
}

export function CharactersPage() {
    const { currentAccountId } = useAccountStore();
    const t = useLocalizationStore(state => state.t);
    const getTable = useMasterStore(state => state.getTable);

    const [loading, setLoading] = useState(false);
    const [userCharacters, setUserCharacters] = useState<UserCharacterDtoInfo[]>([]);
    const [characterMasterMap, setCharacterMasterMap] = useState<Record<number, CharacterMB>>({});
    
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [selectedRarity, setSelectedRarity] = useState<string>('all');
    const [selectedElement, setSelectedElement] = useState<string>('all');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedCharacter, setSelectedCharacter] = useState<UICharacter | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    // 获取数据
    useEffect(() => {
        if (!currentAccountId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. 获取用户角色
                const userData = await ortegaApi.user.getUserData({});
                const chars = userData.userSyncData?.userCharacterDtoInfos || [];
                setUserCharacters(chars);

                // 2. 获取 Master 数据
                const masterTable = await getTable<CharacterMB>('CharacterTable');
                const masterMap: Record<number, CharacterMB> = {};
                masterTable.forEach((m) => {
                    masterMap[m.id] = m;
                });
                setCharacterMasterMap(masterMap);
            } catch (error) {
                console.error('Failed to fetch character data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentAccountId, getTable]);

    // 合并数据并翻译
    const characters: UICharacter[] = useMemo(() => {
        return userCharacters.map(char => {
            const master = characterMasterMap[char.characterId];
            return {
                ...char,
                master,
                name: master ? t(master.nameKey) : `Character ${char.characterId}`,
                element: master?.elementType ?? ElementType.None,
                job: master?.jobFlags ?? JobFlags.None
            };
        });
    }, [userCharacters, characterMasterMap, t]);

    // 过滤和排序逻辑
    const filteredCharacters = useMemo(() => {
        const filtered = characters.filter(char => {
            const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
            
            let matchesRarity = true;
            if (selectedRarity !== 'all') {
                const rarityValue = parseInt(selectedRarity);
                matchesRarity = char.rarityFlags === rarityValue;
            }

            let matchesElement = true;
            if (selectedElement !== 'all') {
                const elementValue = parseInt(selectedElement);
                matchesElement = char.element === elementValue;
            }

            let matchesClass = true;
            if (selectedClass !== 'all') {
                const classValue = parseInt(selectedClass);
                // JobFlags 是位标志，但单角色通常只有一个职业
                matchesClass = (char.job & classValue) !== 0;
            }

            return matchesSearch && matchesRarity && matchesElement && matchesClass;
        });

        // 排序方式: 等级优先 + 稀有度优先
        return [...filtered].sort((a, b) => {
            // 1. 等级降序
            if (b.level !== a.level) {
                return b.level - a.level;
            }
            // 2. 稀有度降序
            return (b.rarityFlags || 0) - (a.rarityFlags || 0);
        });
    }, [characters, search, selectedRarity, selectedElement, selectedClass]);

    // 统计数据
    const stats = useMemo(() => {
        if (characters.length === 0) return { total: 0, highRarityCount: 0, avgLevel: 0, maxLevel: 0 };
        return {
            total: characters.length,
            highRarityCount: characters.filter(c => c.rarityFlags >= CharacterRarityFlags.SSR).length,
            avgLevel: Math.round(characters.reduce((sum, c) => sum + c.level, 0) / characters.length),
            maxLevel: Math.max(...characters.map(c => c.level))
        };
    }, [characters]);

    const getElementData = (element: ElementType) => {
        const data: Record<number, { name: string, color: string, bg: string, icon: string }> = {
            [ElementType.Red]: { name: '业红', color: 'text-red-500', bg: 'bg-red-500/10', icon: '🔥' },
            [ElementType.Blue]: { name: '忧蓝', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: '💧' },
            [ElementType.Green]: { name: '苍翠', color: 'text-green-500', bg: 'bg-green-500/10', icon: '🍃' },
            [ElementType.Yellow]: { name: '流金', color: 'text-yellow-600', bg: 'bg-yellow-500/10', icon: '⚡' },
            [ElementType.Light]: { name: '天光', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: '☀️' },
            [ElementType.Dark]: { name: '幽冥', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: '🌙' }
        };
        return data[element] || { name: '无', color: 'text-gray-500', bg: 'bg-gray-500/10', icon: '❓' };
    };

    const getJobData = (job: JobFlags) => {
        if (job & JobFlags.Warrior) return { name: '战士', color: 'text-red-600', icon: Swords, desc: '物理攻击 • 剑' };
        if (job & JobFlags.Sniper) return { name: '射手', color: 'text-green-600', icon: Zap, desc: '物理攻击 • 枪炮' };
        if (job & JobFlags.Sorcerer) return { name: '法师', color: 'text-purple-600', icon: BookOpen, desc: '魔法攻击 • 魔导书' };
        return { name: '未知', color: 'text-gray-600', icon: Swords, desc: '' };
    };

    const getRarityData = (rarity: CharacterRarityFlags) => {
        const data: Partial<Record<CharacterRarityFlags, { name: string, color: string, text: string, max: number }>> = {
            [CharacterRarityFlags.N]: { name: 'N', color: 'bg-gray-400', text: 'text-gray-700', max: 20 },
            [CharacterRarityFlags.R]: { name: 'R', color: 'bg-green-500', text: 'text-green-700', max: 40 },
            [CharacterRarityFlags.RPlus]: { name: 'R+', color: 'bg-green-600', text: 'text-green-700', max: 60 },
            [CharacterRarityFlags.SR]: { name: 'SR', color: 'bg-blue-500', text: 'text-blue-700', max: 80 },
            [CharacterRarityFlags.SRPlus]: { name: 'SR+', color: 'bg-blue-600', text: 'text-blue-700', max: 100 },
            [CharacterRarityFlags.SSR]: { name: 'SSR', color: 'bg-purple-500', text: 'text-purple-700', max: 120 },
            [CharacterRarityFlags.SSRPlus]: { name: 'SSR+', color: 'bg-purple-600', text: 'text-purple-700', max: 140 },
            [CharacterRarityFlags.UR]: { name: 'UR', color: 'bg-yellow-500', text: 'text-yellow-700', max: 160 },
            [CharacterRarityFlags.URPlus]: { name: 'UR+', color: 'bg-yellow-600', text: 'text-yellow-700', max: 180 },
            [CharacterRarityFlags.LR]: { name: 'LR', color: 'bg-orange-500', text: 'text-orange-700', max: 240 }
        };
        // 简单处理 LR+
        if (rarity >= CharacterRarityFlags.LR) {
            return data[CharacterRarityFlags.LR]!;
        }
        return data[rarity] || { name: '?', color: 'bg-gray-500', text: 'text-gray-700', max: 1 };
    };

    if (!currentAccountId) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>未登录</CardTitle>
                        <CardDescription>请先登录账户以查看角色信息</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (loading && characters.length === 0) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">加载角色数据中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">角色管理</h1>
                <p className="text-muted-foreground">管理和强化你的角色 • 稀有度: N → R → SR → SSR → UR → LR</p>
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
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">SSR及以上</p>
                                <p className="text-2xl font-bold">{stats.highRarityCount}</p>
                            </div>
                            <Star className="h-8 w-8 text-yellow-500" />
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
                                <p className="text-sm text-muted-foreground">最高等级</p>
                                <p className="text-2xl font-bold">{stats.maxLevel}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-orange-500" />
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
                                placeholder="搜索角色名称..."
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
                                <SelectItem value={CharacterRarityFlags.LR.toString()}>LR</SelectItem>
                                <SelectItem value={CharacterRarityFlags.UR.toString()}>UR</SelectItem>
                                <SelectItem value={CharacterRarityFlags.SSR.toString()}>SSR</SelectItem>
                                <SelectItem value={CharacterRarityFlags.SR.toString()}>SR</SelectItem>
                                <SelectItem value={CharacterRarityFlags.R.toString()}>R</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedElement} onValueChange={setSelectedElement}>
                            <SelectTrigger>
                                <SelectValue placeholder="属性" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部属性</SelectItem>
                                <SelectItem value={ElementType.Red.toString()}>🔥 业红</SelectItem>
                                <SelectItem value={ElementType.Blue.toString()}>💧 忧蓝</SelectItem>
                                <SelectItem value={ElementType.Green.toString()}>🍃 苍翠</SelectItem>
                                <SelectItem value={ElementType.Yellow.toString()}>⚡ 流金</SelectItem>
                                <SelectItem value={ElementType.Light.toString()}>☀️ 天光</SelectItem>
                                <SelectItem value={ElementType.Dark.toString()}>🌙 幽冥</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="类型" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部类型</SelectItem>
                                <SelectItem value={JobFlags.Warrior.toString()}>⚔️ 战士</SelectItem>
                                <SelectItem value={JobFlags.Sniper.toString()}>🏹 射手</SelectItem>
                                <SelectItem value={JobFlags.Sorcerer.toString()}>📖 法师</SelectItem>
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
                        const jobData = getJobData(character.job);
                        const rarityData = getRarityData(character.rarityFlags);
                        const JobIcon = jobData.icon;

                        const handleCardClick = () => {
                            setSelectedCharacter(character);
                            setDetailDialogOpen(true);
                        };

                        return (
                            <Card key={character.guid} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
                                <div className={`h-40 ${rarityData.color} bg-gradient-to-br flex items-center justify-center relative`}>
                                    <div className="absolute top-3 left-3">
                                        <Badge className={rarityData.color}>{rarityData.name}</Badge>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="outline" className="bg-white/90">Lv.{character.level}</Badge>
                                    </div>
                                    <div className="text-6xl opacity-80">👤</div>
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                                        <span className="text-2xl">{elementData.icon}</span>
                                        <JobIcon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg truncate">{character.name}</CardTitle>
                                    <CardDescription>
                                        <span className={jobData.color}>{jobData.name}</span> • <span className={elementData.color}>{elementData.name}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">等级进度</span>
                                            <span className="font-medium">{character.level}/{rarityData.max}</span>
                                        </div>
                                        <Progress value={Math.min((character.level / rarityData.max) * 100, 100)} className="h-1.5" />
                                    </div>
                                    {character.isLocked && (
                                        <div className="flex justify-end">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCharacters.map((character) => {
                        const elementData = getElementData(character.element);
                        const jobData = getJobData(character.job);
                        const rarityData = getRarityData(character.rarityFlags);
                        const JobIcon = jobData.icon;

                        const handleCardClick = () => {
                            setSelectedCharacter(character);
                            setDetailDialogOpen(true);
                        };

                        return (
                            <Card key={character.guid} className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
                                <CardContent className="flex items-center gap-6 p-6">
                                    <div className={`h-20 w-20 rounded-lg ${rarityData.color} bg-gradient-to-br flex items-center justify-center text-3xl shrink-0 relative`}>
                                        <div className="absolute top-1 right-1">
                                            <span className="text-sm">{elementData.icon}</span>
                                        </div>
                                        👤
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="text-xl font-bold truncate">{character.name}</h3>
                                            <Badge className={rarityData.color}>{rarityData.name}</Badge>
                                            <Badge variant="outline">Lv.{character.level}/{rarityData.max}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <JobIcon className={`h-4 w-4 ${jobData.color}`} />
                                                <span className={`text-sm ${jobData.color}`}>{jobData.name}</span>
                                            </div>
                                            <span className={`text-sm ${elementData.color}`}>
                                                {elementData.icon} {elementData.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">ID: {character.characterId}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">详情</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {filteredCharacters.length === 0 && !loading && (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">未找到符合条件的角色</p>
                        <p className="text-sm text-muted-foreground mt-2">尝试清除搜索或筛选条件</p>
                    </CardContent>
                </Card>
            )}

            {/* Character Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    {selectedCharacter && (() => {
                        const elementData = getElementData(selectedCharacter.element);
                        const jobData = getJobData(selectedCharacter.job);
                        const rarityData = getRarityData(selectedCharacter.rarityFlags);
                        const JobIcon = jobData.icon;
                        const master = selectedCharacter.master;

                        return (
                            <>
                                <DialogHeader>
                                    <div className="flex items-start gap-6">
                                        <div className={`h-24 w-24 rounded-lg ${rarityData.color} bg-gradient-to-br flex items-center justify-center text-5xl shrink-0 relative`}>
                                            <div className="absolute top-1 left-1">
                                                <Badge className={rarityData.color}>{rarityData.name}</Badge>
                                            </div>
                                            <div className="absolute bottom-1 right-1">
                                                <span className="text-xl">{elementData.icon}</span>
                                            </div>
                                            👤
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <DialogTitle className="text-2xl mb-1 truncate">{selectedCharacter.name}</DialogTitle>
                                            <DialogDescription asChild>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3 flex-wrap text-sm">
                                                        <div className="flex items-center gap-1.5">
                                                            <JobIcon className={`h-4 w-4 ${jobData.color}`} />
                                                            <span className={jobData.color}>{jobData.name}</span>
                                                        </div>
                                                        <span>•</span>
                                                        <span className={elementData.color}>{elementData.icon} {elementData.name}</span>
                                                        <span>•</span>
                                                        <Badge variant="outline">Lv.{selectedCharacter.level}/{rarityData.max}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{jobData.desc}</p>
                                                </div>
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <Tabs defaultValue="overview" className="mt-6">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="overview">能力</TabsTrigger>
                                        <TabsTrigger value="skills">技能</TabsTrigger>
                                        <TabsTrigger value="evolution">进化</TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="space-y-4">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-base">基础数值系数</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {master?.baseParameterCoefficient ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                        <div>
                                                            <div className="text-xs text-muted-foreground">肌肉 (Muscle)</div>
                                                            <div className="text-lg font-bold">{(master.baseParameterCoefficient.muscle || 0).toLocaleString()}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-muted-foreground">能量 (Energy)</div>
                                                            <div className="text-lg font-bold">{(master.baseParameterCoefficient.energy || 0).toLocaleString()}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-muted-foreground">智力 (Intelligence)</div>
                                                            <div className="text-lg font-bold">{(master.baseParameterCoefficient.intelligence || 0).toLocaleString()}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-muted-foreground">健康 (Health)</div>
                                                            <div className="text-lg font-bold">{(master.baseParameterCoefficient.health || 0).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">无法获取基础数值</p>
                                                )}
                                                <div className="mt-4 pt-4 border-t space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">当前经验值</span>
                                                        <span className="font-medium">{selectedCharacter.exp.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">锁定状态</span>
                                                        <span>{selectedCharacter.isLocked ? '🔒 已锁定' : '🔓 未锁定'}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Skills Tab */}
                                    <TabsContent value="skills" className="space-y-4">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                                    技能列表
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">普通攻击</Badge>
                                                        <span className="text-sm font-semibold">ID: {master?.normalSkillId}</span>
                                                    </div>
                                                </div>
                                                {master?.activeSkillIds?.map((id: number, index: number) => (
                                                    <div key={`active-${id}`} className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge>主动技能 {index + 1}</Badge>
                                                            <span className="text-sm font-semibold">ID: {id}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {master?.passiveSkillIds?.map((id: number, index: number) => (
                                                    <div key={`passive-${id}`} className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary">被动技能 {index + 1}</Badge>
                                                            <span className="text-sm font-semibold">ID: {id}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Evolution Tab */}
                                    <TabsContent value="evolution" className="space-y-4">
                                        <Card>
                                            <CardHeader className="py-4">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                                    稀有度进度
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {[
                                                        CharacterRarityFlags.N,
                                                        CharacterRarityFlags.R,
                                                        CharacterRarityFlags.RPlus,
                                                        CharacterRarityFlags.SR,
                                                        CharacterRarityFlags.SRPlus,
                                                        CharacterRarityFlags.SSR,
                                                        CharacterRarityFlags.SSRPlus,
                                                        CharacterRarityFlags.UR,
                                                        CharacterRarityFlags.URPlus,
                                                        CharacterRarityFlags.LR
                                                    ].map((r, idx) => {
                                                        const rData = getRarityData(r);
                                                        const isCurrent = selectedCharacter.rarityFlags === r;
                                                        const isAchieved = selectedCharacter.rarityFlags >= r;
                                                        
                                                        return (
                                                            <div key={r} className="flex items-center gap-1">
                                                                <Badge 
                                                                    className={`${rData.color} ${isCurrent ? 'ring-2 ring-offset-2 ring-primary' : ''} ${!isAchieved ? 'opacity-30' : ''}`}
                                                                >
                                                                    {rData.name}
                                                                </Badge>
                                                                {idx < 9 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="mt-6 p-4 bg-muted rounded-lg border border-dashed">
                                                    <p className="text-xs text-center text-muted-foreground">更多进化详情和所需材料功能开发中...</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex gap-3 mt-6">
                                    <Button className="flex-1" disabled>
                                        强化 (开发中)
                                    </Button>
                                    <Button className="flex-1" variant="outline" onClick={() => setDetailDialogOpen(false)}>
                                        关闭
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
