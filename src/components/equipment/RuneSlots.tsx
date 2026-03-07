import { Badge } from '@/components/ui/badge';
import type { Rune } from '@/mocks/types';
import { RUNE_TYPE_CONFIG } from '@/constants/equipment';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface RuneSlotsProps {
    runes: Rune[];
    maxSlots: number;
    onAddRune?: (slotIndex: number) => void;
    onRemoveRune?: (runeId: string) => void;
    readonly?: boolean;
}

export function RuneSlots({ runes, maxSlots, onAddRune, onRemoveRune, readonly = false }: RuneSlotsProps) {
    const { t } = useTranslation();
    const slots = [...Array(maxSlots)].map((_, index) => runes[index] || null);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('[CommonSphereLabel]')}</span>
                <Badge variant="secondary">
                    {runes.length} / {maxSlots}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {slots.map((rune, index) => (
                    <div
                        key={index}
                        className={`
                            relative border-2 rounded-lg p-3 transition-all
                            ${rune
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                                : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                            }
                            ${!readonly && !rune && onAddRune ? 'cursor-pointer hover:border-purple-300 hover:bg-purple-50/50' : ''}
                        `}
                        onClick={() => !readonly && !rune && onAddRune?.(index)}
                    >
                        {rune ? (
                            <>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg">{RUNE_TYPE_CONFIG[rune.type]?.icon || '💎'}</span>
                                        <div>
                                            <div className="font-semibold text-sm leading-tight">{rune.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {t(RUNE_TYPE_CONFIG[rune.type]?.nameKey || '[CommonSphereLabel]')}
                                            </div>
                                        </div>
                                    </div>
                                    {!readonly && onRemoveRune && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveRune(rune.id);
                                            }}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    {Object.entries(rune.stats).map(([stat, value]) => (
                                        <div key={stat} className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">{stat}:</span>
                                            <span className="font-medium">+{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <Badge variant="outline" className="absolute top-1 right-1 text-xs">
                                    Lv.{rune.level}
                                </Badge>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                                <Plus className="w-6 h-6 mb-1" />
                                <span className="text-xs">{t('EQUIPMENT_EMPTY_SLOT')}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
