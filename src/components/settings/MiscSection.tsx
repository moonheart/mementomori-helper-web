import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, TowerControl as Tower } from 'lucide-react';
import { GuildTowerOption } from '@/api/generated/guildTowerOption';

interface MiscSectionProps {
    guildTower: GuildTowerOption;
    onUpdateGuildTower: (config: GuildTowerOption) => void;
}

export function MiscSection({
    guildTower,
    onUpdateGuildTower,
}: MiscSectionProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Tower className="h-5 w-5 text-primary" />
                        <CardTitle>公会塔 (Guild Tower)</CardTitle>
                    </div>
                    <CardDescription>配置公会塔自动挑战与奖励领取</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="gt-entry">自动报名</Label>
                            <Switch
                                id="gt-entry"
                                checked={guildTower.autoEntry}
                                onCheckedChange={(checked) => onUpdateGuildTower({ ...guildTower, autoEntry: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="gt-challenge">自动挑战</Label>
                            <Switch
                                id="gt-challenge"
                                checked={guildTower.autoChallenge}
                                onCheckedChange={(checked) => onUpdateGuildTower({ ...guildTower, autoChallenge: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="gt-reinforce">自动强化</Label>
                            <Switch
                                id="gt-reinforce"
                                checked={guildTower.autoReinforcement}
                                onCheckedChange={(checked) => onUpdateGuildTower({ ...guildTower, autoReinforcement: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
                            <Label htmlFor="gt-reward">自动领奖</Label>
                            <Switch
                                id="gt-reward"
                                checked={guildTower.autoReceiveReward}
                                onCheckedChange={(checked) => onUpdateGuildTower({ ...guildTower, autoReceiveReward: checked })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>自动挑战重试次数</Label>
                        <Input
                            type="number"
                            className="w-32"
                            value={guildTower.autoChallengeRetryCount}
                            onChange={(e) => onUpdateGuildTower({ ...guildTower, autoChallengeRetryCount: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle>其他设置</CardTitle>
                    </div>
                    <CardDescription>更多功能正在迁移中...</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">暂无更多配置项。</p>
                </CardContent>
            </Card>
        </div>
    );
}
