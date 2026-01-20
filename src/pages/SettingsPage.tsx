import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, User, Volume2, Info } from 'lucide-react';

export function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">设置</h1>
                <p className="text-muted-foreground">管理应用设置和偏好</p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="account">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="account">
                        <User className="mr-2 h-4 w-4" />
                        账号
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        通知
                    </TabsTrigger>
                    <TabsTrigger value="game">
                        <Volume2 className="mr-2 h-4 w-4" />
                        游戏
                    </TabsTrigger>
                    <TabsTrigger value="about">
                        <Info className="mr-2 h-4 w-4" />
                        关于
                    </TabsTrigger>
                </TabsList>

                {/* Account Settings */}
                <TabsContent value="account" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>账号信息</CardTitle>
                            <CardDescription>管理你的账号设置</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start">
                                修改密码
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                绑定邮箱
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                账号安全设置
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>通知设置</CardTitle>
                            <CardDescription>管理通知偏好</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>体力恢复满提醒</Label>
                                    <p className="text-sm text-muted-foreground">
                                        当体力恢复满时通知你
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>任务完成提醒</Label>
                                    <p className="text-sm text-muted-foreground">
                                        任务完成时通知你
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>公会活动提醒</Label>
                                    <p className="text-sm text-muted-foreground">
                                        公会活动开始时通知你
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>系统公告</Label>
                                    <p className="text-sm text-muted-foreground">
                                        接收游戏系统公告
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Game Settings */}
                <TabsContent value="game" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>游戏设置</CardTitle>
                            <CardDescription>调整游戏体验</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>背景音乐</Label>
                                    <p className="text-sm text-muted-foreground">
                                        启用背景音乐
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>音效</Label>
                                    <p className="text-sm text-muted-foreground">
                                        启用游戏音效
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>跳过动画</Label>
                                    <p className="text-sm text-muted-foreground">
                                        跳过战斗和技能动画
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>自动战斗</Label>
                                    <p className="text-sm text-muted-foreground">
                                        默认开启自动战斗
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* About */}
                <TabsContent value="about" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>关于</CardTitle>
                            <CardDescription>应用信息</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">版本</span>
                                <span className="font-semibold">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">最后更新</span>
                                <span className="font-semibold">2026-01-20</span>
                            </div>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full">
                                    检查更新
                                </Button>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground text-center">
                                    © 2026 MementoMori. All rights reserved.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
