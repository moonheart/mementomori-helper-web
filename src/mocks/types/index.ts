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
    rarity: 'SR' | 'SSR' | 'UR';
    level: number;
    maxLevel: number;
    element: 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark';
    role: 'attacker' | 'defender' | 'healer' | 'support';
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

export interface Equipment {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'accessory';
    rarity: 'SR' | 'SSR' | 'UR';
    level: number;
    maxLevel: number;
    stats: Record<string, number>;
    equippedBy?: string;  // character ID
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
