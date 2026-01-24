import { create } from 'zustand';
import { db } from '@/lib/db';
import { masterService } from '@/api/master-service';

interface MasterState {
    isInitializing: boolean;
    isSyncing: boolean;
    progress: { current: number; total: number };
    version: string | null;
    
    // 初始化同步逻辑
    sync: () => Promise<void>;
    
    // 获取单条数据 (带内存缓存)
    getRecord: <T>(tableName: string, id: number) => Promise<T | null>;
}

// 内存缓存以提高高频访问性能
const memoryCache: Record<string, any> = {};

export const useMasterStore = create<MasterState>((set, get) => ({
    isInitializing: true,
    isSyncing: false,
    progress: { current: 0, total: 0 },
    version: null,

    sync: async () => {
        set({ isSyncing: true });
        try {
            const manifest = await masterService.getManifest();
            const { tables, version } = manifest;
            
            set({ version, progress: { current: 0, total: tables.length } });

            for (let i = 0; i < tables.length; i++) {
                const table = tables[i];
                const localMeta = await db.meta.get(table.name);

                // 如果 Hash 不一致或本地无数据，则同步
                if (!localMeta || localMeta.hash !== table.hash) {
                    console.log(`Syncing table: ${table.name}...`);
                    const data = await masterService.getTableData(table.name);
                    
                    await db.transaction('rw', db.masterData, db.meta, async () => {
                        await db.clearTable(table.name);
                        await db.saveRecords(table.name, data);
                        await db.meta.put({
                            tableName: table.name,
                            hash: table.hash,
                            lastUpdated: Date.now()
                        });
                    });
                }
                
                set({ progress: { current: i + 1, total: tables.length } });
            }
        } catch (error) {
            console.error('Master data sync failed:', error);
        } finally {
            set({ isSyncing: false, isInitializing: false });
        }
    },

    getRecord: async <T>(tableName: string, id: number): Promise<T | null> => {
        const cacheKey = `${tableName}:${id}`;
        if (memoryCache[cacheKey]) return memoryCache[cacheKey];

        const data = await db.getRecord<T>(tableName, id);
        if (data) {
            memoryCache[cacheKey] = data;
        }
        return data;
    }
}));
