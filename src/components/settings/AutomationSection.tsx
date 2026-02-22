import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { AutoJobModel } from '@/api/generated/autoJobModel';
import { useLocalizationStore } from '@/store/localization-store';

interface AutomationSectionProps {
    config: AutoJobModel;
    onChange: (config: AutoJobModel) => void;
    onResetCron: (key: keyof AutoJobModel) => void;
}


// 简单开关配置（没有 Cron）
const simpleSwitches = [
    { key: 'disableAll', label: '禁用所有任务' },
    { key: 'autoReinforcementEquipmentOneTime', label: '自动强化装备(一次)' },
    { key: 'autoDungeonBattle', label: '自动时空洞窟' },
    { key: 'autoUseItems', label: '自动使用物品' },
    { key: 'autoFreeGacha', label: '自动免费抽卡' },
    { key: 'autoRankUpCharacter', label: '自动进化角色' },
] as const;

// 带 Cron 的配置项
const cronItems = [
    { switchKey: 'autoPvp', cronKey: 'pvpJobCron', label: '自动竞技场' },
    { switchKey: 'autoLegendLeague', cronKey: 'legendLeagueJobCron', label: '自动传说联赛' },
    { switchKey: 'autoLocalRaid', cronKey: 'autoLocalRaidJobCron', label: '自动本地团队战' },
    { switchKey: 'autoBuyShopItem', cronKey: 'autoBuyShopItemJobCron', label: '自动购买商店道具' },
    { switchKey: 'autoChangeGachaRelic', cronKey: 'autoChangeGachaRelicJobCron', label: '切换圣遗物愿望' },
    { switchKey: 'autoDrawGachaRelic', cronKey: 'autoDrawGachaRelicJobCron', label: '抽取圣遗物(10连)' },
    { switchKey: 'autoOpenGuildRaid', cronKey: 'guildRaidBossReleaseCron', label: '自动开启公会Raid' },
] as const;

// 独立的 Cron 配置（没有对应的开关）
const standaloneCrons = [
    { key: 'dailyJobCron', label: '每日任务计划' },
    { key: 'hourlyJobCron', label: '奖励领取计划' },
] as const;

export function AutomationSection({ config, onChange, onResetCron }: AutomationSectionProps) {
    const { t } = useLocalizationStore();

    const handleSwitchChange = (key: keyof AutoJobModel, checked: boolean) => {
        onChange({ ...config, [key]: checked });
    };

    const handleCronChange = (key: keyof AutoJobModel, value: string) => {
        onChange({ ...config, [key]: value });
    };

    const handleActionToggle = (listKey: 'disabledDailyActions' | 'disabledHourlyActions', actionKey: string, enabled: boolean) => {
        const currentList = config[listKey] || [];
        let newList: string[];

        if (enabled) {
            newList = currentList.filter((k) => k !== actionKey);
        } else {
            newList = [...currentList, actionKey];
        }

        onChange({ ...config, [listKey]: newList });
    };

    const renderActionList = (listKey: 'disabledDailyActions' | 'disabledHourlyActions') => {
        const disabledList = config[listKey] || [];
        const isDaily = listKey === 'disabledDailyActions';
        const defaultActions = isDaily
            ? ['DailyLoginBonus', 'VipDailyGift', 'MonthlyBoost', 'AutoBattleReward', 'FriendPointTransfer', 'PresentReceive', 'EquipmentReinforcement', 'BossQuickBattle', 'InfiniteTower', 'BossHighSpeedBattle', 'GvgReward', 'GuildCheckin', 'GuildRaidBattle', 'GuildTower', 'FriendManage', 'AchievementReward', 'BountyQuestReward', 'BountyQuestDispatch', 'DungeonBattle', 'MissionReward', 'AutoUseItems', 'FreeGacha', 'CharacterRankUp']
            : ['DailyLoginBonus', 'BountyQuestDispatch', 'PresentReceive', 'AutoBattleReward', 'GuildRaidBattle', 'GuildTower', 'GvgReward', 'FriendPointTransfer', 'BountyQuestReward', 'MissionReward', 'FreeGacha', 'AutoUseItems', 'BookSortAuto'];

        return (
            <div className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {defaultActions.map((actionKey) => (
                        <div key={actionKey} className="flex items-center justify-between space-x-2 rounded-lg border p-2">
                            <Label htmlFor={`${listKey}-${actionKey}`} className="flex flex-col space-y-1">
                                <span className="text-sm">{t(`ACTION_${actionKey}`)}</span>
                            </Label>
                            <Switch
                                id={`${listKey}-${actionKey}`}
                                checked={!disabledList.includes(actionKey)}
                                onCheckedChange={(checked) => handleActionToggle(listKey, actionKey, checked)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>自动化配置</CardTitle>
                        <CardDescription>配置各项自动化功能的启用状态和执行计划</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <a href="https://www.freeformatter.com/cron-expression-generator-quartz.html" target="_blank" rel="noreferrer">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Cron 帮助
                        </a>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground">基础开关</h4>
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {simpleSwitches.map(({ key, label }) => (
                                <div key={key} className="flex items-center justify-between space-x-2 rounded-lg border p-2">
                                    <Label htmlFor={key} className="flex flex-col space-y-1">
                                        <span>{label}</span>
                                    </Label>
                                    <Switch
                                        id={key}
                                        checked={config[key] as boolean}
                                        onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground">定时任务</h4>
                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                            {cronItems.map(({ switchKey, cronKey, label }) => (
                                <div key={switchKey} className="space-y-2 rounded-lg border p-3">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={switchKey} className="font-medium">{label}</Label>
                                        <Switch
                                            id={switchKey}
                                            checked={config[switchKey] as boolean}
                                            onCheckedChange={(checked) => handleSwitchChange(switchKey, checked)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id={cronKey}
                                            value={config[cronKey] as string}
                                            onChange={(e) => handleCronChange(cronKey, e.target.value)}
                                            className="font-mono h-8 text-sm flex-1"
                                            placeholder="Cron 表达式"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onResetCron(cronKey)}
                                            title="恢复默认"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground">其他计划</h4>
                        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                            {standaloneCrons.map(({ key, label }) => (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={key} className="text-xs">{label}</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id={key}
                                            value={config[key] as string}
                                            onChange={(e) => handleCronChange(key, e.target.value)}
                                            className="font-mono h-8 text-sm"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onResetCron(key)}
                                            title="恢复默认"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>自动化任务动作</CardTitle>
                        <CardDescription>配置每日和每小时任务中要执行的动作</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="daily" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="daily">{t('AUTO_DAILY_ACTIONS_TITLE')}</TabsTrigger>
                            <TabsTrigger value="hourly">{t('AUTO_HOURLY_ACTIONS_TITLE')}</TabsTrigger>
                        </TabsList>
                        <div className="mt-4">
                            <TabsContent value="daily" className="space-y-4">
                                {renderActionList('disabledDailyActions')}
                            </TabsContent>
                            <TabsContent value="hourly" className="space-y-4">
                                {renderActionList('disabledHourlyActions')}
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
