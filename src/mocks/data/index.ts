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

// 套装定义
export const mockEquipmentSets: Record<string, { name: string; bonuses: { pieces: number; description: string; stats: Record<string, number> }[] }> = {
    flame_set: {
        name: '炎之审判',
        bonuses: [
            { pieces: 2, description: '攻击力+10%', stats: { atk: 10 } },
            { pieces: 4, description: '暴击率+15%,火属性伤害+20%', stats: { crit: 15, fire_dmg: 20 } },
            { pieces: 6, description: '普攻概率造成燃烧效果', stats: { burn_chance: 30 } }
        ]
    },
    guardian_set: {
        name: '守护者之誓',
        bonuses: [
            { pieces: 2, description: '生命值+15%', stats: { hp: 15 } },
            { pieces: 4, description: '防御力+20%,受到伤害-10%', stats: { def: 20, dmg_reduction: 10 } },
            { pieces: 6, description: '受到致命伤害时保留1点生命值(每30秒触发1次)', stats: { immortality: 1 } }
        ]
    },
    mystic_set: {
        name: '神秘咏唱',
        bonuses: [
            { pieces: 2, description: '魔力+12%', stats: { magic: 12 } },
            { pieces: 4, description: '技能冷却-15%,魔法伤害+18%', stats: { cdr: 15, magic_dmg: 18 } }
        ]
    }
};

// 装备数据
export const mockEquipment: Equipment[] = [
    {
        id: 'eq_001',
        name: '炎之裁决',
        slot: 'weapon',
        rarity: 'LR',
        level: 50,
        maxLevel: 50,
        enhanceLevel: 45,
        maxEnhanceLevel: 50,
        holyLevel: 15,
        demonLevel: 12,
        baseStats: {
            atk: 2800,
            crit: 35
        },
        additionalStats: {
            penetration: 280,
            crit_dmg: 45,
            fire_dmg: 25
        },
        setId: 'flame_set',
        setName: '炎之审判',
        isExclusive: true,
        exclusiveCharacterId: 'char_002',
        exclusiveSkill: '释放技能时有30%概率额外造成200%的火焰伤害',
        runeSlots: 4,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_001',
                name: '力量符石·Ⅴ',
                type: 'strength',
                level: 5,
                stats: { atk: 180, physical_atk: 90 }
            },
            {
                id: 'rune_002',
                name: '暴击符石·Ⅴ',
                type: 'crit',
                level: 5,
                stats: { crit: 12, crit_dmg: 20 }
            },
            {
                id: 'rune_003',
                name: '攻击符石·Ⅳ',
                type: 'attack',
                level: 4,
                stats: { atk: 150 }
            }
        ],
        equippedBy: 'char_002',
        canInherit: true,
        canRefine: true,
        description: '传说中火神使用过的武器,蕴含着强大的火元素力量'
    },
    {
        id: 'eq_002',
        name: '守护者头盔',
        slot: 'head',
        rarity: 'UR',
        level: 48,
        maxLevel: 50,
        enhanceLevel: 40,
        maxEnhanceLevel: 50,
        holyLevel: 10,
        demonLevel: 8,
        baseStats: {
            def: 680,
            hp: 2500
        },
        additionalStats: {
            physical_def: 340,
            hp_percent: 8,
            debuff_resist: 15
        },
        setId: 'guardian_set',
        setName: '守护者之誓',
        runeSlots: 3,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_010',
                name: '生命符石·Ⅳ',
                type: 'hp',
                level: 4,
                stats: { hp: 1200, hp_percent: 5 }
            },
            {
                id: 'rune_011',
                name: '防御符石·Ⅳ',
                type: 'defense',
                level: 4,
                stats: { def: 220, physical_def: 110 }
            }
        ],
        equippedBy: 'char_001',
        canInherit: true,
        canRefine: true,
        description: '守护者军团的制式头盔,坚固异常'
    },
    {
        id: 'eq_003',
        name: '守护者铠甲',
        slot: 'body',
        rarity: 'UR',
        level: 48,
        maxLevel: 50,
        enhanceLevel: 42,
        maxEnhanceLevel: 50,
        holyLevel: 11,
        demonLevel: 9,
        baseStats: {
            def: 920,
            hp: 3800
        },
        additionalStats: {
            physical_def: 460,
            magic_def: 380,
            hp_percent: 12
        },
        setId: 'guardian_set',
        setName: '守护者之誓',
        runeSlots: 4,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_012',
                name: '耐力符石·Ⅴ',
                type: 'vitality',
                level: 5,
                stats: { hp: 2000, def: 150 }
            },
            {
                id: 'rune_013',
                name: '物理防御符石·Ⅳ',
                type: 'physical_def',
                level: 4,
                stats: { physical_def: 280, def: 100 }
            },
            {
                id: 'rune_014',
                name: '魔法防御符石·Ⅳ',
                type: 'magic_def',
                level: 4,
                stats: { magic_def: 260, def: 90 }
            }
        ],
        equippedBy: 'char_001',
        canInherit: true,
        canRefine: true
    },
    {
        id: 'eq_004',
        name: '迅捷之靴',
        slot: 'legs',
        rarity: 'SSR',
        level: 45,
        maxLevel: 50,
        enhanceLevel: 35,
        maxEnhanceLevel: 50,
        holyLevel: 6,
        demonLevel: 5,
        baseStats: {
            def: 420,
            speed: 25
        },
        additionalStats: {
            dodge: 18,
            hp: 1500
        },
        runeSlots: 2,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_020',
                name: '速度符石·Ⅲ',
                type: 'speed',
                level: 3,
                stats: { speed: 15, dodge: 8 }
            }
        ],
        canInherit: true,
        canRefine: true,
        description: '据说穿上后能让使用者的速度倍增'
    },
    {
        id: 'eq_005',
        name: '神秘法杖',
        slot: 'weapon',
        rarity: 'UR',
        level: 47,
        maxLevel: 50,
        enhanceLevel: 38,
        maxEnhanceLevel: 50,
        holyLevel: 9,
        demonLevel: 10,
        baseStats: {
            magic: 2200,
            atk: 1800
        },
        additionalStats: {
            magic_dmg: 28,
            debuff_hit: 20,
            crit: 18
        },
        setId: 'mystic_set',
        setName: '神秘咏唱',
        runeSlots: 3,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_030',
                name: '魔力符石·Ⅴ',
                type: 'magic',
                level: 5,
                stats: { magic: 220, magic_dmg: 15 }
            },
            {
                id: 'rune_031',
                name: '弱化命中符石·Ⅳ',
                type: 'debuff_hit',
                level: 4,
                stats: { debuff_hit: 15, magic: 80 }
            }
        ],
        canInherit: true,
        canRefine: true,
        description: '蕴含神秘力量的法杖,能大幅提升施法者的魔力'
    },
    {
        id: 'eq_006',
        name: '精准战戒',
        slot: 'accessory',
        rarity: 'SSR',
        level: 45,
        maxLevel: 50,
        enhanceLevel: 30,
        maxEnhanceLevel: 50,
        holyLevel: 5,
        demonLevel: 4,
        baseStats: {
            hit: 45,
            atk: 580
        },
        additionalStats: {
            crit: 12,
            penetration: 180
        },
        runeSlots: 2,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_040',
                name: '命中符石·Ⅲ',
                type: 'hit',
                level: 3,
                stats: { hit: 20, atk: 60 }
            }
        ],
        canInherit: true,
        canRefine: true,
        description: '提升攻击命中率的战斗指环'
    },
    {
        id: 'eq_007',
        name: '炎之护腕',
        slot: 'hands',
        rarity: 'UR',
        level: 46,
        maxLevel: 50,
        enhanceLevel: 36,
        maxEnhanceLevel: 50,
        holyLevel: 8,
        demonLevel: 7,
        baseStats: {
            atk: 950,
            def: 420
        },
        additionalStats: {
            fire_dmg: 20,
            physical_atk: 280
        },
        setId: 'flame_set',
        setName: '炎之审判',
        runeSlots: 3,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_050',
                name: '战技符石·Ⅳ',
                type: 'dexterity',
                level: 4,
                stats: { atk: 140, crit: 8 }
            }
        ],
        canInherit: true,
        canRefine: true
    },
    {
        id: 'eq_008',
        name: '暗影斗篷',
        slot: 'body',
        rarity: 'SR',
        level: 40,
        maxLevel: 50,
        enhanceLevel: 25,
        maxEnhanceLevel: 50,
        holyLevel: 3,
        demonLevel: 2,
        baseStats: {
            def: 520,
            hp: 1800
        },
        additionalStats: {
            dodge: 22,
            speed: 12
        },
        runeSlots: 1,
        maxRuneSlots: 4,
        equippedRunes: [],
        canInherit: true,
        canRefine: true,
        description: '轻薄的斗篷,能提升穿戴者的闪避能力'
    },
    {
        id: 'eq_009',
        name: '守护者护腿',
        slot: 'legs',
        rarity: 'UR',
        level: 48,
        maxLevel: 50,
        enhanceLevel: 40,
        maxEnhanceLevel: 50,
        holyLevel: 10,
        demonLevel: 8,
        baseStats: {
            def: 720,
            hp: 2800
        },
        additionalStats: {
            physical_def: 360,
            hp_percent: 10,
            crit_resist: 15
        },
        setId: 'guardian_set',
        setName: '守护者之誓',
        runeSlots: 3,
        maxRuneSlots: 4,
        equippedRunes: [
            {
                id: 'rune_060',
                name: '暴击抗性符石·Ⅳ',
                type: 'crit_resist',
                level: 4,
                stats: { crit_resist: 12, def: 80 }
            }
        ],
        equippedBy: 'char_001',
        canInherit: true,
        canRefine: true
    },
    {
        id: 'eq_010',
        name: '雷霆之刃',
        slot: 'weapon',
        rarity: 'SSR',
        level: 43,
        maxLevel: 50,
        enhanceLevel: 30,
        maxEnhanceLevel: 50,
        holyLevel: 5,
        demonLevel: 5,
        baseStats: {
            atk: 1800,
            speed: 18
        },
        additionalStats: {
            crit: 25,
            lightning_dmg: 22
        },
        runeSlots: 2,
        maxRuneSlots: 4,
        equippedRunes: [],
        canInherit: true,
        canRefine: true,
        description: '雷电缠绕的利刃,攻击速度极快'
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
