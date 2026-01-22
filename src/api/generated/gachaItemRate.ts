/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IUserCharacterItem } from "./iUserCharacterItem";
import { CharacterRarityFlags } from "./characterRarityFlags";
import { UserItem } from "./userItem";

export class GachaItemRate implements IUserCharacterItem {
    characterRarityFlags: CharacterRarityFlags;
    addItem: UserItem;
    lotteryRate: number;
    item: UserItem;
}
