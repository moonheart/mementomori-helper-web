import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Swords,
    ShoppingBag,
    Users,
    User,
    Loader2,
    RefreshCcw,
    Play,
    Clock
} from 'lucide-react';
import { useAccountStore } from '@/store/accountStore';
import { settingsApi } from '@/api/settings-service';
import { jobsApi } from '@/api/jobs-service';
import { useToast } from '@/hooks/use-toast';
import dayjs from 'dayjs';

// 导入生成的配置类型
import { AutoJobModel } from '@/api/generated/autoJobModel';
import { PvpOption } from '@/api/generated/pvpOption';
import { DungeonBattleConfig } from '@/api/generated/dungeonBattleConfig';
import { FriendManageOption } from '@/api/generated/friendManageOption';
import { LocalRaidConfig } from '@/api/generated/localRaidConfig';
import { BountyQuestOption } from '@/api/generated/bountyQuestOption';
import { BountyQuestAutoConfig } from '@/api/generated/bountyQuestAutoConfig';
import { ShopConfig } from '@/api/generated/shopConfig';
import { GachaConfigModel } from '@/api/generated/gachaConfigModel';
import { ItemsConfig } from '@/api/generated/itemsConfig';
import { GuildTowerOption } from '@/api/generated/guildTowerOption';
import { JobStatusDto } from '@/api/generated/jobStatusDto';

// 导入子模块组件
import { AutomationSection } from '@/components/settings/AutomationSection';
import { BattleSection } from '@/components/settings/BattleSection';
import { SocialSection } from '@/components/settings/SocialSection';
import { ResourceSection } from '@/components/settings/ResourceSection';
import { MiscSection } from '@/components/settings/MiscSection';

export function AutomationPage() {
    const { currentAccountId, accounts } = useAccountStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeAccountName, setActiveAccountName] = useState('');
    const [status, setStatus] = useState<JobStatusDto[]>([]);

    // 各模块配置状态
    const [autoJob, setAutoJob] = useState<AutoJobModel>(() => ({ ...new AutoJobModel() }));
    const [battleLeague, setBattleLeague] = useState<PvpOption>(() => ({ ...new PvpOption() }));
    const [legendLeague, setLegendLeague] = useState<PvpOption>(() => ({ ...new PvpOption() }));
    const [dungeonBattle, setDungeonBattle] = useState<DungeonBattleConfig>(() => ({ ...new DungeonBattleConfig() }));
    const [friendManage, setFriendManage] = useState<FriendManageOption>(() => ({ ...new FriendManageOption() }));
    const [localRaid, setLocalRaid] = useState<LocalRaidConfig>(() => ({ ...new LocalRaidConfig() }));
    const [bountyQuest, setBountyQuest] = useState<BountyQuestOption>(() => ({ ...new BountyQuestOption() }));
    const [bountyQuestAuto, setBountyQuestAuto] = useState<BountyQuestAutoConfig>(() => ({ ...new BountyQuestAutoConfig() }));
    const [shop, setShop] = useState<ShopConfig>(() => ({ ...new ShopConfig() }));
    const [gacha, setGacha] = useState<GachaConfigModel>(() => ({ ...new GachaConfigModel() }));
    const [items, setItems] = useState<ItemsConfig>(() => ({ ...new ItemsConfig() }));
    const [guildTower, setGuildTower] = useState<GuildTowerOption>(() => ({ ...new GuildTowerOption() }));

    // 加载配置数据
    const loadSettings = useCallback(async (userId: number) => {
        setLoading(true);
        try {
            const [
                autoJobData,
                battleLeagueData,
                legendLeagueData,
                dungeonBattleData,
                friendManageData,
                localRaidData,
                bountyQuestData,
                bountyQuestAutoData,
                shopData,
                gachaData,
                itemsData,
                guildTowerData,
                statusData
            ] = await Promise.all([
                settingsApi.getSetting<AutoJobModel>(userId, 'autojob'),
                settingsApi.getSetting<PvpOption>(userId, 'battleleague'),
                settingsApi.getSetting<PvpOption>(userId, 'legendleague'),
                settingsApi.getSetting<DungeonBattleConfig>(userId, 'dungeonbattle'),
                settingsApi.getSetting<FriendManageOption>(userId, 'friendmanage'),
                settingsApi.getSetting<LocalRaidConfig>(userId, 'localraid'),
                settingsApi.getSetting<BountyQuestOption>(userId, 'bountyquest'),
                settingsApi.getSetting<BountyQuestAutoConfig>(userId, 'bountyquestauto'),
                settingsApi.getSetting<ShopConfig>(userId, 'shop'),
                settingsApi.getSetting<GachaConfigModel>(userId, 'gachaconfig'),
                settingsApi.getSetting<ItemsConfig>(userId, 'items'),
                settingsApi.getSetting<GuildTowerOption>(userId, 'guildtower'),
                jobsApi.getStatus(userId)
            ]);

            if (autoJobData) setAutoJob(autoJobData);
            if (battleLeagueData) setBattleLeague(battleLeagueData);
            if (legendLeagueData) setLegendLeague(legendLeagueData);
            if (dungeonBattleData) setDungeonBattle(dungeonBattleData);
            if (friendManageData) setFriendManage(friendManageData);
            if (localRaidData) setLocalRaid(localRaidData);
            if (bountyQuestData) setBountyQuest(bountyQuestData);
            if (bountyQuestAutoData) setBountyQuestAuto(bountyQuestAutoData);
            if (shopData) setShop(shopData);
            if (gachaData) setGacha(gachaData);
            if (itemsData) setItems(itemsData);
            if (guildTowerData) setGuildTower(guildTowerData);
            setStatus(statusData);

            const account = accounts.find(a => a.userId === userId);
            setActiveAccountName(account?.name || `账户 ${userId}`);
        } catch (error) {
            console.error('Failed to load settings:', error);
            toast({
                variant: 'destructive',
                title: '获取配置失败',
                description: '无法从服务器加载账户配置。'
            });
        } finally {
            setLoading(false);
        }
    }, [accounts, toast]);

    useEffect(() => {
        if (currentAccountId) {
            loadSettings(currentAccountId);
        }
    }, [currentAccountId, loadSettings]);

    // 定时刷新任务状态 (每30秒)
    useEffect(() => {
        if (!currentAccountId) return;

        const refreshStatus = async () => {
            try {
                const statusData = await jobsApi.getStatus(currentAccountId);
                setStatus(statusData);
            } catch (error) {
                console.error('Failed to refresh status:', error);
            }
        };

        const interval = setInterval(refreshStatus, 30000);
        return () => clearInterval(interval);
    }, [currentAccountId]);

    // 刷新任务状态
    const refreshJobStatus = async () => {
        if (!currentAccountId) return;
        try {
            const statusData = await jobsApi.getStatus(currentAccountId);
            setStatus(statusData);
        } catch (error) {
            console.error('Failed to refresh job status:', error);
        }
    };

    // 保存配置处理
    const handleSave = async (key: string, value: unknown) => {
        if (!currentAccountId) return;
        try {
            await settingsApi.saveSetting(currentAccountId, key, value);

            // 如果是 autojob 配置，刷新任务状态
            if (key === 'autojob') {
                await refreshJobStatus();
            }

            toast({
                title: '保存成功',
                description: `配置项 [${key}] 已更新。`,
            });
        } catch (error) {
            console.error(`Failed to save setting ${key}:`, error);
            toast({
                variant: 'destructive',
                title: '保存失败',
                description: `无法更新配置项 [${key}]。`
            });
        }
    };

    const handleTriggerJob = async (jobType: string) => {
        if (!currentAccountId) return;
        try {
            await jobsApi.triggerJob(currentAccountId, jobType);
            toast({
                title: '任务已触发',
                description: `任务 [${jobType}] 已被手动触发执行。`
            });
        } catch (error) {
            console.error('Failed to trigger job:', error);
            toast({
                variant: 'destructive',
                title: '触发失败',
                description: '无法触发该任务。'
            });
        }
    };

    if (!currentAccountId) {
        return (
            <div className="flex h-[450px] items-center justify-center">
                <Card className="w-[420px]">
                    <CardHeader className="text-center">
                        <CardTitle>未选择账户</CardTitle>
                        <CardDescription>请先在账户页面选择一个要配置的账户</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* 页面标题 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">托管管理</h1>
                    <p className="text-muted-foreground">
                        正在配置账户: <span className="text-primary font-medium">{activeAccountName}</span>
                    </p>
                </div>
                {loading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
            </div>

            {/* 活跃任务 */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-lg">活跃任务</CardTitle>
                        <CardDescription>当前后台调度的定时任务</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={refreshJobStatus} disabled={loading}>
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {status.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">暂无活跃任务，请检查配置或是否已禁用所有任务。</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {status.map((job) => (
                                <div key={job.jobType} className="flex flex-col p-3 border rounded-lg bg-card">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-medium text-sm truncate">{job.description}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] shrink-0">{job.jobType}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                        <Clock className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{job.nextRunTime ? dayjs(job.nextRunTime).format('MM-DD HH:mm') : '未计划'}</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => handleTriggerJob(job.jobType)}>
                                        <Play className="h-3 w-3 mr-1" />
                                        执行
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 配置管理 - Tab 区域 */}
            <Tabs defaultValue="automation" className="w-full">
                <TabsList className="grid w-full max-w-3xl grid-cols-5">
                    <TabsTrigger value="automation">
                        <Settings className="mr-2 h-4 w-4" />
                        任务计划
                    </TabsTrigger>
                    <TabsTrigger value="battle">
                        <Swords className="mr-2 h-4 w-4" />
                        战斗策略
                    </TabsTrigger>
                    <TabsTrigger value="resources">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        资源获取
                    </TabsTrigger>
                    <TabsTrigger value="social">
                        <Users className="mr-2 h-4 w-4" />
                        社交管理
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        <User className="mr-2 h-4 w-4" />
                        基础设置
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {/* Tab 1: 任务计划 - AutomationSection */}
                    <TabsContent value="automation">
                        <AutomationSection
                            config={autoJob}
                            onChange={(cfg) => { setAutoJob(cfg); handleSave('autojob', cfg); }}
                            onResetCron={(key) => {
                                const defaultModel = new AutoJobModel();
                                const newCfg = { ...autoJob, [key]: defaultModel[key as keyof AutoJobModel] };
                                setAutoJob(newCfg as AutoJobModel);
                                handleSave('autojob', newCfg);
                            }}
                        />
                    </TabsContent>

                    {/* Tab 2: 战斗策略 */}
                    <TabsContent value="battle">
                        <BattleSection
                            battleLeague={battleLeague}
                            legendLeague={legendLeague}
                            dungeonBattle={dungeonBattle}
                            onUpdatePvp={(key, cfg) => {
                                if (key === 'battleLeague') {
                                    setBattleLeague(cfg);
                                    handleSave('battleleague', cfg);
                                } else {
                                    setLegendLeague(cfg);
                                    handleSave('legendleague', cfg);
                                }
                            }}
                            onUpdateDungeon={(cfg) => {
                                setDungeonBattle(cfg);
                                handleSave('dungeonbattle', cfg);
                            }}
                        />
                    </TabsContent>

                    {/* Tab 3: 资源获取 */}
                    <TabsContent value="resources">
                        <ResourceSection
                            shop={shop}
                            gacha={gacha}
                            items={items}
                            onUpdateShop={(cfg) => { setShop(cfg); handleSave('shop', cfg); }}
                            onUpdateGacha={(cfg) => { setGacha(cfg); handleSave('gachaconfig', cfg); }}
                            onUpdateItems={(cfg) => { setItems(cfg); handleSave('items', cfg); }}
                        />
                    </TabsContent>

                    {/* Tab 4: 社交管理 */}
                    <TabsContent value="social">
                        <SocialSection
                            friendManage={friendManage}
                            localRaid={localRaid}
                            bountyQuest={bountyQuest}
                            bountyQuestAuto={bountyQuestAuto}
                            onUpdateFriends={(cfg) => { setFriendManage(cfg); handleSave('friendmanage', cfg); }}
                            onUpdateLocalRaid={(cfg) => { setLocalRaid(cfg); handleSave('localraid', cfg); }}
                            onUpdateBounty={(cfg) => {
                                setBountyQuest(cfg.option);
                                handleSave('bountyquest', cfg.option);
                                setBountyQuestAuto(cfg.auto);
                                handleSave('bountyquestauto', cfg.auto);
                            }}
                        />
                    </TabsContent>

                    {/* Tab 5: 基础设置 */}
                    <TabsContent value="account">
                        <MiscSection
                            guildTower={guildTower}
                            onUpdateGuildTower={(cfg) => { setGuildTower(cfg); handleSave('guildtower', cfg); }}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

export default AutomationPage;
