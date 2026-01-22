/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiRequestBase } from "./apiRequestBase";
import { IDungeonBattleRequest } from "./iDungeonBattleRequest";
import { DungeonBattleDifficultyType } from "./dungeonBattleDifficultyType";

export class RewardClearLayerRequest extends ApiRequestBase implements IDungeonBattleRequest {
    clearedLayer: number;
    dungeonBattleDifficultyType: DungeonBattleDifficultyType;
    currentTermId: number;
}
