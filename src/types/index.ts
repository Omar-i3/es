export type AssetCategory = 'halal_equities' | 'sukuk' | 'halal_etfs' | 'physical_gold';

export type Currency = 'SAR' | 'USD';

export interface ShariaAudit {
  isCompliant: boolean;
  complianceScore: number; // 0 - 100
  debtToMarketCapRatio: number; // Max 33% per AAOIFI
  cashInterestRatio: number; // Max 33% per AAOIFI
  impureRevenueRatio: number; // Max 5% per AAOIFI
  lastAuditDate: string;
  auditor: string;
  purificationPercentage: number;
  rulingReference: string;
  coreBusinessCompliant: boolean;
}

export interface Asset {
  id: string;
  symbol: string;
  nameAr: string;
  nameEn: string;
  category: AssetCategory;
  priceSAR: number;
  priceUSD: number;
  change24h: number;
  sparkline: number[];
  market: string;
  shariaAudit: ShariaAudit;
  descriptionAr: string;
}

export interface Holding {
  assetId: string;
  asset: Asset;
  shares: number;
  avgBuyPriceSAR: number;
  currentValueSAR: number;
  targetWeight: number; // percentage (e.g. 25)
  currentWeight: number; // percentage (e.g. 26.4)
  unrealizedProfitSAR: number;
  unrealizedProfitPercentage: number;
  accruedPurificationDueSAR: number;
}

export type RiskProfileType = 'conservative' | 'balanced' | 'growth' | 'custom';

export interface RiskProfile {
  id: RiskProfileType;
  titleAr: string;
  subtitleAr: string;
  descriptionAr: string;
  targetAllocation: Record<AssetCategory, number>; // Must sum to 100%
  expectedAnnualReturn: string;
  volatilityLevel: 'منخفضة' | 'متوازنة' | 'عالية ومدروسة';
  shariaHighlight: string;
  icon: string;
}

export type DecisionType = 'rebalance' | 'purification' | 'screening_alert' | 'smart_harvest' | 'deposit_allocation' | 'risk_mitigation';

export interface AIDecisionLog {
  id: string;
  timestamp: string;
  type: DecisionType;
  titleAr: string;
  reasonAr: string;
  actionAr: string;
  impactAr: string;
  assetSymbol?: string;
  isAutonomous: boolean;
  status: 'executed' | 'pending_approval' | 'monitored';
}

export interface ZakatCategoryBreakdown {
  category: AssetCategory;
  categoryNameAr: string;
  totalValueSAR: number;
  zakatablePercentage: number;
  zakatableValueSAR: number;
  zakatDueSAR: number;
}

export interface ZakatReport {
  totalPortfolioValueSAR: number;
  zakatableAssetsValueSAR: number;
  exemptAssetsValueSAR: number;
  zakatDueRate: number; // 0.025 (2.5% Hijri or 2.577% Gregorian)
  zakatDueAmountSAR: number;
  hawlDateHijri: string;
  hawlDateGregorian: string;
  daysRemainingInHawl: number;
  nisabThresholdSAR: number;
  isNisabReached: boolean;
  breakdownByCategory: ZakatCategoryBreakdown[];
  paidThisYearSAR: number;
  lastPaymentDate?: string;
}

export interface PurificationRecord {
  id: string;
  assetId: string;
  symbol: string;
  companyNameAr: string;
  grossDividendSAR: number;
  impurePercentage: number;
  purificationAmountSAR: number;
  period: string;
  status: 'pending' | 'purified';
  purifiedAt?: string;
  charityRecipientAr?: string;
  certificateId?: string;
}

export interface FinancialGoal {
  id: string;
  titleAr: string;
  targetAmountSAR: number;
  currentAmountSAR: number;
  targetYears: number;
  monthlyContributionSAR: number;
  category: 'hajj' | 'home' | 'retirement' | 'education' | 'wealth';
  icon: string;
  projectedReturnRate: number;
}

export interface RiskQuestion {
  id: number;
  questionAr: string;
  options: {
    textAr: string;
    score: number;
  }[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'rebalance' | 'zakat_paid' | 'purification_paid';
  amountSAR: number;
  descriptionAr: string;
  status: 'completed' | 'processing';
  referenceNumber: string;
}
