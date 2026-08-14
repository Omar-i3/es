import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { lastToast, clearToast } = usePortfolio();

  if (!lastToast) return null;

  return (
    <div className="fixed top-20 sm:top-24 left-4 right-4 sm:right-auto sm:left-6 z-50 animate-in slide-in-from-top-4 duration-300 pointer-events-auto max-w-sm">
      <div className={`p-4 rounded-2xl glass-modal border shadow-2xl flex items-start gap-3 ${
        lastToast.type === 'success' 
          ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-100'
          : lastToast.type === 'warning'
          ? 'border-amber-500/50 bg-amber-950/80 text-amber-100'
          : 'border-blue-500/50 bg-slate-900/90 text-slate-100'
      }`}>
        <div className="flex-shrink-0 mt-0.5">
          {lastToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : lastToast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <Info className="w-5 h-5 text-blue-400" />
          )}
        </div>

        <div className="flex-1 space-y-0.5 text-right">
          <h5 className="font-bold text-xs sm:text-sm">{lastToast.title}</h5>
          <p className="text-[11px] opacity-90 leading-relaxed">{lastToast.message}</p>
        </div>

        <button
          onClick={clearToast}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
