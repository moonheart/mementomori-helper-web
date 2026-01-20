import type {
    PlayerInfo,
    Currency,
    Character,
    Equipment,
    Mission,
    ShopItem,
    GachaBanner,
    PVPOpponent,
    Battle,
    Guild,
    GuildMember,
    Dungeon,
    Reward
} from '../types';

// 玩家信息
export const mockPlayerInfo: PlayerInfo = {
    id: 656032828766,
    name: '账户1',
    level: 85,
    exp: 12500,
    maxExp: 15000,
    vipLevel: 5
};

// 货币
export const mockCurrency: Currency = {
    diamond: 15000,
    gold: 2500000,
    stamina: 145,
    maxStamina: 200
};

// 角色数据
export const mockCharacters: Character[] = [
    {
        id: 'char_001',
        name: '芙蕾雅',
        rarity: 'UR',
        level: 80,
        maxLevel: 80,
        element: 'light',
        role: 'healer',
        imageUrl: '/characters/freya.png',
        stats: {
            hp: 15000,
            atk: 2500,
            def: 1800,
            spd: 95
        },
        skills: [
            {
                id: 'skill_001',
                name: '神圣之光',
                description: '恢复全体队友生命值',
                level: 10,
                cooldown: 3,
                type: 'active'
            }
        ],
        equipment: ['eq_001', 'eq_002']
    },
    {
        id: 'char_002',
        name: '雷恩',
        rarity: 'SSR',
        level: 75,
        maxLevel: 80,
        element: 'fire',
        role: 'attacker',
        imageUrl: '/characters/rein.png',
        stats: {
            hp: 12000,
            atk: 3500,
            def: 1200,
            spd: 110
        },
        skills: [],
        equipment: []
    },
    {
        id: 'char_003',
        name: '艾莉娅',
        rarity: 'UR',
        level: 80,
        maxLevel: 80,
        element: 'water',
        role: 'support',
        imageUrl: '/characters/aria.png',
        stats: {
            hp: 13500,
            atk: 2800,
            def: 1600,
            spd: 100
        },
        skills: [],
        equipment: []
    }
];

// 装备数据
export const mockEquipment: Equipment[] = [
    {
        id: 'eq_001',
        name: '炎之剑',
        type: 'weapon',
        rarity: 'UR',
        level: 50,
        maxLevel: 50,
        stats: {
            atk: 1500,
            crit: 25
        },
        equippedBy: 'char_001'
    },
    {
        id: 'eq_002',
        name: '守护之铠',
        type: 'armor',
        rarity: 'SSR',
        level: 45,
        maxLevel: 50,
        stats: {
            def: 800,
            hp: 3000
        }
    }
];

// 任务数据
export const mockMissions: Mission[] = [
    {
        id: 'mission_001',
        type: 'daily',
        title: '完成3次战斗',
        description: '在任意副本中完成3次战斗',
        progress: 2,
        target: 3,
        completed: false,
        claimed: false,
        rewards: [
            { type: 'gold', amount: 10000 },
            { type: 'exp', amount: 500 }
        ]
    },
    {
        id: 'mission_002',
        type: 'daily',
        title: '完成每日任务',
        description: '完成所有每日任务',
        progress: 5,
        target: 5,
        completed: true,
        claimed: false,
        rewards: [
            { type: 'diamond', amount: 50 }
        ]
    },
    {
        id: 'mission_003',
        type: 'weekly',
        title: '累计登录7天',
        description: '本周累计登录游戏7天',
        progress: 4,
        target: 7,
        completed: false,
        claimed: false,
        rewards: [
            { type: 'diamond', amount: 300 }
        ]
    }
];

// 商店商品
export const mockShopItems: ShopItem[] = [
    {
        id: 'shop_001',
        name: '钻石礼包',
        description: '包含1000钻石',
        category: 'premium',
        price: {
            type: 'gold',
            amount: 500000
        },
        purchaseLimit: {
            max: 5,
            current: 2,
            period: 'weekly'
        },
        items: [
            { type: 'diamond', amount: 1000 }
        ]
    },
    {
        id: 'shop_002',
        name: '经验药水',
        description: '增加角色1000经验值',
        category: 'general',
        price: {
            type: 'gold',
            amount: 50000
        },
        purchaseLimit: {
            max: 99,
            current: 15,
            period: 'total'
        },
        items: [
            { type: 'exp', amount: 1000 }
        ]
    }
];

// PVP 对手
export const mockPVPOpponents: PVPOpponent[] = [
    {
        id: 1,
        name: '玩家A',
        level: 84,
        rank: 2456,
        power: 125000,
        team: ['char_001', 'char_002']
    },
    {
        id: 2,
        name: '玩家B',
        level: 86,
        rank: 2450,
        power: 128000,
        team: ['char_002', 'char_003']
    }
];

// 战斗记录
export const mockBattles: Battle[] = [
    {
        id: 'battle_001',
        opponentName: '玩家C',
        result: 'win',
        timestamp: new Date(Date.now() - 3600000),
        rankChange: +5
    },
    {
        id: 'battle_002',
        opponentName: '玩家D',
        result: 'lose',
        timestamp: new Date(Date.now() - 7200000),
        rankChange: -3
    }
];

// 公会信息
export const mockGuild: Guild = {
    id: 'guild_001',
    name: '永恒之光',
    level: 25,
    memberCount: 48,
    maxMembers: 50,
    description: '欢迎活跃玩家加入！'
};

// 公会成员
export const mockGuildMembers: GuildMember[] = [
    {
        id: 1,
        name: '会长',
        level: 90,
        contribution: 15000,
        role: 'leader',
        lastActive: new Date()
    },
    {
        id: 2,
        name: '副会长1',
        level: 88,
        contribution: 12000,
        role: 'officer',
        lastActive: new Date(Date.now() - 3600000)
    }
];

// 副本数据
export const mockDungeons: Dungeon[] = [
    {
        id: 'dungeon_001',
        name: '火焰试炼',
        difficulty: 'hard',
        staminaCost: 20,
        recommendedPower: 100000,
        rewards: [
            { type: 'gold', amount: 50000 },
            { type: 'equipment', id: 'eq_001', amount: 1 }
        ],
        attempts: {
            used: 2,
            max: 5
        }
    }
];
