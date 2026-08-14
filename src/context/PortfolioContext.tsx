import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Currency,
  Holding,
  Asset,
  RiskProfileType,
  AIDecisionLog,
  PurificationRecord,
  FinancialGoal,
  ZakatReport,
  AssetCategory
} from '../types';
import {
  SHARIA_ASSETS,
  INITIAL_HOLDINGS,
  RISK_PROFILES,
  INITIAL_AI_LOGS,
  INITIAL_PURIFICATION_RECORDS,
  INITIAL_GOALS,
} from '../data/mockData';

const SAR_TO_USD_RATE = 0.266667; // 1 SAR = 0.2667 USD (approx 3.75 SAR = 1 USD)

interface PortfolioContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatMoney: (amountSAR: number, withSymbol?: boolean) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // AI Autopilot & Risk
  isAutopilotEnabled: boolean;
  toggleAutopilot: () => void;
  selectedRiskProfile: RiskProfileType;
  setRiskProfile: (profile: RiskProfileType) => void;
  submitRiskAssessment: (totalScore: number) => RiskProfileType;
  executeRebalance: (customRationale?: string) => void;
  isRebalancing: boolean;

  // Portfolio State & Assets
  holdings: Holding[];
  assets: Asset[];
  cashBalanceSAR: number;
  totalPortfolioValueSAR: number;
  totalInvestedSAR: number;
  totalUnrealizedProfitSAR: number;
  totalProfitPercentage: number;
  dailyReturnSAR: number;
  dailyReturnPercentage: number;
  shariaHealthScore: number;
  
  // Actions
  depositCash: (amountSAR: number, note?: string) => void;
  withdrawCash: (amountSAR: number) => boolean;
  
  // Sharia & Zakat
  zakatReport: ZakatReport;
  payZakat: (amountSAR: number) => void;
  purificationRecords: PurificationRecord[];
  purifyDividend: (recordId: string, charityName?: string) => void;
  purifyAllPending: (charityName?: string) => void;
  
  // AI Decision Logs
  aiLogs: AIDecisionLog[];
  addAILog: (log: Omit<AIDecisionLog, 'id' | 'timestamp'>) => void;

  // Goals
  goals: FinancialGoal[];
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateGoalContribution: (id: string, newMonthlySAR: number) => void;

  // Active Audit Modal State
  selectedAssetForAudit: Asset | null;
  setSelectedAssetForAudit: (asset: Asset | null) => void;

  // Recent Action Notification
  lastToast: { title: string; message: string; type: 'success' | 'info' | 'warning' } | null;
  clearToast: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAutopilotEnabled, setIsAutopilotEnabled] = useState<boolean>(true);
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<RiskProfileType>('balanced');
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  
  const [assets, setAssets] = useState<Asset[]>(SHARIA_ASSETS);
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [cashBalanceSAR, setCashBalanceSAR] = useState<number>(14250.0);
  const [aiLogs, setAiLogs] = useState<AIDecisionLog[]>(INITIAL_AI_LOGS);
  const [purificationRecords, setPurificationRecords] = useState<PurificationRecord[]>(INITIAL_PURIFICATION_RECORDS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [selectedAssetForAudit, setSelectedAssetForAudit] = useState<Asset | null>(null);
  const [lastToast, setLastToast] = useState<{ title: string; message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Sync dark mode class on html tag
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleCurrency = () => setCurrency(prev => (prev === 'SAR' ? 'USD' : 'SAR'));
  const toggleAutopilot = () => {
    setIsAutopilotEnabled(prev => {
      const next = !prev;
      addAILog({
        type: 'risk_mitigation',
        titleAr: next ? 'تفعيل وضع الطيار الآلي الكامل (Full Autopilot)' : 'التحول إلى وضع المراقبة والموافقة اليدوية',
        reasonAr: next 
          ? 'المستشار الذكي الآن يتولى تنفيذ عمليات إعادة التوازن والفحص الدوري تلقائياً.'
          : 'سيتطلب كل قرار استثماري أو إعادة توازن تأكيداً يدوياً مسبقاً من قبلك.',
        actionAr: next ? 'تم تمكين المحرك الذاتي وإدارة السيولة الآلية' : 'تم تجميد الصلاحيات التلقائية وتفعيل التنبيهات المسبقة',
        impactAr: next ? 'استجابة فورية لتحركات الأسواق وتصحيح الأوزان' : 'تحكم يدوي كامل في كل معاملة',
        isAutonomous: false,
        status: 'executed'
      });
      return next;
    });
  };

  const clearToast = () => setLastToast(null);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setLastToast({ title, message, type });
    setTimeout(() => {
      setLastToast(null);
    }, 4500);
  };

  // Format currency
  const formatMoney = (amountSAR: number, withSymbol: boolean = true): string => {
    const isUSD = currency === 'USD';
    const convertedAmount = isUSD ? amountSAR * SAR_TO_USD_RATE : amountSAR;
    const formatted = new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);

    if (!withSymbol) return formatted;
    return isUSD ? `$ ${formatted}` : `${formatted} ر.س`;
  };

  // Calculated Portfolio Values
  const totalHoldingsValueSAR = useMemo(() => {
    return holdings.reduce((sum, h) => sum + h.currentValueSAR, 0);
  }, [holdings]);

  const totalPortfolioValueSAR = totalHoldingsValueSAR + cashBalanceSAR;

  const totalInvestedSAR = useMemo(() => {
    return holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPriceSAR), 0);
  }, [holdings]);

  const totalUnrealizedProfitSAR = totalHoldingsValueSAR - totalInvestedSAR;
  const totalProfitPercentage = totalInvestedSAR > 0 ? (totalUnrealizedProfitSAR / totalInvestedSAR) * 100 : 0;

  // Daily return calculated from assets weighted change
  const dailyReturnSAR = useMemo(() => {
    return holdings.reduce((sum, h) => {
      const assetChangePercent = h.asset.change24h / 100;
      return sum + (h.currentValueSAR * (assetChangePercent / (1 + assetChangePercent)));
    }, 0);
  }, [holdings]);

  const dailyReturnPercentage = totalPortfolioValueSAR > 0 ? (dailyReturnSAR / totalPortfolioValueSAR) * 100 : 0;

  // Sharia overall health score
  const shariaHealthScore = useMemo(() => {
    if (holdings.length === 0) return 100;
    const totalScore = holdings.reduce((acc, h) => acc + (h.asset.shariaAudit.complianceScore * (h.currentWeight / 100)), 0);
    return Math.round(totalScore);
  }, [holdings]);

  // Recalculate weights whenever holdings change
  useEffect(() => {
    if (totalHoldingsValueSAR > 0) {
      setHoldings(prev => prev.map(h => ({
        ...h,
        currentWeight: Number(((h.currentValueSAR / totalHoldingsValueSAR) * 100).toFixed(1))
      })));
    }
  }, [totalHoldingsValueSAR]);

  // Add AI Decision Log helper
  const addAILog = (log: Omit<AIDecisionLog, 'id' | 'timestamp'>) => {
    const newLog: AIDecisionLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: 'الآن',
    };
    setAiLogs(prev => [newLog, ...prev]);
  };

  // Submit Risk Assessment
  const submitRiskAssessment = (totalScore: number): RiskProfileType => {
    let profile: RiskProfileType = 'balanced';
    if (totalScore <= 8) {
      profile = 'conservative';
    } else if (totalScore <= 15) {
      profile = 'balanced';
    } else {
      profile = 'growth';
    }
    setSelectedRiskProfile(profile);
    const profileData = RISK_PROFILES.find(p => p.id === profile);
    
    showToast(
      'تم تحديث الملف الاستثماري بنجاح',
      `تم تحديد استراتيجيتك كـ "${profileData?.titleAr}" بناءً على إجاباتك وتحمل المخاطر الشرعي.`
    );

    addAILog({
      type: 'risk_mitigation',
      titleAr: `تحديث درجة المخاطر الشرعية إلى: ${profileData?.titleAr}`,
      reasonAr: `إكمال استبيان تقييم الملاءمة المالية وحساب درجة المخاطر الكلية (${totalScore}/20).`,
      actionAr: `ضبط نسب التخصيص المستهدفة للمحفظة وفق النموذج الاستثماري المعتمد.`,
      impactAr: `تحسين العائد المتوقع إلى ${profileData?.expectedAnnualReturn} وضبط مستويات التحوط.`,
      isAutonomous: false,
      status: 'executed'
    });

    return profile;
  };

  // Rebalance Execution
  const executeRebalance = (customRationale?: string) => {
    setIsRebalancing(true);
    const currentProfile = RISK_PROFILES.find(p => p.id === selectedRiskProfile) || RISK_PROFILES[1];
    
    setTimeout(() => {
      // Re-align holdings target weights to profile
      const categoryWeights = currentProfile.targetAllocation;
      
      setHoldings(prev => {
        return prev.map(h => {
          const cat = h.asset.category;
          let target = 15;
          if (cat === 'halal_equities') target = categoryWeights.halal_equities / 2;
          if (cat === 'sukuk') target = categoryWeights.sukuk / 2;
          if (cat === 'halal_etfs') target = categoryWeights.halal_etfs;
          if (cat === 'physical_gold') target = categoryWeights.physical_gold;
          
          return {
            ...h,
            targetWeight: Math.round(target),
            currentWeight: Math.round(target),
          };
        });
      });

      setIsRebalancing(false);
      showToast('تمت إعادة التوازن بنجاح', 'تمت موازنة أصول المحفظة بالكامل وفق نسب الشريعة المستهدفة.');

      addAILog({
        type: 'rebalance',
        titleAr: 'إعادة توازن شاملة للمحفظة الشرعية',
        reasonAr: customRationale || `إعادة مواءمة الأوزان الحقيقية مع أوزان استراتيجية "${currentProfile.titleAr}".`,
        actionAr: 'تم تنفيذ صفقات بيع وشراء آلية بدون أي فوائد ربوية أو رسوم خفية لإعادة ضبط النسب.',
        impactAr: 'خفض تشتت المحفظة وتحقيق التوافق الدقيق بنسبة 100% مع الأهداف الاستثمارية.',
        isAutonomous: isAutopilotEnabled,
        status: 'executed'
      });
    }, 1200);
  };

  // Deposit Cash
  const depositCash = (amountSAR: number, note: string = 'إيداع نقدي فوري') => {
    if (amountSAR <= 0) return;
    setCashBalanceSAR(prev => prev + amountSAR);
    showToast('تم الإيداع بنجاح', `تم إضافة مبلغ ${formatMoney(amountSAR)} إلى رصيدك النقدي.`);

    addAILog({
      type: 'deposit_allocation',
      titleAr: `معالجة إيداع نقدي بمبلغ ${amountSAR.toLocaleString()} ر.س`,
      reasonAr: `${note} في المحفظة الاستثمارية.`,
      actionAr: isAutopilotEnabled 
        ? 'قام المستشار الذكي بجدولة توزيع المبلغ آلياً على الأصول النقية والصكوك بنسب متزنة.'
        : 'تم إضافة المبلغ في حساب السيولة النقدية بانتظار أوامر الاستثمار.',
      impactAr: 'زيادة القيمة الإجمالية للثروة وتعزيز التدفقات المستقبلية.',
      isAutonomous: isAutopilotEnabled,
      status: 'executed'
    });
  };

  // Withdraw Cash
  const withdrawCash = (amountSAR: number): boolean => {
    if (amountSAR <= 0 || amountSAR > cashBalanceSAR) {
      showToast('تعذر إتمام السحب', 'الرصيد النقدي الحر المتاح غير كافٍ.', 'warning');
      return false;
    }
    setCashBalanceSAR(prev => prev - amountSAR);
    showToast('تم طلب السحب بنجاح', `تم تحويل مبلغ ${formatMoney(amountSAR)} لحسابك البنكي المعتمد.`);
    return true;
  };

  // Zakat Calculation
  const zakatReport: ZakatReport = useMemo(() => {
    // According to AAOIFI Standard No. 35:
    // Equities: Zakatable portion is liquid/working assets (approx 30% for operating companies, 100% for cash/debt receivables)
    // Sukuk: 100% of nominal value + accrued profit
    // Gold: 100% of physical value
    // Cash: 100%
    const nisabThresholdSAR = 24850; // Approx 85g gold price in SAR
    
    let equitiesVal = 0;
    let sukukVal = 0;
    let etfVal = 0;
    let goldVal = 0;

    holdings.forEach(h => {
      if (h.asset.category === 'halal_equities') equitiesVal += h.currentValueSAR;
      if (h.asset.category === 'sukuk') sukukVal += h.currentValueSAR;
      if (h.asset.category === 'halal_etfs') etfVal += h.currentValueSAR;
      if (h.asset.category === 'physical_gold') goldVal += h.currentValueSAR;
    });

    const zakatableEquities = equitiesVal * 0.35; // 35% net working capital estimate
    const zakatableSukuk = sukukVal; // 100%
    const zakatableEtf = etfVal * 0.40; // 40%
    const zakatableGold = goldVal; // 100%
    const zakatableCash = cashBalanceSAR; // 100%

    const totalZakatableSAR = zakatableEquities + zakatableSukuk + zakatableEtf + zakatableGold + zakatableCash;
    const zakatRate = 0.025; // 2.5% Hijri Hawl
    const zakatDueAmountSAR = totalZakatableSAR >= nisabThresholdSAR ? totalZakatableSAR * zakatRate : 0;

    const breakdown: ZakatReport['breakdownByCategory'] = [
      {
        category: 'halal_equities',
        categoryNameAr: 'الأسهم النقية (رأس المال العامل)',
        totalValueSAR: equitiesVal,
        zakatablePercentage: 35,
        zakatableValueSAR: zakatableEquities,
        zakatDueSAR: zakatableEquities * zakatRate,
      },
      {
        category: 'sukuk',
        categoryNameAr: 'الصكوك الإسلامية وعوائدها',
        totalValueSAR: sukukVal,
        zakatablePercentage: 100,
        zakatableValueSAR: zakatableSukuk,
        zakatDueSAR: zakatableSukuk * zakatRate,
      },
      {
        category: 'halal_etfs',
        categoryNameAr: 'صناديق المؤشرات المتوافقة',
        totalValueSAR: etfVal,
        zakatablePercentage: 40,
        zakatableValueSAR: zakatableEtf,
        zakatDueSAR: zakatableEtf * zakatRate,
      },
      {
        category: 'physical_gold',
        categoryNameAr: 'سبائك الذهب المادي المخصص',
        totalValueSAR: goldVal,
        zakatablePercentage: 100,
        zakatableValueSAR: zakatableGold,
        zakatDueSAR: zakatableGold * zakatRate,
      },
    ];

    return {
      totalPortfolioValueSAR,
      zakatableAssetsValueSAR: totalZakatableSAR,
      exemptAssetsValueSAR: totalPortfolioValueSAR - totalZakatableSAR,
      zakatDueRate: zakatRate,
      zakatDueAmountSAR,
      hawlDateHijri: '15 شعبان 1448 هـ',
      hawlDateGregorian: '14 فبراير 2027 م',
      daysRemainingInHawl: 184,
      nisabThresholdSAR,
      isNisabReached: totalZakatableSAR >= nisabThresholdSAR,
      breakdownByCategory: breakdown,
      paidThisYearSAR: 6250.0,
      lastPaymentDate: '2026-02-15',
    };
  }, [holdings, cashBalanceSAR, totalPortfolioValueSAR]);

  // Pay Zakat Action
  const payZakat = (amountSAR: number) => {
    showToast('تقبل الله طاعتكم', `تم توثيق ودفع الزكاة بمبلغ ${formatMoney(amountSAR)} بنجاح.`);

    addAILog({
      type: 'purification',
      titleAr: `توثيق إخراج زكاة المال بمبلغ ${amountSAR.toLocaleString()} ر.س`,
      reasonAr: 'استحقاق الزكاة الشرعية السنوية وموافقة حول المال.',
      actionAr: 'تم توجيه مبلغ الزكاة إلى القنوات الخيرية المعتمدة (منصة إحسان / صندوق الزكاة).',
      impactAr: 'طهارة وبركة رأس المال وامتثال كامل للركن الثالث من أركان الإسلام.',
      isAutonomous: false,
      status: 'executed'
    });
  };

  // Dividend Purification Action
  const purifyDividend = (recordId: string, charityName: string = 'المنصة الوطنية للعمل الخيري (إحسان)') => {
    setPurificationRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          status: 'purified',
          purifiedAt: new Date().toISOString().split('T')[0],
          charityRecipientAr: charityName,
          certificateId: `PUR-2026-EHSAN-${Math.floor(1000 + Math.random() * 9000)}`
        };
      }
      return rec;
    }));

    showToast('تم تطهير الأرباح بنجاح', `تم التبرع بالمبلغ غير النقي إلى ${charityName}.`);
  };

  const purifyAllPending = (charityName: string = 'المنصة الوطنية للعمل الخيري (إحسان)') => {
    setPurificationRecords(prev => prev.map(rec => ({
      ...rec,
      status: 'purified',
      purifiedAt: new Date().toISOString().split('T')[0],
      charityRecipientAr: charityName,
      certificateId: `PUR-2026-EHSAN-${Math.floor(1000 + Math.random() * 9000)}`
    })));

    showToast('تم تطهير كافة الأرباح المعلقة', `تم إخراج كامل المبالغ المستحقة للتطهير إلى ${charityName}.`);

    addAILog({
      type: 'purification',
      titleAr: 'تطهير وإخراج شامل للإيرادات العرضية غير النقية',
      reasonAr: 'تنقية عوائد التوزيعات النقدية السنوية من فوائد الإيداعات البنكية العرضية للشركات.',
      actionAr: `تم التبرع بكامل المبالغ المستحقة لصالح ${charityName} واستخراج شهادات التطهير.`,
      impactAr: 'تصفية المحفظة بنسبة نقاء 100% وإصدار السجل الشرعي الموثق.',
      isAutonomous: isAutopilotEnabled,
      status: 'executed'
    });
  };

  // Goals
  const addGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    setGoals(prev => [...prev, newGoal]);
    showToast('تمت إضافة الهدف بنجاح', `تم إنشاء خطة ادخار ذكية لهدف: ${goal.titleAr}`);
  };

  const updateGoalContribution = (id: string, newMonthlySAR: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, monthlyContributionSAR: newMonthlySAR } : g));
  };

  // Live Market Tick Simulation (every 10s)
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => {
        return prevAssets.map(asset => {
          // Micro price movement between -0.3% and +0.35%
          const deltaPercent = (Math.random() * 0.7 - 0.3) / 100;
          const newPriceSAR = Number((asset.priceSAR * (1 + deltaPercent)).toFixed(2));
          const newPriceUSD = Number((newPriceSAR * SAR_TO_USD_RATE).toFixed(2));
          const newSparkline = [...asset.sparkline.slice(1), newPriceSAR];
          const newChange24h = Number((asset.change24h + deltaPercent * 10).toFixed(2));

          return {
            ...asset,
            priceSAR: newPriceSAR,
            priceUSD: newPriceUSD,
            sparkline: newSparkline,
            change24h: newChange24h,
          };
        });
      });

      // Update holdings valuation with new prices
      setHoldings(prevHoldings => {
        return prevHoldings.map(h => {
          const deltaPercent = (Math.random() * 0.4 - 0.18) / 100;
          const newCurrentVal = Number((h.currentValueSAR * (1 + deltaPercent)).toFixed(2));
          const invested = h.shares * h.avgBuyPriceSAR;
          const profit = newCurrentVal - invested;
          const profitPct = invested > 0 ? (profit / invested) * 100 : 0;

          return {
            ...h,
            currentValueSAR: newCurrentVal,
            unrealizedProfitSAR: Number(profit.toFixed(2)),
            unrealizedProfitPercentage: Number(profitPct.toFixed(2)),
          };
        });
      });

    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        currency,
        toggleCurrency,
        formatMoney,
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        isAutopilotEnabled,
        toggleAutopilot,
        selectedRiskProfile,
        setRiskProfile: setSelectedRiskProfile,
        submitRiskAssessment,
        executeRebalance,
        isRebalancing,
        holdings,
        assets,
        cashBalanceSAR,
        totalPortfolioValueSAR,
        totalInvestedSAR,
        totalUnrealizedProfitSAR,
        totalProfitPercentage,
        dailyReturnSAR,
        dailyReturnPercentage,
        shariaHealthScore,
        depositCash,
        withdrawCash,
        zakatReport,
        payZakat,
        purificationRecords,
        purifyDividend,
        purifyAllPending,
        aiLogs,
        addAILog,
        goals,
        addGoal,
        updateGoalContribution,
        selectedAssetForAudit,
        setSelectedAssetForAudit,
        lastToast,
        clearToast,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
