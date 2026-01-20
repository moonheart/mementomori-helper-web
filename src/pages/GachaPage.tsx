import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export function GachaPage() {
    const [pityCount, setPityCount] = useState(45);
    const pityThreshold = 80;

    const banners = [
        {
            id: '1',
            name: '限定角色召唤',
            description: '超稀有UR角色概率UP！',
            type: 'limited' as const,
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            cost: { single: 300, multi: 3000 }
        },
        {
            id: '2',
            name: '常驻召唤',
            description: '获取各种角色和装备',
            type: 'permanent' as const,
            cost: { single: 300, multi: 3000 }
        }
    ];

    const handleGacha = (type: 'single' | 'multi', bannerId: string) => {
        console.log(`Performing ${type} gacha on banner ${bannerId}`);
        // Mock gacha logic
        if (type === 'multi') {
            setPityCount(prev => Math.min(prev + 10, pityThreshold));
        } else {
            setPityCount(prev => Math.min(prev + 1, pityThreshold));
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">抽卡系统</h1>
                <p className="text-muted-foreground">获取新角色和装备</p>
            </div>

            {/* Pity Counter */}
            <Card className="border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        保底计数器
                    </CardTitle>
                    <CardDescription>
                        距离下次保底还有 {pityThreshold - pityCount} 抽
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={(pityCount / pityThreshold) * 100} />
                    <p className="text-sm text-muted-foreground mt-2">
                        {pityCount} / {pityThreshold}
                    </p>
                </CardContent>
            </Card>

            {/* Banners */}
            <div className="grid gap-6 md:grid-cols-2">
                {banners.map((banner) => (
                    <Card key={banner.id} className={banner.type === 'limited' ? 'border-yellow-500' : ''}>
                        <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative">
                            {banner.type === 'limited' && (
                                <Badge variant="destructive" className="absolute top-4 right-4">
                                    限时
                                </Badge>
                            )}
                            <div className="text-white text-center">
                                <Sparkles className="h-16 w-16 mx-auto mb-4" />
                                <div className="text-2xl font-bold mb-2">{banner.name}</div>
                            </div>
                        </div>
                        <CardHeader>
                            <CardDescription>{banner.description}</CardDescription>
                            {banner.type === 'limited' && banner.endTime && (
                                <div className="text-sm text-muted-foreground">
                                    结束时间: {banner.endTime.toLocaleDateString('zh-CN')}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">单抽费用</div>
                                <div className="flex items-center gap-1">
                                    <span className="text-blue-500">💎</span>
                                    <span className="font-semibold">{banner.cost.single}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">十连费用</div>
                                <div className="flex items-center gap-1">
                                    <span className="text-blue-500">💎</span>
                                    <span className="font-semibold">{banner.cost.multi}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-3">
                                <Button
                                    variant="outline"
                                    onClick={() => handleGacha('single', banner.id)}
                                >
                                    单抽
                                </Button>
                                <Button
                                    onClick={() => handleGacha('multi', banner.id)}
                                >
                                    十连
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle>抽卡记录</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        暂无抽卡记录
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
