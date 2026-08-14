import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  Calendar,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  ChevronLeft,
  FileCheck,
  Coins,
  ArrowUpRight,
  Info,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PurificationRecord } from '../../types';

export const ZakatPurificationView: React.FC = () => {
  const {
    zakatReport,
    payZakat,
    purificationRecords,
    purifyDividend,
    purifyAllPending,
    formatMoney,
    totalPortfolioValueSAR
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<'zakat' | 'purification'>('zakat');
  const [selectedCharity, setSelectedCharity] = useState<string>('المنصة الوطنية للعمل الخيري (إحسان)');
  const [customZakatAmount, setCustomZakatAmount] = useState<string>(zakatReport.zakatDueAmountSAR.toFixed(0));
  const [showZakatSuccessModal, setShowZakatSuccessModal] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<PurificationRecord | null>(null);

  const pendingRecords = purificationRecords.filter(r => r.status === 'pending');
  const purifiedRecords = purificationRecords.filter(r => r.status === 'purified');
  const totalPendingPurificationSAR = pendingRecords.reduce((sum, r) => sum + r.purificationAmountSAR, 0);

  const handlePayZakatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(customZakatAmount);
    if (amount <= 0) return;

    payZakat(amount);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#FFFFFF']
    });
    setShowZakatSuccessModal(true);
  };

  const handlePurifyAll = () => {
    purifyAllPending(selectedCharity);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#34D399']
    });
  };

  const handlePurifySingle = (recordId: string) => {
    purifyDividend(recordId, selectedCharity);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B']
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-card-gold p-6 sm:p-8 border border-gold-500/30">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
              <Scale className="w-4 h-4 text-gold-400" />
              <span>أدوات الامتثال والطهارة المالية (AAOIFI Standard 35)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              حاسبة الزكاة الذكية ونظام تطهير الأرباح
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              احسب زكاة محفظتك بدقة فقهية وفق حول المال والنصاب الشرعي، وقم بتطهير الإيرادات العرضية للشركات المساهمة بنقرة واحدة.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setActiveSubTab('zakat')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSubTab === 'zakat'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              حاسبة الزكاة والحول
            </button>
            <button
              onClick={() => setActiveSubTab('purification')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                activeSubTab === 'purification'
                  ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>تطهير الأرباح</span>
              {pendingRecords.length > 0 && (
                <span className="mr-1.5 px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                  {pendingRecords.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {activeSubTab === 'zakat' ? (
        /* Zakat View */
        <div className="space-y-6">
          
          {/* Zakat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Due Amount */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الزكاة المستحقة التقديرية</span>
                <Scale className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                {formatMoney(zakatReport.zakatDueAmountSAR)}
              </div>
              <p className="text-[11px] text-slate-400">
                نسبة 2.5% على الأوعية الزكوية
              </p>
            </div>

            {/* Zakatable Base */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الوعاء الخاضع للزكاة</span>
                <Coins className="w-4 h-4 text-gold-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-100 tabular-nums">
                {formatMoney(zakatReport.zakatableAssetsValueSAR)}
              </div>
              <p className="text-[11px] text-slate-400">
                صافي الأصول المتداولة والسيولة
              </p>
            </div>

            {/* Hawl Tracker */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>موعد حول الزكاة</span>
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-slate-100">
                {zakatReport.hawlDateHijri}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <span>متبقي {zakatReport.daysRemainingInHawl} يوماً على اكتمال الحول</span>
              </div>
            </div>

            {/* Nisab Status */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>حد النصاب الشرعي</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-slate-100 tabular-nums">
                {formatMoney(zakatReport.nisabThresholdSAR)}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>الثروة بلغت النصاب الشرعي (85g ذهب)</span>
              </div>
            </div>

          </div>

          {/* Breakdown Table by Asset Class */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-400" />
                  <span>تفصيل حساب الوعاء الزكوي حسب الأصول</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تطبيق معيار الأيوفي الشرعي رقم (35) بشأن زكاة الشركات المساهمة والمحافظ
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold">
                    <th className="pb-3 pr-2">فئة الأصل</th>
                    <th className="pb-3">القيمة السوقية</th>
                    <th className="pb-3">نسبة الوعاء الزكوي</th>
                    <th className="pb-3">المبلغ الخاضع للزكاة</th>
                    <th className="pb-3 pl-2">الزكاة المستحقة (2.5%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200 font-medium">
                  {zakatReport.breakdownByCategory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-2 font-bold text-slate-100">{item.categoryNameAr}</td>
                      <td className="py-3.5 tabular-nums">{formatMoney(item.totalValueSAR)}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 font-bold text-emerald-400">
                          {item.zakatablePercentage}%
                        </span>
                      </td>
                      <td className="py-3.5 tabular-nums">{formatMoney(item.zakatableValueSAR)}</td>
                      <td className="py-3.5 pl-2 font-bold text-emerald-400 tabular-nums">
                        {formatMoney(item.zakatDueSAR)}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Cash Row */}
                  <tr className="hover:bg-white/[0.02] font-semibold bg-white/[0.02]">
                    <td className="py-3.5 pr-2 text-slate-100">السيولة النقدية في المحفظة</td>
                    <td className="py-3.5 tabular-nums">{formatMoney(14250)}</td>
                    <td className="py-3.5"><span className="px-2 py-0.5 rounded-md bg-white/5 text-emerald-400">100%</span></td>
                    <td className="py-3.5 tabular-nums">{formatMoney(14250)}</td>
                    <td className="py-3.5 pl-2 font-bold text-emerald-400 tabular-nums">{formatMoney(14250 * 0.025)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pay Zakat Action Box */}
            <div className="mt-6 p-5 rounded-2xl glass-card-emerald border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                  <HeartHandshake className="w-5 h-5 text-emerald-400" />
                  <span>إخراج وتوثيق زكاة المال فورياً</span>
                </div>
                <p className="text-xs text-slate-300">
                  يمكنك توثيق إخراج الزكاة أو توجيهها لمنصة إحسان الخيرية المعتمدة رسمياً في المملكة.
                </p>
              </div>

              <form onSubmit={handlePayZakatSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="number"
                    value={customZakatAmount}
                    onChange={(e) => setCustomZakatAmount(e.target.value)}
                    className="w-32 px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 text-left"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">ر.س</span>
                </div>
                
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap active:scale-95"
                >
                  توثيق ودفع الزكاة
                </button>
              </form>
            </div>

          </div>

        </div>
      ) : (
        /* Purification View */
        <div className="space-y-6">
          
          {/* Purification Explanatory Card */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <span>تطهير التوزيعات والأرباح غير النقية</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  تقوم الشركات المساهمة العالمية والمحلية في بعض الأحيان بإيداع سيولتها في حسابات بنكية تدر فوائد عرضية ضئيلة. يقوم المستشار الآلي باحتساب هذا الجزء وإتاحته للتطهير بنقرة واحدة.
                </p>
              </div>

              {pendingRecords.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="text-[11px] text-slate-400">إجمالي المعلق</div>
                    <div className="text-base font-bold text-amber-400 tabular-nums">
                      {formatMoney(totalPendingPurificationSAR)}
                    </div>
                  </div>

                  <button
                    onClick={handlePurifyAll}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-gold-500/20 active:scale-95"
                  >
                    تطهير الكل والتبرع فوراُ
                  </button>
                </div>
              )}
            </div>

            {/* Charity Selector */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-semibold">توجيه مبالغ التطهير إلى:</span>
              {[
                'المنصة الوطنية للعمل الخيري (إحسان)',
                'منصة جود الإسكان التنموي',
                'جمعية رعاية الأيتام الخيرية',
              ].map((charity) => (
                <button
                  key={charity}
                  onClick={() => setSelectedCharity(charity)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedCharity === charity
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {charity}
                </button>
              ))}
            </div>
          </div>

          {/* Pending Purification Records Table */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-200">الأرباح المستحقة للتطهير حالياً</h4>

            {pendingRecords.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="font-bold text-slate-200 text-sm">محفظتك مطهرة بالكامل 100%!</h5>
                <p className="text-xs text-slate-400">لا توجد أي عوائد أو أرباح غير منقاة معلقة حالياً.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold">
                      <th className="pb-3 pr-2">الأصل / الشركة</th>
                      <th className="pb-3">إجمالي التوزيع</th>
                      <th className="pb-3">نسبة التطهير</th>
                      <th className="pb-3">المبلغ المستحق</th>
                      <th className="pb-3">الفترة</th>
                      <th className="pb-3 pl-2 text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {pendingRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-slate-100">
                          {rec.companyNameAr} <span className="text-slate-400 font-normal">({rec.symbol})</span>
                        </td>
                        <td className="py-3.5 tabular-nums">{formatMoney(rec.grossDividendSAR)}</td>
                        <td className="py-3.5 font-bold text-amber-400">{rec.impurePercentage}%</td>
                        <td className="py-3.5 font-bold text-slate-100 tabular-nums">{formatMoney(rec.purificationAmountSAR)}</td>
                        <td className="py-3.5 text-slate-400">{rec.period}</td>
                        <td className="py-3.5 pl-2 text-left">
                          <button
                            onClick={() => handlePurifySingle(rec.id)}
                            className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs transition-all active:scale-95"
                          >
                            تطهير وتبرع
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Purified History Records */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-200">سجل شهادات التطهير السابقة والموثقة</h4>
            <div className="space-y-3">
              {purifiedRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/[0.07] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{rec.companyNameAr} ({rec.symbol})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-normal">
                        تم التطهير
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      المبلغ المتبرع به: <b className="text-slate-200">{formatMoney(rec.purificationAmountSAR)}</b> لصالح: <span className="text-emerald-400">{rec.charityRecipientAr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">{rec.purifiedAt}</span>
                    <button
                      onClick={() => setViewingCertificate(rec)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>عرض الشهادة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Zakat Success Celebration Modal */}
      {showZakatSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-modal border border-emerald-500/40 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-100">تقبل الله طاعتكم وزكاتكم</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                تم توثيق إخراج زكاة المال بمبلغ <b>{formatMoney(Number(customZakatAmount))}</b> بنجاح وفق الضوابط الشرعية المعتمدة.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 text-xs text-slate-400 space-y-1">
              <div>رقم التوثيق المالي: ZKT-2026-SA-7729</div>
              <div>التاريخ: {new Date().toLocaleDateString('ar-SA')}</div>
            </div>
            <button
              onClick={() => setShowZakatSuccessModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all"
            >
              تم
            </button>
          </div>
        </div>
      )}

      {/* Viewing Certificate Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl glass-modal border border-gold-500/40 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                <Award className="w-5 h-5" />
                <span>شهادة تطهير أرباح شرعية موثقة</span>
              </div>
              <button
                onClick={() => setViewingCertificate(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-semibold"
              >
                إغلاق
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-center">
              <div className="text-xs text-slate-400">منصة نماء للاستثمار الإسلامي الذكي</div>
              <h4 className="text-lg font-black text-emerald-400">إفادة تطهير إيرادات غير نقية</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                تشهد المنصة بأنه قد تم تطهير مبلغ وقدره <b>{formatMoney(viewingCertificate.purificationAmountSAR)}</b> من توزيعات <b>{viewingCertificate.companyNameAr} ({viewingCertificate.symbol})</b> وإيداعه لصالح <b>{viewingCertificate.charityRecipientAr}</b>.
              </p>
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-slate-400 text-right">
                <div>رقم الشهادة: <span className="text-slate-200 font-bold">{viewingCertificate.certificateId}</span></div>
                <div>تاريخ التطهير: <span className="text-slate-200 font-bold">{viewingCertificate.purifiedAt}</span></div>
              </div>
            </div>

            <button
              onClick={() => setViewingCertificate(null)}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs transition-all"
            >
              طباعة / إغلاق الشهادة
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
