/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiResponseBase } from "./apiResponseBase";
import { IUserSyncApiResponse } from "./iUserSyncApiResponse";
import { BattleRewardResult } from "./battleRewardResult";
import { BattleSimulationResult } from "./battleSimulationResult";
import { UserGuildRaidDtoInfo } from "./userGuildRaidDtoInfo";
import { UserSyncData } from "./userSyncData";

export class QuickStartGuildRaidResponse extends ApiResponseBase implements IUserSyncApiResponse {
    battleRewardResult: BattleRewardResult;
    battleSimulationResult: BattleSimulationResult;
    userGuildRaidDtoInfo: UserGuildRaidDtoInfo;
    userSyncData: UserSyncData;
}
