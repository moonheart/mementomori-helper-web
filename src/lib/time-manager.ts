/**
 * 时间管理器 - 处理服务器时间与本地时间的差异
 */
export class TimeManager {
    private static instance: TimeManager;
    private diffFromUtcMs: number = 0;

    private constructor() {}

    public static getInstance(): TimeManager {
        if (!TimeManager.instance) {
            TimeManager.instance = new TimeManager();
        }
        return TimeManager.instance;
    }

    /**
     * 设置时间偏移量
     * @param diffFromUtc 格式如 "+09:00:00" 或 "-05:00:00"
     */
    public setDiffFromUtc(diffFromUtc: string) {
        if (!diffFromUtc) {
            this.diffFromUtcMs = 0;
            return;
        }

        try {
            const parts = diffFromUtc.split(':');
            const sign = parts[0].startsWith('-') ? -1 : 1;
            const hours = Math.abs(parseInt(parts[0], 10));
            const minutes = parseInt(parts[1], 10);
            const seconds = parseInt(parts[2], 10);

            this.diffFromUtcMs = sign * (hours * 3600 + minutes * 60 + seconds) * 1000;
        } catch (e) {
            console.error('Failed to parse diffFromUtc:', diffFromUtc, e);
            this.diffFromUtcMs = 0;
        }
    }

    /**
     * 获取当前服务器毫秒时间戳
     */
    public getServerNowMs(): number {
        // 本地 UTC 时间 + 偏移量
        const utcNow = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000);
        return utcNow + this.diffFromUtcMs;
    }

    /**
     * 获取当前服务器秒时间戳
     */
    public getServerNowSeconds(): number {
        return Math.floor(this.getServerNowMs() / 1000);
    }

    /**
     * 计算两个时间戳之间的间隔，并格式化为 hh:mm:ss
     */
    public formatTimeSpan(ms: number): string {
        if (ms <= 0) return "00:00:00";
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }
}

export const timeManager = TimeManager.getInstance();
