import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  X,
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
}

export const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'deposit',
}) => {
  const { 
    depositCash, 
    withdrawCash, 
    cashBalanceSAR, 
    formatMoney, 
    isAutopilotEnabled 
  } = usePortfolio();

  const [mode, setMode] = useState<'deposit' | 'withdraw'>(initialMode);
  const [amount, setAmount] = useState<string>('5000');
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'apple_pay' | 'bank_transfer'>('mada');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      if (mode === 'deposit') {
        depositCash(numAmount);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#F59E0B']
        });
        setIsProcessing(false);
        onClose();
      } else {
        const success = withdrawCash(numAmount);
        setIsProcessing(false);
        if (success) onClose();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl glass-modal border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-100">
                {mode === 'deposit' ? 'إيداع نقدي واستثمار فوري' : 'سحب أرباح أو سيولة نقدية'}
              </h3>
              <p className="text-[11px] text-slate-400">
                السيولة النقدية المتاحة: <b className="text-emerald-400">{formatMoney(cashBalanceSAR)}</b>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle (Deposit / Withdraw) */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('deposit')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'deposit'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>إيداع استثماري</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'withdraw'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>طلب سحب</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              المبلغ المراد {mode === 'deposit' ? 'إيداعه' : 'سحبه'} (ر.س):
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={100}
                required
                className="w-full px-4 py-3 rounded-2xl bg-black/30 border border-white/15 text-lg font-black text-emerald-400 focus:outline-none focus:border-emerald-500 text-left tabular-nums"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                ر.س
              </span>
            </div>

            {/* Quick Amounts */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none text-xs">
              {quickAmounts.map((qAmount) => (
                <button
                  key={qAmount}
                  type="button"
                  onClick={() => setAmount(qAmount.toString())}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    Number(amount) === qAmount
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  +{qAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector (For Deposit) */}
          {mode === 'deposit' ? (
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-300">وسيلة الدفع الآمنة:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'mada', label: 'بطاقة مدى', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay', icon: Sparkles },
                  { id: 'bank_transfer', label: 'تحويل بنكي', icon: Building },
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === pm.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold shadow-sm'
                          : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-slate-200">التحويل إلى الحساب البنكي المعتمد (IBAN):</div>
              <div className="text-emerald-400 font-mono text-[11px]">SA82 8000 0412 6080 1012 3456</div>
              <div className="text-[10px] text-slate-400">مصرف الراجحي • يتم التنفيذ خلال دقائق عبر نظام سريع</div>
            </div>
          )}

          {/* Autopilot Auto-allocation info */}
          {mode === 'deposit' && isAutopilotEnabled && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <b>الطيار الآلي مفعل:</b> سيتم استثمار وتوزيع المبلغ تلقائياً وفق نسب الشريعة المستهدفة فور الإيداع.
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isProcessing || !amount || Number(amount) <= 0}
            className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
              mode === 'deposit'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-600/30'
            }`}
          >
            {isProcessing ? (
              <span>جاري المعالجة البنكية...</span>
            ) : mode === 'deposit' ? (
              <span>تأكيد الإيداع الفوري ({formatMoney(Number(amount))})</span>
            ) : (
              <span>تأكيد طلب السحب ({formatMoney(Number(amount))})</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
