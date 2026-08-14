import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  PieChart,
  Bot,
  Scale,
  Settings,
  Sparkles
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isAutopilotEnabled } = usePortfolio();

  const navItems = [
    {
      id: 'dashboard',
      titleAr: 'الرئيسية',
      icon: LayoutDashboard,
    },
    {
      id: 'portfolio',
      titleAr: 'المحفظة',
      icon: PieChart,
    },
    {
      id: 'ai-advisor',
      titleAr: 'المستشار الآلي',
      icon: Bot,
      highlight: true,
    },
    {
      id: 'sharia',
      titleAr: 'الزكاة والشرعية',
      icon: Scale,
    },
    {
      id: 'settings',
      titleAr: 'الإعدادات',
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-area-pb shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-13 h-13 p-3 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-emerald-500/40 scale-110 ring-4 ring-background'
                    : 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-gold-500 text-white shadow-emerald-900/50 scale-100 ring-4 ring-background'
                }`}>
                  <Icon className="w-6 h-6" />
                  {isAutopilotEnabled && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold mt-1 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {item.titleAr}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive ? 'text-emerald-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 ${
                isActive ? 'font-bold text-emerald-400' : 'text-slate-400'
              }`}>
                {item.titleAr}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
