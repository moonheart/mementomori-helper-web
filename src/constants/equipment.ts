import type { EquipmentRarity, EquipmentSlot } from '@/mocks/types';

/**
 * 稀有度配置
 */
export const RARITY_CONFIG = {
    D: { name: 'D', color: 'gray', order: 1 },
    A: { name: 'A', color: 'gray', order: 2 },
    S: { name: 'S', color: 'green', order: 3 },
    R: { name: 'R', color: 'blue', order: 4 },
    SR: { name: 'SR', color: 'blue', order: 5 },
    SSR: { name: 'SSR', color: 'purple', order: 6 },
    UR: { name: 'UR', color: 'yellow', order: 7 },
    LR: { name: 'LR', color: 'orange', order: 8 }
} as const;

/**
 * 装备部位配置
 * 名称使用游戏原始翻译键
 */
export const SLOT_CONFIG: Record<EquipmentSlot, { nameKey: string; icon: string; canSocketRune: 'attack' | 'defense' }> = {
    weapon: { nameKey: '[EquipmentSlotTypeWeapon]', icon: '⚔️', canSocketRune: 'attack' },
    head: { nameKey: '[EquipmentSlotTypeHelmet]', icon: '🪖', canSocketRune: 'defense' },
    body: { nameKey: '[EquipmentSlotTypeArmor]', icon: '🦺', canSocketRune: 'defense' },
    legs: { nameKey: '[EquipmentSlotTypeShoes]', icon: '👖', canSocketRune: 'defense' },
    hands: { nameKey: '[EquipmentSlotTypeGauntlet]', icon: '🧤', canSocketRune: 'attack' },
    accessory: { nameKey: '[EquipmentSlotTypeSub]', icon: '💍', canSocketRune: 'attack' }
};

/**
 * 符石类型配置
 * 名称使用游戏原始翻译键
 */
export const RUNE_TYPE_CONFIG = {
    // 攻击型符石
    strength: { nameKey: '[SphereName1]', category: 'attack', icon: '💪' },
    dexterity: { nameKey: '[SphereName16]', category: 'attack', icon: '🎯' },
    magic: { nameKey: '[SphereName31]', category: 'attack', icon: '✨' },
    attack: { nameKey: '[SphereName46]', category: 'attack', icon: '⚔️' },
    penetration: { nameKey: '[SphereName61]', category: 'attack', icon: '🗡️' },
    hit: { nameKey: '[SphereName76]', category: 'attack', icon: '🎯' },
    crit: { nameKey: '[SphereName91]', category: 'attack', icon: '💥' },
    debuff_hit: { nameKey: '[SphereName106]', category: 'attack', icon: '🌀' },
    speed: { nameKey: '[SphereName226]', category: 'attack', icon: '⚡' },

    // 防御型符石
    vitality: { nameKey: '[SphereName121]', category: 'defense', icon: '❤️' },
    defense: { nameKey: 'EQUIPMENT_RUNE_DEFENSE', category: 'defense', icon: '🛡️' },
    hp: { nameKey: '[SphereName136]', category: 'defense', icon: '💚' },
    physical_def: { nameKey: '[SphereName151]', category: 'defense', icon: '🛡️' },
    magic_def: { nameKey: '[SphereName166]', category: 'defense', icon: '🔮' },
    dodge: { nameKey: '[SphereName181]', category: 'defense', icon: '💨' },
    crit_resist: { nameKey: '[SphereName196]', category: 'defense', icon: '🛡️' },
    debuff_resist: { nameKey: '[SphereName211]', category: 'defense', icon: '🌟' }
} as const;

/**
 * 装备帮助文档（使用游戏原始翻译键）
 */
export const EQUIPMENT_HELP_DOCS = {
    basic: {
        titleKey: '[HelpHeadLine2300]',
        contentKey: '[HelpMainText2300]'
    },
    enhance: {
        titleKey: '[HelpHeadLine2310]',
        contentKey: '[HelpMainText2310]'
    },
    divine: {
        titleKey: '[HelpHeadLine2330]',
        contentKey: '[HelpMainText2330]'
    },
    refine: {
        titleKey: '[HelpHeadLine2320]',
        contentKey: '[HelpMainText2320]'
    },
    rune: {
        titleKey: '[HelpHeadLine2350]',
        contentKey: '[HelpMainText2350]'
    },
    inherit: {
        titleKey: '[HelpHeadLine2400]',
        contentKey: '[HelpMainText2400]'
    },
    evolution: {
        titleKey: '[HelpHeadLine2340]',
        contentKey: '[HelpMainText2340]'
    }
};
