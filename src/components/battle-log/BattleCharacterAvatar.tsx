import { CharacterState, ActiveEffectGroup } from '@/hooks/useBattleReplay';
import { useBattleUnitInfo } from '@/hooks/useBattleUnitInfo';
import { UnitIconType } from '@/api/generated/unitIconType';
import { AssetManager } from '@/lib/asset-manager';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';
import { cn } from '@/lib/utils';
import { useLocalizationStore } from '@/store/localization-store';
import { useMemo } from 'react';
import { useSkillInfosFromEffectGroups, SkillInfo } from '@/hooks/useSkillInfoFromEffectGroup';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BattleCharacterAvatarProps {
    character: CharacterState;
    isActing?: boolean;
}

/**
 * 获取单位图标 URL
 */
function getUnitIconUrl(unitIconType: UnitIconType, unitIconId: number): string {
    switch (unitIconType) {
        case UnitIconType.Character:
        case UnitIconType.ShareCharacter:
            return AssetManager.character.getAvatarUrl(unitIconId);
        case UnitIconType.EnemyCharacter:
        case UnitIconType.WitchQlipha:
            return AssetManager.enemy.getUrl(unitIconId);
        default:
            return AssetManager.enemy.getUrl(unitIconId);
    }
}

/**
 * 效果图标组件
 */
function EffectTag({ effectGroup, skillInfo }: { effectGroup: ActiveEffectGroup; skillInfo: SkillInfo }) {
    const t = useLocalizationStore(state => state.t);
    const isPermanent = effectGroup.effectTurn >= 9999;
    
    const turnText = !isPermanent ? ` (${effectGroup.effectTurn}回合)` : '';
    
    // 使用 t 函数格式化描述，传入 effectValues 替换占位符
    const effectValues = effectGroup.effects.map(e => e.effectValue.toLocaleString());
    const description = skillInfo.descriptionKey ? t(skillInfo.descriptionKey, effectValues) : '';
    
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="relative w-8 h-8 rounded overflow-hidden border border-border/50 cursor-pointer">
                    <img
                        src={skillInfo.iconUrl}
                        alt={skillInfo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    {/* 回合数标记 */}
                    {!isPermanent && effectGroup.effectTurn > 0 && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-0.5 rounded-tl">
                            {effectGroup.effectTurn}
                        </div>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-50">
                <div className="font-medium">{skillInfo.name}{turnText}</div>
                {description && <div className="text-xs mt-1">{description}</div>}
            </TooltipContent>
        </Tooltip>
    );
}

export function BattleCharacterAvatar({
    character,
    isActing = false
}: BattleCharacterAvatarProps) {
    const t = useLocalizationStore(state => state.t);
    const { name: nameKey, unitIconType, unitIconId, isLoading } = useBattleUnitInfo(character.unitType, character.unitId);
    const displayName = t(nameKey);

    const isAttacker = character.groupType === BattleFieldCharacterGroupType.Attacker;
    const iconUrl = getUnitIconUrl(unitIconType, unitIconId);

    // 计算HP百分比
    const hpPercent = Math.max(0, Math.min(100, (character.currentHp / character.maxHp) * 100));

    // 获取技能信息
    const effectGroupIds = useMemo(() => 
        character.effectGroups.map(eg => eg.effectGroupId),
        [character.effectGroups]
    );
    const skillInfos = useSkillInfosFromEffectGroups(effectGroupIds);

    return (
        <div
            className={cn(
                "relative p-2 rounded-lg border-2 transition-all duration-300 w-[300px]",
                isAttacker
                    ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                    : "bg-red-50/50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
                isActing && "ring-2 ring-yellow-400 scale-105",
                character.isDead && "opacity-60 grayscale"
            )}
        >
            <div className="flex items-center gap-2">
                {/* 头像 */}
                <div className="relative shrink-0">
                    <div
                        className={cn(
                            "w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center",
                            isAttacker
                                ? "bg-blue-100 dark:bg-blue-900"
                                : "bg-red-100 dark:bg-red-900"
                        )}
                    >
                        {isLoading ? (
                            <span className="text-xs font-bold text-muted-foreground">...</span>
                        ) : (
                            <img
                                src={iconUrl}
                                alt={displayName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-bold ${isAttacker ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}">${character.unitId.toString().slice(-2)}</span>`;
                                }}
                            />
                        )}
                    </div>

                    {/* 等级标记 */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">{character.level}</span>
                    </div>
                </div>

                {/* 信息区域 */}
                <div className="flex-1 min-w-0">
                    {/* 名字和GUID */}
                    <div className="flex items-center gap-1">
                        <div className="text-xs font-medium truncate">
                            {displayName}
                        </div>
                        <span className="text-[9px] text-muted-foreground/60 font-mono">
                            #{character.guid}
                        </span>
                    </div>

                    {/* HP 条 */}
                    <div className="mt-1.5">
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                            <span>HP</span>
                            <span>{character.currentHp.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500 ease-out",
                                    hpPercent > 50
                                        ? "bg-green-500"
                                        : hpPercent > 25
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                )}
                                style={{ width: `${hpPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 效果显示区域 */}
            {character.effectGroups.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-1">
                    {character.effectGroups.map(eg => (
                        <EffectTag
                            key={eg.effectGroupId}
                            effectGroup={eg}
                            skillInfo={skillInfos.get(eg.effectGroupId) || { name: `技能 #${eg.effectGroupId}`, descriptionKey: '', iconUrl: '', isActiveSkill: false, isLoading: true }}
                        />
                    ))}
                </div>
            )}

            {/* 死亡标记 */}
            {character.isDead && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <span className="px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                        阵亡
                    </span>
                </div>
            )}
        </div>
    );
}
