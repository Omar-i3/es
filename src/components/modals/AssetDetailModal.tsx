import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Scale,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AssetDetailModal: React.FC = () => {
  const { selectedAssetForAudit, setSelectedAssetForAudit, formatMoney } = usePortfolio();

  if (!selectedAssetForAudit) return null;

  const audit = selectedAssetForAudit.shariaAudit;
  const isDebtSafe = audit.debtToMarketCapRatio < 33;
  const isCashSafe = audit.cashInterestRatio < 33;
  const isImpureSafe = audit.impureRevenueRatio < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl glass-modal border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-100">
                  تقرير الفحص الشرعي: {selectedAssetForAudit.nameAr}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {audit.complianceScore}% توافق
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                رمز السهم: {selectedAssetForAudit.symbol} • {selectedAssetForAudit.market}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedAssetForAudit(null)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Sharia Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-emerald-300">
                الأصل مجاز ومصنف كـ "استثمار إسلامي نقي"
              </div>
              <div className="text-xs text-emerald-400/80 mt-0.5">
                {audit.rulingReference}
              </div>
            </div>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] text-slate-400">تاريخ آخر تدقيق</div>
            <div className="text-xs font-semibold text-slate-200">{audit.lastAuditDate}</div>
          </div>
        </div>

        {/* AAOIFI Criteria Financial Ratios */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>معايير الفلترة المالية (هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية AAOIFI)</span>
          </h4>

          <div className="space-y-3">
            
            {/* 1. Debt Ratio */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">1. نسبة إجمالي الديون الربوية إلى القيمة السوقية</span>
                <span className={`font-bold ${isDebtSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {audit.debtToMarketCapRatio}% <span className="text-slate-400 font-normal">(الحد الأقصى: 33%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-full ${isDebtSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min((audit.debtToMarketCapRatio / 33) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {isDebtSafe 
                  ? '✅ تلتزم الشركة بسقف الاقتراض المسموح شرعاً ولا تعتمد على التمويل الربوي الكثيف.' 
                  : '⚠️ تجاوزت نسبة الديون الحد الشرعي المسموح.'}
              </p>
            </div>

            {/* 2. Cash & Interest-bearing securities */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">2. نسبة النقد والاستثمارات ذات الفائدة إلى القيمة السوقية</span>
                <span className={`font-bold ${isCashSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {audit.cashInterestRatio}% <span className="text-slate-400 font-normal">(الحد الأقصى: 33%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-full ${isCashSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min((audit.cashInterestRatio / 33) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {isCashSafe 
                  ? '✅ النقدية الربوية ضمن المعدل المسموح ولا تمثل أغلبية أصول الشركة.' 
                  : '⚠️ نسبة النقدية بفائدة تفوق المعيار الشرعي.'}
              </p>
            </div>

            {/* 3. Impure Revenue */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">3. نسبة الإيرادات العرضية غير المتوافقة</span>
                <span className={`font-bold ${isImpureSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {audit.impureRevenueRatio}% <span className="text-slate-400 font-normal">(الحد الأقصى: 5%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full rounded-full ${isImpureSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min((audit.impureRevenueRatio / 5) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {audit.purificationPercentage === 0 
                  ? '✨ سهم نقي 100% بدون أي إيراد عرضي ولا يتطلب أي تطهير.'
                  : `💡 يتطلب تطهير نسبة ${audit.purificationPercentage}% من أي توزيعات أرباح مستلمة وإخراجها للجمعيات الخيرية.`}
              </p>
            </div>

          </div>
        </div>

        {/* Auditor & Compliance Certification */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-slate-400 text-[11px]">جهة المراجعة والاعتماد الشرعي</div>
              <div className="font-bold text-slate-200">{audit.auditor}</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-4 h-4" />
            <span>شهادة تدقيق سارية</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedAssetForAudit(null)}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
          >
            إغلاق التقرير
          </button>
        </div>

      </div>
    </div>
  );
};
