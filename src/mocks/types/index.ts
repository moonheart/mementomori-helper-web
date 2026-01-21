// Mock 数据类型定义

export interface PlayerInfo {
    id: number;
    name: string;
    level: number;
    exp: number;
    maxExp: number;
    vipLevel: number;
}

export interface Currency {
    diamond: number;  // 钻石
    gold: number;     // 金币
    stamina: number;  // 体力
    maxStamina: number;
}

export interface Character {
    id: string;
    name: string;
    rarity: 'N' | 'R' | 'R+' | 'SR' | 'SR+' | 'SSR' | 'SSR+' | 'UR' | 'UR+' | 'LR' | 'LR+' | 'LR+2' | 'LR+3' | 'LR+4' | 'LR+5';
    level: number;
    maxLevel: number;
    element: 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark';
    role: 'warrior' | 'ranger' | 'mage' | 'attacker' | 'defender' | 'healer' | 'support';
    imageUrl: string;
    stats: {
        hp: number;
        atk: number;
        def: number;
        spd: number;
    };
    skills: Skill[];
    equipment: string[];  // equipment IDs
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    level: number;
    cooldown: number;
    type: 'active' | 'passive';
}

// 装备部位类型
export type EquipmentSlot = 'weapon' | 'head' | 'body' | 'legs' | 'hands' | 'accessory';

// 装备稀有度
export type EquipmentRarity = 'D' | 'A' | 'S' | 'R' | 'SR' | 'SSR' | 'UR' | 'LR';

// 符石类型
export type RuneType = 'strength' | 'dexterity' | 'magic' | 'vitality' | 'attack' | 'defense' |
    'physical_def' | 'magic_def' | 'hp' | 'crit' | 'crit_resist' | 'hit' | 'dodge' | 'speed' |
    'debuff_hit' | 'debuff_resist' | 'penetration';

// 符石接口
export interface Rune {
    id: string;
    name: string;
    type: RuneType;
    level: number;
    stats: Record<string, number>;
}

// 套装效果
export interface SetBonus {
    pieces: number;  // 需要的装备件数
    description: string;
    stats: Record<string, number>;
}

// 装备套装
export interface EquipmentSet {
    id: string;
    name: string;
    bonuses: SetBonus[];  // 2件套、4件套、6件套效果
}

export interface Equipment {
    id: string;
    name: string;
    slot: EquipmentSlot;          // 装备部位
    rarity: EquipmentRarity;      // 稀有度
    level: number;                // 装备等级
    maxLevel: number;

    // 强化系统
    enhanceLevel: number;          // 强化等级
    maxEnhanceLevel: number;
    holyLevel: number;             // 圣装等级
    demonLevel: number;            // 魔装等级

    // 属性
    baseStats: Record<string, number>;      // 基础属性
    additionalStats: Record<string, number>; // 附加属性

    // 套装
    setId?: string;                // 套装ID
    setName?: string;              // 套装名称

    // 专属武器
    isExclusive?: boolean;         // 是否专属武器
    exclusiveCharacterId?: string; // 专属角色ID
    exclusiveSkill?: string;       // 专属技能描述

    // 符石系统
    runeSlots: number;             // 符石插槽数量
    maxRuneSlots: number;
    equippedRunes: Rune[];         // 已镶嵌的符石

    // 其他
    equippedBy?: string;           // 装备者ID
    canInherit: boolean;           // 是否可继承
    canRefine: boolean;            // 是否可打磨
    description?: string;          // 装备描述
}

export interface Mission {
    id: string;
    type: 'daily' | 'weekly' | 'main' | 'achievement';
    title: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
    claimed: boolean;
    rewards: Reward[];
}

export interface Reward {
    type: 'diamond' | 'gold' | 'character' | 'equipment' | 'exp';
    id?: string;
    amount: number;
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    category: 'general' | 'special' | 'premium' | 'limited';
    price: {
        type: 'diamond' | 'gold';
        amount: number;
    };
    purchaseLimit: {
        max: number;
        current: number;
        period: 'daily' | 'weekly' | 'total';
    };
    items: {
        type: string;
        id?: string;
        amount: number;
    }[];
}

export interface GachaBanner {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    endTime: Date;
    cost: {
        single: number;
        multi: number;
    };
    pityCount: number;
    pityThreshold: number;
    featuredItems: {
        type: 'character' | 'equipment';
        id: string;
        rarity: string;
    }[];
}

export interface PVPOpponent {
    id: number;
    name: string;
    level: number;
    rank: number;
    power: number;
    team: string[];  // character IDs
}

export interface Battle {
    id: string;
    opponentName: string;
    result: 'win' | 'lose';
    timestamp: Date;
    rankChange: number;
}

export interface Guild {
    id: string;
    name: string;
    level: number;
    memberCount: number;
    maxMembers: number;
    description: string;
}

export interface GuildMember {
    id: number;
    name: string;
    level: number;
    contribution: number;
    role: 'leader' | 'officer' | 'member';
    lastActive: Date;
}

export interface Dungeon {
    id: string;
    name: string;
    difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
    staminaCost: number;
    recommendedPower: number;
    rewards: Reward[];
    attempts: {
        used: number;
        max: number;
    };
}
