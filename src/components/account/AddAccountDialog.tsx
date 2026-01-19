import { useState } from 'react';
import { accountApi } from '@/api/account-service';
import { useAccountStore } from '@/store/accountStore';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

export function AddAccountDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [method, setMethod] = useState<'clientkey' | 'password'>('password');
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [clientKey, setClientKey] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { addAccount } = useAccountStore();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !userId) {
            toast({
                title: '错误',
                description: '请填写所有必填字段',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            if (method === 'clientkey') {
                if (!clientKey) {
                    toast({
                        title: '错误',
                        description: '请输入 ClientKey',
                        variant: 'destructive',
                    });
                    return;
                }

                const account = await accountApi.addAccountWithClientKey({
                    name,
                    userId: parseInt(userId),
                    clientKey,
                });

                addAccount(account);
                toast({
                    title: '成功',
                    description: '账号添加成功',
                });
            } else {
                if (!password) {
                    toast({
                        title: '错误',
                        description: '请输入引继码',
                        variant: 'destructive',
                    });
                    return;
                }

                const result = await accountApi.addAccountWithPassword({
                    name,
                    userId: parseInt(userId),
                    password,
                });

                if (result.success && result.clientKey) {
                    // 账号已自动添加
                    toast({
                        title: '成功',
                        description: '账号添加成功',
                    });

                    // 重新加载账号列表
                    const accounts = await accountApi.getAccounts();
                    useAccountStore.getState().setAccounts(accounts);
                } else {
                    toast({
                        title: '失败',
                        description: result.message || '获取 ClientKey 失败',
                        variant: 'destructive',
                    });
                }
            }

            // 关闭对话框并重置表单
            onOpenChange(false);
            setName('');
            setUserId('');
            setClientKey('');
            setPassword('');
        } catch (error) {
            console.error('Failed to add account:', error);
            toast({
                title: '错误',
                description: error instanceof Error ? error.message : '添加账号失败',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>添加账号</DialogTitle>
                    <DialogDescription>
                        选择使用 ClientKey 或引继码添加账号
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="password">使用引继码</TabsTrigger>
                            <TabsTrigger value="clientkey">使用 ClientKey</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name-pwd">账号名称</Label>
                                <Input
                                    id="name-pwd"
                                    placeholder="例如：我的主账号"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userid-pwd">用户 ID</Label>
                                <Input
                                    id="userid-pwd"
                                    type="number"
                                    placeholder="例如：123456"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">引继码</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="输入引继码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    系统将自动获取 ClientKey
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="clientkey" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name-ck">账号名称</Label>
                                <Input
                                    id="name-ck"
                                    placeholder="例如：我的主账号"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userid-ck">用户 ID</Label>
                                <Input
                                    id="userid-ck"
                                    type="number"
                                    placeholder="例如：123456"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="clientkey">ClientKey</Label>
                                <Input
                                    id="clientkey"
                                    type="password"
                                    placeholder="输入 ClientKey"
                                    value={clientKey}
                                    onChange={(e) => setClientKey(e.target.value)}
                                    required
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            取消
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            添加账号
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
