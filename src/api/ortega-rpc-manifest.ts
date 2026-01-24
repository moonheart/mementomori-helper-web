// @ts-nocheck
// 该文件由 C# 后端自动生成，仅包含类型定义，请勿手动修改
/* eslint-disable */

import type {
    AutoRequest,
    AutoResponse,
    BattleRequest,
    BattleResponse,
    BossQuickRequest,
    BossQuickResponse,
    BossRequest,
    BossResponse,
    BossRewardInfoRequest,
    BossRewardInfoResponse,
    BulkApplyFriendsRequest,
    BulkApplyFriendsResponse,
    BulkTransferFriendPointRequest,
    BulkTransferFriendPointResponse,
    BuyItemRequest,
    BuyItemResponse,
    BuyProductRequest,
    BuyProductResponse,
    CastManyRequest,
    CastManyResponse,
    CastRequest,
    CastResponse,
    ChangeEquipmentRequest,
    ChangeEquipmentResponse,
    ChangeGachaRelicRequest,
    ChangeGachaRelicResponse,
    ComebackUserRequest,
    ComebackUserResponse,
    CreateAccessTokenRequest,
    CreateAccessTokenResponse,
    CreateUserRequest,
    CreateUserResponse,
    CreateWorldPlayerRequest,
    CreateWorldPlayerResponse,
    DrawRequest,
    DrawResponse,
    EntryCharacterRequest,
    EntryCharacterResponse,
    ExecBattleRequest,
    ExecBattleResponse,
    ExecGuestRequest,
    ExecGuestResponse,
    ExecRecoveryRequest,
    ExecRecoveryResponse,
    ExecReinforceRelicRequest,
    ExecReinforceRelicResponse,
    ExecReviveRequest,
    ExecReviveResponse,
    ExecShopRequest,
    ExecShopResponse,
    FinishBattleRequest,
    FinishBattleResponse,
    GetAutoBattleRewardItemInfoRequest,
    GetAutoBattleRewardItemInfoResponse,
    GetBattleGridDataRequest,
    GetBattleGridDataResponse,
    GetCharacterStoryRewardRequest,
    GetCharacterStoryRewardResponse,
    GetComebackUserDataRequest,
    GetComebackUserDataResponse,
    GetCompetitionInfoRequest,
    GetCompetitionInfoResponse,
    GetDailyGiftRequest,
    GetDailyGiftResponse,
    GetDataUriRequest,
    GetDataUriResponse,
    GetDetailsInfoRequest,
    GetDetailsInfoResponse,
    GetDungeonBattleInfoRequest,
    GetDungeonBattleInfoResponse,
    GetFriendCampaignInfoRequest,
    GetFriendCampaignInfoResponse,
    GetGuildBaseInfoRequest,
    GetGuildBaseInfoResponse,
    GetGuildIdRequest,
    GetGuildIdResponse,
    GetGuildMemberInfoRequest,
    GetGuildMemberInfoResponse,
    GetGuildRaidInfoRequest,
    GetGuildRaidInfoResponse,
    GetGuildRaidWorldRewardInfoRequest,
    GetGuildRaidWorldRewardInfoResponse,
    GetGuildTowerInfoRequest,
    GetGuildTowerInfoResponse,
    GetGuildTowerRankingRequest,
    GetGuildTowerRankingResponse,
    GetLegendLeagueInfoRequest,
    GetLegendLeagueInfoResponse,
    GetLimitedLoginBonusInfoRequest,
    GetLimitedLoginBonusInfoResponse,
    GetListRequest,
    GetListResponse,
    GetLocalRaidBattleResultRequest,
    GetLocalRaidBattleResultResponse,
    GetLocalRaidInfoRequest,
    GetLocalRaidInfoResponse,
    GetLotteryItemListRequest,
    GetLotteryItemListResponse,
    GetMissionInfoRequest,
    GetMissionInfoResponse,
    GetMonthlyLoginBonusInfoRequest,
    GetMonthlyLoginBonusInfoResponse,
    GetMyPageNoticeInfoListRequest,
    GetMyPageNoticeInfoListResponse,
    GetMypageRequest,
    GetMypageResponse,
    GetNoticeInfoListRequest,
    GetNoticeInfoListResponse,
    GetPlayerInfoListRequest,
    GetPlayerInfoListResponse,
    GetPlayerRankingRequest,
    GetPlayerRankingResponse,
    GetProductListRequest,
    GetProductListResponse,
    GetPvpInfoRequest,
    GetPvpInfoResponse,
    GetQuestInfoRequest,
    GetQuestInfoResponse,
    GetReinforcementJobDataRequest,
    GetReinforcementJobDataResponse,
    GetServerHostRequest,
    GetServerHostResponse,
    GetUserDataRequest,
    GetUserDataResponse,
    GetWeeklyTopicsInfoRequest,
    GetWeeklyTopicsInfoResponse,
    GiveAllSrCharacterRequest,
    GiveAllSrCharacterResponse,
    GiveGuildRaidWorldRewardItemRequest,
    GiveGuildRaidWorldRewardItemResponse,
    InheritanceEquipmentRequest,
    InheritanceEquipmentResponse,
    LeaveShopRequest,
    LeaveShopResponse,
    LegendLeagueStartRequest,
    LegendLeagueStartResponse,
    LoginPlayerRequest,
    LoginPlayerResponse,
    LoginRequest,
    LoginResponse,
    MapInfoRequest,
    MapInfoResponse,
    NextQuestRequest,
    NextQuestResponse,
    OpenGuildRaidRequest,
    OpenGuildRaidResponse,
    OpenTreasureChestRequest,
    OpenTreasureChestResponse,
    ProceedLayerRequest,
    ProceedLayerResponse,
    PvpStartRequest,
    PvpStartResponse,
    QuickRequest,
    QuickResponse,
    QuickStartGuildRaidRequest,
    QuickStartGuildRaidResponse,
    RankUpRequest,
    RankUpResponse,
    ReadCharacterStoryRequest,
    ReadCharacterStoryResponse,
    ReceiveAchieveRankingRewardRequest,
    ReceiveAchieveRankingRewardResponse,
    ReceiveDailyLimitedLoginBonusRequest,
    ReceiveDailyLimitedLoginBonusResponse,
    ReceiveDailyLoginBonusRequest,
    ReceiveDailyLoginBonusResponse,
    ReceiveFloorRewardRequest,
    ReceiveFloorRewardResponse,
    ReceiveGlobalGvgRewardRequest,
    ReceiveGlobalGvgRewardResponse,
    ReceiveItemRequest,
    ReceiveItemResponse,
    ReceiveLocalGvgRewardRequest,
    ReceiveLocalGvgRewardResponse,
    ReceiveLoginCountBonusRequest,
    ReceiveLoginCountBonusResponse,
    ReceivePanelMissionBingoRewardRequest,
    ReceivePanelMissionBingoRewardResponse,
    ReceiveRewardRequest,
    ReceiveRewardResponse,
    ReceiveSpecialLimitedLoginBonusRequest,
    ReceiveSpecialLimitedLoginBonusResponse,
    ReinforceJobRequest,
    ReinforceJobResponse,
    ReinforcementRequest,
    ReinforcementResponse,
    RemakeRequest,
    RemakeResponse,
    RemoveEquipmentRequest,
    RemoveEquipmentResponse,
    RemoveFriendRequest,
    RemoveFriendResponse,
    ReplyAllFriendRequest,
    ReplyAllFriendResponse,
    ResetTabRequest,
    ResetTabResponse,
    RewardAutoBattleRequest,
    RewardAutoBattleResponse,
    RewardBattleReceiveRelicRequest,
    RewardBattleReceiveRelicResponse,
    RewardBattleReinforceRelicRequest,
    RewardBattleReinforceRelicResponse,
    RewardClearLayerRequest,
    RewardClearLayerResponse,
    RewardFriendMissionRequest,
    RewardFriendMissionResponse,
    RewardMissionActivityRequest,
    RewardMissionActivityResponse,
    RewardMissionRequest,
    RewardMissionResponse,
    RewardRequest,
    RewardResponse,
    SelectGridRequest,
    SelectGridResponse,
    SetSelectListRequest,
    SetSelectListResponse,
    SetVipLevelRequest,
    SetVipLevelResponse,
    SkipDungeonBattleRequest,
    SkipDungeonBattleResponse,
    StartGuildRaidRequest,
    StartGuildRaidResponse,
    StartRequest,
    StartResponse,
    TowerBattleQuickRequest,
    TowerBattleQuickResponse,
    TrainingRequest,
    TrainingResponse,
    UseAutoBattleRewardItemRequest,
    UseAutoBattleRewardItemResponse,
    UseFriendCodeRequest,
    UseFriendCodeResponse,
    UseRecoveryItemRequest,
    UseRecoveryItemResponse,
} from './generated';

export interface OrtegaRpcMap {
    "auth/comebackUser": {
        request: ComebackUserRequest;
        response: ComebackUserResponse;
    };
    "auth/createAccessToken": {
        request: CreateAccessTokenRequest;
        response: CreateAccessTokenResponse;
    };
    "auth/createUser": {
        request: CreateUserRequest;
        response: CreateUserResponse;
    };
    "auth/createWorldPlayer": {
        request: CreateWorldPlayerRequest;
        response: CreateWorldPlayerResponse;
    };
    "auth/getComebackUserData": {
        request: GetComebackUserDataRequest;
        response: GetComebackUserDataResponse;
    };
    "auth/getDataUri": {
        request: GetDataUriRequest;
        response: GetDataUriResponse;
    };
    "auth/getServerHost": {
        request: GetServerHostRequest;
        response: GetServerHostResponse;
    };
    "auth/login": {
        request: LoginRequest;
        response: LoginResponse;
    };
    "badge/getCompetitionInfo": {
        request: GetCompetitionInfoRequest;
        response: GetCompetitionInfoResponse;
    };
    "battle/auto": {
        request: AutoRequest;
        response: AutoResponse;
    };
    "battle/boss": {
        request: BossRequest;
        response: BossResponse;
    };
    "battle/bossQuick": {
        request: BossQuickRequest;
        response: BossQuickResponse;
    };
    "battle/bossRewardInfo": {
        request: BossRewardInfoRequest;
        response: BossRewardInfoResponse;
    };
    "battle/getLegendLeagueInfo": {
        request: GetLegendLeagueInfoRequest;
        response: GetLegendLeagueInfoResponse;
    };
    "battle/getPvpInfo": {
        request: GetPvpInfoRequest;
        response: GetPvpInfoResponse;
    };
    "battle/legendLeagueStart": {
        request: LegendLeagueStartRequest;
        response: LegendLeagueStartResponse;
    };
    "battle/nextQuest": {
        request: NextQuestRequest;
        response: NextQuestResponse;
    };
    "battle/pvpStart": {
        request: PvpStartRequest;
        response: PvpStartResponse;
    };
    "battle/quick": {
        request: QuickRequest;
        response: QuickResponse;
    };
    "battle/rewardAutoBattle": {
        request: RewardAutoBattleRequest;
        response: RewardAutoBattleResponse;
    };
    "bountyQuest/getList": {
        request: GetListRequest;
        response: GetListResponse;
    };
    "bountyQuest/remake": {
        request: RemakeRequest;
        response: RemakeResponse;
    };
    "bountyQuest/reward": {
        request: RewardRequest;
        response: RewardResponse;
    };
    "bountyQuest/start": {
        request: StartRequest;
        response: StartResponse;
    };
    "character/getCharacterStoryReward": {
        request: GetCharacterStoryRewardRequest;
        response: GetCharacterStoryRewardResponse;
    };
    "character/getDetailsInfo": {
        request: GetDetailsInfoRequest;
        response: GetDetailsInfoResponse;
    };
    "character/rankUp": {
        request: RankUpRequest;
        response: RankUpResponse;
    };
    "character/readCharacterStory": {
        request: ReadCharacterStoryRequest;
        response: ReadCharacterStoryResponse;
    };
    "debug/giveAllSrCharacter": {
        request: GiveAllSrCharacterRequest;
        response: GiveAllSrCharacterResponse;
    };
    "debug/setVipLevel": {
        request: SetVipLevelRequest;
        response: SetVipLevelResponse;
    };
    "dungeonBattle/execBattle": {
        request: ExecBattleRequest;
        response: ExecBattleResponse;
    };
    "dungeonBattle/execGuest": {
        request: ExecGuestRequest;
        response: ExecGuestResponse;
    };
    "dungeonBattle/execRecovery": {
        request: ExecRecoveryRequest;
        response: ExecRecoveryResponse;
    };
    "dungeonBattle/execReinforceRelic": {
        request: ExecReinforceRelicRequest;
        response: ExecReinforceRelicResponse;
    };
    "dungeonBattle/execRevive": {
        request: ExecReviveRequest;
        response: ExecReviveResponse;
    };
    "dungeonBattle/execShop": {
        request: ExecShopRequest;
        response: ExecShopResponse;
    };
    "dungeonBattle/finishBattle": {
        request: FinishBattleRequest;
        response: FinishBattleResponse;
    };
    "dungeonBattle/getBattleGridData": {
        request: GetBattleGridDataRequest;
        response: GetBattleGridDataResponse;
    };
    "dungeonBattle/getDungeonBattleInfo": {
        request: GetDungeonBattleInfoRequest;
        response: GetDungeonBattleInfoResponse;
    };
    "dungeonBattle/leaveShop": {
        request: LeaveShopRequest;
        response: LeaveShopResponse;
    };
    "dungeonBattle/proceedLayer": {
        request: ProceedLayerRequest;
        response: ProceedLayerResponse;
    };
    "dungeonBattle/rewardBattleReceiveRelic": {
        request: RewardBattleReceiveRelicRequest;
        response: RewardBattleReceiveRelicResponse;
    };
    "dungeonBattle/rewardBattleReinforceRelic": {
        request: RewardBattleReinforceRelicRequest;
        response: RewardBattleReinforceRelicResponse;
    };
    "dungeonBattle/rewardClearLayer": {
        request: RewardClearLayerRequest;
        response: RewardClearLayerResponse;
    };
    "dungeonBattle/selectGrid": {
        request: SelectGridRequest;
        response: SelectGridResponse;
    };
    "dungeonBattle/skipBattle": {
        request: SkipDungeonBattleRequest;
        response: SkipDungeonBattleResponse;
    };
    "dungeonBattle/useRecoveryItem": {
        request: UseRecoveryItemRequest;
        response: UseRecoveryItemResponse;
    };
    "equipment/cast": {
        request: CastRequest;
        response: CastResponse;
    };
    "equipment/castMany": {
        request: CastManyRequest;
        response: CastManyResponse;
    };
    "equipment/changeEquipment": {
        request: ChangeEquipmentRequest;
        response: ChangeEquipmentResponse;
    };
    "equipment/inheritanceEquipment": {
        request: InheritanceEquipmentRequest;
        response: InheritanceEquipmentResponse;
    };
    "equipment/reinforcement": {
        request: ReinforcementRequest;
        response: ReinforcementResponse;
    };
    "equipment/removeEquipment": {
        request: RemoveEquipmentRequest;
        response: RemoveEquipmentResponse;
    };
    "equipment/training": {
        request: TrainingRequest;
        response: TrainingResponse;
    };
    "friend/bulkApplyFriends": {
        request: BulkApplyFriendsRequest;
        response: BulkApplyFriendsResponse;
    };
    "friend/bulkTransferFriendPoint": {
        request: BulkTransferFriendPointRequest;
        response: BulkTransferFriendPointResponse;
    };
    "friend/getFriendCampaignInfo": {
        request: GetFriendCampaignInfoRequest;
        response: GetFriendCampaignInfoResponse;
    };
    "friend/getPlayerInfoList": {
        request: GetPlayerInfoListRequest;
        response: GetPlayerInfoListResponse;
    };
    "friend/removeFriend": {
        request: RemoveFriendRequest;
        response: RemoveFriendResponse;
    };
    "friend/replyAllFriend": {
        request: ReplyAllFriendRequest;
        response: ReplyAllFriendResponse;
    };
    "friend/rewardFriendMission": {
        request: RewardFriendMissionRequest;
        response: RewardFriendMissionResponse;
    };
    "friend/useFriendCode": {
        request: UseFriendCodeRequest;
        response: UseFriendCodeResponse;
    };
    "gacha/changeGachaRelic": {
        request: ChangeGachaRelicRequest;
        response: ChangeGachaRelicResponse;
    };
    "gacha/draw": {
        request: DrawRequest;
        response: DrawResponse;
    };
    "gacha/getList": {
        request: GetListRequest;
        response: GetListResponse;
    };
    "gacha/getLotteryItemList": {
        request: GetLotteryItemListRequest;
        response: GetLotteryItemListResponse;
    };
    "gacha/setSelectList": {
        request: SetSelectListRequest;
        response: SetSelectListResponse;
    };
    "globalGvg/receiveGlobalGvgReward": {
        request: ReceiveGlobalGvgRewardRequest;
        response: ReceiveGlobalGvgRewardResponse;
    };
    "guildInfo/getGuildBaseInfo": {
        request: GetGuildBaseInfoRequest;
        response: GetGuildBaseInfoResponse;
    };
    "guildInfo/getGuildId": {
        request: GetGuildIdRequest;
        response: GetGuildIdResponse;
    };
    "guildInfo/getGuildMemberInfo": {
        request: GetGuildMemberInfoRequest;
        response: GetGuildMemberInfoResponse;
    };
    "guildRaid/getGuildRaidInfo": {
        request: GetGuildRaidInfoRequest;
        response: GetGuildRaidInfoResponse;
    };
    "guildRaid/getGuildRaidWorldRewardInfo": {
        request: GetGuildRaidWorldRewardInfoRequest;
        response: GetGuildRaidWorldRewardInfoResponse;
    };
    "guildRaid/giveGuildRaidWorldRewardItem": {
        request: GiveGuildRaidWorldRewardItemRequest;
        response: GiveGuildRaidWorldRewardItemResponse;
    };
    "guildRaid/openGuildRaid": {
        request: OpenGuildRaidRequest;
        response: OpenGuildRaidResponse;
    };
    "guildRaid/quickStartGuildRaid": {
        request: QuickStartGuildRaidRequest;
        response: QuickStartGuildRaidResponse;
    };
    "guildRaid/startGuildRaid": {
        request: StartGuildRaidRequest;
        response: StartGuildRaidResponse;
    };
    "guildTower/battle": {
        request: BattleRequest;
        response: BattleResponse;
    };
    "guildTower/entryCharacter": {
        request: EntryCharacterRequest;
        response: EntryCharacterResponse;
    };
    "guildTower/getGuildTowerInfo": {
        request: GetGuildTowerInfoRequest;
        response: GetGuildTowerInfoResponse;
    };
    "guildTower/getGuildTowerRanking": {
        request: GetGuildTowerRankingRequest;
        response: GetGuildTowerRankingResponse;
    };
    "guildTower/getReinforcementJobData": {
        request: GetReinforcementJobDataRequest;
        response: GetReinforcementJobDataResponse;
    };
    "guildTower/receiveFloorReward": {
        request: ReceiveFloorRewardRequest;
        response: ReceiveFloorRewardResponse;
    };
    "guildTower/reinforceJob": {
        request: ReinforceJobRequest;
        response: ReinforceJobResponse;
    };
    "item/getAutoBattleRewardItemInfo": {
        request: GetAutoBattleRewardItemInfoRequest;
        response: GetAutoBattleRewardItemInfoResponse;
    };
    "item/openTreasureChest": {
        request: OpenTreasureChestRequest;
        response: OpenTreasureChestResponse;
    };
    "item/useAutoBattleRewardItem": {
        request: UseAutoBattleRewardItemRequest;
        response: UseAutoBattleRewardItemResponse;
    };
    "localGvg/receiveLocalGvgReward": {
        request: ReceiveLocalGvgRewardRequest;
        response: ReceiveLocalGvgRewardResponse;
    };
    "localRaid/getLocalRaidBattleResult": {
        request: GetLocalRaidBattleResultRequest;
        response: GetLocalRaidBattleResultResponse;
    };
    "localRaid/getLocalRaidInfo": {
        request: GetLocalRaidInfoRequest;
        response: GetLocalRaidInfoResponse;
    };
    "loginBonus/getLimitedLoginBonusInfo": {
        request: GetLimitedLoginBonusInfoRequest;
        response: GetLimitedLoginBonusInfoResponse;
    };
    "loginBonus/getMonthlyLoginBonusInfo": {
        request: GetMonthlyLoginBonusInfoRequest;
        response: GetMonthlyLoginBonusInfoResponse;
    };
    "loginBonus/receiveDailyLimitedLoginBonus": {
        request: ReceiveDailyLimitedLoginBonusRequest;
        response: ReceiveDailyLimitedLoginBonusResponse;
    };
    "loginBonus/receiveDailyLoginBonus": {
        request: ReceiveDailyLoginBonusRequest;
        response: ReceiveDailyLoginBonusResponse;
    };
    "loginBonus/receiveLoginCountBonus": {
        request: ReceiveLoginCountBonusRequest;
        response: ReceiveLoginCountBonusResponse;
    };
    "loginBonus/receiveSpecialLimitedLoginBonus": {
        request: ReceiveSpecialLimitedLoginBonusRequest;
        response: ReceiveSpecialLimitedLoginBonusResponse;
    };
    "mission/getMissionInfo": {
        request: GetMissionInfoRequest;
        response: GetMissionInfoResponse;
    };
    "mission/receivePanelMissionBingoReward": {
        request: ReceivePanelMissionBingoRewardRequest;
        response: ReceivePanelMissionBingoRewardResponse;
    };
    "mission/rewardMission": {
        request: RewardMissionRequest;
        response: RewardMissionResponse;
    };
    "mission/rewardMissionActivity": {
        request: RewardMissionActivityRequest;
        response: RewardMissionActivityResponse;
    };
    "notice/getMypageNoticeInfoList": {
        request: GetMyPageNoticeInfoListRequest;
        response: GetMyPageNoticeInfoListResponse;
    };
    "notice/getNoticeInfoList": {
        request: GetNoticeInfoListRequest;
        response: GetNoticeInfoListResponse;
    };
    "present/getList": {
        request: GetListRequest;
        response: GetListResponse;
    };
    "present/receiveItem": {
        request: ReceiveItemRequest;
        response: ReceiveItemResponse;
    };
    "quest/getQuestInfo ": {
        request: GetQuestInfoRequest;
        response: GetQuestInfoResponse;
    };
    "quest/mapInfo": {
        request: MapInfoRequest;
        response: MapInfoResponse;
    };
    "ranking/getPlayerRanking": {
        request: GetPlayerRankingRequest;
        response: GetPlayerRankingResponse;
    };
    "ranking/receiveAchieveRankingReward": {
        request: ReceiveAchieveRankingRewardRequest;
        response: ReceiveAchieveRankingRewardResponse;
    };
    "shop/buyProduct": {
        request: BuyProductRequest;
        response: BuyProductResponse;
    };
    "shop/getList": {
        request: GetListRequest;
        response: GetListResponse;
    };
    "shop/getProductList": {
        request: GetProductListRequest;
        response: GetProductListResponse;
    };
    "shop/receiveReward": {
        request: ReceiveRewardRequest;
        response: ReceiveRewardResponse;
    };
    "towerBattle/quick": {
        request: TowerBattleQuickRequest;
        response: TowerBattleQuickResponse;
    };
    "towerBattle/start": {
        request: StartRequest;
        response: StartResponse;
    };
    "tradeShop/buyItem": {
        request: BuyItemRequest;
        response: BuyItemResponse;
    };
    "tradeShop/getList": {
        request: GetListRequest;
        response: GetListResponse;
    };
    "tradeShop/resetTab": {
        request: ResetTabRequest;
        response: ResetTabResponse;
    };
    "user/getMypage": {
        request: GetMypageRequest;
        response: GetMypageResponse;
    };
    "user/getUserData": {
        request: GetUserDataRequest;
        response: GetUserDataResponse;
    };
    "user/loginPlayer": {
        request: LoginPlayerRequest;
        response: LoginPlayerResponse;
    };
    "vip/getDailyGift": {
        request: GetDailyGiftRequest;
        response: GetDailyGiftResponse;
    };
    "weeklyTopics/getWeeklyTopicsInfo": {
        request: GetWeeklyTopicsInfoRequest;
        response: GetWeeklyTopicsInfoResponse;
    };
}
