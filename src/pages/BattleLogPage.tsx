import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBattleLog } from '@/hooks/useBattleLog';
import { BattleLogModal } from '@/components/battle-log';
import { BattleType } from '@/api/generated/battleType';
import {
    Trophy,
    Sword,
    Target,
    Clock,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Loader2,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const battleTypeNames: Record<number, string> = {
    [BattleType.Auto]: '自动战斗',
    [BattleType.Boss]: '首领挑战',
    [BattleType.GuildBattle]: '公会战',
    [BattleType.BattleLeague]: '竞技场',
    [BattleType.LegendLeague]: '传说联赛',
    [BattleType.LocalRaid]: '幻影神殿',
    [BattleType.TowerBattle]: '无穷之塔',
    [BattleType.DungeonBattle]: '地下城',
    [BattleType.GuildRaid]: '公会讨伐',
    [BattleType.GuildTower]: '公会塔',
    [BattleType.FriendBattle]: '友谊赛',
};

export function BattleLogPage() {
    const {
        logs,
        loading,
        selectedLog,
        isModalOpen,
        pagination,
        loadLogs,
        viewLogDetail,
        deleteLog,
        closeModal
    } = useBattleLog({ pageSize: 20 });

    const [selectedType, setSelectedType] = useState<number | null>(null);

    useEffect(() => {
        loadLogs({ battleType: selectedType ?? undefined });
    }, [selectedType]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        loadLogs({ battleType: selectedType ?? undefined, page: newPage });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">战斗记录</h1>
                <p className="text-muted-foreground mt-1">
                    查看历史战斗记录和详细战报
                </p>
            </div>

            {/* 筛选栏 */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">筛选:</span>
                        <Button
                            variant={selectedType === null ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedType(null)}
                        >
                            全部
                        </Button>
                        {[BattleType.Boss, BattleType.BattleLeague, BattleType.LegendLeague, BattleType.TowerBattle].map(type => (
                            <Button
                                key={type}
                                variant={selectedType === type ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedType(type)}
                            >
                                {battleTypeNames[type] || `类型${type}`}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 战斗日志列表 */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>历史记录</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            共 {pagination.total} 条
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>暂无战斗记录</p>
                            <p className="text-sm mt-1">进行首领挑战、竞技场等战斗后会自动记录</p>
                        </div>
                    ) : (
                        <>
                            <ScrollArea className="h-[500px]">
                                <div className="space-y-2">
                                    {logs.map((log) => (
                                        <div
                                            key={log.battleToken}
                                            className={cn(
                                                "flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors",
                                                "hover:bg-muted/50",
                                                log.isWin
                                                    ? "border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10"
                                                    : "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10"
                                            )}
                                            onClick={() => viewLogDetail(log.battleToken)}
                                        >
                                            {/* 胜负标识 */}
                                            <div className={cn(
                                                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                                                log.isWin
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                            )}>
                                                {log.isWin ? (
                                                    <Trophy className="w-6 h-6" />
                                                ) : (
                                                    <Sword className="w-6 h-6" />
                                                )}
                                            </div>

                                            {/* 战斗信息 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={log.isWin ? 'default' : 'destructive'}
                                                        className="text-xs"
                                                    >
                                                        {log.isWin ? '胜利' : '失败'}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {battleTypeNames[log.battleType] || `类型${log.battleType}`}
                                                    </span>
                                                    {log.questId && (
                                                        <span className="text-xs text-muted-foreground">
                                                            关卡 {log.questId}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(log.createdAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Target className="w-3 h-3" />
                                                        {log.endTurn} 回合
                                                    </span>
                                                    <span>{formatDuration(log.battleDurationMs)}</span>
                                                </div>
                                            </div>

                                            {/* 操作按钮 */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteLog(log.battleToken);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* 分页 */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        {pagination.page} / {pagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* 战斗详情弹窗 */}
            <BattleLogModal
                isOpen={isModalOpen}
                onClose={closeModal}
                battleData={selectedLog}
            />
        </div>
    );
}
