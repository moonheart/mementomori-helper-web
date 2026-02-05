import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sparkles,
    Clock,
    BookOpen,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { ortegaApi } from '@/api/ortega-client';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAccountStore } from '@/store/accountStore';
import { useMasterStore } from '@/store/masterStore';
import { useItemName } from '@/hooks/useItemName';
import { GachaCaseInfo } from '@/api/generated/gachaCaseInfo';
import { GachaCaseUiMB } from '@/api/generated/gachaCaseUiMB';
import { GachaCaseMB } from '@/api/generated/gachaCaseMB';
import { ItemType } from '@/api/generated/itemType';
import { GachaDrawResponse } from '@/api/generated/GachadrawResponse';
import { GachaGetLotteryItemListResponse } from '@/api/generated/GachagetLotteryItemListResponse';

export function GachaPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const currentAccount = useAccountStore(state => state.accounts.find(a => a.userId === state.currentAccountId));
    const getTable = useMasterStore(state => state.getTable);
    const { getItemName } = useItemName();

    const [loading, setLoading] = useState(false);
    const [gachaCaseInfos, setGachaCaseInfos] = useState<GachaCaseInfo[]>([]);
    const [gachaCaseUiMap, setGachaCaseUiMap] = useState<Record<number, GachaCaseUiMB>>({});
    const [gachaCaseMap, setGachaCaseMap] = useState<Record<number, GachaCaseMB>>({});
    const [userBalance, setUserBalance] = useState<Record<string, number>>({});
    const [alertMessage, setAlertMessage] = useState('');

    // 确认对话框状态
    const [confirmDrawOpen, setConfirmDrawOpen] = useState(false);
    const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);

    // 结果对话框状态
    const [resultDrawOpen, setResultDrawOpen] = useState(false);
    const [drawResult, setDrawResult] = useState<GachaDrawResponse | null>(null);

    // 详情对话框状态
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedGachaCase, setSelectedGachaCase] = useState<GachaCaseInfo | null>(null);
    const [lotteryDetail, setLotteryDetail] = useState<GachaGetLotteryItemListResponse | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const loadData = useCallback(async () => {
        if (!currentAccount) {
            setAlertMessage('请先登录账户');
            return;
        }
        setLoading(true);
        setAlertMessage('');
        try {
            const [gachaRes, userRes] = await Promise.all([
                ortegaApi.gacha.getList({}),
                ortegaApi.user.getUserData({})
            ]);

            setGachaCaseInfos(gachaRes.gachaCaseInfoList || []);

            // 加载 Master 数据
            const [gachaCaseUiTable, gachaCaseTable] = await Promise.all([
                getTable<GachaCaseUiMB>('GachaCaseUiTable'),
                getTable<GachaCaseMB>('GachaCaseTable')
            ]);

            const uiMap: Record<number, GachaCaseUiMB> = {};
            gachaCaseUiTable.forEach((m) => {
                uiMap[m.id] = m;
            });
            setGachaCaseUiMap(uiMap);

            const caseMap: Record<number, GachaCaseMB> = {};
            gachaCaseTable.forEach((m) => {
                caseMap[m.id] = m;
            });
            setGachaCaseMap(caseMap);

            // 提取用户余额
            const syncData = userRes.userSyncData;
            if (syncData?.userItemDtoInfo) {
                const balanceMap: Record<string, number> = {};
                syncData.userItemDtoInfo.forEach(item => {
                    const key = `${item.itemType}_${item.itemId}`;
                    balanceMap[key] = item.itemCount || 0;
                });
                setUserBalance(balanceMap);
            }
        } catch (error) {
            console.error('Failed to load gacha data:', error);
            setAlertMessage('加载抽卡数据失败，请稍后再试');
            toast({
                title: '加载失败',
                description: '无法获取抽卡数据，请稍后再试',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [currentAccount, toast, getTable]);

    useEffect(() => {
        if (currentAccount) {
            loadData();
        }
    }, [loadData, currentAccount]);

    const getUserItemCount = (itemType: ItemType, itemId: number): number => {
        const key = `${itemType}_${itemId}`;
        return userBalance[key] || 0;
    };

    const handleDrawClick = (buttonId: number) => {
        setSelectedButtonId(buttonId);
        setConfirmDrawOpen(true);
    };

    const handleConfirmDraw = async () => {
        if (!selectedButtonId) return;

        setConfirmDrawOpen(false);
        setLoading(true);
        try {
            const drawRes = await ortegaApi.gacha.draw({ gachaButtonId: selectedButtonId });
            setDrawResult(drawRes);
            setGachaCaseInfos(drawRes.gachaCaseInfoList || []);

            // 更新用户余额
            if (drawRes.userSyncData?.userItemDtoInfo) {
                const balanceMap: Record<string, number> = {};
                drawRes.userSyncData.userItemDtoInfo.forEach(item => {
                    const key = `${item.itemType}_${item.itemId}`;
                    balanceMap[key] = item.itemCount || 0;
                });
                setUserBalance(balanceMap);
            }

            setResultDrawOpen(true);
        } catch (error) {
            console.error('Draw failed:', error);
            toast({
                title: '抽卡失败',
                description: '抽卡失败，请检查余额或稍后再试',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setSelectedButtonId(null);
        }
    };

    const handleShowDetail = async (gachaCase: GachaCaseInfo) => {
        setSelectedGachaCase(gachaCase);
        setDetailOpen(true);
        setLoadingDetail(true);
        setLotteryDetail(null);

        try {
            const firstButtonId = gachaCase.gachaButtonInfoList?.[0]?.gachaButtonId;
            if (firstButtonId) {
                const lotteryRes = await ortegaApi.gacha.getLotteryItemList({ gachaButtonId: firstButtonId });
                setLotteryDetail(lotteryRes);
            }
        } catch (error) {
            console.error('Failed to load lottery detail:', error);
            toast({
                title: '加载失败',
                description: '无法获取抽卡详情',
                variant: 'destructive',
            });
        } finally {
            setLoadingDetail(false);
        }
    };

    if (loading && gachaCaseInfos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">加载抽卡数据中...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">抽卡系统</h1>
                    <p className="text-muted-foreground mt-1">
                        获取角色和装备
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                    <Clock className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    刷新数据
                </Button>
            </div>

            {/* 错误提示 */}
            {alertMessage && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
            )}

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>抽卡说明：</strong>
                    使用抽卡券或钻石进行抽卡，有机会获得稀有角色和装备。点击"详情"查看抽卡概率。
                </AlertDescription>
            </Alert>

            {/* 抽卡池列表 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {gachaCaseInfos
                    .sort((a, b) => b.displayOrder - a.displayOrder)
                    .map((gachaCase) => {
                        const uiMb = gachaCaseUiMap[gachaCase.gachaCaseUiId];

                        return (
                            <Card key={gachaCase.gachaCaseId} className="overflow-hidden">
                                {/* 抽卡池banner */}
                                <div className="h-32 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center relative">
                                    <div className="text-white text-center">
                                        <Sparkles className="h-12 w-12 mx-auto mb-2" />
                                    </div>
                                    {gachaCase.endTime > 0 && (
                                        <Badge variant="destructive" className="absolute top-2 right-2">
                                            限时
                                        </Badge>
                                    )}
                                </div>

                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                {uiMb ? t(uiMb.nameKey) : `抽卡池 #${gachaCase.gachaCaseId}`}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {uiMb ? t(uiMb.explanationKey) : ''}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleShowDetail(gachaCase)}
                                        >
                                            详情
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* 显示持有的货币/道具 */}
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">持有</div>
                                        <div className="flex flex-wrap gap-2">
                                            {gachaCase.gachaButtonInfoList
                                                ?.map(btn => btn.consumeUserItem)
                                                .filter((item, index, self) =>
                                                    index === self.findIndex(i =>
                                                        i.itemType === item.itemType && i.itemId === item.itemId
                                                    )
                                                )
                                                .map((item, idx) => (
                                                    <Badge key={idx} variant="secondary">
                                                        {getItemName(item.itemType, item.itemId)} × {getUserItemCount(item.itemType, item.itemId)}
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    {/* 抽卡按钮 */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {gachaCase.gachaButtonInfoList?.map((button) => {
                                            const count = getUserItemCount(
                                                button.consumeUserItem.itemType,
                                                button.consumeUserItem.itemId
                                            );
                                            const disabled = count < (button.consumeUserItem.itemCount || 0);

                                            return (
                                                <Button
                                                    key={button.gachaButtonId}
                                                    disabled={disabled || loading}
                                                    variant={disabled ? "outline" : "default"}
                                                    onClick={() => handleDrawClick(button.gachaButtonId)}
                                                    className="w-full"
                                                >
                                                    <Sparkles className="h-4 w-4 mr-1" />
                                                    {getItemName(button.consumeUserItem.itemType, button.consumeUserItem.itemId)} × {button.consumeUserItem.itemCount}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
            </div>

            {/* 确认抽卡对话框 */}
            <Dialog open={confirmDrawOpen} onOpenChange={setConfirmDrawOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>确认抽卡</DialogTitle>
                        <DialogDescription>
                            确定要进行抽卡吗？
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDrawOpen(false)}>
                            取消
                        </Button>
                        <Button onClick={handleConfirmDraw}>
                            确认
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 抽卡结果对话框 */}
            <Dialog open={resultDrawOpen} onOpenChange={setResultDrawOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            抽卡结果
                        </DialogTitle>
                    </DialogHeader>
                    {drawResult && (
                        <div className="space-y-4">
                            {/* 主要奖励 */}
                            {drawResult.gachaRewardItemList && drawResult.gachaRewardItemList.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">获得物品</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {drawResult.gachaRewardItemList.map((item, idx) => (
                                            <Card key={idx}>
                                                <CardContent className="p-3">
                                                    <div className="font-medium">
                                                        {getItemName(item.itemType, item.itemId)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        × {item.itemCount}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 额外奖励 */}
                            {drawResult.gachaRewardAddItemList && drawResult.gachaRewardAddItemList.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">额外奖励</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {drawResult.gachaRewardAddItemList.map((item, idx) => (
                                            <Card key={idx}>
                                                <CardContent className="p-3">
                                                    <div className="font-medium">
                                                        {getItemName(item.itemType, item.itemId)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        × {item.itemCount}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bonus 奖励 */}
                            {drawResult.bonusRewardItemList && drawResult.bonusRewardItemList.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">Bonus 奖励</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {drawResult.bonusRewardItemList.map((item, idx) => (
                                            <Card key={idx}>
                                                <CardContent className="p-3">
                                                    <div className="font-medium">
                                                        {getItemName(item.itemType, item.itemId)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        × {item.itemCount}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 角色解锁 */}
                            {drawResult.characterReleaseItemList && drawResult.characterReleaseItemList.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">新角色解锁</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {drawResult.characterReleaseItemList.map((item, idx) => (
                                            <Card key={idx} className="border-yellow-500">
                                                <CardContent className="p-3">
                                                    <div className="font-medium text-yellow-600">
                                                        {getItemName(item.itemType, item.itemId)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        × {item.itemCount}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setResultDrawOpen(false)}>
                            关闭
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 详情对话框 */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>抽卡详情</DialogTitle>
                    </DialogHeader>
                    {loadingDetail ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* 活动时间和说明 */}
                            {selectedGachaCase && gachaCaseUiMap[selectedGachaCase.gachaCaseUiId] && gachaCaseMap[selectedGachaCase.gachaCaseId] && (
                                <div className="space-y-3">
                                    {/* Header - 活动时间 */}
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div
                                            className="text-sm whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{
                                                __html: (() => {
                                                    const caseMb = gachaCaseMap[selectedGachaCase.gachaCaseId];
                                                    const uiMb = gachaCaseUiMap[selectedGachaCase.gachaCaseUiId];

                                                    // 解析时间（简化版，实际可能需要更复杂的处理）
                                                    const startTimeStr = caseMb.startTimeFixJST || '';
                                                    const endTimeStr = caseMb.endTimeFixJST || '';
                                                    const periodInfo = startTimeStr && endTimeStr
                                                        ? `${startTimeStr.replace(' ', ' ')} ~ ${endTimeStr.replace(' ', ' ')}`
                                                        : '';

                                                    return t(uiMb.detailDialogHeadingKey || '', [periodInfo]).replace(/\n/g, '<br/>');
                                                })()
                                            }}
                                        />
                                    </div>

                                    {/* Body - 详细说明 */}
                                    <div className="p-4 border rounded-lg">
                                        <div
                                            className="text-sm whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{
                                                __html: (() => {
                                                    const uiMb = gachaCaseUiMap[selectedGachaCase.gachaCaseUiId];
                                                    return t(uiMb.detailDialogDetailKey || '', [selectedGachaCase.gachaDrawCount]).replace(/\n/g, '<br/>');
                                                })()
                                            }}
                                        />
                                    </div>

                                    {/* 固定额外奖励 */}
                                    {(() => {
                                        const uiMb = gachaCaseUiMap[selectedGachaCase.gachaCaseUiId];
                                        const addRewardItems = uiMb.addRewardItems;
                                        return addRewardItems && addRewardItems.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2">{t('[GachaRewardAddItem]')}</h4>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <tbody>
                                                            {addRewardItems.map((item, idx) => (
                                                                <tr key={idx} className={idx > 0 ? 'border-t' : ''}>
                                                                    <td className="p-2">
                                                                        {getItemName(item.itemType, item.itemId)} × {item.itemCount}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* 概率信息 */}
                            {lotteryDetail && (
                                <div className="space-y-4">
                                    {/* Bonus 奖励概率 */}
                                    {lotteryDetail.gachaBonusRateList && lotteryDetail.gachaBonusRateList.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Bonus 奖励</h4>
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted">
                                                        <tr>
                                                            <th className="p-2 text-left">抽取次数</th>
                                                            <th className="p-2 text-left">奖励</th>
                                                            <th className="p-2 text-left">概率</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lotteryDetail.gachaBonusRateList.map((bonus, idx) => (
                                                            <tr key={idx} className="border-t">
                                                                <td className="p-2">{bonus.gachaCount} 次</td>
                                                                <td className="p-2">
                                                                    {bonus.gachaItemRateList?.map((item, i) => (
                                                                        <div key={i}>
                                                                            {getItemName(item.item.itemType, item.item.itemId)} × {item.item.itemCount}
                                                                        </div>
                                                                    ))}
                                                                </td>
                                                                <td className="p-2">
                                                                    {bonus.gachaItemRateList?.map((item, i) => (
                                                                        <div key={i}>
                                                                            {(item.lotteryRate * 100).toFixed(2)}%
                                                                        </div>
                                                                    ))}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* 稀有度概率 */}
                                    {lotteryDetail.gachaRarityRateList && lotteryDetail.gachaRarityRateList.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">稀有度概率</h4>
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted">
                                                        <tr>
                                                            <th className="p-2 text-left">稀有度</th>
                                                            <th className="p-2 text-left">概率</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lotteryDetail.gachaRarityRateList.map((rarity, idx) => (
                                                            <tr key={idx} className="border-t">
                                                                <td className="p-2">{t(String(rarity.characterRarityFlags))}</td>
                                                                <td className="p-2">{(rarity.lotteryRate * 100).toFixed(2)}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* 单个物品概率 */}
                                    {lotteryDetail.gachaItemRateList && lotteryDetail.gachaItemRateList.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">单个物品概率</h4>
                                            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted sticky top-0">
                                                        <tr>
                                                            <th className="p-2 text-left">物品</th>
                                                            <th className="p-2 text-left">稀有度</th>
                                                            <th className="p-2 text-left">概率</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lotteryDetail.gachaItemRateList.map((item, idx) => (
                                                            <tr key={idx} className="border-t">
                                                                <td className="p-2">
                                                                    {getItemName(item.item.itemType, item.item.itemId)} × {item.item.itemCount}
                                                                </td>
                                                                <td className="p-2">{t(String(item.characterRarityFlags))}</td>
                                                                <td className="p-2">{(item.lotteryRate * 100).toFixed(4)}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer - 注意事项 */}
                            {selectedGachaCase && gachaCaseUiMap[selectedGachaCase.gachaCaseUiId]?.detailDialogNotesKey && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                                    <div
                                        className="text-sm text-amber-900 dark:text-amber-100 whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                gachaCaseUiMap[selectedGachaCase.gachaCaseUiId].detailDialogNotesKey || '',
                                                []
                                            ).replace(/\n/g, '<br/>')
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDetailOpen(false)}>
                            关闭
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
