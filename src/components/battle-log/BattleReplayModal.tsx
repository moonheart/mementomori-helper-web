import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BattleSimulationResult } from '@/api/generated/battleSimulationResult';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';
import { useBattleReplay } from '@/hooks/useBattleReplay';
import { BattleCharacterAvatar } from './BattleCharacterAvatar';
import { BattleLogPanel } from './BattleLogPanel';
import { cn } from '@/lib/utils';
import { 
    Play, 
    Pause, 
    RotateCcw, 
    ChevronLeft, 
    ChevronRight,
    SkipBack,
    SkipForward,
    Swords
} from 'lucide-react';
import { useCallback } from 'react';

interface BattleReplayModalProps {
    isOpen: boolean;
    onClose: () => void;
    battleData: BattleSimulationResult | null;
}

/**
 * 伤害数字组件
 */
function DamageNumber({ value, isCrit }: { value: number; isCrit: boolean }) {
    const isHeal = value > 0;
    const displayValue = Math.abs(value).toLocaleString();
    
    return (
        <div 
            className={cn(
                "absolute font-bold text-lg animate-float-up pointer-events-none z-50",
                isHeal ? "text-green-500" : "text-red-500",
                isCrit && "text-yellow-500 text-xl"
            )}
            style={{
                animation: 'floatUp 1s ease-out forwards'
            }}
        >
            {isHeal ? '+' : '-'}{displayValue}
        </div>
    );
}

export function BattleReplayModal({
    isOpen,
    onClose,
    battleData
}: BattleReplayModalProps) {
    const {
        replayState,
        currentIndex,
        totalEvents,
        currentTurn,
        characters,
        currentEvent,
        activeDamageEvents,
        snapshots,
        play,
        pause,
        reset,
        goTo,
        next,
        prev,
        nextTurn,
        prevTurn
    } = useBattleReplay(battleData);

    // 关闭时重置
    const handleClose = useCallback(() => {
        pause();
        reset();
        onClose();
    }, [pause, reset, onClose]);

    // 点击日志事件跳转
    const handleEventClick = useCallback((index: number) => {
        goTo(index);
    }, [goTo]);

    if (!battleData) return null;

    // 分组角色
    const attackerChars = Array.from(characters.values())
        .filter(c => c.groupType === BattleFieldCharacterGroupType.Attacker);
    const defenderChars = Array.from(characters.values())
        .filter(c => c.groupType === BattleFieldCharacterGroupType.Receiver);

    // 获取当前行动角色（通过 sourceGuid 查找）
    const actingCharacter = currentEvent?.sourceGuid 
        ? Array.from(characters.values()).find(c => c.guid === currentEvent.sourceGuid)
        : null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
                <TooltipProvider>
                <DialogHeader className="px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Swords className="w-6 h-6 text-primary" />
                            <div>
                                <DialogTitle className="text-lg">战斗重播</DialogTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                    <span>回合 {currentTurn}</span>
                                    {currentEvent && (
                                        <span className="text-xs px-2 py-0.5 bg-muted rounded">
                                            {getEventLabel(currentEvent)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* 回合导航 */}
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={prevTurn}
                                disabled={currentIndex <= 0}
                            >
                                <SkipBack className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-medium px-2 min-w-[80px] text-center">
                                回合 {currentTurn}
                            </span>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={nextTurn}
                                disabled={currentIndex >= totalEvents - 1}
                            >
                                <SkipForward className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* 战斗区域 */}
                <div className="flex gap-4 px-6 py-4 min-h-[400px]">
                    {/* 我方队伍 */}
                    <div className="w-[320px] space-y-2 flex-shrink-0">
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                            我方队伍
                        </div>
                        {attackerChars.map(char => (
                            <BattleCharacterAvatar
                                key={char.id}
                                character={char}
                                isActing={actingCharacter?.guid === char.guid}
                            />
                        ))}
                    </div>

                    {/* 中央战斗日志区域 */}
                    <div className="flex-1 relative bg-gradient-to-b from-muted/30 to-muted/50 rounded-lg h-[400px] flex flex-col overflow-hidden">
                        {/* 标题栏 */}
                        <div className="px-3 py-2 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">战斗日志</span>
                            <span className="text-xs text-muted-foreground">
                                共 {totalEvents} 条记录
                            </span>
                        </div>
                        
                        {/* 日志面板 */}
                        <BattleLogPanel
                            snapshots={snapshots}
                            currentIndex={currentIndex}
                            onEventClick={handleEventClick}
                        />

                        {/* 伤害数字浮动层 */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {activeDamageEvents
                                .filter(event => event.value !== 0) // 过滤 Miss (value=0)
                                .map(event => {
                                    const targetChar = Array.from(characters.values()).find(
                                        c => c.guid === event.targetGuid && c.groupType === event.targetGroupType
                                    );
                                    if (!targetChar) return null;
                                    
                                    const isAttacker = targetChar.groupType === BattleFieldCharacterGroupType.Attacker;
                                    const positionClass = isAttacker ? 'left-[10%]' : 'right-[10%]';
                                    const offsetY = (event.id.charCodeAt(event.id.length - 1) % 40) - 20;
                                    
                                    return (
                                        <div
                                            key={event.id}
                                            className={cn("absolute top-1/2", positionClass)}
                                            style={{ 
                                                transform: `translateY(${-50 + offsetY}px)`,
                                                animation: 'floatUp 1s ease-out forwards'
                                            }}
                                        >
                                            <DamageNumber 
                                                value={event.value} 
                                                isCrit={event.isCrit} 
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* 敌方队伍 */}
                    <div className="w-[320px] space-y-2 flex-shrink-0">
                        <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-2 text-right">
                            敌方队伍
                        </div>
                        {defenderChars.map(char => (
                            <BattleCharacterAvatar
                                key={char.id}
                                character={char}
                                isActing={actingCharacter?.guid === char.guid}
                            />
                        ))}
                    </div>
                </div>

                {/* 控制栏 */}
                <div className="px-6 pb-6">
                    <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
                        {/* 播放控制 */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={reset}
                                title="重置"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={prev}
                                disabled={currentIndex <= 0}
                                title="上一步"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            
                            {replayState === 'playing' ? (
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={pause}
                                    className="h-12 w-12"
                                    title="暂停"
                                >
                                    <Pause className="w-5 h-5" />
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="icon"
                                    onClick={play}
                                    className="h-12 w-12"
                                    title="播放"
                                    disabled={currentIndex >= totalEvents - 1}
                                >
                                    <Play className="w-5 h-5 ml-0.5" />
                                </Button>
                            )}
                            
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={next}
                                disabled={currentIndex >= totalEvents - 1}
                                title="下一步"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* 状态显示 */}
                        <div className="ml-4 text-sm text-muted-foreground">
                            {replayState === 'idle' && '准备就绪'}
                            {replayState === 'playing' && '播放中...'}
                            {replayState === 'paused' && '已暂停'}
                            {replayState === 'ended' && '播放完毕'}
                        </div>
                    </div>
                </div>

                {/* 添加动画样式 */}
                <style>{`
                    @keyframes floatUp {
                        0% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(-50px) scale(0.8);
                        }
                    }
                    .animate-float-up {
                        animation: floatUp 1s ease-out forwards;
                    }
                `}</style>
                </TooltipProvider>
            </DialogContent>
        </Dialog>
    );
}

/**
 * 获取事件标签
 */
function getEventLabel(event: { type: string; skillId?: number }): string {
    switch (event.type) {
        case 'turn_start':
            return '回合开始';
        case 'turn_end':
            return '回合结束';
        case 'action':
            return `技能 #${event.skillId}`;
        case 'damage':
            return '造成伤害';
        case 'heal':
            return '治疗';
        case 'passive':
            return '被动触发';
        case 'effect':
            return '效果触发';
        default:
            return event.type;
    }
}