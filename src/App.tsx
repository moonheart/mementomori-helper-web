import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AccountsPage } from './pages/AccountsPage';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CharactersPage } from './pages/CharactersPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { MissionsPage } from './pages/MissionsPage';
import { ShopPage } from './pages/ShopPage';
import { GachaPage } from './pages/GachaPage';
import { PVPPage } from './pages/PVPPage';
import { GuildPage } from './pages/GuildPage';
import { DungeonPage } from './pages/DungeonPage';
import { SettingsPage } from './pages/SettingsPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 账号管理页面 - 独立布局 */}
        <Route path="/accounts" element={<AccountsPage />} />

        {/* 主应用 - 使用 MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/gacha" element={<GachaPage />} />
          <Route path="/pvp" element={<PVPPage />} />
          <Route path="/guild" element={<GuildPage />} />
          <Route path="/dungeon" element={<DungeonPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 默认重定向到 Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
