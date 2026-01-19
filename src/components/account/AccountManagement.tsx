import { useEffect, useState } from 'react';
import { accountApi } from '@/api/account-service';
import { useAccountStore } from '@/store/accountStore';
import { AddAccountDialog } from '@/components/account/AddAccountDialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreVertical, Plus, Trash2, LogIn } from 'lucide-react';

export function AccountManagement() {
    const { accounts, currentAccountId, setAccounts, removeAccount, setCurrentAccount, setLoading } = useAccountStore();
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [loginLoading, setLoginLoading] = useState<number | null>(null);
    const { toast } = useToast();

    // 加载账号列表
    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const data = await accountApi.getAccounts();
            setAccounts(data);
        } catch (error) {
            console.error('Failed to load accounts:', error);
            toast({
                title: '错误',
                description: '加载账号列表失败',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteUserId) return;

        try {
            await accountApi.deleteAccount(deleteUserId);
            removeAccount(deleteUserId);
            toast({
                title: '成功',
                description: '账号已删除',
            });
        } catch (error) {
            console.error('Failed to delete account:', error);
            toast({
                title: '错误',
                description: '删除账号失败',
                variant: 'destructive',
            });
        } finally {
            setDeleteUserId(null);
        }
    };

    const handleLogin = async (userId: number, clientKey: string) => {
        try {
            setLoginLoading(userId);
            const result = await accountApi.login({ userId, clientKey });

            if (result.success) {
                setCurrentAccount(userId);

                // 重新加载账号列表以获取更新的登录状态
                await loadAccounts();

                toast({
                    title: '登录成功',
                    description: result.message,
                });
            } else {
                toast({
                    title: '登录失败',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Failed to login:', error);
            toast({
                title: '错误',
                description: '登录失败',
                variant: 'destructive',
            });
        } finally {
            setLoginLoading(null);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>账号管理</CardTitle>
                            <CardDescription>
                                管理您的游戏账号，支持多账号切换
                            </CardDescription>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            添加账号
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {accounts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">还没有添加账号</p>
                            <Button onClick={() => setShowAddDialog(true)} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                添加第一个账号
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {accounts.map((account) => (
                                <div
                                    key={account.userId}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{account.name}</span>
                                                {account.isLoggedIn && (
                                                    <Badge variant="default" className="bg-green-600">在线</Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {account.userId}
                                                {account.currentWorldId && ` • 世界 ${account.currentWorldId}`}
                                            </div>
                                            {account.lastLoginTime && (
                                                <div className="text-xs text-muted-foreground">
                                                    最后登录: {new Date(account.lastLoginTime).toLocaleString('zh-CN')}
                                                </div>
                                            )}
                                        </div>
                                        {currentAccountId === account.userId && (
                                            <Badge variant="outline">当前账号</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleLogin(account.userId, account.clientKey)}
                                            disabled={loginLoading === account.userId}
                                        >
                                            {loginLoading === account.userId ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    登录
                                                </>
                                            )}
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => setDeleteUserId(account.userId)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    删除账号
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddAccountDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
            />

            <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除这个账号吗？此操作无法撤销。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
