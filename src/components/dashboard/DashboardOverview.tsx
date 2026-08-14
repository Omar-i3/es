import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Bot,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Coins,
  RefreshCw,
  Eye,
  Sliders,
  ChevronLeft,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { HISTORICAL_CHART_DATA, RISK_PROFILES } from '../../data/mockData';

interface DashboardOverviewProps {
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenAiChat: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenDeposit,
  onOpenWithdraw,
  onOpenAiChat,
}) => {
  const {
    formatMoney,
    totalPortfolioValueSAR,
    totalInvestedSAR,
    totalUnrealizedProfitSAR,
    totalProfitPercentage,
    dailyReturnSAR,
    dailyReturnPercentage,
    cashBalanceSAR,
    shariaHealthScore,
    isAutopilotEnabled,
    toggleAutopilot,
    selectedRiskProfile,
    executeRebalance,
    isRebalancing,
    holdings,
    aiLogs,
    zakatReport,
    purificationRecords,
    setActiveTab,
    setSelectedAssetForAudit
  } = usePortfolio();

  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');
  const [showBenchmark, setShowBenchmark] = useState(true);

  // Asset class allocation for PieChart
  const allocationData = [
    {
      name: 'الأسهم النقية',
      value: holdings.filter(h => h.asset.category === 'halal_equities').reduce((sum, h) => sum + h.currentValueSAR, 0),
      color: '#10B981', // emerald
      category: 'halal_equities'
    },
    {
      name: 'الصكوك الإسلامية',
      value: holdings.filter(h => h.asset.category === 'sukuk').reduce((sum, h) => sum + h.currentValueSAR, 0),
      color: '#3B82F6', // blue/sukuk
      category: 'sukuk'
    },
    {
      name: 'صناديق المؤشرات',
      value: holdings.filter(h => h.asset.category === 'halal_etfs').reduce((sum, h) => sum + h.currentValueSAR, 0),
      color: '#8B5CF6', // purple
      category: 'halal_etfs'
    },
    {
      name: 'الذهب المادي المخصص',
      value: holdings.filter(h => h.asset.category === 'physical_gold').reduce((sum, h) => sum + h.currentValueSAR, 0),
      color: '#F59E0B', // gold
      category: 'physical_gold'
    },
    {
      name: 'السيولة النقدية',
      value: cashBalanceSAR,
      color: '#64748B', // slate
      category: 'cash'
    },
  ].filter(item => item.value > 0);

  const currentProfileData = RISK_PROFILES.find(p => p.id === selectedRiskProfile) || RISK_PROFILES[1];
  const pendingPurificationCount = purificationRecords.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner: Sharia & AI Autopilot State */}
      <div className="relative overflow-hidden rounded-3xl glass-card-emerald p-6 border border-emerald-500/25">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>منظومة الاستثمار الإسلامي الذكي 2.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              أهلاً بك، محفظتك تنمو وفق ضوابط الشريعة الإسلامية
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              المستشار الآلي يراقب فلترة الأسهم والصكوك ومعايير الأيوفي (AAOIFI) على مدار الساعة، مع تحويط آلي وإدارة سيولة ذكية.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => executeRebalance()}
              disabled={isRebalancing}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'جاري إعادة التوازن...' : 'إعادة توازن ذكية'}</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>إيداع استثماري</span>
            </button>
          </div>

        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Portfolio Value */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">صافي القيمة السوقية</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-100 tabular-nums">
            {formatMoney(totalPortfolioValueSAR)}
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold">
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
              dailyReturnSAR >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {dailyReturnSAR >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {dailyReturnPercentage >= 0 ? `+${dailyReturnPercentage.toFixed(2)}%` : `${dailyReturnPercentage.toFixed(2)}%`}
            </span>
            <span className="text-slate-400 text-[11px]">
              ({formatMoney(Math.abs(dailyReturnSAR))} اليوم)
            </span>
          </div>
        </div>

        {/* Total Profit & Returns */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">إجمالي الأرباح الرأسمالية</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
            +{formatMoney(totalUnrealizedProfitSAR)}
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-slate-400">
            <span className="text-emerald-400 font-bold">+{totalProfitPercentage.toFixed(2)}%</span>
            <span className="text-[11px]">من إجمالي رأس المال المستثمر</span>
          </div>
        </div>

        {/* Sharia Health Score */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">مؤشر النقاء والامتثال الشرعي</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              {shariaHealthScore}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">مطابق 100%</span>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>خالٍ من الربا والغرر والديون المرتفعة</span>
          </div>
        </div>

        {/* Zakat & Purification Quick Stat */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-gold-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">الزكاة والتطهير السنوي</span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gold-400 tabular-nums">
            {formatMoney(zakatReport.zakatDueAmountSAR)}
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400 font-medium">
            <span>متبقي على الحول: {zakatReport.daysRemainingInHawl} يوم</span>
            {pendingPurificationCount > 0 && (
              <span className="text-amber-400 font-bold">
                {pendingPurificationCount} تطهير معلق
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Main Analytical Section: Performance Chart & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Chart (2 Columns) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 border border-white/5 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>أداء المحفظة ومقارنة المؤشرات</span>
              </h3>
              <p className="text-xs text-slate-400">
                مقارنة النمو التراكمي للمحفظة مقابل مؤشر تداول الشريعي
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold">
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    timeframe === tf
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf === '1M' ? 'شهر' : tf === '3M' ? '٣ أشهر' : tf === '6M' ? '٦ أشهر' : tf === '1Y' ? 'سنة' : 'الكل'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORICAL_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="benchmarkGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-modal p-3 rounded-xl border border-white/10 text-xs shadow-xl space-y-1 text-right">
                          <p className="font-bold text-slate-200">{label}</p>
                          <p className="text-emerald-400 font-bold">
                            المحفظة الذكية: {formatMoney(Number(payload[0]?.value) || 0)}
                          </p>
                          {payload[1] && (
                            <p className="text-blue-400 font-medium">
                              مؤشر المقارنة: {formatMoney(Number(payload[1]?.value) || 0)}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#portfolioGlow)" 
                  name="المحفظة"
                />
                {showBenchmark && (
                  <Area 
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#benchmarkGlow)" 
                    name="مؤشر تداول"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>محفظة نماء الذكية (+18.0% YTD)</span>
              </div>
              <button 
                onClick={() => setShowBenchmark(!showBenchmark)}
                className={`flex items-center gap-2 transition-opacity ${showBenchmark ? 'opacity-100' : 'opacity-40'}`}
              >
                <span className="w-3 h-1.5 rounded-full bg-blue-500" />
                <span>مؤشر المقارنة التوازني</span>
              </button>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              تفوق على المؤشر بمقدار +7.34%
            </div>
          </div>

        </div>

        {/* Asset Allocation Donut (1 Column) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/5 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                <span>توزيع الأصول الشرعية</span>
              </h3>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5"
              >
                <span>التفاصيل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              توزيع متوافق مع استراتيجية "{currentProfileData.titleAr}"
            </p>
          </div>

          {/* Donut Chart */}
          <div className="relative h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(14, 21, 38, 0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const pct = ((Number(data.value) / totalPortfolioValueSAR) * 100).toFixed(1);
                      return (
                        <div className="glass-modal p-2.5 rounded-xl border border-white/10 text-xs shadow-xl text-right">
                          <p className="font-bold text-slate-100">{data.name}</p>
                          <p className="text-emerald-400 font-semibold">{formatMoney(Number(data.value))}</p>
                          <p className="text-slate-400 text-[10px]">{pct}% من إجمالي المحفظة</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400">إجمالي الأصول</span>
              <span className="text-sm font-black text-slate-100">{holdings.length} أصول</span>
            </div>
          </div>

          {/* Allocation Legend */}
          <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
            {allocationData.slice(0, 4).map((item, idx) => {
              const pct = ((item.value / totalPortfolioValueSAR) * 100).toFixed(1);
              return (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-slate-400">{formatMoney(item.value)}</span>
                    <span className="font-bold text-slate-100 tabular-nums">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Secondary Row: AI Decision Feed & Quick Sharia Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live AI Decision Log Feed (2 Columns) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">سجل قرارات المستشار الآلي المباشر</h3>
                <p className="text-xs text-slate-400">تفسيرات حية لجميع عمليات التحويط وإعادة التوازن والفحص الشرعي</p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('ai-advisor')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>لوحة الطيار الآلي</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {aiLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/[0.07] border border-white/5 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{log.isAutonomous ? 'قرار آلي ذاتي' : 'موافقة المستخدم'}</span>
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">{log.titleAr}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{log.timestamp}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pr-2 border-r-2 border-emerald-500/40">
                  {log.reasonAr}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>الإجراء: {log.actionAr}</span>
                  <span className="text-emerald-400 font-semibold">{log.impactAr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Sharia Health & Advisor Prompt (1 Column) */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/5 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>المستشار الفقهي الذكي</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 leading-snug">
              اسأل نماء عن أي حكم استثماري أو نسبة تطهير
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              مساعدنا الذكي مدرب على فتاوى المجامع الفقهية ومعايير المحاسبة الإسلامية (AAOIFI) للإجابة على استفساراتك المالية.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onOpenAiChat}
              className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-xs text-slate-300 transition-all flex items-center justify-between"
            >
              <span>لماذا تم اختيار صكوك KSA 2030؟</span>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={onOpenAiChat}
              className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-xs text-slate-300 transition-all flex items-center justify-between"
            >
              <span>كيف تحسب زكاة الأسهم ذات النية الاستثمارية؟</span>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button
              onClick={onOpenAiChat}
              className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-xs text-slate-300 transition-all flex items-center justify-between"
            >
              <span>ما هي نسبة الديون المسموحة في معيار الأيوفي؟</span>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <button
            onClick={onOpenAiChat}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Bot className="w-4 h-4" />
            <span>فتح نافذة المحادثة الفورية</span>
          </button>
        </div>

      </div>

    </div>
  );
};
