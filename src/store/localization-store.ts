import { create } from 'zustand';
import { localizationApi } from '@/api/localization-service';
import { db } from '@/lib/db';

interface LocalizationState {
    currentLanguage: string;
    resources: Record<string, string>;
    isLoading: boolean;
    
    // Actions
    setLanguage: (lang: string) => Promise<void>;
    fetchResources: (lang: string) => Promise<void>;
    t: (key: string | undefined | null, params?: unknown[]) => string;
}

export const useLocalizationStore = create<LocalizationState>((set, get) => ({
    currentLanguage: localStorage.getItem('app_lang') || 'zhCN',
    resources: {},
    isLoading: false,

    setLanguage: async (lang: string) => {
        localStorage.setItem('app_lang', lang);
        set({ currentLanguage: lang });
        await get().fetchResources(lang);
    },

    fetchResources: async (lang: string) => {
        // 如果已经有资源且语言匹配，且不是强制刷新，可以跳过 (这里简化为先查 DB)
        set({ isLoading: true });
        try {
            // 1. 尝试从 IndexedDB 获取
            const cached = await db.getTranslations(lang);
            if (cached && Object.keys(cached).length > 0) {
                set({ resources: cached });
                // 异步在后台更新一次，或者根据需要决定是否更新
                // 这里为了简单，如果命中缓存就先用缓存
                set({ isLoading: false });
                
                // 可选：如果需要后台静默更新，可以在这里调用 API
                return;
            }

            // 2. 如果没有缓存，从 API 获取
            const data = await localizationApi.getResources(lang);
            set({ resources: data });
            
            // 3. 保存到 IndexedDB
            await db.saveTranslations(lang, data);
        } catch (error) {
            console.error('Failed to fetch localization resources:', error);
        } finally {
            set({ isLoading: false });
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
                text = text.replace(placeholder, String(param));
            });
        }

        // 处理 <br> 标签为换行符
        return text.replace(/<br>/g, '\n');
    }
}));
