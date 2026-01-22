import { AccountManagement } from '@/components/account/AccountManagement';

export function AccountsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2">账号管理</h1>
                    <p className="text-slate-300">管理您的游戏账号，支持多账号切换</p>
                </div>
                <AccountManagement />
            </div>
        </div>
    );
}
