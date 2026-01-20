import { Bell, ChevronDown, Diamond, Coins, Zap } from 'lucide-react';
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
import { mockCurrency, mockPlayerInfo } from '@/mocks/data';

export function Header() {
    const navigate = useNavigate();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Player Info */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{mockPlayerInfo.name}</span>
                            <Badge variant="secondary">Lv.{mockPlayerInfo.level}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            经验: {mockPlayerInfo.exp}/{mockPlayerInfo.maxExp}
                        </div>
                    </div>
                </div>
            </div>

            {/* Currency & Actions */}
            <div className="flex items-center gap-4">
                {/* Currencies */}
                <div className="flex items-center gap-4">
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
                            <span>{mockPlayerInfo.name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>我的账号</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/accounts')}>
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
    );
}
