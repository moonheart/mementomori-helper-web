import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { mockEquipmentSets } from '@/mocks/data';
import { useTranslation } from '@/hooks/useTranslation';

interface SetBonusDisplayProps {
    setId: string;
    equippedPieces: number;
}

export function SetBonusDisplay({ setId, equippedPieces }: SetBonusDisplayProps) {
    const { t } = useTranslation();
    const setData = mockEquipmentSets[setId];

    if (!setData) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">{setData.name}</h3>
                    <p className="text-sm text-muted-foreground">{t('[CharacterEquipmentSeriesEffect]')}</p>
                </div>
                <Badge variant="secondary">
                    {t('EQUIPMENT_SET_PIECES_EQUIPPED', [String(equippedPieces)])}
                </Badge>
            </div>

            <div className="space-y-2">
                {setData.bonuses.map((bonus, index) => {
                    const isActive = equippedPieces >= bonus.pieces;

                    return (
                        <div
                            key={index}
                            className={`
                                border rounded-lg p-3 transition-all
                                ${isActive
                                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'
                                }
                            `}
                        >
                            <div className="flex items-start gap-2">
                                <div className={`
                                    w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                                    ${isActive
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500'
                                    }
                                `}>
                                    {isActive && <Check className="w-3 h-3" />}
                                    {!isActive && <span className="text-xs">{bonus.pieces}</span>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                            variant={isActive ? "default" : "outline"}
                                            className="text-xs"
                                        >
                                            {t('EQUIPMENT_SET_PIECES', [String(bonus.pieces)])}
                                        </Badge>
                                        {isActive && (
                                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                {t('EQUIPMENT_SET_ACTIVE')}
                                            </span>
                                        )}
                                    </div>

                                    <p className={`
                                        text-sm
                                        ${isActive
                                            ? 'text-foreground font-medium'
                                            : 'text-muted-foreground'
                                        }
                                    `}>
                                        {bonus.description}
                                    </p>

                                    {Object.keys(bonus.stats).length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {Object.entries(bonus.stats).map(([stat, value]) => (
                                                <Badge
                                                    key={stat}
                                                    variant={isActive ? "secondary" : "outline"}
                                                    className="text-xs"
                                                >
                                                    {stat}: +{value}{typeof value === 'number' && value < 100 ? '%' : ''}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
