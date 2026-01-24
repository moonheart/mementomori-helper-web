import { useState, useEffect } from 'react';
import { useMasterStore } from '@/store/masterStore';

/**
 * 通用 Hook 用于获取 Master 数据
 * @param tableName 表名，如 'CharacterTable'
 * @param id 记录 ID
 * @returns { data: T | null, loading: boolean }
 */
export function useMasterData<T = any>(tableName: string, id: number | string | undefined) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const getRecord = useMasterStore(state => state.getRecord);

    useEffect(() => {
        if (id === undefined || id === null) {
            setData(null);
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);

        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        
        getRecord<T>(tableName, numericId).then(res => {
            if (isMounted) {
                setData(res);
                setLoading(false);
            }
        }).catch(() => {
            if (isMounted) {
                setData(null);
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [tableName, id, getRecord]);

    return { data, loading };
}
