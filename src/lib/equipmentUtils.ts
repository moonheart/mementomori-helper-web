import type { Equipment, EquipmentRarity, EquipmentSlot } from '@/mocks/types';

/**
 * 获取稀有度对应的颜色类名
 */
export function getRarityColor(rarity: EquipmentRarity): string {
    const colors: Record<EquipmentRarity, string> = {
        'D': 'bg-gray-400',
        'A': 'bg-gray-500',
        'S': 'bg-green-500',
        'R': 'bg-blue-400',
        'SR': 'bg-blue-600',
        'SSR': 'bg-purple-600',
        'UR': 'bg-yellow-500',
        'LR': 'bg-gradient-to-r from-orange-500 to-red-600'
    };
    return colors[rarity] || 'bg-gray-500';
}

/**
 * 获取稀有度对应的文字颜色
 */
export function getRarityTextColor(rarity: EquipmentRarity): string {
    const colors: Record<EquipmentRarity, string> = {
        'D': 'text-gray-400',
        'A': 'text-gray-500',
        'S': 'text-green-500',
        'R': 'text-blue-400',
        'SR': 'text-blue-600',
        'SSR': 'text-purple-600',
        'UR': 'text-yellow-500',
        'LR': 'text-orange-500'
    };
    return colors[rarity] || 'text-gray-500';
}

/**
 * 获取装备部位对应的图标
 */
export function getSlotIcon(slot: EquipmentSlot): string {
    const icons: Record<EquipmentSlot, string> = {
        'weapon': '⚔️',
        'head': '🪖',
        'body': '🦺',
        'legs': '👖',
        'hands': '🧤',
        'accessory': '💍'
    };
    return icons[slot] || '📦';
}

/**
 * 获取装备部位的中文名称
 */
export function getSlotName(slot: EquipmentSlot): string {
    const names: Record<EquipmentSlot, string> = {
        'weapon': '武器',
        'head': '头部',
        'body': '身体',
        'legs': '腿部',
        'hands': '手部',
        'accessory': '饰品'
    };
    return names[slot] || '未知';
}

/**
 * 计算装备的总战斗力
 */
export function calculateEquipmentPower(equipment: Equipment): number {
    let power = 0;

    // 基础属性权重
    const baseWeights: Record<string, number> = {
        atk: 1.5,
        magic: 1.5,
        def: 1.2,
        hp: 0.3,
        speed: 2,
        crit: 3,
        hit: 1.5,
        dodge: 2
    };

    // 计算基础属性
    Object.entries(equipment.baseStats).forEach(([stat, value]) => {
        const weight = baseWeights[stat] || 1;
        power += value * weight;
    });

    // 计算附加属性 (权重稍低)
    Object.entries(equipment.additionalStats).forEach(([stat, value]) => {
        const weight = (baseWeights[stat] || 1) * 0.8;
        power += value * weight;
    });

    // 强化等级加成
    power += equipment.enhanceLevel * 50;

    // 圣装/魔装加成
    power += equipment.holyLevel * 30;
    power += equipment.demonLevel * 30;

    // 符石加成
    equipment.equippedRunes.forEach(rune => {
        Object.values(rune.stats).forEach(value => {
            power += value * 0.5;
        });
        power += rune.level * 20;
    });

    // 稀有度系数
    const rarityMultiplier: Record<EquipmentRarity, number> = {
        'D': 0.5,
        'A': 0.7,
        'S': 0.9,
        'R': 1.0,
        'SR': 1.2,
        'SSR': 1.5,
        'UR': 2.0,
        'LR': 2.5
    };

    power *= rarityMultiplier[equipment.rarity] || 1;

    return Math.floor(power);
}

/**
 * 格式化属性名称
 */
export function formatStatName(stat: string): string {
    const names: Record<string, string> = {
        atk: '攻击力',
        magic: '魔力',
        def: '防御力',
        hp: '生命值',
        speed: '速度',
        crit: '暴击',
        crit_dmg: '暴击伤害',
        crit_resist: '暴击抗性',
        hit: '命中',
        dodge: '闪避',
        penetration: '穿透',
        physical_def: '物理防御',
        magic_def: '魔法防御',
        physical_atk: '物理攻击',
        magic_atk: '魔法攻击',
        debuff_hit: '弱化命中',
        debuff_resist: '弱化抗性',
        hp_percent: '生命值',
        fire_dmg: '火属性伤害',
        water_dmg: '水属性伤害',
        wind_dmg: '风属性伤害',
        earth_dmg: '土属性伤害',
        lightning_dmg: '雷属性伤害',
        dmg_reduction: '伤害减免',
        burn_chance: '燃烧概率',
        immortality: '不死',
        cdr: '技能冷却'
    };
    return names[stat] || stat;
}

/**
 * 格式化属性值显示
 */
export function formatStatValue(stat: string, value: number): string {
    // 百分比属性
    const percentStats = [
        'crit', 'crit_dmg', 'crit_resist', 'hit', 'dodge', 'hp_percent',
        'fire_dmg', 'water_dmg', 'wind_dmg', 'earth_dmg', 'lightning_dmg',
        'dmg_reduction', 'burn_chance', 'magic_dmg', 'cdr', 'physical_atk'
    ];

    if (percentStats.includes(stat)) {
        return `+${value}%`;
    }

    return `+${value}`;
}

/**
 * 检查装备是否可以强化
 */
export function canEnhance(equipment: Equipment): boolean {
    return equipment.enhanceLevel < equipment.maxEnhanceLevel;
}

/**
 * 检查装备是否可以打磨
 */
export function canRefine(equipment: Equipment): boolean {
    return equipment.canRefine && equipment.rarity !== 'D' && equipment.rarity !== 'A';
}

/**
 * 检查装备是否可以继承
 */
export function canInherit(equipment: Equipment): boolean {
    return equipment.canInherit && (
        equipment.enhanceLevel > 0 ||
        equipment.holyLevel > 0 ||
        equipment.demonLevel > 0 ||
        equipment.runeSlots > 0
    );
}

/**
 * 计算符石插槽使用率
 */
export function getRuneSlotUsage(equipment: Equipment): { used: number; total: number; percentage: number } {
    const used = equipment.equippedRunes.length;
    const total = equipment.runeSlots;
    const percentage = total > 0 ? Math.floor((used / total) * 100) : 0;
    return { used, total, percentage };
}

/**
 * 获取强化等级显示颜色
 */
export function getEnhanceLevelColor(enhanceLevel: number, maxLevel: number): string {
    const percentage = (enhanceLevel / maxLevel) * 100;

    if (percentage >= 90) return 'text-orange-500';
    if (percentage >= 70) return 'text-purple-500';
    if (percentage >= 50) return 'text-blue-500';
    if (percentage >= 30) return 'text-green-500';
    return 'text-gray-500';
}

/**
 * 排序装备列表
 */
export function sortEquipment(
    equipment: Equipment[],
    sortBy: 'level' | 'rarity' | 'enhance' | 'power'
): Equipment[] {
    const rarityOrder: Record<EquipmentRarity, number> = {
        'D': 1, 'A': 2, 'S': 3, 'R': 4, 'SR': 5, 'SSR': 6, 'UR': 7, 'LR': 8
    };

    return [...equipment].sort((a, b) => {
        switch (sortBy) {
            case 'level':
                return b.level - a.level;
            case 'rarity':
                return rarityOrder[b.rarity] - rarityOrder[a.rarity];
            case 'enhance':
                return b.enhanceLevel - a.enhanceLevel;
            case 'power':
                return calculateEquipmentPower(b) - calculateEquipmentPower(a);
            default:
                return 0;
        }
    });
}
