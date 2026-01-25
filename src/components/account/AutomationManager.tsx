import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Play,
    Settings2,
    Terminal,
    Clock,
    Save,
    RefreshCcw,
    CheckCircle2
} from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { jobsApi } from '@/api/jobs-service';
import { AutoJobModel } from '@/api/generated/autoJobModel';
import { JobStatusDto } from '@/api/generated/jobStatusDto';
import { useJobLogs } from '@/hooks/useJobLogs';
import dayjs from 'dayjs';

export function AutomationManager() {
    const { currentAccountId } = useAccountStore();
    const [config, setConfig] = useState<AutoJobModel | null>(null);
    const [status, setStatus] = useState<JobStatusDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { logs, isConnected, clearLogs } = useJobLogs(currentAccountId);

    const fetchData = async () => {
        if (!currentAccountId) return;
        setLoading(true);
        try {
            const [configData, statusData] = await Promise.all([
                jobsApi.getConfig(currentAccountId),
                jobsApi.getStatus(currentAccountId)
            ]);
            setConfig(configData);
            setStatus(statusData);
        } catch (error) {
            console.error('Failed to fetch automation data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentAccountId]);

    const handleSaveConfig = async () => {
        if (!currentAccountId || !config) return;
        setSaving(true);
        try {
            await jobsApi.updateConfig(currentAccountId, config);
            await fetchData();
        } catch (error) {
            console.error('Failed to save config:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleTriggerJob = async (jobType: string) => {
        if (!currentAccountId) return;
        try {
            await jobsApi.triggerJob(currentAccountId, jobType);
        } catch (error) {
            console.error('Failed to trigger job:', error);
        }
    };

    if (!currentAccountId) return null;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* 任务列表 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg">活跃任务</CardTitle>
                            <CardDescription>当前后台调度的定时任务</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {status.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">暂无活跃任务，请检查配置或是否已禁用所有任务。</p>
                            ) : (
                                status.map((job) => (
                                    <div key={job.jobType} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{job.description}</span>
                                                <Badge variant="outline" className="text-[10px]">{job.jobType}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>下次运行: {job.nextRunTime ? dayjs(job.nextRunTime).format('MM-DD HH:mm') : '未计划'}</span>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => handleTriggerJob(job.jobType)}>
                                            <Play className="h-3 w-3 mr-1" />
                                            执行
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 控制台日志 */}
                <Card className="flex flex-col h-[400px]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            <CardTitle className="text-sm font-medium">执行日志</CardTitle>
                            {isConnected ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">已连接</Badge>
                            ) : (
                                <Badge variant="destructive" className="text-[10px]">未连接</Badge>
                            )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={clearLogs}>
                            清空
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto bg-black rounded-b-lg p-3 font-mono text-[11px]">
                        <div className="space-y-1">
                            {logs.length === 0 ? (
                                <p className="text-zinc-500 italic">等待任务执行日志...</p>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-zinc-500 shrink-0">[{log.time.split(' ')[1]}]</span>
                                        <span className={log.level === 'Error' ? 'text-red-400' : log.level === 'Warning' ? 'text-yellow-400' : 'text-zinc-300'}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 配置面板 */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            托管设置
                        </CardTitle>
                        <CardDescription>个性化配置每个账号的自动化行为</CardDescription>
                    </div>
                    <Button onClick={handleSaveConfig} disabled={saving || !config}>
                        {saving ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        保存配置
                    </Button>
                </CardHeader>
                <CardContent>
                    {config ? (
                        <div className="space-y-8">
                            {/* 全局开关 */}
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-dashed">
                                <div className="space-y-0.5">
                                    <Label className="text-base">禁用所有自动化任务</Label>
                                    <p className="text-sm text-muted-foreground">开启后，该账号的所有后台定时任务将停止运行。</p>
                                </div>
                                <Switch 
                                    checked={config.disableAll} 
                                    onCheckedChange={(checked) => setConfig({ ...config, disableAll: checked })}
                                />
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* 定时周期配置 */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        运行频率 (Cron)
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="daily-cron">每日任务周期</Label>
                                            <Input 
                                                id="daily-cron" 
                                                value={config.dailyJobCron} 
                                                onChange={(e) => setConfig({ ...config, dailyJobCron: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="hourly-cron">每小时任务周期</Label>
                                            <Input 
                                                id="hourly-cron" 
                                                value={config.hourlyJobCron} 
                                                onChange={(e) => setConfig({ ...config, hourlyJobCron: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 功能细项开关 */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        自动化细项
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <Label htmlFor="auto-pvp" className="text-sm">自动竞技场 (PVP)</Label>
                                            <Switch 
                                                id="auto-pvp"
                                                checked={config.autoPvp} 
                                                onCheckedChange={(checked) => setConfig({ ...config, autoPvp: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <Label htmlFor="auto-use-items" className="text-sm">自动使用道具</Label>
                                            <Switch 
                                                id="auto-use-items"
                                                checked={config.autoUseItems} 
                                                onCheckedChange={(checked) => setConfig({ ...config, autoUseItems: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <Label htmlFor="auto-free-gacha" className="text-sm">自动免费抽卡</Label>
                                            <Switch 
                                                id="auto-free-gacha"
                                                checked={config.autoFreeGacha} 
                                                onCheckedChange={(checked) => setConfig({ ...config, autoFreeGacha: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <Label htmlFor="auto-local-raid" className="text-sm">自动多人副本</Label>
                                            <Switch
                                                id="auto-local-raid"
                                                checked={config.autoLocalRaid}
                                                onCheckedChange={(checked) => setConfig({ ...config, autoLocalRaid: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <Label htmlFor="auto-buy-shop" className="text-sm">自动购买商店物品</Label>
                                            <Switch
                                                id="auto-buy-shop"
                                                checked={config.autoBuyShopItem}
                                                onCheckedChange={(checked) => setConfig({ ...config, autoBuyShopItem: checked })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <RefreshCcw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">加载配置中...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
