import { useState, useCallback } from 'react';
import { battleLogApi, BattleLogSummary } from '@/api/battle-log-api';
import { BattleSimulationResult } from '@/api/generated/battleSimulationResult';
import { toast } from '@/hooks/use-toast';

interface UseBattleLogOptions {
    pageSize?: number;
}

export function useBattleLog(options: UseBattleLogOptions = {}) {
    const { pageSize = 20 } = options;

    const [logs, setLogs] = useState<BattleLogSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState<BattleSimulationResult | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0
    });

    /**
     * 加载战斗日志列表
     */
    const loadLogs = useCallback(async (params: {
        battleType?: number;
        page?: number;
        startDate?: string;
        endDate?: string;
    } = {}) => {
        setLoading(true);
        try {
            const response = await battleLogApi.getList({
                ...params,
                pageSize
            });
            setLogs(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Failed to load battle logs:', error);
            toast({
                title: '加载失败',
                description: '无法获取战斗日志列表',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    /**
     * 查看战斗日志详情
     */
    const viewLogDetail = useCallback(async (battleToken: string) => {
        setDetailLoading(true);
        try {
            const detail = await battleLogApi.getDetail(battleToken);
            const battleData = JSON.parse(detail.battleDataJson) as BattleSimulationResult;
            setSelectedLog(battleData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to load battle log detail:', error);
            toast({
                title: '加载失败',
                description: '无法获取战斗详情',
                variant: 'destructive'
            });
        } finally {
            setDetailLoading(false);
        }
    }, []);

    /**
     * 删除战斗日志
     */
    const deleteLog = useCallback(async (battleToken: string) => {
        try {
            await battleLogApi.delete(battleToken);
            toast({
                title: '删除成功',
                description: '战斗记录已删除'
            });
            // 刷新列表
            await loadLogs({ page: pagination.page });
        } catch (error) {
            console.error('Failed to delete battle log:', error);
            toast({
                title: '删除失败',
                description: '无法删除战斗记录',
                variant: 'destructive'
            });
        }
    }, [loadLogs, pagination.page]);

    /**
     * 关闭弹窗
     */
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedLog(null);
    }, []);

    return {
        logs,
        loading,
        selectedLog,
        detailLoading,
        isModalOpen,
        pagination,
        loadLogs,
        viewLogDetail,
        deleteLog,
        closeModal
    };
}
