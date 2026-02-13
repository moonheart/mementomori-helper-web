import { cn } from '@/lib/utils';
import { ReplayEvent, CharacterState } from '@/hooks/useBattleReplay';
import { SkillDisplayType } from '@/api/generated/skillDisplayType';
import { EffectType } from '@/api/generated/effectType';
import { HitType } from '@/api/generated/hitType';
import { BattleFieldCharacterGroupType } from '@/api/generated/battleFieldCharacterGroupType';
import { forwardRef } from 'react';
import { useBattleUnitInfo } from '@/hooks/useBattleUnitInfo';
import { useLocalizationStore } from '@/store/localization-store';
import { useSkillName } from '@/hooks/useSkillName';

/** 效果类型中文映射 */
const effectTypeLabels: Record<number, string> = {
    // 增益效果
    [EffectType.SpeedUp]: '速度上升',
    [EffectType.MaxHpUp]: '最大HP上升',
    [EffectType.AttackPowerUp]: '攻击力上升',
    [EffectType.DefenseUp]: '防御力上升',
    [EffectType.PhysicalDamageRelaxUp]: '物理防御上升',
    [EffectType.MagicDamageRelaxUp]: '魔法防御上升',
    [EffectType.DamageEnhanceUp]: '伤害增强上升',
    [EffectType.HitUp]: '命中上升',
    [EffectType.AvoidanceUp]: '闪避上升',
    [EffectType.CriticalUp]: '暴击上升',
    [EffectType.CriticalResistUp]: '暴击抵抗上升',
    [EffectType.HpDrainUp]: '吸血上升',
    [EffectType.DamageReflectUp]: '伤害反弹上升',
    [EffectType.GiveHealRateUp]: '回血量上升',
    [EffectType.ReceiveHealRateUp]: '被回血量上升',
    [EffectType.GiveDamageUp]: '输出伤害上升',
    [EffectType.ReceiveDamageDown]: '承受伤害下降',
    [EffectType.CoolTimeRecoveryUp]: '轻快',
    [EffectType.HitRateUp]: '命中率上升',
    [EffectType.AvoidanceRateUp]: '闪避率上升',
    [EffectType.CriticalRateUp]: '暴击率上升',
    [EffectType.CriticalResistRateUp]: '抗暴率上升',
    [EffectType.DebuffHitRateUp]: '弱化效果命中率上升',
    [EffectType.DebuffResistRateUp]: '弱化效果抵抗率上升',
    
    // 特殊增益
    [EffectType.DamageGuard]: '伤害免疫',
    [EffectType.Shield1]: '多重屏障',
    [EffectType.Shield2]: '护盾',
    [EffectType.DebuffGuard]: '弱化效果免疫',
    [EffectType.ConfuseActionDebuffGuard]: '控制效果免疫',
    [EffectType.Taunt]: '挑衅',
    [EffectType.Stealth]: '隐身',
    [EffectType.NonTarget]: '透明',
    [EffectType.HealOverTime]: '再生',
    [EffectType.Immortal]: '不死之身',
    [EffectType.BuffCover]: '增益效果护罩',
    [EffectType.NonHit]: '无法被命中',
    
    // 减益效果
    [EffectType.SpeedDown]: '速度下降',
    [EffectType.MaxHpDown]: '最大HP下降',
    [EffectType.AttackPowerDown]: '攻击力下降',
    [EffectType.DefenseDown]: '防御力下降',
    [EffectType.PhysicalDamageRelaxDown]: '物理防御下降',
    [EffectType.MagicDamageRelaxDown]: '魔法防御下降',
    [EffectType.DamageEnhanceDown]: '伤害增强下降',
    [EffectType.HitDown]: '命中下降',
    [EffectType.AvoidanceDown]: '闪避下降',
    [EffectType.CriticalDown]: '暴击下降',
    [EffectType.CriticalResistDown]: '暴击抵抗下降',
    [EffectType.HpDrainDown]: '吸血下降',
    [EffectType.DamageReflectDown]: '伤害反弹下降',
    [EffectType.GiveHealRateDown]: '回血量下降',
    [EffectType.ReceiveHealRateDown]: '被回血量下降',
    [EffectType.GiveDamageDown]: '输出伤害下降',
    [EffectType.ReceiveDamageUp]: '承受伤害上升',
    [EffectType.CoolTimeRecoveryDown]: '迟缓',
    [EffectType.HitRateDown]: '命中率下降',
    [EffectType.AvoidanceRateDown]: '闪避率下降',
    [EffectType.CriticalRateDown]: '暴击率下降',
    [EffectType.CriticalResistRateDown]: '抗暴率下降',
    
    // 控制效果
    [EffectType.Stun]: '晕厥',
    [EffectType.Confuse]: '混乱',
    [EffectType.Silence]: '沉默',
    [EffectType.Stubborn]: '固执',
    
    // 持续伤害
    [EffectType.Poison]: '中毒',
    [EffectType.Bleeding]: '流血',
    [EffectType.Combustion]: '燃烧',
    [EffectType.Burn]: '灼烧',
    [EffectType.HpRecoveryForbidden]: '不治',
    [EffectType.AvoidanceForbidden]: '禁锢',
    [EffectType.BuffForbidden]: '增益效果免疫',
    
    // 共鸣/献身
    [EffectType.DamageResonanceFromSelfAndDamageReduction]: '献身',
    [EffectType.DamageResonanceFromHighHpEnemy]: '共鸣(高HP)',
    [EffectType.DamageResonanceFromLowHpEnemy]: '共鸣(低HP)',
    [EffectType.DamageResonanceFromAllEnemy]: '共鸣',
};

/** 技能显示类型映射 */
const skillDisplayTypeLabels: Record<SkillDisplayType, string> = {
    [SkillDisplayType.None]: '',
    [SkillDisplayType.Heal]: '治疗',
    [SkillDisplayType.PhysicalAttack]: '物理攻击',
    [SkillDisplayType.MagicAttack]: '魔法攻击',
    [SkillDisplayType.PhysicalDirectDamage]: '直接伤害',
    [SkillDisplayType.MagicDirectDamage]: '魔法直接伤害',
    [SkillDisplayType.HpDrain]: '吸血',
    [SkillDisplayType.Buff]: '增益',
    [SkillDisplayType.DeBuff]: '减益',
    [SkillDisplayType.PhysicalCounterAttack]: '物理反击',
    [SkillDisplayType.MagicCounterAttack]: '魔法反击',
    [SkillDisplayType.PhysicalResonanceAttack]: '物理共鸣',
    [SkillDisplayType.MagicResonanceAttack]: '魔法共鸣',
    [SkillDisplayType.RemoveEffect]: '移除效果',
    [SkillDisplayType.BurstEffect]: '爆发效果',
    [SkillDisplayType.SelfInjuryDamage]: '自损',
    [SkillDisplayType.Resurrection]: '复活',
    [SkillDisplayType.SilenceHeal]: '沉默治疗',
};

interface BattleLogEntryProps {
    event: ReplayEvent;
    characters: Map<string, CharacterState>;
    isCurrent: boolean;
    isPast: boolean;
    onClick?: () => void;
}

/**
 * 角色名字组件 - 从 Master 数据获取真实角色名，区分敌我颜色
 */
function CharacterName({ character }: { character: CharacterState | null }) {
    const t = useLocalizationStore(state => state.t);
    const { name: nameKey, isLoading } = useBattleUnitInfo(
        character?.unitType ?? 0,
        character?.unitId ?? 0
    );
    
    if (!character) {
        return <span>未知</span>;
    }
    
    const isAttacker = character.groupType === BattleFieldCharacterGroupType.Attacker;
    
    if (isLoading) return <span>...</span>;
    
    return (
        <span className={cn(
            "font-medium",
            isAttacker 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-red-600 dark:text-red-400"
        )}>
            {t(nameKey)}
        </span>
    );
}

/**
 * 战斗日志条目组件
 */
export const BattleLogEntry = forwardRef<HTMLDivElement, BattleLogEntryProps>(
    ({ event, characters, isCurrent, isPast, onClick }, ref) => {
        // 通过 guid 查找角色
        const getCharacterByGuid = (guid?: number) => {
            if (guid === undefined) return null;
            for (const [, char] of characters) {
                if (char.guid === guid) return char;
            }
            return null;
        };
        
        const sourceChar = getCharacterByGuid(event.sourceGuid);
        const targetChar = getCharacterByGuid(event.targetGuid);
        
        // 获取技能名称（必须在顶层调用 hook）
        const { name: activeSkillName } = useSkillName(event.skillId, false);
        const { name: passiveSkillName } = useSkillName(event.skillId, true);
        
        // 获取效果文本
        const getEffectText = () => {
            if (event.addEffectGroups && event.addEffectGroups.length > 0) {
                const effects = event.addEffectGroups.flatMap(eg => eg.effects || []);
                return effects.map(e => {
                    const label = effectTypeLabels[e.effectType] || `效果#${e.effectType}`;
                    const value = e.effectValue ? ` +${e.effectValue.toLocaleString()}` : '';
                    return `${label}${value}`;
                }).join(', ');
            }
            return null;
        };
        
        // 获取命中类型文本
        const getHitTypeText = (hitType?: HitType) => {
            if (hitType === undefined || hitType === HitType.Hit) return null;
            console.log('HitType:', hitType);
            switch (hitType) {
                case HitType.Ignore: return '无视防御';
                case HitType.Miss: return '闪避';
                case HitType.Critical: return '暴击';
                case HitType.Shield1: return '多重屏障';
                case HitType.Shield1Critical: return '多重屏障·暴击';
                case HitType.Shield2: return '护盾';
                case HitType.Shield2Critical: return '护盾·暴击';
                case HitType.ShieldBreak: return '破盾';
                case HitType.ShieldBreakCritical: return '破盾·暴击';
                default: return null;
            }
        };
        
        // 渲染不同类型的事件
        const renderContent = () => {
            switch (event.type) {
                case 'turn_start':
                    return (
                        <div className="text-center text-muted-foreground font-medium py-1">
                            ═══ 回合 {event.turn} 开始 ═══
                        </div>
                    );
                    
                case 'turn_end':
                    return (
                        <div className="text-center text-muted-foreground font-medium py-1">
                            ═══ 回合 {event.turn} 结束 ═══
                        </div>
                    );
                    
                case 'action':
                    return (
                        <div className="flex items-center gap-2 flex-wrap">
                            <CharacterName character={sourceChar} />
                            <span className="text-muted-foreground">使用</span>
                            <span className="text-primary font-medium">{activeSkillName}</span>
                        </div>
                    );
                    
                case 'damage':
                case 'heal': {
                    const isHeal = event.type === 'heal' || (event.changeHp ?? 0) > 0;
                    const value = event.changeHp ?? 0;
                    const isMiss = event.hitType === HitType.Miss;
                    const valueText = isMiss 
                        ? 'Miss' 
                        : (isHeal 
                            ? `+${value.toLocaleString()}` 
                            : `-${Math.abs(value).toLocaleString()}`);
                    const hitText = getHitTypeText(event.hitType);
                    const effectText = getEffectText();
                    const attackTypeText = event.skillDisplayType 
                        ? skillDisplayTypeLabels[event.skillDisplayType] 
                        : null;
                    
                    return (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {/* 来源 */}
                            {sourceChar && (
                                <>
                                    <CharacterName character={sourceChar} />
                                    <span className="text-muted-foreground">→</span>
                                </>
                            )}
                            {/* 目标 */}
                            <CharacterName character={targetChar} />
                            {/* 攻击类型 */}
                            {attackTypeText && (
                                <span className="text-xs text-muted-foreground">[{attackTypeText}]</span>
                            )}
                            {/* 数值/Miss */}
                            <span className={cn(
                                "font-bold ml-auto",
                                isMiss && "text-gray-500",
                                !isMiss && isHeal && "text-green-600 dark:text-green-400",
                                !isMiss && !isHeal && "text-red-600 dark:text-red-400"
                            )}>
                                {valueText}
                            </span>
                            {/* 暴击/闪避标记 */}
                            {hitText && (
                                <span className="text-yellow-500 font-medium">[{hitText}]</span>
                            )}
                            {/* 效果 */}
                            {effectText && (
                                <span className="text-xs text-muted-foreground w-full">
                                    获得效果: {effectText}
                                </span>
                            )}
                        </div>
                    );
                }
                
                case 'passive':
                case 'effect': {
                    const effectText = getEffectText();
                    const isBuff = event.skillDisplayType === SkillDisplayType.Buff;
                    const isDeBuff = event.skillDisplayType === SkillDisplayType.DeBuff;
                    
                    return (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {/* 被动标记 */}
                            {event.isTurnPassive && (
                                <span className="text-xs text-orange-500 font-medium">[被动]</span>
                            )}
                            {/* 来源 */}
                            {sourceChar && (
                                <>
                                    <CharacterName character={sourceChar} />
                                    {targetChar && targetChar.guid !== sourceChar.guid && (
                                        <span className="text-muted-foreground">→</span>
                                    )}
                                </>
                            )}
                            {/* 目标 */}
                            {targetChar && (!sourceChar || targetChar.guid !== sourceChar.guid) && (
                                <CharacterName character={targetChar} />
                            )}
                            {/* 技能名称 */}
                            {event.skillId && (
                                <span className="text-xs text-muted-foreground">
                                    [{event.type === 'passive' ? passiveSkillName : activeSkillName}]
                                </span>
                            )}
                            {/* 效果描述 */}
                            {effectText && (
                                <span className={cn(
                                    "text-sm",
                                    isBuff && "text-blue-600 dark:text-blue-400",
                                    isDeBuff && "text-purple-600 dark:text-purple-400"
                                )}>
                                    {effectText}
                                </span>
                            )}
                            {/* 持续回合 */}
                            {event.addEffectGroups && event.addEffectGroups.length > 0 && 
                             event.addEffectGroups[0].effectTurn > 0 && event.addEffectGroups[0].effectTurn < 9999 && (
                                <span className="text-xs text-muted-foreground">
                                    ({event.addEffectGroups[0].effectTurn}回合)
                                </span>
                            )}
                        </div>
                    );
                }
                
                default:
                    return (
                        <div className="text-muted-foreground">
                            未知事件类型: {event.type}
                        </div>
                    );
            }
        };
        
        // 确定样式
        const isTurnMarker = event.type === 'turn_start' || event.type === 'turn_end';
        const isActionEvent = event.type === 'action';
        
        return (
            <div
                ref={ref}
                onClick={onClick}
                className={cn(
                    "px-2 py-1.5 rounded text-sm transition-all cursor-pointer",
                    // 回合标记特殊样式
                    isTurnMarker && "bg-muted/50 border-y border-border/30 my-1",
                    // 行动事件样式
                    isActionEvent && "bg-primary/5 border-l-2 border-primary/30",
                    // 当前播放事件样式
                    isCurrent && !isTurnMarker && "bg-primary/20 ring-1 ring-primary shadow-sm",
                    // 已播放事件样式
                    isPast && !isCurrent && "opacity-80",
                    // 未播放事件样式
                    !isPast && !isCurrent && "opacity-40",
                    // 鼠标悬停
                    !isTurnMarker && "hover:bg-muted/50"
                )}
            >
                {renderContent()}
            </div>
        );
    }
);

BattleLogEntry.displayName = 'BattleLogEntry';
