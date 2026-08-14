import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { PortfolioHoldings } from './components/portfolio/PortfolioHoldings';
import { AiAutopilotView } from './components/ai-advisor/AiAutopilotView';
import { ZakatPurificationView } from './components/sharia/ZakatPurificationView';
import { GoalSimulatorView } from './components/goals/GoalSimulatorView';
import { SettingsView } from './components/settings/SettingsView';
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { DepositWithdrawModal } from './components/modals/DepositWithdrawModal';
import { AiChatModal } from './components/ai-advisor/AiChatModal';
import { PwaInstallPrompt } from './components/pwa/PwaInstallPrompt';
import { Toast } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const { activeTab } = usePortfolio();
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositModalMode, setDepositModalMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const handleOpenDeposit = () => {
    setDepositModalMode('deposit');
    setIsDepositModalOpen(true);
  };

  const handleOpenWithdraw = () => {
    setDepositModalMode('withdraw');
    setIsDepositModalOpen(true);
  };

  const handleOpenAiChat = () => {
    setIsAiChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background islamic-mesh-bg text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Global Header */}
      <Header
        onOpenDeposit={handleOpenDeposit}
        onOpenAiChat={handleOpenAiChat}
      />

      {/* Main Content Area with Desktop Sidebar & View Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* Right Desktop Sidebar (RTL) */}
        <Sidebar onOpenAiChat={handleOpenAiChat} />

        {/* Dynamic Main View Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onOpenDeposit={handleOpenDeposit}
              onOpenWithdraw={handleOpenWithdraw}
              onOpenAiChat={handleOpenAiChat}
            />
          )}

          {activeTab === 'portfolio' && <PortfolioHoldings />}

          {activeTab === 'ai-advisor' && <AiAutopilotView />}

          {activeTab === 'sharia' && <ZakatPurificationView />}

          {activeTab === 'goals' && <GoalSimulatorView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Interactive Modals */}
      <AssetDetailModal />
      
      <DepositWithdrawModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        initialMode={depositModalMode}
      />

      <AiChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      {/* PWA Floating Installation Banner */}
      <PwaInstallPrompt />

      {/* Floating Action Notifications */}
      <Toast />

    </div>
  );
};

export function App() {
  return (
    <PortfolioProvider>
      <MainLayout />
    </PortfolioProvider>
  );
}

export default App;
