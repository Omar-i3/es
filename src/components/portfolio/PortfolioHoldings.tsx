import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  PieChart as PieIcon,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Sparkles,
  ChevronLeft,
  ExternalLink,
  Coins,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AssetCategory, Holding } from '../../types';

export const PortfolioHoldings: React.FC = () => {
  const {
    holdings,
    formatMoney,
    setSelectedAssetForAudit,
    shariaHealthScore,
    totalPortfolioValueSAR
  } = usePortfolio();

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHoldings = holdings.filter(h => {
    const matchesCat = selectedCategory === 'all' || h.asset.category === selectedCategory;
    const matchesSearch = 
      h.asset.nameAr.includes(searchQuery) ||
      h.asset.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categoryLabels: { id: AssetCategory | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'كافة الأصول', count: holdings.length },
    { id: 'halal_equities', label: 'الأسهم النقية', count: holdings.filter(h => h.asset.category === 'halal_equities').length },
    { id: 'sukuk', label: 'الصكوك الإسلامية', count: holdings.filter(h => h.asset.category === 'sukuk').length },
    { id: 'halal_etfs', label: 'صناديق المؤشرات (ETFs)', count: holdings.filter(h => h.asset.category === 'halal_etfs').length },
    { id: 'physical_gold', label: 'الذهب المادي', count: holdings.filter(h => h.asset.category === 'physical_gold').length },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>فحص شرعي شامل وفق ضوابط الأيوفي (AAOIFI Standard 21)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              أصول ومكونات المحفظة الاستثمارية النقية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              جميع الأصول مفلترة بدقة وتخضع لإشراف شرعي مستمر لضمان خلوها التام من الفوائد الربوية أو نسب المديونية المرتفعة.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">إجمالي الأصول النقية</div>
              <div className="text-lg font-black text-emerald-400">{holdings.length} أصول معتمدة</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sharia Criteria Matrix Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/5 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px]">نسبة الديون الربوية</div>
            <div className="font-bold text-emerald-400 mt-0.5">&lt; 33% من القيمة السوقية</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px]">الأصول النقدية بفائدة</div>
            <div className="font-bold text-emerald-400 mt-0.5">&lt; 33% من إجمالي الأصول</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px]">الإيرادات غير المتوافقة</div>
            <div className="font-bold text-emerald-400 mt-0.5">&lt; 5% مع التطهير التلقائي</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-slate-400 text-[11px]">النشاط التشغيلي الرئيسي</div>
            <div className="font-bold text-emerald-400 mt-0.5">100% مباح وخالٍ من المحظورات</div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categoryLabels.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الأصل أو الرمز..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

      </div>

      {/* Holdings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHoldings.map((holding) => {
          const isProfit = holding.unrealizedProfitSAR >= 0;
          const isPriceUp = holding.asset.change24h >= 0;
          
          return (
            <div
              key={holding.assetId}
              className="glass-card rounded-2xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between space-y-4"
            >
              <div>
                
                {/* Card Top: Asset Info & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-emerald-400">
                      {holding.asset.symbol.split('.')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {holding.asset.nameAr}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                          متوافق 100%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{holding.asset.market}</p>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="font-black text-base text-slate-100 tabular-nums">
                      {formatMoney(holding.currentValueSAR)}
                    </div>
                    <div className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                      isPriceUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPriceUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{isPriceUp ? `+${holding.asset.change24h}%` : `${holding.asset.change24h}%`}</span>
                    </div>
                  </div>
                </div>

                {/* Description & Weight Bar */}
                <p className="text-xs text-slate-300 line-clamp-2 mt-3 leading-relaxed">
                  {holding.asset.descriptionAr}
                </p>

                {/* Weight Comparison Progress */}
                <div className="mt-3.5 pt-3 border-t border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>الوزن في المحفظة: <b className="text-slate-200">{holding.currentWeight}%</b></span>
                    <span>المستهدف: <b className="text-emerald-400">{holding.targetWeight}%</b></span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(holding.currentWeight * 2.5, 100)}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Card Bottom: Stats & Sharia Audit Trigger */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400">
                  <span>الكمية: </span>
                  <span className="font-semibold text-slate-200">{holding.shares.toLocaleString()} وحدة</span>
                </div>

                <button
                  onClick={() => setSelectedAssetForAudit(holding.asset)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition-all hover:scale-105"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تقرير الفحص الشرعي</span>
                  <ChevronLeft className="w-3 h-3 text-emerald-400" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
