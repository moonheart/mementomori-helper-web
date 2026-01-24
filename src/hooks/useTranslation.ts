import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { localizationApi } from '@/api/localization-service';

interface TranslationState {
    resources: Record<string, string>;
    language: string;
    loading: boolean;
    setLanguage: (lang: string) => Promise<void>;
    t: (key: string | undefined | null) => string;
}

export const useTranslationStore = create<TranslationState>()(
    persist(
        (set, get) => ({
            resources: {},
            language: 'zhCN',
            loading: false,
            setLanguage: async (lang: string) => {
                set({ loading: true });
                try {
                    const resources = await localizationApi.getResources(lang);
                    set({ resources, language: lang });
                } catch (error) {
                    console.error('Failed to load localization:', error);
                } finally {
                    set({ loading: false });
                }
            },
            t: (key: string | undefined | null) => {
                if (!key) return '';
                return get().resources[key] || key;
            }
        }),
        {
            name: 'mementomori-translation',
            partialize: (state) => ({ language: state.language, resources: state.resources }),
        }
    )
);

export function useTranslation() {
    const { t, language, loading, setLanguage } = useTranslationStore();
    return { t, language, loading, setLanguage };
}
