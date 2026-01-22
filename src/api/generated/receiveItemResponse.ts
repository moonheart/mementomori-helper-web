/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ApiResponseBase } from "./apiResponseBase";
import { IUserSyncApiResponse } from "./iUserSyncApiResponse";
import { PresentItem } from "./presentItem";
import { UserPresentDtoInfo } from "./userPresentDtoInfo";
import { UserSyncData } from "./userSyncData";

export class ReceiveItemResponse extends ApiResponseBase implements IUserSyncApiResponse {
    resultItems: PresentItem[];
    upsertPresentDtoInfoList: UserPresentDtoInfo[];
    userSyncData: UserSyncData;
}
