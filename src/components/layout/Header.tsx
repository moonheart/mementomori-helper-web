import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Diamond, Coins, Zap, Users, User, Star, Calendar, MessageSquare } from 'lucide-react';
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
import { mockCurrency } from '@/mocks/data';

export function Header() {
    const navigate = useNavigate();
    const { t } = useLocalizationStore();
    const currentAccountId = useAccountStore((state) => state.currentAccountId);
    const setUserInfo = useUserStore((state) => state.setUserInfo);
    const [status, setStatus] = useState<UserStatusDtoInfo | null>(null);

    useEffect(() => {
        async function fetchHeaderData() {
            try {
                const response = await ortegaApi.user.getUserData({}) as UserGetUserDataResponse;
                if (response?.userSyncData?.userStatusDtoInfo) {
                    setStatus(response.userSyncData.userStatusDtoInfo);
                    // 更新全局用户状态
                    setUserInfo(response.userSyncData.userStatusDtoInfo);
                }
            } catch (error) {
                console.error('Failed to fetch header user data:', error);
            }
        }

        fetchHeaderData();
    }, [currentAccountId, setUserInfo]);

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
                    {/* Currencies */}
                    <div className="hidden items-center gap-4 2xl:flex">
                        <div className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5">
                            <Diamond className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">{mockCurrency.diamond.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{mockCurrency.gold.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5">
                            <Zap className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{mockCurrency.stamina}/{mockCurrency.maxStamina}</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            3
                        </span>
                    </Button>

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
