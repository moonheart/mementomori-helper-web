import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useLocalizationStore } from './store/localization-store';
import { useMasterStore } from './store/masterStore';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CharactersPage } from './pages/CharactersPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { ItemsPage } from './pages/ItemsPage';
import { BattlePage } from './pages/BattlePage';
import { TowerPage } from './pages/TowerPage';
import { WishingFountainPage } from './pages/WishingFountainPage';
import { MissionsPage } from './pages/MissionsPage';
import { ShopPage } from './pages/ShopPage';
import { GachaPage } from './pages/GachaPage';
import { PVPPage } from './pages/PVPPage';
import { GuildPage } from './pages/GuildPage';
import { DungeonPage } from './pages/DungeonPage';
import { TimeSpaceCavePage } from './pages/TimeSpaceCavePage';
import { PhantomTemplePage } from './pages/PhantomTemplePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { FriendsPage } from './pages/FriendsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AccountsPage } from './pages/AccountsPage';
import { AutomationPage } from './pages/AutomationPage';
import './index.css';

function App() {
  const { currentLanguage, fetchResources } = useLocalizationStore();
  const syncMasterData = useMasterStore(state => state.sync);

  useEffect(() => {
    fetchResources(currentLanguage);
    syncMasterData();

    // 清理旧的 translation 存储 (localStorage)
    // 之前使用 useTranslationStore 时 persist 存储的名称是 'mementomori-translation'
    if (localStorage.getItem('mementomori-translation')) {
      console.log('Cleaning up legacy translation storage...');
      localStorage.removeItem('mementomori-translation');
    }
  }, [currentLanguage, fetchResources, syncMasterData]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 账号管理页面 - 独立页面，不使用 MainLayout */}
        <Route path="/accounts" element={<AccountsPage />} />

        {/* 主应用 - 使用 MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/tower" element={<TowerPage />} />
          <Route path="/fountain" element={<WishingFountainPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/gacha" element={<GachaPage />} />
          <Route path="/pvp" element={<PVPPage />} />
          <Route path="/guild" element={<GuildPage />} />
          <Route path="/dungeon" element={<DungeonPage />} />
          <Route path="/cave" element={<TimeSpaceCavePage />} />
          <Route path="/temple" element={<PhantomTemplePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 默认重定向到 Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* 捕获所有未定义的路由并重定向到 Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
