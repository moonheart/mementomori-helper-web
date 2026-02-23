import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Users, User, Star, Calendar, MessageSquare, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ortegaApi } from '@/api/ortega-client';
import { UserGetUserDataResponse } from '@/api/generated/UsergetUserDataResponse';
import { UserStatusDtoInfo } from '@/api/generated/userStatusDtoInfo';
import { useLocalizationStore } from '@/store/localization-store';
import { useAccountStore } from '@/store/accountStore';
import { useUserStore } from '@/store/userStore';
import { useTimeManager } from '@/hooks/useTimeManager';
import { useMasterStore } from '@/store/masterStore';
import { TimeServerMB } from '@/api/generated/timeServerMB';

export function Header() {
    const navigate = useNavigate();
    const { t, currentLanguage, setLanguage } = useLocalizationStore();
    const currentAccountId = useAccountStore((state) => state.currentAccountId);
    const setUserInfo = useUserStore((state) => state.setUserInfo);
    const timeManager = useTimeManager();
    const getTable = useMasterStore((state) => state.getTable);
    const [status, setStatus] = useState<UserStatusDtoInfo | null>(null);
    const [serverTimeStr, setServerTimeStr] = useState('--:--:--');

    const languages = [
        { code: 'zhCN', label: '简体中文' },
        { code: 'zhTW', label: '繁體中文' },
        { code: 'enUS', label: 'English' },
        { code: 'jaJP', label: '日本語' },
        { code: 'koKR', label: '한국어' }
    ];

    // 获取用户数据，并初始化时间偏移
    useEffect(() => {
        async function fetchHeaderData() {
            try {
                const response = await ortegaApi.user.getUserData({}) as UserGetUserDataResponse;
                if (response?.userSyncData?.userStatusDtoInfo) {
                    setStatus(response.userSyncData.userStatusDtoInfo);
                    setUserInfo(response.userSyncData.userStatusDtoInfo);
                }
                // 初始化服务器时间偏移
                const timeServerId = response?.userSyncData?.timeServerId;
                if (timeServerId) {
                    const timeServers = await getTable<TimeServerMB>('TimeServerTable');
                    const ts = timeServers.find(s => s.timeServerType === timeServerId);
                    if (ts?.differenceDateTimeFromUtc) {
                        timeManager.setDiffFromUtc(ts.differenceDateTimeFromUtc);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch header user data:', error);
            }
        }

        fetchHeaderData();
    }, [currentAccountId, setUserInfo, getTable, timeManager]);

    // 每秒刷新服务器时间显示
    useEffect(() => {
        const update = () => {
            const d = new Date(timeManager.getServerNowMs());
            const pad = (n: number) => n.toString().padStart(2, '0');
            setServerTimeStr(
                `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ` +
                `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
            );
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [timeManager]);

    const formatTimestamp = (timestamp?: number) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <header className="flex min-h-16 items-center justify-between border-b bg-background px-6 py-2">
                {/* Player Info */}
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="truncate font-semibold">
                                {t('[CommonPlayerNameFormat]', [status?.name || '-'])}
                            </span>
                            <Badge variant="outline" className="font-mono">
                                {t('[PlayerId]')}: {status?.playerId ?? '-'}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {t('[CommonPlayerRankLabel]')}: {status?.rank ?? '-'}
                            </span>
                            <span className="mx-2">|</span>
                            <span>{t('[CommonVipWithSpaceFormat]', [status?.vip ?? 0])}</span>
                            <span className="mx-2 hidden lg:inline">|</span>
                            <span className="hidden items-center gap-1 lg:inline-flex">
                                <Calendar className="h-3 w-3" />
                                创建于: {formatTimestamp(status?.createAt)}
                            </span>
                            {status?.comment && (
                                <>
                                    <span className="mx-2 hidden xl:inline">|</span>
                                    <span className="hidden items-center gap-1 italic xl:inline-flex">
                                        <MessageSquare className="h-3 w-3" />
                                        {t('[MyPagePlayerInformationCommentLabel]')}: {status.comment}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Currency & Actions */}
                <div className="flex items-center gap-4">
                    {/* Server Time */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 font-mono text-sm" title="服务器时间">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="tabular-nums">{t('[MyPagePlayerInformationServerTimeLabel]')} {serverTimeStr}</span>
                    </div>

                    {/* Language Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" title="切换语言">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {languages.map(lang => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    className={currentLanguage === lang.code ? 'bg-accent' : ''}
                                >
                                    {lang.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Account Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <span className="max-w-[120px] truncate">
                                    {status?.name || '-'}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>我的账号</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/accounts')}>
                                <Users className="mr-2 h-4 w-4" />
                                账号管理
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/settings')}>
                                设置
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                退出登录
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
        </>
    );
}
