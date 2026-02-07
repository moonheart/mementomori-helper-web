/**
 * 游戏资源管理器 - 统一管理图标、图片等资源的URL生成
 * 
 * 图标格式说明:
 * - _l: 1024*1024 (大图标)
 * - _m: 256*256 (中等图标)
 * - _s: 128*128 (小图标)
 * - _w: 256*152 (宽屏图标)
 */

const BASE_URL = 'https://list.moonheart.dev/d/public/mmtm/AddressableConvertAssets';

export type IconSize = 'l' | 'm' | 's' | 'w';

export interface IconOptions {
    size?: IconSize;
    fallback?: string;
}

/**
 * 角色图标管理
 */
export class CharacterIconManager {
    /**
     * 获取角色图标URL
     * @param characterId 角色ID (数字)
     * @param options 图标选项
     * @returns 完整的图标URL
     */
    static getUrl(characterId: number, options: IconOptions = {}): string {
        const { size = 'm' } = options;
        const paddedId = characterId.toString().padStart(6, '0');
        return `${BASE_URL}/CharacterIcon/CHR_${paddedId}/CHR_${paddedId}_00_${size}.png`;
    }

    /**
     * 获取角色头像URL (小尺寸，适合列表显示)
     */
    static getAvatarUrl(characterId: number): string {
        return this.getUrl(characterId, { size: 's' });
    }

    /**
     * 获取角色卡片URL (中等尺寸，适合卡片显示)
     */
    static getCardUrl(characterId: number): string {
        return this.getUrl(characterId, { size: 'm' });
    }

    /**
     * 获取角色详情URL (大尺寸，适合详情页)
     */
    static getDetailUrl(characterId: number): string {
        return this.getUrl(characterId, { size: 'l' });
    }

    /**
     * 获取角色宽屏图标URL (256*152，适合横幅)
     */
    static getWideUrl(characterId: number): string {
        return this.getUrl(characterId, { size: 'w' });
    }
}

/**
 * 装备图标管理
 */
export class EquipmentIconManager {
    /**
     * 获取装备图标URL
     * @param equipmentId 装备ID
     * @param options 图标选项
     */
    static getUrl(equipmentId: number, options: IconOptions = {}): string {
        const { size = 'm' } = options;
        // 装备ID格式: ITM_Equipment_000001
        const paddedId = equipmentId.toString().padStart(6, '0');
        return `${BASE_URL}/EquipmentIcon/ITM_Equipment_${paddedId}/ITM_Equipment_${paddedId}_${size}.png`;
    }
}

/**
 * 道具图标管理
 */
export class ItemIconManager {
    /**
     * 获取道具图标URL
     * @param itemId 道具ID
     * @param options 图标选项
     */
    static getUrl(itemId: number, options: IconOptions = {}): string {
        const { size = 'm' } = options;
        const paddedId = itemId.toString().padStart(6, '0');
        return `${BASE_URL}/ItemIcon/ITM_${paddedId}/ITM_${paddedId}_${size}.png`;
    }
}

/**
 * 遗物(圣遗物)图标管理
 */
export class RelicIconManager {
    /**
     * 获取遗物图标URL
     * @param relicId 遗物ID
     * @param options 图标选项
     */
    static getUrl(relicId: number, options: IconOptions = {}): string {
        const { size = 'm' } = options;
        const paddedId = relicId.toString().padStart(6, '0');
        return `${BASE_URL}/DungeonBattleRelicIcon/ITM_DungeonBattleRelic_${paddedId}/ITM_DungeonBattleRelic_${paddedId}_${size}.png`;
    }
}

/**
 * 宝石图标管理
 */
export class SphereIconManager {
    /**
     * 获取宝石图标URL
     * @param sphereId 宝石ID
     * @param options 图标选项
     */
    static getUrl(sphereId: number, options: IconOptions = {}): string {
        const { size = 'm' } = options;
        const paddedId = sphereId.toString().padStart(6, '0');
        return `${BASE_URL}/SphereIcon/ITM_Sphere_${paddedId}/ITM_Sphere_${paddedId}_${size}.png`;
    }
}

/**
 * 技能图标管理
 */
export class SkillIconManager {
    /**
     * 获取技能图标URL
     * @param skillId 技能ID
     * @param options 图标选项
     */
    static getUrl(skillId: number, options: IconOptions = {}): string {
        const { size = 'm' } = options;
        const paddedId = skillId.toString().padStart(6, '0');
        return `${BASE_URL}/SkillIcon/SKL_${paddedId}/SKL_${paddedId}_${size}.png`;
    }
}

/**
 * 统一的资源管理器入口
 */
export const AssetManager = {
    character: CharacterIconManager,
    equipment: EquipmentIconManager,
    item: ItemIconManager,
    relic: RelicIconManager,
    sphere: SphereIconManager,
    skill: SkillIconManager,
} as const;

export default AssetManager;
