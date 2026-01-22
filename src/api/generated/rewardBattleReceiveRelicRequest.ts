/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiRequestBase } from "./apiRequestBase";
import { IDungeonBattleRequest } from "./iDungeonBattleRequest";

export class RewardBattleReceiveRelicRequest extends ApiRequestBase implements IDungeonBattleRequest {
    dungeonGridGuid: string;
    selectedRelicId: number;
    currentTermId: number;
}
