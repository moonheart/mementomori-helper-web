import { AutomationManager } from '@/components/account/AutomationManager';

export function AutomationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">托管管理</h1>
                <p className="text-muted-foreground mt-1">配置并监控账号的后台自动化任务</p>
            </div>
            
            <AutomationManager />
        </div>
    );
}

export default AutomationPage;
