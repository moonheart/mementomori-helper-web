import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, CheckCircle2, Target, Loader2 } from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { MissionGroupType, MissionStatusType, MissionGetMissionInfoResponse, UserMissionDtoInfo, MissionInfo, MissionMB } from '@/api/generated';
import { useMasterData } from '@/hooks/useMasterData';
import { useLocalizationStore } from '@/store/localization-store';

import { MissionRow, UIStoreMission } from '@/components/mission/MissionRow';

interface BookSortMissionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    missionData: MissionGetMissionInfoResponse | null;
    onFetchNeeded: () => void;
}

export function BookSortMissionsDialog({ open, onOpenChange, missionData, onFetchNeeded }: BookSortMissionsDialogProps) {
    const [loading, setLoading] = useState(false);
    const [claiming, setClaiming] = useState<Set<number>>(new Set());

    const getGroupInfo = (): MissionInfo | undefined => {
        if (!missionData?.missionInfoDict) return undefined;
        const dict = missionData.missionInfoDict as Record<string | number, MissionInfo>;
        return dict[MissionGroupType.BookSort] || dict[MissionGroupType[MissionGroupType.BookSort]];
    };

    const mapMissions = (): UIStoreMission[] => {
        const groupInfo = getGroupInfo();
        if (!groupInfo || !groupInfo.userMissionDtoInfoDict) return [];

        const missions: UIStoreMission[] = [];

        Object.values(groupInfo.userMissionDtoInfoDict).forEach((dtoList) => {
            if (!dtoList) return;
            (dtoList as UserMissionDtoInfo[]).forEach((dto) => {
                const history = dto.missionStatusHistory as Record<string | number, number[]>;
                if (!history) return;

                const getList = (type: MissionStatusType) => history[type] || history[MissionStatusType[type]] || [];

                let status: MissionStatusType | null = null;
                let missionId: number | null = null;

                const progressList = getList(MissionStatusType.Progress);
                const notReceivedList = getList(MissionStatusType.NotReceived);
                const lockedList = getList(MissionStatusType.Locked);
                const receivedList = getList(MissionStatusType.Received);

                if (progressList.length > 0) {
                    status = MissionStatusType.Progress;
                    missionId = progressList[progressList.length - 1];
                } else if (notReceivedList.length > 0) {
                    status = MissionStatusType.NotReceived;
                    missionId = notReceivedList[notReceivedList.length - 1];
                } else if (lockedList.length > 0) {
                    status = MissionStatusType.Locked;
                    missionId = lockedList[lockedList.length - 1];
                } else if (receivedList.length > 0) {
                    status = MissionStatusType.Received;
                    missionId = receivedList[receivedList.length - 1];
                }

                if (missionId !== null && status !== null) {
                    missions.push({
                        id: missionId,
                        missionType: dto.missionType,
                        status: status,
                        progress: dto.progressCount
                    });
                }
            });
        });

        // Sort by claimable (first) -> progress (second) -> locked -> received
        return missions.sort((a, b) => {
            const getPriority = (status: MissionStatusType) => {
                if (status === MissionStatusType.NotReceived) return 0;
                if (status === MissionStatusType.Progress) return 1;
                if (status === MissionStatusType.Locked) return 2;
                if (status === MissionStatusType.Received) return 3;
                return 4;
            };
            const priorityA = getPriority(a.status);
            const priorityB = getPriority(b.status);
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return a.id - b.id;
        });
    };

    const missions = useMemo(() => mapMissions(), [missionData]);

    const handleClaimMission = async (missionId: number) => {
        setClaiming(prev => new Set(prev).add(missionId));
        try {
            await ortegaApi.mission.rewardMission({
                targetMissionIdList: [missionId]
            });
            onFetchNeeded();
        } catch (error) {
            console.error('Failed to claim mission:', error);
        } finally {
            setClaiming(prev => {
                const newSet = new Set(prev);
                newSet.delete(missionId);
                return newSet;
            });
        }
    };

    const handleClaimAll = async () => {
        const allClaimableMissions = missions
            .filter(m => m.status === MissionStatusType.NotReceived)
            .map(m => m.id);

        if (allClaimableMissions.length === 0) return;

        setLoading(true);
        try {
            await ortegaApi.mission.rewardMission({
                targetMissionIdList: allClaimableMissions
            });
            onFetchNeeded();
        } catch (error) {
            console.error('Failed to claim all rewards:', error);
        } finally {
            setLoading(false);
        }
    };

    const claimableCount = missions.filter(m => m.status === MissionStatusType.NotReceived).length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col pt-8">
                <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mb-2">
                    <div>
                        <DialogTitle className="text-2xl font-bold">书库大扫除任务</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">完成书库大扫除任务获取奖励</p>
                    </div>
                    {claimableCount > 0 && (
                        <Button onClick={handleClaimAll} disabled={loading} className="mr-8">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            一键领取
                        </Button>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1 py-4">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {missions.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-muted-foreground">暂无书库大扫除任务</div>
                        ) : (
                            missions.map(m => (
                                <MissionRow
                                    key={m.id}
                                    mission={m}
                                    onClaim={() => handleClaimMission(m.id)}
                                    isClaiming={claiming.has(m.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
