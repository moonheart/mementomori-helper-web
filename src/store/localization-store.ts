import { create } from 'zustand';
import { localizationApi } from '@/api/localization-service';

interface LocalizationState {
    currentLanguage: string;
    resources: Record<string, string>;
    isLoading: boolean;
    
    // Actions
    setLanguage: (lang: string) => Promise<void>;
    fetchResources: (lang: string) => Promise<void>;
    t: (key: string, params?: unknown[]) => string;
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
        set({ isLoading: true });
        try {
            const data = await localizationApi.getResources(lang);
            set({ resources: data });
        } catch (error) {
            console.error('Failed to fetch localization resources:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    t: (key: string, params?: unknown[]) => {
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
