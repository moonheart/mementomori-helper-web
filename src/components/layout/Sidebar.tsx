import { Home, Users, Package, ListTodo, ShoppingCart, Swords, Shield, MapPin, Settings, TrendingUp, Sparkles, Mountain, Ghost, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    {
        title: '每日清单',
        href: '/dashboard',
        icon: Home
    },
    {
        title: '托管管理',
        href: '/automation',
        icon: Bot
    },
    {
        title: '角色',
        href: '/characters',
        icon: Users
    },
    {
        title: '装备',
        href: '/equipment',
        icon: Package
    },
    {
        title: '战斗',
        href: '/battle',
        icon: Swords
    },
    {
        title: '塔攻略',
        href: '/tower',
        icon: MapPin
    },
    {
        title: '祈愿之泉',
        href: '/fountain',
        icon: Sparkles
    },
    {
        title: '时空洞窟',
        href: '/cave',
        icon: Mountain
    },
    {
        title: '幻影神殿',
        href: '/temple',
        icon: Ghost
    },
    {
        title: '竞技场',
        href: '/pvp',
        icon: Shield
    },
    {
        title: '公会',
        href: '/guild',
        icon: Users
    },
    {
        title: '任务',
        href: '/missions',
        icon: ListTodo
    },
    {
        title: '商店',
        href: '/shop',
        icon: ShoppingCart
    },
    {
        title: '好友',
        href: '/friends',
        icon: Users
    },
    {
        title: '排行榜',
        href: '/leaderboard',
        icon: TrendingUp
    },
    {
        title: '设置',
        href: '/settings',
        icon: Settings
    }
];

export function Sidebar() {
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
                        (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

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
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
