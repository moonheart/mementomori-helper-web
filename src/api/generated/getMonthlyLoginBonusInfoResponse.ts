/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiResponseBase } from "./apiResponseBase";

export class GetMonthlyLoginBonusInfoResponse extends ApiResponseBase {
    monthlyLoginBonusId: number;
    pastReceivedCount: number;
    receivedDailyRewardDayList: number[];
    receivedLoginCountRewardDayList: number[];
}
