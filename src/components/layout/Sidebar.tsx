import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  PieChart,
  Bot,
  Scale,
  Target,
  Settings,
  ShieldCheck,
  Coins,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  onOpenAiChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAiChat }) => {
  const { 
    activeTab, 
    setActiveTab, 
    shariaHealthScore, 
    zakatReport, 
    formatMoney,
    isAutopilotEnabled
  } = usePortfolio();

  const navigationItems = [
    {
      id: 'dashboard',
      titleAr: 'لوحة التحكم الرئيسية',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'portfolio',
      titleAr: 'المحفظة والأصول المفلترة',
      icon: PieChart,
      badge: '6 أصول',
    },
    {
      id: 'ai-advisor',
      titleAr: 'المستشار والطيار الآلي',
      icon: Bot,
      badge: isAutopilotEnabled ? 'نشط' : 'يدوي',
      badgeColor: isAutopilotEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'sharia',
      titleAr: 'حاسبة الزكاة والتطهير',
      icon: Scale,
      badge: `${zakatReport.daysRemainingInHawl} يوم`,
      badgeColor: 'bg-gold-500/20 text-gold-400',
    },
    {
      id: 'goals',
      titleAr: 'محاكي الأهداف المالية',
      icon: Target,
      badge: '4 أهداف',
    },
    {
      id: 'settings',
      titleAr: 'الضوابط الشرعية والإعدادات',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-[calc(100vh-5rem)] sticky top-20 border-l border-white/5 bg-background/50 backdrop-blur-md p-4 justify-between select-none">
      <div className="space-y-6">
        
        {/* Navigation Menu */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            القائمة الرئيسية
          </p>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-l from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-300 border-r-4 border-emerald-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.titleAr}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Quick Prompt Card */}
        <div className="relative overflow-hidden rounded-2xl glass-card-emerald p-4 border border-emerald-500/20 shadow-lg">
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <h4 className="text-xs font-bold text-slate-100">المستشار الفقهي والاستثماري</h4>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            هل لديك تساؤل حول فلترة سهم معين أو كيفية تطهير أرباح الشركات العالمية؟
          </p>
          <button
            onClick={onOpenAiChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <span>استشر الذكاء الاصطناعي</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Footer Sharia Assurance Badge */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-200">الرقابة الشرعية المعتمدة</div>
              <div className="text-[10px] text-slate-400">معيار الأيوفي (AAOIFI)</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-emerald-400">{shariaHealthScore}%</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center">
          نماء © 2026 • منصة استثمارية مرخصة وفق الضوابط الإسلامية
        </p>
      </div>

    </aside>
  );
};
