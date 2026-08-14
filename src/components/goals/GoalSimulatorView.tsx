import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Target,
  Sparkles,
  Plus,
  Compass,
  Home,
  Palmtree,
  GraduationCap,
  TrendingUp,
  Sliders,
  DollarSign,
  Calendar,
  CheckCircle2,
  X,
  Coins,
  ChevronLeft
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { FinancialGoal } from '../../types';

export const GoalSimulatorView: React.FC = () => {
  const { goals, addGoal, formatMoney, totalPortfolioValueSAR } = usePortfolio();

  // Interactive Simulator Parameters
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2500);
  const [yearsHorizon, setYearsHorizon] = useState<number>(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(11.5);
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);

  // New Goal Form State
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(100000);
  const [newGoalYears, setNewGoalYears] = useState(3);
  const [newGoalMonthly, setNewGoalMonthly] = useState(1500);
  const [newGoalCategory, setNewGoalCategory] = useState<FinancialGoal['category']>('hajj');

  // Calculate compound trajectory data
  const simulationChartData = useMemo(() => {
    const data = [];
    let currentShariaWealth = totalPortfolioValueSAR;
    let currentStaticSavings = totalPortfolioValueSAR;
    const r = expectedReturnRate / 100;

    for (let y = 0; y <= yearsHorizon; y++) {
      if (y === 0) {
        data.push({
          year: 'اليوم',
          shariaWealth: Math.round(currentShariaWealth),
          staticSavings: Math.round(currentStaticSavings),
        });
      } else {
        // Compound interest with monthly contributions
        // FV = PV*(1+r)^y + PMT * [((1+r/12)^(12*y) - 1) / (r/12)]
        const monthlyRate = r / 12;
        const totalMonths = y * 12;
        const futureValuePrincipal = totalPortfolioValueSAR * Math.pow(1 + r, y);
        const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        const totalSimulated = futureValuePrincipal + futureValueContributions;
        const staticTotal = totalPortfolioValueSAR + (monthlyContribution * totalMonths);

        data.push({
          year: `سنة ${y}`,
          shariaWealth: Math.round(totalSimulated),
          staticSavings: Math.round(staticTotal),
        });
      }
    }
    return data;
  }, [totalPortfolioValueSAR, monthlyContribution, yearsHorizon, expectedReturnRate]);

  const finalSimulatedValue = simulationChartData[simulationChartData.length - 1]?.shariaWealth || 0;
  const finalStaticValue = simulationChartData[simulationChartData.length - 1]?.staticSavings || 0;
  const netCompoundGain = finalSimulatedValue - finalStaticValue;

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    addGoal({
      titleAr: newGoalTitle,
      targetAmountSAR: Number(newGoalTarget),
      currentAmountSAR: 0,
      targetYears: Number(newGoalYears),
      monthlyContributionSAR: Number(newGoalMonthly),
      category: newGoalCategory,
      icon: newGoalCategory === 'hajj' ? 'Compass' : newGoalCategory === 'home' ? 'Home' : newGoalCategory === 'retirement' ? 'Palmtree' : 'GraduationCap',
      projectedReturnRate: expectedReturnRate,
    });

    setShowAddGoalModal(false);
    setNewGoalTitle('');
  };

  const getGoalIcon = (category: FinancialGoal['category']) => {
    switch (category) {
      case 'hajj': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'home': return <Home className="w-5 h-5 text-blue-400" />;
      case 'retirement': return <Palmtree className="w-5 h-5 text-gold-400" />;
      case 'education': return <GraduationCap className="w-5 h-5 text-purple-400" />;
      default: return <Target className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>التخطيط المالي الذكي ومضاعفة الثروة المركبة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              محاكي الأهداف المالية ونمو الثروة الشرعية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              شاهد كيف تعمل قوة النمو المركب الحلال على تسريع تحقيق أهدافك الكبرى مثل الحج، تملك المنزل، أو التقاعد المالي المبكر.
            </p>
          </div>

          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة هدف استثماري جديد</span>
          </button>
        </div>
      </div>

      {/* Active Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {goals.map((goal) => {
          const progressPct = Math.min(Math.round((goal.currentAmountSAR / goal.targetAmountSAR) * 100), 100);
          return (
            <div
              key={goal.id}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {getGoalIcon(goal.category)}
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{progressPct}% منجز</span>
                </div>

                <h4 className="font-bold text-sm text-slate-100">{goal.titleAr}</h4>
                <div className="text-lg font-black text-slate-100 mt-1 tabular-nums">
                  {formatMoney(goal.currentAmountSAR)} <span className="text-xs text-slate-400 font-normal">/ {formatMoney(goal.targetAmountSAR)}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>الادخار: <b className="text-slate-200">{formatMoney(goal.monthlyContributionSAR)}</b>/شهر</span>
                <span>المدة: <b className="text-slate-200">{goal.targetYears} سنوات</b></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Compound Growth Simulator */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>محاكي العائد المركب الحلال (Compound Halal Growth)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              حرّك المؤشرات لاكتشاف حجم ثروتك المستقبلية مقارنة بالادخار النقدي التقليدي
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">فائض النمو المركب الصافي</div>
              <div className="text-lg font-black text-emerald-400 tabular-nums">
                +{formatMoney(netCompoundGain)}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
          
          {/* Monthly Contribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">الاستقطاع الشهري:</span>
              <span className="font-bold text-emerald-400 text-sm tabular-nums">{formatMoney(monthlyContribution)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={20000}
              step={500}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>500 ر.س</span>
              <span>20,000 ر.س</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">المدة الزمنية للاستثمار:</span>
              <span className="font-bold text-slate-100 text-sm">{yearsHorizon} سنوات</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={yearsHorizon}
              onChange={(e) => setYearsHorizon(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>سنة واحدة</span>
              <span>25 سنة</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">متوسط العائد السنوي المتوقع:</span>
              <span className="font-bold text-gold-400 text-sm">{expectedReturnRate}%</span>
            </div>
            <input
              type="range"
              min={5.0}
              max={20.0}
              step={0.5}
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>متحفظ (5%)</span>
              <span>نمو متسارع (20%)</span>
            </div>
          </div>

        </div>

        {/* Projection Area Chart */}
        <div className="space-y-4">
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="shariaGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="staticSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
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
                            الاستثمار الذكي (نماء): {formatMoney(Number(payload[0]?.value) || 0)}
                          </p>
                          <p className="text-slate-400 font-medium">
                            الادخار البنكي الثابت: {formatMoney(Number(payload[1]?.value) || 0)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="shariaWealth" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#shariaGrowth)" 
                  name="الاستثمار الذكي"
                />
                <Area 
                  type="monotone" 
                  dataKey="staticSavings" 
                  stroke="#64748B" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#staticSavings)" 
                  name="الادخار الثابت"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>المحفظة الذكية المتوافقة مع الشريعة ({expectedReturnRate}% سنوياً)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-slate-500" />
                <span>الادخار النقدي البنكي (بدون عوائد استثمارية)</span>
              </div>
            </div>
            <div className="text-emerald-400 font-bold text-[11px]">
              القيمة المتوقعة بعد {yearsHorizon} سنوات: {formatMoney(finalSimulatedValue)}
            </div>
          </div>
        </div>

      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl glass-modal border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-black text-base sm:text-lg text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span>إنشاء هدف مالي شرعي جديد</span>
              </h3>
              <button onClick={() => setShowAddGoalModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم الهدف</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="مثال: شراء سيارة عائلية، تأسيس مشروع ريادي..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ المستهدف (ر.س)</label>
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                    min={1000}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المدة (بالسنوات)</label>
                  <input
                    type="number"
                    value={newGoalYears}
                    onChange={(e) => setNewGoalYears(Number(e.target.value))}
                    min={1}
                    max={30}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">فئة الهدف</label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'hajj', label: 'حج / عمرة' },
                    { id: 'home', label: 'عقار / منزل' },
                    { id: 'retirement', label: 'تقاعد حر' },
                    { id: 'education', label: 'تعليم' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewGoalCategory(cat.id as any)}
                      className={`py-2 rounded-xl border text-center transition-all ${
                        newGoalCategory === cat.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  حفظ الهدف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
