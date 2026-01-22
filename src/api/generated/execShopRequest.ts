/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiRequestBase } from "./apiRequestBase";
import { IDungeonBattleRequest } from "./iDungeonBattleRequest";

export class ExecShopRequest extends ApiRequestBase implements IDungeonBattleRequest {
    dungeonGridGuid: string;
    tradeShopItemId: number;
    currentTermId: number;
}
