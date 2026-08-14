import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ShieldCheck, 
  Bot, 
  Sun, 
  Moon, 
  DollarSign, 
  PlusCircle, 
  Bell, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface HeaderProps {
  onOpenDeposit: () => void;
  onOpenAiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDeposit, onOpenAiChat }) => {
  const { 
    currency, 
    toggleCurrency, 
    isDarkMode, 
    toggleDarkMode, 
    isAutopilotEnabled, 
    shariaHealthScore,
    aiLogs,
    formatMoney,
    totalPortfolioValueSAR
  } = usePortfolio();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-gold-400 p-[2px] shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center overflow-hidden">
                <span className="text-emerald-400 font-bold text-xl md:text-2xl tracking-tighter">نـ</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-l from-emerald-400 via-emerald-200 to-white bg-clip-text text-transparent">
                  نَمَاءْ
                </h1>
                <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  إسلامي ذكي
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                المستشار الآلي وفق معايير هيئة الأيوفي (AAOIFI)
              </p>
            </div>
          </div>

          {/* Center Badges (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Sharia Compliance Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>مطابقة شرعية:</span>
              <span className="font-bold text-emerald-400">{shariaHealthScore}% نقي</span>
            </div>

            {/* AI Autopilot Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isAutopilotEnabled 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Bot className="w-4 h-4 animate-bounce" />
              <span>الطيار الآلي:</span>
              <span className="font-bold">{isAutopilotEnabled ? 'مفعل وتلقائي' : 'موافقة يدوية'}</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* AI Chatbot Button */}
            <button
              onClick={onOpenAiChat}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-semibold transition-all hover:scale-[1.02] shadow-sm"
              title="محادثة المستشار الآلي الذكي"
            >
              <Sparkles className="w-4 h-4 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="hidden sm:inline">اسأل المستشار</span>
              <span className="flex sm:hidden">
                <MessageSquare className="w-4 h-4" />
              </span>
            </button>

            {/* Currency Toggle (SAR / USD) */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all"
              title="تغيير العملة"
            >
              <span className={currency === 'SAR' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>ر.س</span>
              <span className="text-slate-600">/</span>
              <span className={currency === 'USD' ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>$</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                title="التنبيهات وقرارات الذكاء الاصطناعي"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-3 w-80 md:w-96 rounded-2xl glass-modal p-4 border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-sm text-slate-100">آخر قرارات المستشار الآلي</h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      مباشر
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {aiLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors">
                        <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                          <span className="text-emerald-400 font-medium">{log.titleAr}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-200 line-clamp-2 leading-relaxed">{log.reasonAr}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-white/10 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Deposit Button */}
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs md:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">إيداع فوري</span>
              <span className="sm:hidden">إيداع</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
