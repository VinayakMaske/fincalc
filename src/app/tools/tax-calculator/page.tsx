"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Users,
  User,
  Home,
  Receipt,
  TrendingDown,
  TrendingUp,
  PieChart,
  BarChart3,
  Info,
  Shield,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Wallet,
  Landmark,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────
type FilingStatus = "single" | "married_joint" | "married_separate" | "head_household";
type TaxYear = "2025" | "2026";

interface TaxBracket {
  rate: number;
  min: number;
  max: number;
}

interface BracketRow {
  bracket: string;
  taxableAmount: number;
  rate: number;
  tax: number;
  cumulative: number;
}

// ─── 2025 Tax Brackets (IRS Rev. Proc. 2024-40) ──────────────────────
const BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity },
  ],
  married_joint: [
    { rate: 0.10, min: 0, max: 23850 },
    { rate: 0.12, min: 23850, max: 96950 },
    { rate: 0.22, min: 96950, max: 206700 },
    { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 },
    { rate: 0.35, min: 501050, max: 751600 },
    { rate: 0.37, min: 751600, max: Infinity },
  ],
  married_separate: [
    { rate: 0.10, min: 0, max: 11925 },
    { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 },
    { rate: 0.35, min: 250525, max: 375800 },
    { rate: 0.37, min: 375800, max: Infinity },
  ],
  head_household: [
    { rate: 0.10, min: 0, max: 17000 },
    { rate: 0.12, min: 17000, max: 64850 },
    { rate: 0.22, min: 64850, max: 103350 },
    { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250500 },
    { rate: 0.35, min: 250500, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity },
  ],
};

// ─── 2026 Tax Brackets (IRS Rev. Proc. 2025-32) ──────────────────────
const BRACKETS_2026: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 12400 },
    { rate: 0.12, min: 12400, max: 50400 },
    { rate: 0.22, min: 50400, max: 105700 },
    { rate: 0.24, min: 105700, max: 201775 },
    { rate: 0.32, min: 201775, max: 256225 },
    { rate: 0.35, min: 256225, max: 640600 },
    { rate: 0.37, min: 640600, max: Infinity },
  ],
  married_joint: [
    { rate: 0.10, min: 0, max: 24800 },
    { rate: 0.12, min: 24800, max: 100800 },
    { rate: 0.22, min: 100800, max: 211400 },
    { rate: 0.24, min: 211400, max: 403550 },
    { rate: 0.32, min: 403550, max: 512450 },
    { rate: 0.35, min: 512450, max: 768600 },
    { rate: 0.37, min: 768600, max: Infinity },
  ],
  married_separate: [
    { rate: 0.10, min: 0, max: 12400 },
    { rate: 0.12, min: 12400, max: 50400 },
    { rate: 0.22, min: 50400, max: 105700 },
    { rate: 0.24, min: 105700, max: 201775 },
    { rate: 0.32, min: 201775, max: 256225 },
    { rate: 0.35, min: 256225, max: 384300 },
    { rate: 0.37, min: 384300, max: Infinity },
  ],
  head_household: [
    { rate: 0.10, min: 0, max: 18650 },
    { rate: 0.12, min: 18650, max: 67100 },
    { rate: 0.22, min: 67100, max: 105700 },
    { rate: 0.24, min: 105700, max: 201775 },
    { rate: 0.32, min: 201775, max: 256225 },
    { rate: 0.35, min: 256225, max: 640600 },
    { rate: 0.37, min: 640600, max: Infinity },
  ],
};

const STANDARD_DEDUCTION: Record<TaxYear, Record<FilingStatus, number>> = {
  "2025": {
    single: 15750,
    married_joint: 31500,
    married_separate: 15750,
    head_household: 23625,
  },
  "2026": {
    single: 16100,
    married_joint: 32200,
    married_separate: 16100,
    head_household: 24150,
  },
};

const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  married_joint: "Married Filing Jointly",
  married_separate: "Married Filing Separately",
  head_household: "Head of Household",
};

// ─── Helpers ─────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function calculateFederalTax(
  grossIncome: number,
  preTaxDeductions: number,
  filingStatus: FilingStatus,
  taxYear: TaxYear,
  dependents: number
): {
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  bracketBreakdown: BracketRow[];
  standardDeduction: number;
  childTaxCredit: number;
  taxAfterCredits: number;
} {
  const brackets = taxYear === "2025" ? BRACKETS_2025[filingStatus] : BRACKETS_2026[filingStatus];
  const standardDeduction = STANDARD_DEDUCTION[taxYear][filingStatus];
  const adjustedGrossIncome = Math.max(0, grossIncome - preTaxDeductions);
  const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);

  let totalTax = 0;
  let marginalRate = 0;
  const bracketBreakdown: BracketRow[] = [];
  let cumulative = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const amountInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    const taxForBracket = amountInBracket * bracket.rate;
    totalTax += taxForBracket;
    cumulative += taxForBracket;
    marginalRate = bracket.rate;

    bracketBreakdown.push({
      bracket: `${(bracket.rate * 100).toFixed(0)}%`,
      taxableAmount: amountInBracket,
      rate: bracket.rate,
      tax: taxForBracket,
      cumulative,
    });
  }

  // Child Tax Credit: $2,200 per child (2025+ under OBBBA), refundable portion $1,700
  // Phase-out starts at $200k single / $400k married joint
  const ctcPerChild = taxYear === "2025" ? 2200 : 2200; // same for both years under OBBBA
  let childTaxCredit = Math.min(dependents * ctcPerChild, totalTax);

  // Simple phase-out: reduce by $50 per $1,000 over threshold
  const phaseOutThreshold = filingStatus === "married_joint" ? 400000 : 200000;
  if (adjustedGrossIncome > phaseOutThreshold) {
    const excess = adjustedGrossIncome - phaseOutThreshold;
    const phaseOutAmount = Math.floor(excess / 1000) * 50 * dependents;
    childTaxCredit = Math.max(0, childTaxCredit - phaseOutAmount);
  }

  const taxAfterCredits = Math.max(0, totalTax - childTaxCredit);
  const effectiveRate = grossIncome > 0 ? (taxAfterCredits / grossIncome) * 100 : 0;

  return {
    taxableIncome,
    totalTax,
    effectiveRate,
    marginalRate,
    bracketBreakdown,
    standardDeduction,
    childTaxCredit,
    taxAfterCredits,
  };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function FederalTaxCalculatorPage() {
  const [grossIncome, setGrossIncome] = useState<string>("75000");
  const [preTaxDeductions, setPreTaxDeductions] = useState<string>("0");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [taxYear, setTaxYear] = useState<TaxYear>("2025");
  const [dependents, setDependents] = useState<string>("0");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const gi = Number(grossIncome) || 0;
  const ptd = Number(preTaxDeductions) || 0;
  const dep = Number(dependents) || 0;

  const result = useMemo(
    () => calculateFederalTax(gi, ptd, filingStatus, taxYear, dep),
    [gi, ptd, filingStatus, taxYear, dep]
  );

  // Chart data
  const bracketChartData = useMemo(() => {
    return result.bracketBreakdown.map((row) => ({
      bracket: row.bracket,
      tax: row.tax,
      amount: row.taxableAmount,
    }));
  }, [result.bracketBreakdown]);

  const donutData = useMemo(() => {
    const data = [];
    if (result.taxAfterCredits > 0) {
      data.push({ name: "Federal Tax", value: result.taxAfterCredits });
    }
    const takeHome = gi - result.taxAfterCredits - ptd;
    if (takeHome > 0) {
      data.push({ name: "Take Home", value: takeHome });
    }
    if (ptd > 0) {
      data.push({ name: "Pre-Tax Deductions", value: ptd });
    }
    return data;
  }, [result.taxAfterCredits, gi, ptd]);

  const DONUT_COLORS = ["#ef4444", "#10b981", "#3b82f6"]; // red, emerald, blue

  // Smart insight
  const smartInsight = useMemo(() => {
    if (gi === 0) return "Enter your income to see your federal tax estimate.";
    if (result.effectiveRate < 10) {
      return `Your effective tax rate is ${result.effectiveRate.toFixed(1)}% — you are keeping most of what you earn.`;
    }
    if (result.effectiveRate < 20) {
      return `At an effective rate of ${result.effectiveRate.toFixed(1)}%, roughly $${(result.taxAfterCredits / 12).toFixed(0)} goes to federal taxes each month.`;
    }
    return `With a ${(result.marginalRate * 100).toFixed(0)}% marginal rate, every extra dollar you earn above ${formatCurrency(result.taxableIncome)} is taxed at that rate. Consider tax-advantaged accounts.`;
  }, [gi, result.effectiveRate, result.taxAfterCredits, result.marginalRate, result.taxableIncome]);

  // Custom tooltip
  interface TooltipItem {
    dataKey: string;
    color: string;
    value: number;
    name: string;
  }
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipItem[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-slate-900 mb-2">{label} Bracket</p>
          {payload.map((entry: TooltipItem) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600">{entry.name === "tax" ? "Tax Owed" : "Taxable Amount"}:</span>
              <span className="font-medium text-slate-900">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const takeHomePay = gi - result.taxAfterCredits - ptd;
  const monthlyTakeHome = takeHomePay / 12;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Bill<span className="text-emerald-600">Swift</span>
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200">
              <Landmark className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                Free Calculator
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Federal Income Tax Calculator
              </h1>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl">
            Estimate your federal income tax for {taxYear} based on IRS brackets and rates. 
            Includes standard deduction, marginal rate analysis, and take-home pay breakdown.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tax Year */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                Tax Year
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(["2025", "2026"] as TaxYear[]).map((year) => (
                  <button
                    key={year}
                    onClick={() => setTaxYear(year)}
                    className={`rounded-xl border px-4 py-4 font-medium transition-all ${
                      taxYear === year
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50/30"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Income */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-red-600" />
                Income & Deductions
              </h2>
              <div className="space-y-5">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Gross Annual Income
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={grossIncome}
                      onChange={(e) => setGrossIncome(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="75000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Pre-Tax Deductions (401k, HSA, etc.)
                  </label>
                  <div className="relative">
                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={preTaxDeductions}
                      onChange={(e) => setPreTaxDeductions(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    401k, HSA, FSA, and other pre-tax contributions
                  </p>
                </div>
              </div>
            </div>

            {/* Filing Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Filing Status
              </h2>
              <div className="space-y-2">
                {([
                  { value: "single" as FilingStatus, label: "Single", icon: User },
                  { value: "married_joint" as FilingStatus, label: "Married Filing Jointly", icon: Users },
                  { value: "married_separate" as FilingStatus, label: "Married Filing Separately", icon: User },
                  { value: "head_household" as FilingStatus, label: "Head of Household", icon: Home },
                ]).map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setFilingStatus(status.value)}
                    className={`w-full flex items-center gap-3 rounded-xl border px-4 py-4 text-left mb-3 font-medium transition-all ${
                      filingStatus === status.value
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50/30"
                    }`}
                  >
                    <status.icon className="h-4 w-4 shrink-0" />
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dependents */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-red-600" />
                Tax Credits
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Qualifying Children (under 17)
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 mb-1 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={dependents}
                    onChange={(e) => setDependents(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ${taxYear === "2025" ? "2,200" : "2,200"} Child Tax Credit per child
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              {[
                { icon: Shield, text: "100% Private — No data stored" },
                { icon: Clock, text: "Instant results as you type" },
                { icon: CheckCircle2, text: "IRS 2025 & 2026 tax brackets" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <item.icon className="h-4 w-4 text-red-500 shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result Card */}
            <div className="rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-orange-50 p-8 mb-5">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2">
                    Estimated Federal Tax ({taxYear})
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-red-800 mb-2">
                    {formatCurrency(result.taxAfterCredits)}
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    Effective rate: {result.effectiveRate.toFixed(1)}% · Marginal rate: {(result.marginalRate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="rounded-xl bg-white/80 border border-red-200 p-4">
                    <p className="text-xs text-slate-500">Taxable Income</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.taxableIncome)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 border border-red-200 p-4">
                    <p className="text-xs text-slate-500">Standard Deduction</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.standardDeduction)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Take Home Pay */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Take-Home Pay Breakdown
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <p className="text-sm text-emerald-600 mb-1">Annual Take-Home</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {formatCurrency(takeHomePay)}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                  <p className="text-sm text-blue-600 mb-1">Monthly Take-Home</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {formatCurrency(monthlyTakeHome)}
                  </p>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-sm text-red-600 mb-1">Federal Tax</p>
                  <p className="text-3xl font-bold text-red-700">
                    {formatCurrency(result.taxAfterCredits)}
                  </p>
                </div>
              </div>
            </div>

            {/* Donut + Bar Chart */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Donut Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-red-600" />
                  Income Distribution
                </h3>
                <div className="w-full h-55">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any) => [formatCurrency(Number(value)), String(name)]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value: any) => (
                          <span className="text-xs text-slate-600">{String(value)}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bracket Bar Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-red-600" />
                  Tax by Bracket
                </h3>
                <div className="w-full h-55">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bracketChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="bracket" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="tax" fill="#ef4444" radius={[4, 4, 0, 0]} name="tax" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-orange-50 p-6 shadow-sm mb-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-red-200 shrink-0">
                  <Info className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-red-800 mb-1">Smart Insight</h3>
                  <p className="text-sm text-red-700 leading-relaxed">{smartInsight}</p>
                </div>
              </div>
            </div>

            {/* Bracket Breakdown Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-5">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 border border-red-200">
                    <Receipt className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Bracket-by-Bracket Breakdown
                    </h3>
                    <p className="text-sm text-slate-500">
                      See how each portion of your income is taxed
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    showBreakdown ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showBreakdown && (
                <div className="border-t border-slate-200">
                  <div className="max-h-100 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Tax Rate
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Taxable Amount
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Tax Owed
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Cumulative
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.bracketBreakdown.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {row.bracket}
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-700">
                              {formatCurrency(row.taxableAmount)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-red-600 font-medium">
                              {formatCurrency(row.tax)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                              {formatCurrency(row.cumulative)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Tax Brackets Reference */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-red-600" />
                {taxYear} Tax Brackets — {FILING_STATUS_LABELS[filingStatus]}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Income Range
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(taxYear === "2025" ? BRACKETS_2025[filingStatus] : BRACKETS_2026[filingStatus]).map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 font-medium text-slate-900">
                          {(b.rate * 100).toFixed(0)}%
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-700">
                          {formatCurrency(b.min)} — {b.max === Infinity ? "∞" : formatCurrency(b.max)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Try More Free Calculators
            </h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              Explore our full suite of financial tools — all free, private, and built for the USA.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-10 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Browse All Tools
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}