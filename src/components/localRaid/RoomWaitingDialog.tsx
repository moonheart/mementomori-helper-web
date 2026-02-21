import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Users,
    Crown,
    Check,
    X,
    Play,
    LogOut,
    Loader2,
    Trophy,
    Clock,
} from 'lucide-react';
import { LocalRaidPartyInfo } from '@/api/localRaidSignalRService';
import { LocalRaidRoomConditionsType } from '@/api/generated';
import { CreateRoomParams } from '@/api/localRaidSignalRService';
import { clsx } from 'clsx';

interface RoomWaitingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    room: LocalRaidPartyInfo | null;
    myPlayerId: number;
    onReady: (isReady: boolean) => Promise<void>;
    onStartBattle: () => Promise<void>;
    onDisband: () => Promise<void>;
    onUpdateCondition: (params: CreateRoomParams) => Promise<void>;
}

export function RoomWaitingDialog({
    open,
    onOpenChange,
    room,
    myPlayerId,
    onReady,
    onStartBattle,
    onDisband,
}: RoomWaitingDialogProps) {
    const [isReady, setIsReady] = useState(false);
    const [loading, setLoading] = useState(false);

    // 判断是否是房主 - 通过比较 leaderPlayerId
    const isLeader = room?.leaderPlayerId === myPlayerId;

    // 全体就绪：房主默认就绪，其他成员需点准备
    const allReady = room?.localRaidBattleLogPlayerInfoList?.every(
        (member) => member.isLeader || member.isReady
    ) ?? false;

    // 成员数量
    const memberCount = room?.localRaidBattleLogPlayerInfoList?.length || 0;

    // 房间满员（最多3人）
    const isFull = memberCount >= 3;

    // 处理准备按钮
    const handleReady = async () => {
        if (isLeader) return;
        setLoading(true);
        try {
            await onReady(!isReady);
            setIsReady(!isReady);
        } finally {
            setLoading(false);
        }
    };

    // 处理开始战斗
    const handleStartBattle = async () => {
        setLoading(true);
        try {
            await onStartBattle();
        } finally {
            setLoading(false);
        }
    };

    // 处理离开/解散
    const handleLeave = async () => {
        setLoading(true);
        try {
            if (isLeader) {
                await onDisband();
            }
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    // 重置准备状态 - 从房间成员列表中找到自己的状态
    useEffect(() => {
        if (room && myPlayerId) {
            const myInfo = room.localRaidBattleLogPlayerInfoList?.find(
                (m) => m.playerInfo?.playerId === myPlayerId
            );
            setIsReady(myInfo?.isReady || false);
        }
    }, [room, myPlayerId]);

    if (!room) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        等待队友
                    </DialogTitle>
                    <DialogDescription>
                        房间ID: {room.roomId?.slice(0, 12) || 'Unknown'}...
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* 房间状态 */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{memberCount}/3 人</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {room.conditionsType !== LocalRaidRoomConditionsType.None && (
                                <Badge variant="outline">
                                    {room.conditionsType === LocalRaidRoomConditionsType.BattlePower && (
                                        <span>战力: {room.requiredBattlePower.toLocaleString()}</span>
                                    )}
                                    {room.conditionsType === LocalRaidRoomConditionsType.Password && (
                                        <span>密码房间</span>
                                    )}
                                    {room.conditionsType === LocalRaidRoomConditionsType.All && (
                                        <span>战力+密码</span>
                                    )}
                                </Badge>
                            )}
                            {room.isAutoStart && (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                    自动开始
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* 总战力 */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span>总战力</span>
                        </div>
                        <span className="font-bold">
                            {room.totalBattlePower?.toLocaleString() || '--'}
                        </span>
                    </div>

                    {/* 成员列表 */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">成员</h4>
                        {room.localRaidBattleLogPlayerInfoList?.map((member, index) => (
                            <Card key={index} className={clsx(
                                member.isLeader && "border-yellow-500"
                            )}>
                                <CardContent className="py-2 px-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                member.isLeader ? "bg-yellow-500 text-white" : "bg-muted"
                                            )}>
                                                {member.isLeader ? (
                                                    <Crown className="h-4 w-4" />
                                                ) : (
                                                    <Users className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {member.playerInfo?.playerName || '未知'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    战力: {member.playerInfo?.battlePower?.toLocaleString() || '--'}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {member.isLeader ? (
                                                <Badge variant="outline" className="text-yellow-600">
                                                    房主
                                                </Badge>
                                            ) : member.isReady ? (
                                                <Badge className="bg-green-500">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    准备
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    等待
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                        {isLeader ? (
                            // 房主操作
                            <>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleLeave}
                                    disabled={loading}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    解散房间
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleStartBattle}
                                    disabled={loading || !allReady || memberCount < 1}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Play className="h-4 w-4 mr-2" />
                                    )}
                                    开始战斗
                                </Button>
                            </>
                        ) : (
                            // 成员操作
                            <>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleLeave}
                                    disabled={loading}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    离开房间
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleReady}
                                    disabled={loading}
                                    variant={isReady ? "secondary" : "default"}
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : isReady ? (
                                        <X className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-2" />
                                    )}
                                    {isReady ? '取消准备' : '准备'}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* 提示 */}
                    {isLeader && !allReady && (
                        <p className="text-xs text-muted-foreground text-center">
                            等待所有成员准备就绪后可开始战斗
                        </p>
                    )}
                    {room.isAutoStart && allReady && isFull && (
                        <p className="text-xs text-green-600 text-center">
                            所有人已准备，即将自动开始...
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
