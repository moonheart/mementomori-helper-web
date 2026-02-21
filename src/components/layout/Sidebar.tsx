import { Home, Users, Package, Boxes, ListTodo, ShoppingCart, Swords, Shield, MapPin, Settings, TrendingUp, Sparkles, Mountain, Ghost, Bot, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLocalizationStore } from '@/store/localization-store';

const navItems: { titleKey: string; href: string; icon: React.ElementType }[] = [
    {
        titleKey: '每日清单',
        href: '/dashboard',
        icon: Home
    },
    {
        titleKey: '托管管理',
        href: '/automation',
        icon: Bot
    },
    {
        titleKey: '角色',
        href: '/characters',
        icon: Users
    },
    {
        titleKey: '装备',
        href: '/equipment',
        icon: Package
    },
    {
        titleKey: '道具',
        href: '/items',
        icon: Boxes
    },
    {
        titleKey: '战斗',
        href: '/battle',
        icon: Swords
    },
    {
        titleKey: '塔攻略',
        href: '/tower',
        icon: MapPin
    },
    {
        titleKey: '[CommonHeaderBountyQuestLabel]',
        href: '/fountain',
        icon: Sparkles
    },
    {
        titleKey: '时空洞窟',
        href: '/cave',
        icon: Mountain
    },
    {
        titleKey: '幻影神殿',
        href: '/temple',
        icon: Ghost
    },
    {
        titleKey: '竞技场',
        href: '/pvp',
        icon: Shield
    },
    {
        titleKey: '公会',
        href: '/guild',
        icon: Users
    },
    {
        titleKey: '任务',
        href: '/missions',
        icon: ListTodo
    },
    {
        titleKey: '抽卡',
        href: '/gacha',
        icon: Sparkles
    },
    {
        titleKey: '商店',
        href: '/shop',
        icon: ShoppingCart
    },
    {
        titleKey: '好友',
        href: '/friends',
        icon: Users
    },
    {
        titleKey: '战斗记录',
        href: '/battle-logs',
        icon: ScrollText
    },
    {
        titleKey: '排行榜',
        href: '/leaderboard',
        icon: TrendingUp
    },
    {
        titleKey: '设置',
        href: '/settings',
        icon: Settings
    }
];

export function Sidebar() {
    const { t } = useLocalizationStore();
    const location = useLocation();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-background">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    MementoMori
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href ||
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href + '/'));

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {t(item.titleKey)}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
