import Dexie, { Table } from 'dexie';

export interface MasterMeta {
    tableName: string;
    hash: string;
    lastUpdated: number;
}

export interface MasterRecord {
    table_id: string; // 复合主键: tableName + ":" + id
    tableName: string;
    id: number;
    data: any;
}

export class MementoMoriDB extends Dexie {
    meta!: Table<MasterMeta>;
    masterData!: Table<MasterRecord>;

    constructor() {
        super('MementoMoriDB');
        this.version(1).stores({
            meta: 'tableName',
            masterData: 'table_id, tableName, id'
        });
    }

    /**
     * 清除特定表的数据
     */
    async clearTable(tableName: string) {
        await this.masterData.where('tableName').equals(tableName).delete();
    }

    /**
     * 批量保存记录
     */
    async saveRecords(tableName: string, records: any[]) {
        const masterRecords: MasterRecord[] = records.map(r => ({
            table_id: `${tableName}:${r.id}`,
            tableName,
            id: r.id,
            data: r
        }));
        await this.masterData.bulkPut(masterRecords);
    }

    /**
     * 获取单条记录
     */
    async getRecord<T>(tableName: string, id: number): Promise<T | null> {
        const record = await this.masterData.get(`${tableName}:${id}`);
        return record ? record.data as T : null;
    }

    /**
     * 获取全表数据
     */
    async getFullTable<T>(tableName: string): Promise<T[]> {
        const records = await this.masterData.where('tableName').equals(tableName).toArray();
        return records.map(r => r.data as T);
    }
}

export const db = new MementoMoriDB();
