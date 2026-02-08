import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCalculatedCharacterDetail } from '@/api/character-client';
import { useMasterStore } from '@/store/masterStore';
import { useLocalizationStore } from '@/store/localization-store';
import {
    ActiveSkillMB,
    BattleParameter,
    BattleParameterType,
    BaseParameterType,
    CharacterDetailInfo,
    CharacterRarityFlags,
    ElementType,
    EquipmentMB,
    EquipmentRarityFlags,
    EquipmentSlotType,
    JobFlags,
    PassiveSkillMB,
} from '@/api/generated';
import { getSlotIcon, getSlotName } from '@/lib/equipmentUtils';
import { AssetManager } from '@/lib/asset-manager';
import { BookOpen, ChevronRight, Loader2, Shield, Sparkles, Swords, TrendingUp, Zap } from 'lucide-react';
import type { UICharacter } from './types';

interface Props {
    character: UICharacter | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function getElementData(element: ElementType) {
    const data: Record<number, { name: string; color: string; icon: string }> = {
        [ElementType.Red]: { name: '业红', color: 'text-red-500', icon: '🔥' },
        [ElementType.Blue]: { name: '忧蓝', color: 'text-blue-500', icon: '💧' },
        [ElementType.Green]: { name: '苍翠', color: 'text-green-500', icon: '🍃' },
        [ElementType.Yellow]: { name: '流金', color: 'text-yellow-600', icon: '⚡' },
        [ElementType.Light]: { name: '天光', color: 'text-yellow-400', icon: '☀️' },
        [ElementType.Dark]: { name: '幽冥', color: 'text-purple-500', icon: '🌙' },
    };
    return data[element] || { name: '无', color: 'text-gray-500', icon: '❓' };
}

function getJobData(job: JobFlags) {
    if (job & JobFlags.Warrior) return { name: '战士', color: 'text-red-600', icon: Swords, desc: '物理攻击 • 剑' };
    if (job & JobFlags.Sniper) return { name: '射手', color: 'text-green-600', icon: Zap, desc: '物理攻击 • 枪炮' };
    if (job & JobFlags.Sorcerer) return { name: '法师', color: 'text-purple-600', icon: BookOpen, desc: '魔法攻击 • 魔导书' };
    return { name: '未知', color: 'text-gray-600', icon: Swords, desc: '' };
}

function getRarityData(rarity: CharacterRarityFlags) {
    const data: Partial<Record<CharacterRarityFlags, { name: string; color: string; max: number }>> = {
        [CharacterRarityFlags.N]: { name: 'N', color: 'bg-gray-400', max: 20 },
        [CharacterRarityFlags.R]: { name: 'R', color: 'bg-green-500', max: 40 },
        [CharacterRarityFlags.RPlus]: { name: 'R+', color: 'bg-green-600', max: 60 },
        [CharacterRarityFlags.SR]: { name: 'SR', color: 'bg-blue-500', max: 80 },
        [CharacterRarityFlags.SRPlus]: { name: 'SR+', color: 'bg-blue-600', max: 100 },
        [CharacterRarityFlags.SSR]: { name: 'SSR', color: 'bg-purple-500', max: 120 },
        [CharacterRarityFlags.SSRPlus]: { name: 'SSR+', color: 'bg-purple-600', max: 140 },
        [CharacterRarityFlags.UR]: { name: 'UR', color: 'bg-yellow-500', max: 160 },
        [CharacterRarityFlags.URPlus]: { name: 'UR+', color: 'bg-yellow-600', max: 180 },
        [CharacterRarityFlags.LR]: { name: 'LR', color: 'bg-orange-500', max: 240 },
    };
    if (rarity >= CharacterRarityFlags.LR) return data[CharacterRarityFlags.LR]!;
    return data[rarity] || { name: '?', color: 'bg-gray-500', max: 1 };
}

const PERCENT_KEYS: Array<keyof BattleParameter> = [
    'critical', 'criticalResist', 'criticalDamageEnhance', 'physicalDamageRelax', 'magicDamageRelax',
    'physicalCriticalDamageRelax', 'magicCriticalDamageRelax', 'damageEnhance', 'debuffHit',
    'debuffResist', 'damageReflect', 'hpDrain',
];

const BASE_PARAMETER_CONFIG: Array<{ type: BaseParameterType; label: string; key: 'muscle' | 'energy' | 'intelligence' | 'health' }> = [
    { type: BaseParameterType.Muscle, label: '力量', key: 'muscle' },
    { type: BaseParameterType.Energy, label: '能量', key: 'energy' },
    { type: BaseParameterType.Intelligence, label: '智力', key: 'intelligence' },
    { type: BaseParameterType.Health, label: '健康', key: 'health' },
];

const BATTLE_PARAMETER_CONFIG: Array<{ type: BattleParameterType; label: string; key: keyof BattleParameter }> = [
    { type: BattleParameterType.Hp, label: '生命', key: 'hP' },
    { type: BattleParameterType.AttackPower, label: '攻击力', key: 'attackPower' },
    { type: BattleParameterType.PhysicalDamageRelax, label: '物理伤害缓和', key: 'physicalDamageRelax' },
    { type: BattleParameterType.MagicDamageRelax, label: '魔法伤害缓和', key: 'magicDamageRelax' },
    { type: BattleParameterType.Hit, label: '命中', key: 'hit' },
    { type: BattleParameterType.Avoidance, label: '闪避', key: 'avoidance' },
    { type: BattleParameterType.Critical, label: '暴击', key: 'critical' },
    { type: BattleParameterType.CriticalResist, label: '暴击抗性', key: 'criticalResist' },
    { type: BattleParameterType.CriticalDamageEnhance, label: '暴击伤害强化', key: 'criticalDamageEnhance' },
    { type: BattleParameterType.PhysicalCriticalDamageRelax, label: '物理暴击伤害缓和', key: 'physicalCriticalDamageRelax' },
    { type: BattleParameterType.MagicCriticalDamageRelax, label: '魔法暴击伤害缓和', key: 'magicCriticalDamageRelax' },
    { type: BattleParameterType.DefensePenetration, label: '防御穿透', key: 'defensePenetration' },
    { type: BattleParameterType.Defense, label: '防御力', key: 'defense' },
    { type: BattleParameterType.DamageEnhance, label: '伤害强化', key: 'damageEnhance' },
    { type: BattleParameterType.DebuffHit, label: '弱化命中', key: 'debuffHit' },
    { type: BattleParameterType.DebuffResist, label: '弱化抗性', key: 'debuffResist' },
    { type: BattleParameterType.DamageReflect, label: '伤害反射', key: 'damageReflect' },
    { type: BattleParameterType.HpDrain, label: '吸血', key: 'hpDrain' },
    { type: BattleParameterType.Speed, label: '速度', key: 'speed' },
];

function formatBattleStatValue(key: keyof BattleParameter, value: number): string {
    return PERCENT_KEYS.includes(key) ? `${(value / 100).toFixed(1)}%` : value.toLocaleString();
}

function getHpValue(battleParameter: BattleParameter | undefined): number {
    if (!battleParameter) return 0;
    const hpFromModel = battleParameter.hP;
    const hpFromPayload = (battleParameter as unknown as { hp?: number }).hp;
    return hpFromModel ?? hpFromPayload ?? 0;
}

function getBattleValue(battleParameter: BattleParameter | undefined, key: keyof BattleParameter): number {
    if (!battleParameter) return 0;
    if (key === 'hP') return getHpValue(battleParameter);
    return battleParameter[key] ?? 0;
}

function getEquipmentRarity(rarity: EquipmentRarityFlags): { name: string; cls: string } {
    if (rarity >= EquipmentRarityFlags.LR) return { name: 'LR', cls: 'bg-orange-500' };
    if (rarity >= EquipmentRarityFlags.UR) return { name: 'UR', cls: 'bg-yellow-500' };
    if (rarity >= EquipmentRarityFlags.SSR) return { name: 'SSR', cls: 'bg-purple-600' };
    if (rarity >= EquipmentRarityFlags.SR) return { name: 'SR', cls: 'bg-blue-600' };
    if (rarity >= EquipmentRarityFlags.R) return { name: 'R', cls: 'bg-green-600' };
    return { name: 'N', cls: 'bg-gray-500' };
}

export function CharacterDetailDialog({ character, open, onOpenChange }: Props) {
    const t = useLocalizationStore(state => state.t);
    const getTable = useMasterStore(state => state.getTable);
    const [detailInfo, setDetailInfo] = useState<CharacterDetailInfo | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [abilityDialogOpen, setAbilityDialogOpen] = useState(false);
    const [equipmentMasterMap, setEquipmentMasterMap] = useState<Record<number, EquipmentMB>>({});
    const [activeSkillMap, setActiveSkillMap] = useState<Record<number, ActiveSkillMB>>({});
    const [passiveSkillMap, setPassiveSkillMap] = useState<Record<number, PassiveSkillMB>>({});

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            getTable<EquipmentMB>('EquipmentTable'),
            getTable<ActiveSkillMB>('ActiveSkillTable'),
            getTable<PassiveSkillMB>('PassiveSkillTable'),
        ]).then(([eqTable, activeTable, passiveTable]) => {
            if (cancelled) return;
            const eqMap: Record<number, EquipmentMB> = {};
            eqTable.forEach(x => { eqMap[x.id] = x; });
            setEquipmentMasterMap(eqMap);
            const aMap: Record<number, ActiveSkillMB> = {};
            activeTable.forEach(x => { aMap[x.id] = x; });
            setActiveSkillMap(aMap);
            const pMap: Record<number, PassiveSkillMB> = {};
            passiveTable.forEach(x => { pMap[x.id] = x; });
            setPassiveSkillMap(pMap);
        }).catch(error => {
            console.error('Failed to load detail master data:', error);
        });
        return () => { cancelled = true; };
    }, [getTable]);

    useEffect(() => {
        if (!open || !character) return;
        let cancelled = false;
        const fetchDetail = async () => {
            setDetailLoading(true);
            setDetailError(null);
            try {
                const res = await getCalculatedCharacterDetail(character.guid);
                if (cancelled) return;
                const info = res ?? null;
                setDetailInfo(info);
                if (!info) setDetailError('未获取到该角色详细数据');
            } catch (error) {
                console.error('Failed to fetch character detail:', error);
                if (!cancelled) {
                    setDetailInfo(null);
                    setDetailError('获取角色详细数据失败');
                }
            } finally {
                if (!cancelled) setDetailLoading(false);
            }
        };
        fetchDetail();
        return () => { cancelled = true; };
    }, [character, open]);

    const elementData = character ? getElementData(character.element) : null;
    const jobData = character ? getJobData(character.job) : null;
    const rarityData = character ? getRarityData(character.rarityFlags) : null;
    const JobIcon = jobData?.icon ?? Swords;

    const potentialStats = useMemo(() => {
        const base = detailInfo?.baseParameter ?? character?.master?.baseParameterCoefficient;
        if (!base) return [];
        return BASE_PARAMETER_CONFIG
            .sort((a, b) => a.type - b.type)
            .map(config => ({ label: config.label, value: base[config.key] ?? 0 }));
    }, [character?.master?.baseParameterCoefficient, detailInfo?.baseParameter]);

    const battleStats = useMemo(() => {
        if (!detailInfo?.battleParameter) return [] as Array<{ key: keyof BattleParameter; label: string; value: number }>;
        const bp = detailInfo.battleParameter;
        return BATTLE_PARAMETER_CONFIG
            .sort((a, b) => a.type - b.type)
            .map(config => {
                if (config.key === 'hP') {
                    return { key: config.key, label: config.label, value: getHpValue(bp) };
                }
                return { key: config.key, label: config.label, value: bp[config.key] ?? 0 };
            });
    }, [detailInfo]);

    const potentialDetailGroups = useMemo(() => {
        const base = detailInfo?.baseParameter ?? character?.master?.baseParameterCoefficient;
        const bp = detailInfo?.battleParameter;
        if (!base || !bp) return [];

        return [
            {
                title: '力量',
                value: base.muscle ?? 0,
                left: { label: '物理防御力', value: getBattleValue(bp, 'physicalDamageRelax') },
                right: { label: '攻击力', value: getBattleValue(bp, 'attackPower') },
                rightSub: { label: '命中', value: getBattleValue(bp, 'hit') },
            },
            {
                title: '战技',
                value: base.energy ?? 0,
                left: { label: '闪避', value: getBattleValue(bp, 'avoidance') },
                right: { label: '暴击', value: getBattleValue(bp, 'critical') },
            },
            {
                title: '魔力',
                value: base.intelligence ?? 0,
                left: { label: '魔法防御力', value: getBattleValue(bp, 'magicDamageRelax') },
                right: { label: '弱化效果命中', value: getBattleValue(bp, 'debuffHit') },
            },
            {
                title: '耐力',
                value: base.health ?? 0,
                left: { label: '生命', value: getBattleValue(bp, 'hP') },
                right: { label: '暴击抗性', value: getBattleValue(bp, 'criticalResist') },
            },
        ];
    }, [character?.master?.baseParameterCoefficient, detailInfo?.baseParameter, detailInfo?.battleParameter]);

    const abilityBasicRows = useMemo(() => {
        const bp = detailInfo?.battleParameter;
        if (!bp) return [];
        return [
            { label: '生命', key: 'hP' as const },
            { label: '攻击力', key: 'attackPower' as const },
            { label: '防御力', key: 'defense' as const },
            { label: '防御穿透', key: 'defensePenetration' as const },
            { label: '速度', key: 'speed' as const },
        ].map(row => ({ label: row.label, value: getBattleValue(bp, row.key), key: row.key }));
    }, [detailInfo?.battleParameter]);

    const abilityAdvancedLeftGroups = useMemo(() => {
        const bp = detailInfo?.battleParameter;
        if (!bp) return [];
        return [
            [
                { label: '物魔防御穿透', value: getBattleValue(bp, 'defensePenetration') },
            ],
            [
                { label: '命中', value: getBattleValue(bp, 'hit') },
                { label: '暴击', value: getBattleValue(bp, 'critical') },
                { label: '暴击伤害强化', value: getBattleValue(bp, 'criticalDamageEnhance'), key: 'criticalDamageEnhance' as const },
            ],
            [
                { label: '弱化效果命中', value: getBattleValue(bp, 'debuffHit') },
                { label: '伤害反弹', value: getBattleValue(bp, 'damageReflect'), key: 'damageReflect' as const },
            ],
        ];
    }, [detailInfo?.battleParameter]);

    const abilityAdvancedRightGroups = useMemo(() => {
        const bp = detailInfo?.battleParameter;
        if (!bp) return [];
        return [
            [
                { label: '物理防御力', value: getBattleValue(bp, 'physicalDamageRelax') },
                { label: '魔法防御力', value: getBattleValue(bp, 'magicDamageRelax') },
            ],
            [
                { label: '闪避', value: getBattleValue(bp, 'avoidance') },
                { label: '暴击抗性', value: getBattleValue(bp, 'criticalResist') },
                { label: '物理暴击伤害降低', value: getBattleValue(bp, 'physicalCriticalDamageRelax'), key: 'physicalCriticalDamageRelax' as const },
                { label: '魔法暴击伤害降低', value: getBattleValue(bp, 'magicCriticalDamageRelax'), key: 'magicCriticalDamageRelax' as const },
            ],
            [
                { label: '弱化效果抗性', value: getBattleValue(bp, 'debuffResist') },
                { label: '吸血', value: getBattleValue(bp, 'hpDrain'), key: 'hpDrain' as const },
            ],
        ];
    }, [detailInfo?.battleParameter]);

    const equippedItems = useMemo(() => {
        if (!detailInfo?.userEquipmentDtoInfos) return [];
        return detailInfo.userEquipmentDtoInfos.map(eq => {
            const master = equipmentMasterMap[eq.equipmentId];
            const rarity = master?.rarityFlags ?? EquipmentRarityFlags.None;
            const slot = master?.slotType ?? EquipmentSlotType.Weapon;
            return { ...eq, master, rarity, slot, name: master ? t(master.nameKey) : `装备 ${eq.equipmentId}` };
        }).sort((a, b) => a.slot - b.slot);
    }, [detailInfo, equipmentMasterMap, t]);

    const getActiveSkillBaseInfo = (skill: ActiveSkillMB | undefined) => {
        if (!skill?.activeSkillInfos?.length) return null;
        return skill.activeSkillInfos.find(i => i.characterLevel === 1)
            ?? [...skill.activeSkillInfos].sort((a, b) => a.characterLevel - b.characterLevel)[0];
    };

    const getPassiveSkillBaseInfo = (skill: PassiveSkillMB | undefined) => {
        if (!skill?.passiveSkillInfos?.length) return null;
        return skill.passiveSkillInfos.find(i => i.characterLevel === 1)
            ?? [...skill.passiveSkillInfos].sort((a, b) => a.characterLevel - b.characterLevel)[0];
    };

    const getActiveSkillCooldownText = (skill: ActiveSkillMB | undefined): string => {
        if (!skill) return '--';
        const init = skill.skillInitCoolTime ?? 0;
        const max = skill.skillMaxCoolTime ?? 0;
        if (init <= 0 && max <= 0) return '无';
        if (init === max) return `${init} 回合`;
        return `${init} / ${max} 回合`;
    };

    const getPassiveSkillCooldownText = (skill: PassiveSkillMB | undefined): string => {
        if (!skill?.passiveSkillInfos?.length) return '--';
        const current = getPassiveSkillBaseInfo(skill);
        const subInfos = current?.passiveSubSetSkillInfos ?? [];
        if (subInfos.length === 0) return '无';
        const coolTimes = subInfos
            .map(x => ({ init: x.skillCoolTime ?? 0, max: x.skillMaxCoolTime ?? 0 }))
            .filter(x => x.init > 0 || x.max > 0);
        if (coolTimes.length === 0) return '无';
        const minInit = Math.min(...coolTimes.map(x => x.init));
        const maxMax = Math.max(...coolTimes.map(x => x.max));
        if (minInit === maxMax) return `${minInit} 回合`;
        return `${minInit} / ${maxMax} 回合`;
    };

    const getActiveSkillUpgrades = (skill: ActiveSkillMB | undefined) => {
        if (!skill?.activeSkillInfos?.length) return [];
        return [...skill.activeSkillInfos]
            .filter(info => info.characterLevel > 1)
            .sort((a, b) => a.characterLevel - b.characterLevel)
            .map(info => ({
                level: info.characterLevel,
                description: t(info.descriptionKey),
                unlocked: character ? character.level >= info.characterLevel : false,
            }));
    };

    const getPassiveSkillUpgrades = (skill: PassiveSkillMB | undefined) => {
        if (!skill?.passiveSkillInfos?.length) return [];
        return [...skill.passiveSkillInfos]
            .filter(info => info.characterLevel > 1)
            .sort((a, b) => a.characterLevel - b.characterLevel)
            .map(info => ({
                level: info.characterLevel,
                description: t(info.descriptionKey),
                unlocked: character ? character.level >= info.characterLevel : false,
            }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {!character || !elementData || !jobData || !rarityData ? null : (
                    <>
                        <DialogHeader>
                            <div className="flex items-start gap-6">
                                <div className="h-24 w-24 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                                    <div className="absolute top-1 left-1 z-10"><Badge className={rarityData.color}>{rarityData.name}</Badge></div>
                                    <div className="absolute bottom-1 right-1 z-10"><span className="text-xl">{elementData.icon}</span></div>
                                    <img
                                        src={AssetManager.character.getCardUrl(character.characterId)}
                                        alt={character.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <DialogTitle className="text-2xl mb-1 truncate">{character.name}</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 flex-wrap text-sm">
                                                <div className="flex items-center gap-1.5"><JobIcon className={`h-4 w-4 ${jobData.color}`} /><span className={jobData.color}>{jobData.name}</span></div>
                                                <span>•</span><span className={elementData.color}>{elementData.icon} {elementData.name}</span><span>•</span>
                                                <Badge variant="outline">Lv.{character.level}/{rarityData.max}</Badge>
                                                {detailInfo?.battlePower ? <><span>•</span><span className="font-medium">战力 {detailInfo.battlePower.toLocaleString()}</span></> : null}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{jobData.desc}</p>
                                        </div>
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <Tabs defaultValue="ability" className="mt-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="ability">能力</TabsTrigger>
                                <TabsTrigger value="equipment">装备</TabsTrigger>
                                <TabsTrigger value="skills">技能</TabsTrigger>
                                <TabsTrigger value="evolution">进化</TabsTrigger>
                            </TabsList>

                            <TabsContent value="ability" className="space-y-4">
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-base">能力信息</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {detailLoading ? (
                                            <div className="py-8 text-center text-muted-foreground">
                                                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                                正在加载能力数据...
                                            </div>
                                        ) : detailError ? (
                                            <p className="text-sm text-destructive">{detailError}</p>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {potentialStats.map(stat => (
                                                        <div key={stat.label}>
                                                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                                                            <div className="text-lg font-bold">{stat.value.toLocaleString()}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {battleStats.length > 0 ? (
                                                    <>
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                            {battleStats.slice(0, 6).map(stat => (
                                                                <div key={stat.key} className="flex justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                                                                    <span className="text-muted-foreground">{stat.label}</span>
                                                                    <span className="font-medium">{formatBattleStatValue(stat.key, stat.value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <Button variant="outline" size="sm" onClick={() => setAbilityDialogOpen(true)}>
                                                                查看能力详细信息
                                                            </Button>
                                                        </div>
                                                    </>
                                                ) : null}
                                                <div className="pt-4 border-t space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">当前经验值</span>
                                                        <span className="font-medium">{character.exp.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">锁定状态</span>
                                                        <span className="flex items-center gap-1">
                                                            <Shield className="h-3.5 w-3.5" />
                                                            {character.isLocked ? '已锁定' : '未锁定'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="equipment" className="space-y-4">
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-base">装备信息</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {detailLoading ? (
                                            <div className="py-8 text-center text-muted-foreground">
                                                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                                                正在加载装备数据...
                                            </div>
                                        ) : equippedItems.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">当前没有可展示的装备数据</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {equippedItems.map(item => {
                                                    const rarity = getEquipmentRarity(item.rarity);
                                                    return (
                                                        <div key={item.guid} className="rounded-lg border p-3">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="text-lg">{getSlotIcon(item.slot)}</span>
                                                                        <span className="font-medium truncate">{item.name}</span>
                                                                        <Badge className={rarity.cls}>{rarity.name}</Badge>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {getSlotName(item.slot)} • Lv.{item.master?.equipmentLv ?? 0} • ID {item.equipmentId}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right text-xs text-muted-foreground shrink-0">
                                                                    <div>强化 +{item.reinforcementLv ?? 0}</div>
                                                                    <div>圣装 Lv.{item.legendSacredTreasureLv ?? 0}</div>
                                                                    <div>魔装 Lv.{item.matchlessSacredTreasureLv ?? 0}</div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                                                <div className="rounded bg-muted px-2 py-1">肌肉 +{(item.additionalParameterMuscle ?? 0).toLocaleString()}</div>
                                                                <div className="rounded bg-muted px-2 py-1">能量 +{(item.additionalParameterEnergy ?? 0).toLocaleString()}</div>
                                                                <div className="rounded bg-muted px-2 py-1">智力 +{(item.additionalParameterIntelligence ?? 0).toLocaleString()}</div>
                                                                <div className="rounded bg-muted px-2 py-1">健康 +{(item.additionalParameterHealth ?? 0).toLocaleString()}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="skills" className="space-y-4">
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-yellow-500" />
                                            技能信息
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {character.master?.normalSkillId ? (
                                            <div className="rounded-lg border p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline">普通攻击</Badge>
                                                    <span className="text-sm font-medium">
                                                        {activeSkillMap[character.master.normalSkillId]
                                                            ? t(activeSkillMap[character.master.normalSkillId].nameKey)
                                                            : `技能 ${character.master.normalSkillId}`}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : null}

                                        {character.master?.activeSkillIds?.map((id, index) => {
                                            const skill = activeSkillMap[id];
                                            const info = getActiveSkillBaseInfo(skill);
                                            return (
                                                <div key={`active-${id}`} className="rounded-lg border p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge>主动技能 {index + 1}</Badge>
                                                        <span className="text-sm font-medium">{skill ? t(skill.nameKey) : `技能 ${id}`}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mb-1">
                                                        冷却回合: {getActiveSkillCooldownText(skill)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{info ? t(info.descriptionKey) : '暂无说明'}</p>
                                                    <div className="rounded bg-muted/60 px-2 py-2 text-xs space-y-1">
                                                        <div className="font-medium">技能升级效果</div>
                                                        {getActiveSkillUpgrades(skill).map((upgrade, upgradeIndex) => (
                                                            <div
                                                                key={`active-up-${id}-${upgradeIndex}`}
                                                                className={`flex gap-2 items-start ${upgrade.unlocked ? 'text-foreground' : 'text-muted-foreground opacity-70'}`}
                                                            >
                                                                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${upgrade.unlocked ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                                                                    {upgrade.unlocked ? '已解锁' : '未解锁'}
                                                                </span>
                                                                <span className="shrink-0 text-muted-foreground">Lv.{upgrade.level}</span>
                                                                <span>{upgrade.description}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {character.master?.passiveSkillIds?.map((id, index) => {
                                            const skill = passiveSkillMap[id];
                                            const info = getPassiveSkillBaseInfo(skill);
                                            return (
                                                <div key={`passive-${id}`} className="rounded-lg border p-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="secondary">被动技能 {index + 1}</Badge>
                                                        <span className="text-sm font-medium">{skill ? t(skill.nameKey) : `技能 ${id}`}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mb-1">
                                                        冷却回合: {getPassiveSkillCooldownText(skill)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{info ? t(info.descriptionKey) : '暂无说明'}</p>
                                                    <div className="rounded bg-muted/60 px-2 py-2 text-xs space-y-1">
                                                        <div className="font-medium">技能升级效果</div>
                                                        {getPassiveSkillUpgrades(skill).map((upgrade, upgradeIndex) => (
                                                            <div
                                                                key={`passive-up-${id}-${upgradeIndex}`}
                                                                className={`flex gap-2 items-start ${upgrade.unlocked ? 'text-foreground' : 'text-muted-foreground opacity-70'}`}
                                                            >
                                                                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${upgrade.unlocked ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                                                                    {upgrade.unlocked ? '已解锁' : '未解锁'}
                                                                </span>
                                                                <span className="shrink-0 text-muted-foreground">Lv.{upgrade.level}</span>
                                                                <span>{upgrade.description}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </TabsContent>

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
                                                CharacterRarityFlags.N, CharacterRarityFlags.R, CharacterRarityFlags.RPlus, CharacterRarityFlags.SR,
                                                CharacterRarityFlags.SRPlus, CharacterRarityFlags.SSR, CharacterRarityFlags.SSRPlus,
                                                CharacterRarityFlags.UR, CharacterRarityFlags.URPlus, CharacterRarityFlags.LR,
                                            ].map((rarity, idx) => {
                                                const data = getRarityData(rarity);
                                                const isCurrent = character.rarityFlags === rarity;
                                                const isAchieved = character.rarityFlags >= rarity;
                                                return (
                                                    <div key={rarity} className="flex items-center gap-1">
                                                        <Badge className={`${data.color} ${isCurrent ? 'ring-2 ring-offset-2 ring-primary' : ''} ${!isAchieved ? 'opacity-30' : ''}`}>
                                                            {data.name}
                                                        </Badge>
                                                        {idx < 9 ? <ChevronRight className="h-3 w-3 text-muted-foreground" /> : null}
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
                            <Button className="flex-1" disabled>强化 (开发中)</Button>
                            <Button className="flex-1" variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
                        </div>

                        <Dialog open={abilityDialogOpen} onOpenChange={setAbilityDialogOpen}>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>能力详细资讯</DialogTitle>
                                </DialogHeader>
                                {detailInfo?.battleParameter ? (
                                    <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                                        <div className="rounded border px-3 py-2 text-center">
                                            <div className="text-xs text-muted-foreground">战斗力</div>
                                            <div className="text-2xl font-semibold">{(detailInfo.battlePower ?? 0).toLocaleString()}</div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">潜在能力</div>
                                            {potentialDetailGroups.map(group => (
                                                <div key={group.title} className="rounded border p-3 space-y-2">
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="font-semibold">{group.title}</span>
                                                            <span className="font-semibold">{group.value.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>{group.right.label}</span>
                                                            <span className="font-medium">{group.right.value.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>{group.left.label}</span>
                                                            <span className="font-medium">{group.left.value.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>{group.rightSub?.label ?? ''}</span>
                                                            <span className="font-medium">
                                                                {group.rightSub ? group.rightSub.value.toLocaleString() : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">能力数值</div>
                                            <div className="rounded border p-3 grid grid-cols-1 gap-1 text-sm">
                                                {abilityBasicRows.map(row => (
                                                    <div key={`basic-${row.key}`} className="flex justify-between border-b last:border-b-0 py-1">
                                                        <span>{row.label}</span>
                                                        <span className="font-medium">{row.value.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="rounded border p-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-1">
                                                    {abilityAdvancedLeftGroups.map((group, groupIdx) => (
                                                        <div key={`adv-l-group-${groupIdx}`} className={groupIdx > 0 ? 'pt-3' : ''}>
                                                            {group.map(row => (
                                                                <div key={`adv-l-${row.label}`} className="flex justify-between border-b py-1">
                                                                    <span>{row.label}</span>
                                                                    <span className="font-medium">
                                                                        {'key' in row ? formatBattleStatValue(row.key!, row.value) : row.value.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-1">
                                                    {abilityAdvancedRightGroups.map((group, groupIdx) => (
                                                        <div key={`adv-r-group-${groupIdx}`} className={groupIdx > 0 ? 'pt-3' : ''}>
                                                            {group.map(row => (
                                                                <div key={`adv-r-${row.label}`} className="flex justify-between border-b py-1">
                                                                    <span>{row.label}</span>
                                                                    <span className="font-medium">
                                                                        {'key' in row ? formatBattleStatValue(row.key!, row.value) : row.value.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">暂无能力详细数据</p>}
                                <Button variant="outline" onClick={() => setAbilityDialogOpen(false)}>关闭</Button>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
