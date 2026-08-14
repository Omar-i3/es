import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Settings,
  ShieldCheck,
  Globe,
  Bell,
  Download,
  Lock,
  User,
  CheckCircle2,
  FileText,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currency,
    toggleCurrency,
    isDarkMode,
    toggleDarkMode,
    isAutopilotEnabled,
    toggleAutopilot,
    shariaHealthScore,
    totalPortfolioValueSAR,
    formatMoney
  } = usePortfolio();

  const [shariaStandard, setShariaStandard] = useState('AAOIFI');
  const [autoDonatePurification, setAutoDonatePurification] = useState(true);
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Generate downloadable simulated CSV
      const csvContent = `data:text/csv;charset=utf-8,الأصل,الرمز,الفئة,القيمة_السوقية_ر.س,نسبة_التوافق_الشرعي,نسبة_التطهير\n`
        + `مصرف الراجحي,1120.SR,أسهم نقية,72570,100%,0.0%\n`
        + `صكوك حكومة المملكة 2030,KSA-SK30,صكوك إسلامية,61380,100%,0.0%\n`
        + `صندوق SPUS,SPUS,صناديق مؤشرات,47250,98%,0.42%\n`
        + `أرامكو السعودية,2222.SR,أسهم نقية,40382.5,99%,0.12%\n`
        + `الذهب المادي المخصص,GLD-SHR,ذهب مادي,35448,100%,0.0%\n`
        + `صكوك البنك الإسلامي,ISDB-GRN,صكوك إسلامية,28504,100%,0.0%\n`;
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `تقرير_محفظة_نماء_الشرعية_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              إعدادات المحفظة والضوابط الشرعية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              تخصيص معايير الفلترة الفقهية، التنبيهات الذكية، وتفضيلات الحساب
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-gold-500 p-[2px]">
              <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center font-black text-xl text-emerald-400">
                ع
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-100">عمر عبدالله الشريف</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  مستثمر موثق
                </span>
              </div>
              <p className="text-xs text-slate-400">رقم الحساب الاستثماري: NAMAA-SA-98214</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">حالة التحقق الشرعي:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>مكتمل ومجاز</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sharia Governance Settings */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">حوكمة المعايير الشرعية والفلترة</h3>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Standard Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="font-bold text-slate-200 text-sm">مرجع الفحص الشرعي المعتمد</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                تطبيق المعايير المعترف بها عالمياً ومحلياً لفلترة الأسهم والصكوك
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'AAOIFI', name: 'هيئة الأيوفي (AAOIFI)' },
                { id: 'DJIM', name: 'داو جونز الإسلامي' },
                { id: 'FTSE', name: 'فوتسي الشريعي' },
              ].map((std) => (
                <button
                  key={std.id}
                  onClick={() => setShariaStandard(std.id)}
                  className={`px-3 py-2 rounded-xl font-bold transition-all ${
                    shariaStandard === std.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {std.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Donate Purification Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="font-bold text-slate-200 text-sm">التطهير التلقائي الفوري للأرباح</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                اقتطاع نسب الإيرادات العرضية غير النقية فور استلام التوزيعات وتحويلها للمنصات الخيرية
              </p>
            </div>

            <button
              onClick={() => setAutoDonatePurification(!autoDonatePurification)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                autoDonatePurification ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  autoDonatePurification ? '-translate-x-8' : '-translate-x-1'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* App & Display Preferences */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-slate-100">التفضيلات والعرض المالي</h3>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Currency Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="font-bold text-slate-200 text-sm">العملة الافتراضية لعرض المحفظة</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                التحويل الفوري للقيم والتقارير بين الريال والدولار
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => currency !== 'SAR' && toggleCurrency()}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  currency === 'SAR' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'
                }`}
              >
                ريال سعودي (ر.س)
              </button>
              <button
                onClick={() => currency !== 'USD' && toggleCurrency()}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  currency === 'USD' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'
                }`}
              >
                دولار أمريكي ($)
              </button>
            </div>
          </div>

          {/* Biometrics */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div>
              <div className="font-bold text-slate-200 text-sm">الحماية بالبصمة والوجه (Face ID / Touch ID)</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                طلب المصادقة البيومترية عند تنفيذ عمليات السحب أو تعديل المحفظة
              </p>
            </div>

            <button
              onClick={() => setEnableBiometrics(!enableBiometrics)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                enableBiometrics ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  enableBiometrics ? '-translate-x-8' : '-translate-x-1'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Reports & Export */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>تصدير التقارير المالية والزكوية الرسمية</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تنزيل كشف حساب تفصيلي بجميع العمليات ونسب الامتثال الشرعي بصيغة CSV أو PDF
            </p>
          </div>

          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 text-xs sm:text-sm font-bold transition-all border border-white/10 active:scale-95"
          >
            <Download className={`w-4 h-4 text-emerald-400 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'جاري التصدير...' : 'تصدير التقرير (CSV)'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
