import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BattleSimulationResult } from '@/api/generated/battleSimulationResult';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';
import { BattleTeamStats } from './BattleTeamStats';
import { BattleReplayModal } from './BattleReplayModal';
import { Trophy, X, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BattleLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    battleData: BattleSimulationResult | null;
}

export function BattleLogModal({
    isOpen,
    onClose,
    battleData
}: BattleLogModalProps) {
    const [isReplayOpen, setIsReplayOpen] = useState(false);

    if (!battleData) return null;

    const { battleEndInfo, battleCharacterReports } = battleData;
    const isWin = battleEndInfo.winGroupType === BattleFieldCharacterGroupType.Attacker;

    // 分组角色
    const attackerCharacters = battleCharacterReports.filter(
        c => c.groupType === BattleFieldCharacterGroupType.Attacker
    );
    const defenderCharacters = battleCharacterReports.filter(
        c => c.groupType === BattleFieldCharacterGroupType.Receiver
    );

    // 获取队伍名称
    const attackerName = attackerCharacters[0]?.playerName || '我方';
    const defenderName = defenderCharacters[0]?.playerName || '敌方';

    // 检查是否有战斗日志数据
    const hasBattleLog = battleData.battleLog?.battleSubLogs && battleData.battleLog.battleSubLogs.length > 0;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Trophy className={cn(
                                    "w-6 h-6",
                                    isWin ? "text-yellow-500" : "text-gray-400"
                                )} />
                                <div>
                                    <DialogTitle className="text-lg">战斗记录</DialogTitle>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                        <span>获胜回合数: {battleEndInfo.endTurn}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="px-6 pb-6 max-h-[calc(90vh-140px)]">
                        {/* 队伍对比 */}
                        <div className="flex gap-4">
                            {/* 攻击方 */}
                            <BattleTeamStats
                                characters={attackerCharacters}
                                teamName={attackerName}
                                isWin={isWin}
                                groupType={BattleFieldCharacterGroupType.Attacker}
                            />

                            {/* 防守方 */}
                            <BattleTeamStats
                                characters={defenderCharacters}
                                teamName={defenderName}
                                isWin={!isWin}
                                groupType={BattleFieldCharacterGroupType.Receiver}
                            />
                        </div>

                        {/* 底部按钮 */}
                        <div className="flex justify-center gap-4 mt-6">
                            <Button variant="outline" onClick={onClose}>
                                <X className="w-4 h-4 mr-1" />
                                关闭
                            </Button>
                            <Button
                                variant="default"
                                disabled={!hasBattleLog}
                                title={hasBattleLog ? "观看战斗重播" : "无战斗日志数据"}
                                onClick={() => setIsReplayOpen(true)}
                            >
                                <Play className="w-4 h-4 mr-1" />
                                重播
                            </Button>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* 战斗重播弹窗 */}
            <BattleReplayModal
                isOpen={isReplayOpen}
                onClose={() => setIsReplayOpen(false)}
                battleData={battleData}
            />
        </>
    );
}
