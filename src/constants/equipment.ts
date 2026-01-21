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
 */
export const SLOT_CONFIG: Record<EquipmentSlot, { name: string; icon: string; canSocketRune: 'attack' | 'defense' }> = {
    weapon: { name: '武器', icon: '⚔️', canSocketRune: 'attack' },
    head: { name: '头部', icon: '🪖', canSocketRune: 'defense' },
    body: { name: '身体', icon: '🦺', canSocketRune: 'defense' },
    legs: { name: '腿部', icon: '👖', canSocketRune: 'defense' },
    hands: { name: '手部', icon: '🧤', canSocketRune: 'attack' },
    accessory: { name: '饰品', icon: '💍', canSocketRune: 'attack' }
};

/**
 * 符石类型配置
 */
export const RUNE_TYPE_CONFIG = {
    // 攻击型符石
    strength: { name: '力量符石', category: 'attack', icon: '💪' },
    dexterity: { name: '战技符石', category: 'attack', icon: '🎯' },
    magic: { name: '魔力符石', category: 'attack', icon: '✨' },
    attack: { name: '攻击符石', category: 'attack', icon: '⚔️' },
    penetration: { name: '穿透符石', category: 'attack', icon: '🗡️' },
    hit: { name: '命中符石', category: 'attack', icon: '🎯' },
    crit: { name: '暴击符石', category: 'attack', icon: '💥' },
    debuff_hit: { name: '弱化命中符石', category: 'attack', icon: '🌀' },
    speed: { name: '速度符石', category: 'attack', icon: '⚡' },

    // 防御型符石
    vitality: { name: '耐力符石', category: 'defense', icon: '❤️' },
    defense: { name: '防御符石', category: 'defense', icon: '🛡️' },
    hp: { name: '生命符石', category: 'defense', icon: '💚' },
    physical_def: { name: '物理防御符石', category: 'defense', icon: '🛡️' },
    magic_def: { name: '魔法防御符石', category: 'defense', icon: '🔮' },
    dodge: { name: '闪避符石', category: 'defense', icon: '💨' },
    crit_resist: { name: '暴击抗性符石', category: 'defense', icon: '🛡️' },
    debuff_resist: { name: '弱化抗性符石', category: 'defense', icon: '🌟' }
} as const;

/**
 * 装备帮助文档（从游戏文档提取）
 */
export const EQUIPMENT_HELP_DOCS = {
    basic: {
        title: '武具',
        content: `**武具**
装备武具能提高角色的能力。武具有等级之分，角色无法装备等级高于自己的武具。

**基础属性与附加属性**
武具的性能分为基础属性与附加属性。基础属性可提升的能力数值种类取决于武具的部位。武具的稀有度越高，具备的附加属性种类越多。附加属性的数值将在武具首次装备到角色身上时随机进行分配。

**神装效果**
赋予武具「圣装等级」与「魔装等级」后，可触发神装效果。圣装等级、魔装等级可提升的能力数值种类取决于武具的部位。玩家可通过神装强化来提升两者的等级，等级越高，提升的能力数值越多。

**套装效果**
装备同一套武具可触发套装效果，触发的效果取决于装备数量的多少。套装武具分为「R」、「SR」、「SSR」、「UR」、「LR」5种稀有度。LR武具的装备对象仅限稀有度达到LR+5以上的角色。

**专属武器**
专属武器装备在指定角色身上时，可触发专属技能效果与专属被动效果。专属武器分为「SSR」、「UR」、「LR」3种稀有度。专属武器同样具备套装效果，搭配其他套装武具可触发套装效果。`
    },
    enhance: {
        title: '武具强化',
        content: `**武具强化**
进行强化可提升武具的强化等级。强化等级越高，武具的基础属性越强。强化等级的上限取决于武具等级。`
    },
    divine: {
        title: '神装强化',
        content: `**神装强化**
进行神装强化可提升武具的圣装等级与魔装等级。

神装强化需要使用圣装武具、魔装武具或魔装香油作为材料。

镶嵌符石的武具无法作为强化材料。

**自动选取(圣)、自动选取(魔)**
- 自动选取(圣)：可自动选择7个提升圣装等级的材料
- 自动选取(魔)：可自动选择7个提升魔装等级的材料

无法自动选择同时具备圣装与魔装效果的武具。`
    },
    refine: {
        title: '武具打磨',
        content: `**武具打磨**
进行武具打磨可重新随机分配武具的附加属性。附加属性的种类与总值不变。与装备对象专长能力对应的附加属性将显示为绿色。将专长能力对应的属性调整为更高的数值，可以让武具发挥更好的效果。

**锁定功能**
达到一定的VIP等级后，可解锁「锁定」功能。将指定的附加属性锁定之后，可在不改变该属性数值的情况下，重新分配其他附加属性的数值。搭配锁定功能进行武具打磨时需要花费钻石。

**快速打磨**
可一次性进行20次武具打磨，并从中选择1种打磨结果应用到武具上。须消耗打磨20次武具所需要的道具。`
    },
    rune: {
        title: '符石镶嵌',
        content: `**符石镶嵌**
可将选定的符石嵌入武具的镶嵌孔里。玩家可通过加工增加镶嵌孔的数量，每件武具最多可镶嵌4块符石。

**攻击型符石**
「武器」、「饰品」、「手部防具」可镶嵌「攻击型符石」。

包括：力量符石、战技符石、魔力符石、攻击力符石、物魔防御穿透符石、命中符石、暴击符石、弱化效果命中符石、速度符石

**防御型符石**
「头部防具」、「身体防具」、「腿部防具」可镶嵌「防御型符石」。

包括：耐力符石、生命符石、物理防御力符石、魔法防御力符石、闪避符石、暴击抗性符石、弱化效果抗性符石

**快速镶嵌**
可调出已保存的自定义符石组，并自动镶嵌至角色身上。

**符石合成**
符石合成可提升符石的等级。升级符石时，需要使用1块种类与等级相同的符石作为升级材料。`
    },
    inherit: {
        title: '武具继承',
        content: `**武具继承**
武具继承可将武具目前的强化状态转移到其他武具上。当主体武具与材料武具都经过强化时，将从中选择强化值较高的一方进行继承，较低的强化值则会保留在材料武具上。

**材料武具条件**
符合以下任一条件的武具皆可作为材料武具：
- 强化等级1以上的武具
- 圣装等级1以上的武具
- 魔装等级1以上的武具
- 拥有1个以上空镶嵌孔的武具

**主体武具条件**
在主体武具现有的各种强化值中，至少有1项低于材料武具的强化值。`
    },
    evolution: {
        title: '武具进化与觉醒',
        content: `**武具进化**
具备套装效果的武具或专属武具可进行武具进化。武具进化可使武具升级，提高基础属性与附加属性，并且转化为套装效果更强大的武具。

武具等级达到Lv240之后将不再变化。此外，武具进化无法超过装备对象的等级。

**武具觉醒**
装备对象的稀有度达到LR+5之后，武具等级达到指定条件的UR套装武具或专属武具可觉醒为新的武具。

武具觉醒可升级武具的稀有度，提升基础属性与附加属性，并且转化为套装效果更强大的武具。`
    }
};
