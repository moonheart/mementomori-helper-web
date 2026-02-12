import { useMasterStore } from '@/store/masterStore';
import { EffectGroupMB } from '@/api/generated/effectGroupMB';
import { EffectGroupIconType } from '@/api/generated/effectGroupIconType';
import { useLocalizationStore } from '@/store/localization-store';
import { useEffect, useState } from 'react';

export interface EffectGroupInfo {
    name: string;
    iconId: number;
    iconType: EffectGroupIconType;
    isLoading: boolean;
}

/**
 * 获取效果组的名称和图标信息
 */
export function useEffectGroupName(effectGroupId: number): EffectGroupInfo {
    const getRecord = useMasterStore(state => state.getRecord);
    const t = useLocalizationStore(state => state.t);
    const [info, setInfo] = useState<EffectGroupInfo>({
        name: `效果 #${effectGroupId}`,
        iconId: 0,
        iconType: EffectGroupIconType.None,
        isLoading: true
    });

    useEffect(() => {
        let mounted = true;
        getRecord<EffectGroupMB>('EffectGroupTable', effectGroupId).then(effectGroupMB => {
            if (!mounted) return;
            if (effectGroupMB) {
                setInfo({
                    name: t(effectGroupMB.nameKey) || `效果 #${effectGroupId}`,
                    iconId: effectGroupMB.iconId,
                    iconType: effectGroupMB.iconType,
                    isLoading: false
                });
            } else {
                setInfo({
                    name: `效果 #${effectGroupId}`,
                    iconId: 0,
                    iconType: EffectGroupIconType.None,
                    isLoading: false
                });
            }
        });
        return () => { mounted = false; };
    }, [effectGroupId, getRecord, t]);

    return info;
}

/**
 * 批量获取效果组信息
 */
export function useEffectGroupNames(effectGroupIds: number[]): Map<number, EffectGroupInfo> {
    const getRecord = useMasterStore(state => state.getRecord);
    const t = useLocalizationStore(state => state.t);
    const [infos, setInfos] = useState<Map<number, EffectGroupInfo>>(new Map());

    useEffect(() => {
        let mounted = true;
        
        async function loadEffectGroups() {
            const result = new Map<number, EffectGroupInfo>();
            
            for (const id of effectGroupIds) {
                const effectGroupMB = await getRecord<EffectGroupMB>('EffectGroupTable', id);
                if (effectGroupMB) {
                    result.set(id, {
                        name: t(effectGroupMB.nameKey) || `效果 #${id}`,
                        iconId: effectGroupMB.iconId,
                        iconType: effectGroupMB.iconType,
                        isLoading: false
                    });
                } else {
                    result.set(id, {
                        name: `效果 #${id}`,
                        iconId: 0,
                        iconType: EffectGroupIconType.None,
                        isLoading: false
                    });
                }
            }
            
            if (mounted) {
                setInfos(result);
            }
        }
        
        loadEffectGroups();
        return () => { mounted = false; };
    }, [effectGroupIds, getRecord, t]);

    return infos;
}
