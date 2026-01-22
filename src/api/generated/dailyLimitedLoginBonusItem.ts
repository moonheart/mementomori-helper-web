/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IUserCharacterItem } from "./iUserCharacterItem";
import { UserItem } from "./userItem";
import { CharacterRarityFlags } from "./characterRarityFlags";

export class DailyLimitedLoginBonusItem implements IUserCharacterItem {
    dailyRewardItem: UserItem;
    date: number;
    rarityFlags: CharacterRarityFlags;
}
