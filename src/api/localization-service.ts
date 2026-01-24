import axiosInstance from './axios-client';

export const localizationApi = {
    /**
     * 获取指定语言的本地化资源
     * @param lang 语言代码，如 'zhCN', 'jaJP', 'enUS'
     */
    getResources: async (lang: string = 'zhCN'): Promise<Record<string, string>> => {
        const response = await axiosInstance.get<Record<string, string>>(`/api/localization/resources`, {
            params: { lang }
        });
        return response.data;
    }
};
