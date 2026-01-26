import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { AutoJobModel } from '@/api/generated/autoJobModel';

interface AutomationSectionProps {
    config: AutoJobModel;
    onChange: (config: AutoJobModel) => void;
    onResetCron: (key: keyof AutoJobModel) => void;
}

export function AutomationSection({ config, onChange, onResetCron }: AutomationSectionProps) {
    const handleSwitchChange = (key: keyof AutoJobModel, checked: boolean) => {
        onChange({ ...config, [key]: checked });
    };

    const handleCronChange = (key: keyof AutoJobModel, value: string) => {
        onChange({ ...config, [key]: value });
    };

    const switches = [
        { key: 'disableAll', label: '禁用所有任务' },
        { key: 'autoReinforcementEquipmentOneTime', label: '自动强化装备(一次)' },
        { key: 'autoPvp', label: '自动竞技场' },
        { key: 'autoLegendLeague', label: '自动传说联赛' },
        { key: 'autoDungeonBattle', label: '自动时空洞窟' },
        { key: 'autoUseItems', label: '自动使用物品' },
        { key: 'autoFreeGacha', label: '自动免费抽卡' },
        { key: 'autoRankUpCharacter', label: '自动进化角色' },
        { key: 'autoOpenGuildRaid', label: '自动开启公会Raid' },
        { key: 'autoLocalRaid', label: '自动本地团队战' },
        { key: 'autoChangeGachaRelic', label: '自动切换圣遗物愿望' },
        { key: 'autoDrawGachaRelic', label: '自动抽取圣遗物(10连)' },
    ] as const;

    const crons = [
        { key: 'dailyJobCron', label: '每日任务计划' },
        { key: 'hourlyJobCron', label: '奖励领取计划' },
        { key: 'pvpJobCron', label: '竞技场计划' },
        { key: 'legendLeagueJobCron', label: '传说联赛计划' },
        { key: 'guildRaidBossReleaseCron', label: '公会Raid释放计划' },
        { key: 'autoBuyShopItemJobCron', label: '商店购买计划' },
        { key: 'autoLocalRaidJobCron', label: '本地团队战计划' },
        { key: 'autoChangeGachaRelicJobCron', label: '切换圣遗物计划' },
        { key: 'autoDrawGachaRelicJobCron', label: '抽取圣遗物计划' },
    ] as const;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>自动化开关</CardTitle>
                        <CardDescription>控制各项自动化功能的启用状态</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {switches.map(({ key, label }) => (
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle>任务执行计划 (Cron)</CardTitle>
                        <CardDescription>配置自动化任务的执行时间周期 (Quartz Cron 表达式)</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <a href="https://www.freeformatter.com/cron-expression-generator-quartz.html" target="_blank" rel="noreferrer">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Cron 帮助
                        </a>
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {crons.map(({ key, label }) => (
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
                </CardContent>
            </Card>
        </div>
    );
}
