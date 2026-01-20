import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockGuild, mockGuildMembers } from '@/mocks/data';
import { Users, Crown, Shield as ShieldIcon, Trophy, Swords } from 'lucide-react';

export function GuildPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">公会系统</h1>
                <p className="text-muted-foreground">与公会成员一起冒险</p>
            </div>

            {/* Guild Info */}
            <Card className="border-primary">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <ShieldIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{mockGuild.name}</CardTitle>
                                <CardDescription>{mockGuild.description}</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-lg">
                            Lv.{mockGuild.level}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">成员: {mockGuild.memberCount}/{mockGuild.maxMembers}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">公会等级: {mockGuild.level}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="members">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="members">成员</TabsTrigger>
                    <TabsTrigger value="missions">任务</TabsTrigger>
                    <TabsTrigger value="boss">Boss</TabsTrigger>
                    <TabsTrigger value="settings">设置</TabsTrigger>
                </TabsList>

                {/* Members */}
                <TabsContent value="members" className="space-y-4 mt-6">
                    {mockGuildMembers.map((member) => (
                        <Card key={member.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                                        {member.role === 'leader' && <Crown className="h-6 w-6" />}
                                        {member.role !== 'leader' && member.name[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{member.name}</span>
                                            <Badge variant={
                                                member.role === 'leader' ? 'default' :
                                                    member.role === 'officer' ? 'secondary' :
                                                        'outline'
                                            }>
                                                {member.role === 'leader' && '会长'}
                                                {member.role === 'officer' && '副会长'}
                                                {member.role === 'member' && '成员'}
                                            </Badge>
                                            <Badge variant="outline">Lv.{member.level}</Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            贡献: {member.contribution.toLocaleString()} •
                                            最后上线: {member.lastActive.toLocaleString('zh-CN')}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Guild Missions */}
                <TabsContent value="missions" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>公会任务</CardTitle>
                            <CardDescription>完成公会任务获取奖励</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                暂无公会任务
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Guild Boss */}
                <TabsContent value="boss" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>公会 Boss</CardTitle>
                            <CardDescription>挑战强大的公会 Boss</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🐉</div>
                                <div className="font-semibold text-lg mb-2">暗影巨龙</div>
                                <div className="text-sm text-muted-foreground mb-6">
                                    本周 Boss 已刷新
                                </div>
                                <Button size="lg">
                                    <Swords className="mr-2 h-5 w-5" />
                                    挑战 Boss
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Guild Settings */}
                <TabsContent value="settings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>公会设置</CardTitle>
                            <CardDescription>管理公会信息和权限</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    编辑公会信息
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    成员管理
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-destructive">
                                    退出公会
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
