import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt if user hasn't dismissed it
      const dismissed = localStorage.getItem('namaa_pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If standalone already, do not show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      setShowIOSGuide(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('namaa_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating Bottom / Top Banner */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="glass-modal rounded-3xl p-4 sm:p-5 border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-gold-400 p-[2px] shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center font-black text-lg text-emerald-400">
                نـ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-slate-100">تطبيق نماء الذكي</h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">PWA</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                ثبّت التطبيق على شاشة هاتفك الرئيسية لتجربة سريعة وتصفح بدون إنترنت.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              تثبيت
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl glass-modal border border-emerald-500/40 p-6 space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-100">تثبيت تطبيق نماء على iPhone / iPad</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                لتثبيت التطبيق على نظام iOS عبر متصفح Safari، اتبع الخطوات التالية:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 space-y-3 text-xs text-right text-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>اضغط على زر المشاركة <b>(Share <Share className="w-3.5 h-3.5 inline mx-1 text-blue-400" />)</b> أسفل المتصفح.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>مرر للأسفل واختر <b>"إضافة إلى الشاشة الرئيسية" (<PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> Add to Home Screen)</b>.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>اضغط على <b>"إضافة" (Add)</b> في أعلى اليمين.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}
    </>
  );
};
