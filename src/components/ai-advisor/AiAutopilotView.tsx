import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Scale,
  Zap,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Filter,
  Flame
} from 'lucide-react';
import { RISK_PROFILES, RISK_QUESTIONS } from '../../data/mockData';
import { RiskProfileType, DecisionType } from '../../types';

export const AiAutopilotView: React.FC = () => {
  const {
    isAutopilotEnabled,
    toggleAutopilot,
    selectedRiskProfile,
    setRiskProfile,
    submitRiskAssessment,
    executeRebalance,
    isRebalancing,
    aiLogs,
    holdings,
    totalPortfolioValueSAR,
    formatMoney
  } = usePortfolio();

  // Wizard state for Risk Assessment Questionnaire
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [filterType, setFilterType] = useState<DecisionType | 'all'>('all');

  const currentProfileData = RISK_PROFILES.find(p => p.id === selectedRiskProfile) || RISK_PROFILES[1];

  // Calculate current allocation by category
  const currentCategoryAllocations = {
    halal_equities: Number(((holdings.filter(h => h.asset.category === 'halal_equities').reduce((s, h) => s + h.currentValueSAR, 0) / totalPortfolioValueSAR) * 100).toFixed(1)),
    sukuk: Number(((holdings.filter(h => h.asset.category === 'sukuk').reduce((s, h) => s + h.currentValueSAR, 0) / totalPortfolioValueSAR) * 100).toFixed(1)),
    halal_etfs: Number(((holdings.filter(h => h.asset.category === 'halal_etfs').reduce((s, h) => s + h.currentValueSAR, 0) / totalPortfolioValueSAR) * 100).toFixed(1)),
    physical_gold: Number(((holdings.filter(h => h.asset.category === 'physical_gold').reduce((s, h) => s + h.currentValueSAR, 0) / totalPortfolioValueSAR) * 100).toFixed(1)),
  };

  const handleAnswerSelect = (score: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = score;
    setSelectedAnswers(newAnswers);

    if (currentQuestionIndex < RISK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate total score
      const totalScore = newAnswers.reduce((sum, s) => sum + s, 0);
      submitRiskAssessment(totalScore);
      setShowQuestionnaire(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
    }
  };

  const filteredLogs = aiLogs.filter(log => {
    if (filterType === 'all') return true;
    if (filterType === 'rebalance') return log.type === 'rebalance';
    if (filterType === 'screening_alert') return log.type === 'screening_alert';
    if (filterType === 'purification') return log.type === 'purification';
    if (filterType === 'risk_mitigation') return log.type === 'risk_mitigation';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Autopilot Hero Controller */}
      <div className="relative overflow-hidden rounded-3xl glass-card-emerald p-6 sm:p-8 border border-emerald-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/20">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                    المستشار والطيار الآلي الذكي (Namaa AI Autopilot)
                  </h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    isAutopilotEnabled 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {isAutopilotEnabled ? 'الوضع الذاتي الكامل' : 'الوضع اليدوي'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  خوارزمية ذكية مبرمجة على إدارة المحافظ الإسلامية، إعادة التوازن التلقائي عند انحراف الأوزان، والفحص الشرعي المستمر.
                </p>
              </div>
            </div>
          </div>

          {/* Autopilot Toggle Switch */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full lg:w-auto justify-between lg:justify-start">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-200">الاستثمار الذاتي المستقل</div>
              <div className="text-[11px] text-slate-400">
                {isAutopilotEnabled ? 'تنفيذ فوري لقرارات التوازن' : 'يتطلب موافقة يدوية مسبقة'}
              </div>
            </div>

            <button
              onClick={toggleAutopilot}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ${
                isAutopilotEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isAutopilotEnabled ? '-translate-x-9' : '-translate-x-1'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Risk Profile Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>استراتيجية المحفظة وملف المخاطر الشرعي</span>
            </h3>
            <p className="text-xs text-slate-400">اختر النموذج الاستثماري المتوافق مع أهدافك أو أجرِ استبيان الملاءمة</p>
          </div>

          <button
            onClick={() => setShowQuestionnaire(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-xs font-bold border border-gold-500/30 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-gold-400" />
            <span>استبيان تحديد المخاطر</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISK_PROFILES.map((profile) => {
            const isSelected = selectedRiskProfile === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => setRiskProfile(profile.id)}
                className={`relative rounded-3xl p-5 border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'glass-card-emerald border-emerald-500 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-500/50'
                    : 'glass-card border-white/5 hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 left-4 flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>المعتمدة حالياً</span>
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{profile.titleAr}</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold">{profile.subtitleAr}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {profile.descriptionAr}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>العائد السنوي المتوقع:</span>
                    <span className="font-bold text-emerald-400">{profile.expectedAnnualReturn}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>درجة التذبذب:</span>
                    <span className="font-semibold text-slate-200">{profile.volatilityLevel}</span>
                  </div>
                  
                  {/* Category Allocation mini bars */}
                  <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] text-center">
                    <div className="p-1 rounded bg-white/5">
                      <div className="text-slate-400">أسهم</div>
                      <div className="font-bold text-slate-200">{profile.targetAllocation.halal_equities || 15}%</div>
                    </div>
                    <div className="p-1 rounded bg-white/5">
                      <div className="text-slate-400">صكوك</div>
                      <div className="font-bold text-slate-200">{profile.targetAllocation.sukuk || 65}%</div>
                    </div>
                    <div className="p-1 rounded bg-white/5">
                      <div className="text-slate-400">صناديق</div>
                      <div className="font-bold text-slate-200">{profile.targetAllocation.halal_etfs || 5}%</div>
                    </div>
                    <div className="p-1 rounded bg-white/5">
                      <div className="text-slate-400">ذهب</div>
                      <div className="font-bold text-slate-200">{profile.targetAllocation.physical_gold || 15}%</div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Target Allocation & Rebalance Dashboard */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>محرك إعادة التوازن الشرعي الذكي (Smart Rebalancing)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              مقارنة التوزيع الفعلي للأصول مقابل النسب المستهدفة في استراتيجية "{currentProfileData.titleAr}"
            </p>
          </div>

          <button
            onClick={() => executeRebalance()}
            disabled={isRebalancing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRebalancing ? 'animate-spin' : ''}`} />
            <span>{isRebalancing ? 'جاري ضبط التوازن...' : 'تنفيذ إعادة التوازن التلقائي'}</span>
          </button>
        </div>

        {/* Allocation Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Equities */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">الأسهم النقية (Halal Equities)</span>
              <span className="text-slate-400">
                الفعلي: <b className="text-emerald-400">{currentCategoryAllocations.halal_equities}%</b> | المستهدف: <b>{currentProfileData.targetAllocation.halal_equities}%</b>
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${currentCategoryAllocations.halal_equities}%` }} />
            </div>
          </div>

          {/* Sukuk */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">الصكوك الإسلامية (Sukuk)</span>
              <span className="text-slate-400">
                الفعلي: <b className="text-blue-400">{currentCategoryAllocations.sukuk}%</b> | المستهدف: <b>{currentProfileData.targetAllocation.sukuk}%</b>
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${currentCategoryAllocations.sukuk}%` }} />
            </div>
          </div>

          {/* ETFs */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">صناديق المؤشرات المتوافقة (ETFs)</span>
              <span className="text-slate-400">
                الفعلي: <b className="text-purple-400">{currentCategoryAllocations.halal_etfs}%</b> | المستهدف: <b>{currentProfileData.targetAllocation.halal_etfs}%</b>
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${currentCategoryAllocations.halal_etfs}%` }} />
            </div>
          </div>

          {/* Gold */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">الذهب المادي المخصص (Physical Gold)</span>
              <span className="text-slate-400">
                الفعلي: <b className="text-gold-400">{currentCategoryAllocations.physical_gold}%</b> | المستهدف: <b>{currentProfileData.targetAllocation.physical_gold}%</b>
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden flex">
              <div className="h-full bg-gold-500 rounded-full transition-all duration-500" style={{ width: `${currentCategoryAllocations.physical_gold}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* Decision Feed Log */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">سجل القرارات والتحليلات الآلية المفصل</h3>
              <p className="text-xs text-slate-400">سجل شفاف يوضح الأسباب الفقهية والمالية لكل إجراء</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType('rebalance')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'rebalance' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              إعادة التوازن
            </button>
            <button
              onClick={() => setFilterType('screening_alert')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'screening_alert' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              الفحص الشرعي
            </button>
            <button
              onClick={() => setFilterType('purification')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === 'purification' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              التطهير والزكاة
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-5 rounded-2xl bg-white/5 hover:bg-white/[0.07] border border-white/5 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-sm text-slate-100">{log.titleAr}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    {log.isAutonomous ? 'آلي ذاتي' : 'بموافقة المستخدم'}
                  </span>
                  <span className="text-xs text-slate-400">{log.timestamp}</span>
                </div>
              </div>

              {/* Rationale & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <div className="text-slate-400 text-[11px] mb-1 font-semibold">السبب والتحليل المالي/الفقهي:</div>
                  <div className="text-slate-200 leading-relaxed">{log.reasonAr}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <div className="text-slate-400 text-[11px] mb-1 font-semibold">الإجراء المنفذ والأثر:</div>
                  <div className="text-emerald-300 leading-relaxed">{log.actionAr}</div>
                  <div className="text-[11px] text-slate-400 mt-1">الأثر: {log.impactAr}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Questionnaire Wizard Modal */}
      {showQuestionnaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl glass-modal border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h3 className="font-black text-base sm:text-lg text-slate-100">
                  استبيان الملاءمة وتحمل المخاطر الشرعي
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold">
                السؤال {currentQuestionIndex + 1} من {RISK_QUESTIONS.length}
              </span>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed">
                {RISK_QUESTIONS[currentQuestionIndex].questionAr}
              </h4>

              <div className="space-y-2.5">
                {RISK_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option.score)}
                    className="w-full text-right p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-xs sm:text-sm text-slate-200 hover:text-emerald-300 font-semibold transition-all duration-200 flex items-center justify-between group"
                  >
                    <span>{option.textAr}</span>
                    <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
              <button
                onClick={() => setShowQuestionnaire(false)}
                className="text-slate-400 hover:text-slate-200 font-semibold"
              >
                إلغاء
              </button>
              <span>اختر الإجابة الأقرب لوضعك المالي لاستنتاج المحفظة المثالية</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
