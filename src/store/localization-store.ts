import { create } from 'zustand';
import { localizationApi } from '@/api/localization-service';
import { db } from '@/lib/db';

interface LocalizationState {
    currentLanguage: string;
    resources: Record<string, string>;
    isLoading: boolean;
    isSyncing: boolean;
    hash: string | null;
    lastUpdated: number | null;

    // Actions
    setLanguage: (lang: string) => Promise<void>;
    fetchResources: (lang: string) => Promise<void>;
    sync: (lang?: string) => Promise<void>;
    t: (key: string | undefined | null, params?: unknown[]) => string;
}

export const useLocalizationStore = create<LocalizationState>((set, get) => ({
    currentLanguage: localStorage.getItem('app_lang') || 'zhCN',
    resources: {},
    isLoading: false,
    isSyncing: false,
    hash: null,
    lastUpdated: null,

    setLanguage: async (lang: string) => {
        localStorage.setItem('app_lang', lang);
        set({ currentLanguage: lang });
        await get().sync(lang);
    },

    fetchResources: async (lang: string) => {
        // 如果已经有资源且语言匹配，且不是强制刷新，可以跳过 (这里简化为先查 DB)
        set({ isLoading: true });
        try {
            // 1. 尝试从 IndexedDB 获取
            const cached = await db.getTranslationRecord(lang);
            if (cached && Object.keys(cached.resources).length > 0) {
                set({
                    resources: cached.resources,
                    hash: cached.hash,
                    lastUpdated: cached.lastUpdated
                });
                set({ isLoading: false });

                // 后台静默检查更新
                get().sync(lang);
                return;
            }

            // 2. 如果没有缓存，从 API 获取
            await get().sync(lang);
        } catch (error) {
            console.error('Failed to fetch localization resources:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    sync: async (lang?: string) => {
        const targetLang = lang || get().currentLanguage;
        set({ isSyncing: true });

        try {
            // 1. 获取服务器 manifest
            const manifest = await localizationApi.getManifest(targetLang);

            // 2. 获取本地缓存
            const localRecord = await db.translations.get(targetLang);

            // 3. 如果 hash 不一致或本地无数据，则同步
            if (!localRecord || localRecord.hash !== manifest.hash) {
                console.log(`Syncing localization resources for: ${targetLang}...`);
                const resources = await localizationApi.getResources(targetLang);

                // 4. 保存到 IndexedDB
                await db.saveTranslations(targetLang, resources, manifest.hash);

                // 5. 更新状态
                set({
                    resources,
                    hash: manifest.hash,
                    lastUpdated: manifest.lastUpdated
                });
            }
        } catch (error) {
            console.error('Localization sync failed:', error);
        } finally {
            set({ isSyncing: false });
        }
    },

    t: (key: string | undefined | null, params?: unknown[]) => {
        if (!key) return '';
        const { resources } = get();

        // 如果资源未加载或找不到 key，返回 key 本身
        if (!resources || !resources[key]) {
            return key;
        }

        let text = resources[key];

        // 处理 C# 风格的占位符 {0}, {1}, etc.
        if (params && params.length > 0) {
            params.forEach((param, index) => {
                const placeholder = `{${index}}`;
                text = text.replaceAll(placeholder, String(param));
            });
        }

        return text;
    }
}));
