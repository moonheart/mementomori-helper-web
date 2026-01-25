import { ItemType } from '@/api/generated/itemType';
import { 
    ItemMB, 
    EquipmentMB, 
    CharacterMB, 
    EquipmentCompositeMB, 
    SphereMB, 
    TreasureChestMB, 
    EquipmentSetMaterialMB, 
    LevelLinkMB, 
    DungeonBattleRelicMB, 
    EquipmentSetMaterialBoxMB 
} from '@/api/generated';

export interface ItemMasterTables {
    ItemTable?: ItemMB[];
    EquipmentTable?: EquipmentMB[];
    CharacterTable?: CharacterMB[];
    EquipmentCompositeTable?: EquipmentCompositeMB[];
    SphereTable?: SphereMB[];
    TreasureChestTable?: TreasureChestMB[];
    EquipmentSetMaterialTable?: EquipmentSetMaterialMB[];
    LevelLinkTable?: LevelLinkMB[];
    DungeonBattleRelicTable?: DungeonBattleRelicMB[];
    EquipmentSetMaterialBoxTable?: EquipmentSetMaterialBoxMB[];
}

/**
 * 获取道具名称的通用工具函数
 * 参考 api\MementoMori.Ortega\Common\Utils\ItemUtil.cs
 */
export function getItemName(
    itemType: ItemType,
    itemId: number,
    masterTables: ItemMasterTables,
    t: (key: string | undefined | null, params?: unknown[]) => string
): string {
    switch (itemType) {
        case ItemType.CurrencyFree:
        case ItemType.CurrencyPaid:
        case ItemType.Gold:
        case ItemType.QuestQuickTicket:
        case ItemType.CharacterTrainingMaterial:
        case ItemType.EquipmentReinforcementItem:
        case ItemType.ExchangePlaceItem:
        case ItemType.MatchlessSacredTreasureExpItem:
        case ItemType.GachaTicket:
        case ItemType.TreasureChestKey:
        case ItemType.BossChallengeTicket:
        case ItemType.TowerBattleTicket:
        case ItemType.DungeonRecoveryItem:
        case ItemType.PlayerExp:
        case ItemType.FriendPoint:
        case ItemType.EquipmentRarityCrystal:
        case ItemType.GuildFame:
        case ItemType.GuildExp:
        case ItemType.ActivityMedal:
        case ItemType.EventExchangePlaceItem:
        case ItemType.PanelGetJudgmentItem:
        case ItemType.UnlockPanelGridItem:
        case ItemType.PanelUnlockItem:
        case ItemType.MusicTicket: {
            const itemMb = masterTables.ItemTable?.find(m => m.itemType === itemType && m.itemId === itemId);
            return t(itemMb?.nameKey) || itemMb?.memo || `道具 ${itemId}`;
        }
        case ItemType.Equipment: {
            const equipmentMb = masterTables.EquipmentTable?.find(m => m.id === itemId);
            return t(equipmentMb?.nameKey) || equipmentMb?.memo || `装备 ${itemId}`;
        }
        case ItemType.EquipmentFragment: {
            const compositeMb = masterTables.EquipmentCompositeTable?.find(m => m.id === itemId);
            const equipmentMb = masterTables.EquipmentTable?.find(m => m.id === compositeMb?.equipmentId);
            const name = t(equipmentMb?.nameKey) || equipmentMb?.memo || `装备 ${compositeMb?.equipmentId}`;
            return t('[CommonItemEquipmentFragmentFormat]', [name]) || `${name}碎片`;
        }
        case ItemType.Character: {
            const characterMb = masterTables.CharacterTable?.find(m => m.id === itemId);
            if (!characterMb) return `角色 ${itemId}`;
            const n1 = t(characterMb.nameKey);
            const n2 = t(characterMb.name2Key);
            return n2 ? `${n1} ${n2}` : n1;
        }
        case ItemType.CharacterFragment: {
            const characterMb = masterTables.CharacterTable?.find(m => m.id === itemId);
            if (!characterMb) return `角色碎片 ${itemId}`;
            const n1 = t(characterMb.nameKey);
            const n2 = t(characterMb.name2Key);
            const name = n2 ? `${n1} ${n2}` : n1;
            return t('[CommonItemCharacterFragment]', [name]) || `${name}碎片`;
        }
        case ItemType.DungeonBattleRelic: {
            const mb = masterTables.DungeonBattleRelicTable?.find(m => m.id === itemId);
            return t(mb?.nameKey) || mb?.memo || `圣遗物 ${itemId}`;
        }
        case ItemType.EquipmentSetMaterial: {
            const mb = masterTables.EquipmentSetMaterialTable?.find(m => m.id === itemId);
            return t(mb?.nameKey) || mb?.memo || `套装材料 ${itemId}`;
        }
        case ItemType.Sphere: {
            const mb = masterTables.SphereTable?.find(m => m.id === itemId);
            return t(mb?.nameKey) || mb?.memo || `宝石 ${itemId}`;
        }
        case ItemType.TreasureChest: {
            const mb = masterTables.TreasureChestTable?.find(m => m.id === itemId);
            return t(mb?.nameKey) || mb?.memo || `宝箱 ${itemId}`;
        }
        case ItemType.LevelLinkExp: {
            const mb = masterTables.LevelLinkTable?.find(m => m.id === itemId);
            return mb?.memo || `等级链接经验 ${itemId}`;
        }
        case ItemType.EquipmentSetMaterialBox: {
            const mb = masterTables.EquipmentSetMaterialBoxTable?.find(m => m.id === itemId);
            return t(mb?.nameKey) || mb?.memo || `套装材料箱 ${itemId}`;
        }
        default:
            return `道具 ${itemId}`;
    }
}
