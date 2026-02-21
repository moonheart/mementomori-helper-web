import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LocalRaidQuestInfo } from '@/api/generated';
import { LocalRaidRoomConditionsType } from '@/api/generated';
import { CreateRoomParams } from '@/api/localRaidSignalRService';

interface CreateRoomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quest: LocalRaidQuestInfo | null;
    myBattlePower: number;
    onCreate: (params: CreateRoomParams) => Promise<void>;
}

export function CreateRoomDialog({
    open,
    onOpenChange,
    quest,
    myBattlePower,
    onCreate,
}: CreateRoomDialogProps) {
    const [conditionsType, setConditionsType] = useState<LocalRaidRoomConditionsType>(
        LocalRaidRoomConditionsType.None
    );
    const [requiredBattlePower, setRequiredBattlePower] = useState(0);
    const [password, setPassword] = useState('0');
    const [isAutoStart, setIsAutoStart] = useState(true);
    const [creating, setCreating] = useState(false);

    const handleCreate = async () => {
        if (!quest) return;

        setCreating(true);
        try {
            await onCreate({
                conditionsType,
                questId: quest.id,
                requiredBattlePower: conditionsType === LocalRaidRoomConditionsType.BattlePower ||
                                     conditionsType === LocalRaidRoomConditionsType.All
                    ? requiredBattlePower
                    : 0,
                password: conditionsType === LocalRaidRoomConditionsType.Password ||
                          conditionsType === LocalRaidRoomConditionsType.All
                    ? parseInt(password) || 0
                    : 0,
                isAutoStart,
            });
        } finally {
            setCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>创建房间</DialogTitle>
                    <DialogDescription>
                        创建一个房间邀请其他玩家一起挑战
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* 房间条件 */}
                    <div className="space-y-2">
                        <Label>房间条件</Label>
                        <Select
                            value={conditionsType.toString()}
                            onValueChange={(v) => setConditionsType(parseInt(v) as LocalRaidRoomConditionsType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="选择条件类型" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={LocalRaidRoomConditionsType.None.toString()}>
                                    无限制
                                </SelectItem>
                                <SelectItem value={LocalRaidRoomConditionsType.BattlePower.toString()}>
                                    战力限制
                                </SelectItem>
                                <SelectItem value={LocalRaidRoomConditionsType.Password.toString()}>
                                    密码房间
                                </SelectItem>
                                <SelectItem value={LocalRaidRoomConditionsType.All.toString()}>
                                    战力+密码
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 战力限制 */}
                    {(conditionsType === LocalRaidRoomConditionsType.BattlePower ||
                      conditionsType === LocalRaidRoomConditionsType.All) && (
                        <div className="space-y-2">
                            <Label>最低战力要求</Label>
                            <Input
                                type="number"
                                value={requiredBattlePower}
                                onChange={(e) => setRequiredBattlePower(parseInt(e.target.value) || 0)}
                                placeholder="输入最低战力"
                            />
                            <p className="text-xs text-muted-foreground">
                                我的战力: {myBattlePower.toLocaleString()}
                            </p>
                        </div>
                    )}

                    {/* 密码 */}
                    {(conditionsType === LocalRaidRoomConditionsType.Password ||
                      conditionsType === LocalRaidRoomConditionsType.All) && (
                        <div className="space-y-2">
                            <Label>房间密码</Label>
                            <Input
                                type="number"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="输入4-6位数字密码"
                            />
                        </div>
                    )}

                    {/* 自动开始 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>自动开始</Label>
                            <p className="text-xs text-muted-foreground">
                                所有成员准备后自动开始战斗
                            </p>
                        </div>
                        <Switch
                            checked={isAutoStart}
                            onCheckedChange={setIsAutoStart}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={handleCreate} disabled={creating}>
                        {creating ? '创建中...' : '创建房间'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
