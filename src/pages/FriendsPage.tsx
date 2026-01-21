import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Users,
    UserPlus,
    Heart,
    Gift,
    Search,
    Clock,
    Swords,
    BookOpen,
    Check,
    X
} from 'lucide-react';
import { useState } from 'react';

// Mock数据 - 好友列表
const friendsList = [
    { id: 1, name: '暗影之刃', level: 85, power: 142000, online: true, lastLogin: '在线', giftSent: true, giftReceived: false },
    { id: 2, name: '星辰守护', level: 82, power: 135000, online: false, lastLogin: '2小时前', giftSent: true, giftReceived: true },
    { id: 3, name: '风之使者', level: 80, power: 128000, online: false, lastLogin: '5小时前', giftSent: false, giftReceived: true },
    { id: 4, name: '烈焰战士', level: 78, power: 125000, online: true, lastLogin: '在线', giftSent: true, giftReceived: false },
    { id: 5, name: '冰霜女神', level: 76, power: 120000, online: false, lastLogin: '1天前', giftSent: false, giftReceived: false }
];

// Mock数据 - 好友申请
const friendRequests = [
    { id: 1, name: '光明使者', level: 79, power: 130000, requestTime: '2小时前' },
    { id: 2, name: '暗夜猎手', level: 75, power: 118000, requestTime: '5小时前' },
    { id: 3, name: '圣光骑士', level: 81, power: 138000, requestTime: '1天前' }
];

// Mock数据 - 体力赠送状态
const staminaStatus = {
    sentToday: 8,
    maxSend: 10,
    receivedToday: 7,
    maxReceive: 10,
    pendingGifts: 3
};

export function FriendsPage() {
    const [searchId, setSearchId] = useState('');

    return (
        <div className="space-y-6">
            {/* 页面标题 */}
            <div>
                <h1 className="text-3xl font-bold">好友</h1>
                <p className="text-muted-foreground mt-1">
                    管理好友，赠送体力，分享游戏乐趣
                </p>
            </div>

            {/* 帮助说明 */}
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                    <strong>好友系统说明：</strong>
                    最多50位好友。每天可赠送和接收10次体力。
                    好友可用于幻影神殿组队和祈愿之泉支援。
                </AlertDescription>
            </Alert>

            {/* 体力赠送状态 */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-pink-500" />
                            今日赠送
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pink-600">
                                {staminaStatus.sentToday} / {staminaStatus.maxSend}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                已赠送体力次数
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            今日接收
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">
                                {staminaStatus.receivedToday} / {staminaStatus.maxReceive}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                已接收体力次数
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-orange-500" />
                            待领取
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600">
                                    {staminaStatus.pendingGifts}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    未领取体力礼物
                                </div>
                            </div>
                            {staminaStatus.pendingGifts > 0 && (
                                <Button className="w-full" size="sm">
                                    <Heart className="mr-2 h-4 w-4" />
                                    一键领取
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="friends" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="friends">
                        好友列表 ({friendsList.length}/50)
                    </TabsTrigger>
                    <TabsTrigger value="requests">
                        好友申请 ({friendRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="search">
                        添加好友
                    </TabsTrigger>
                </TabsList>

                {/* 好友列表 */}
                <TabsContent value="friends" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            共 {friendsList.length} 位好友
                        </div>
                        <Button variant="outline" size="sm">
                            <Gift className="mr-2 h-4 w-4" />
                            一键赠送体力
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {friendsList.map((friend) => (
                            <Card key={friend.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                                {friend.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{friend.name}</span>
                                                    {friend.online && (
                                                        <Badge className="bg-green-500">
                                                            在线
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>Lv.{friend.level}</span>
                                                    <span>•</span>
                                                    <span className="text-primary">战力: {friend.power.toLocaleString()}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {friend.lastLogin}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* 赠送状态 */}
                                            {friend.giftSent ? (
                                                <Badge variant="outline" className="text-green-600 border-green-600">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    已赠送
                                                </Badge>
                                            ) : (
                                                <Button size="sm" variant="outline">
                                                    <Gift className="mr-1 h-4 w-4" />
                                                    赠送
                                                </Button>
                                            )}

                                            {/* 接收状态 */}
                                            {friend.giftReceived && (
                                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                                    <Heart className="h-3 w-3 mr-1" />
                                                    可领取
                                                </Badge>
                                            )}

                                            {/* 更多操作 */}
                                            <Button size="sm" variant="ghost">
                                                <Users className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 好友申请 */}
                <TabsContent value="requests" className="space-y-4">
                    {friendRequests.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {friendRequests.length} 个待处理申请
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Check className="mr-2 h-4 w-4" />
                                        全部同意
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <X className="mr-2 h-4 w-4" />
                                        全部拒绝
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {friendRequests.map((request) => (
                                    <Card key={request.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white font-bold">
                                                        {request.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold mb-1">{request.name}</div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <span>Lv.{request.level}</span>
                                                            <span>•</span>
                                                            <span className="text-primary">战力: {request.power.toLocaleString()}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {request.requestTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        <Check className="mr-1 h-4 w-4" />
                                                        同意
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <X className="mr-1 h-4 w-4" />
                                                        拒绝
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="h-16 w-16 mb-4 text-muted-foreground opacity-20" />
                                <h3 className="text-lg font-semibold mb-2">暂无好友申请</h3>
                                <p className="text-muted-foreground text-sm">
                                    当有玩家向你发送好友申请时会显示在这里
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* 添加好友 */}
                <TabsContent value="search" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>通过ID搜索好友</CardTitle>
                            <CardDescription>输入玩家ID来添加好友</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="请输入玩家ID"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="flex-1"
                                />
                                <Button>
                                    <Search className="mr-2 h-4 w-4" />
                                    搜索
                                </Button>
                            </div>

                            <div className="p-4 bg-muted rounded-lg">
                                <div className="text-sm text-muted-foreground">
                                    💡 提示：
                                    <ul className="mt-2 space-y-1 list-disc list-inside">
                                        <li>最多可添加50位好友</li>
                                        <li>好友可以互相赠送体力</li>
                                        <li>好友可用于组队和借用支援角色</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>推荐好友</CardTitle>
                            <CardDescription>战力相近的其他玩家</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { id: 1, name: '推荐玩家1', level: 74, power: 126000 },
                                    { id: 2, name: '推荐玩家2', level: 76, power: 130000 },
                                    { id: 3, name: '推荐玩家3', level: 73, power: 124000 }
                                ].map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center justify-between p-3 rounded-lg border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                                                {player.name.charAt(player.name.length - 1)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">{player.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Lv.{player.level} • 战力: {player.power.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="sm">
                                            <UserPlus className="mr-1 h-4 w-4" />
                                            添加
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
