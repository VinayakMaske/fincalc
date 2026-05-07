"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  PieChart,
  Percent,
  Calendar,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────
type InvestmentType = "business" | "stocks" | "real_estate" | "side_hustle" | "custom";

interface YearlyProjection {
  year: number;
  invested: number;
  returns: number;
  cumulativeReturn: number;
  roi: number;
  breakEven: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number): string {
  return `${n.toFixed(2)}%`;
}

function calculateROI(
  initialInvestment: number,
  annualReturn: number,
  years: number,
  additionalInvestment: number,
  annualExpenses: number
): {
  roi: number;
  totalInvested: number;
  totalReturned: number;
  netProfit: number;
  breakEvenYear: number | null;
  yearlyData: YearlyProjection[];
} {
  const yearlyData: YearlyProjection[] = [];
  let cumulativeInvested = initialInvestment;
  let cumulativeReturned = 0;
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= years; year++) {
    cumulativeInvested += additionalInvestment + annualExpenses;
    const yearReturn = (cumulativeInvested - additionalInvestment * (year - 1) - annualExpenses * year) * (annualReturn / 100);
    const actualReturn = Math.max(0, yearReturn - annualExpenses);
    cumulativeReturned += actualReturn;

    const netProfit = cumulativeReturned - cumulativeInvested;
    const roi = cumulativeInvested > 0 ? (netProfit / cumulativeInvested) * 100 : 0;

    if (breakEvenYear === null && netProfit >= 0) {
      breakEvenYear = year;
    }

    yearlyData.push({
      year,
      invested: cumulativeInvested,
      returns: cumulativeReturned,
      cumulativeReturn: netProfit,
      roi,
      breakEven: netProfit >= 0,
    });
  }

  const final = yearlyData[yearlyData.length - 1];
  return {
    roi: final?.roi || 0,
    totalInvested: final?.invested || 0,
    totalReturned: final?.returns || 0,
    netProfit: final?.cumulativeReturn || 0,
    breakEvenYear,
    yearlyData,
  };
}

const INVESTMENT_TYPES: { value: InvestmentType; label: string; defaultReturn: number; defaultYears: number }[] = [
  { value: "business", label: "Business", defaultReturn: 15, defaultYears: 5 },
  { value: "stocks", label: "Stocks", defaultReturn: 10, defaultYears: 10 },
  { value: "real_estate", label: "Real Estate", defaultReturn: 8, defaultYears: 10 },
  { value: "side_hustle", label: "Side Hustle", defaultReturn: 25, defaultYears: 3 },
  { value: "custom", label: "Custom", defaultReturn: 12, defaultYears: 5 },
];

// ─── Main Component ──────────────────────────────────────────────────
export default function ROICalculatorPage() {
  const [invType, setInvType] = useState<InvestmentType>("business");
  const [initialInvestment, setInitialInvestment] = useState<string>("10000");
  const [annualReturn, setAnnualReturn] = useState<string>("15");
  const [years, setYears] = useState<string>("5");
  const [additionalInvestment, setAdditionalInvestment] = useState<string>("0");
  const [annualExpenses, setAnnualExpenses] = useState<string>("0");
  const [showSchedule, setShowSchedule] = useState(false);

  const ii = Number(initialInvestment) || 0;
  const ar = Number(annualReturn) || 0;
  const y = Number(years) || 0;
  const ai = Number(additionalInvestment) || 0;
  const ae = Number(annualExpenses) || 0;

  const result = useMemo(
    () => calculateROI(ii, ar, y, ai, ae),
    [ii, ar, y, ai, ae]
  );

  // Chart data
  const chartData = useMemo(() => {
    return result.yearlyData.map((d) => ({
      year: `Yr ${d.year}`,
      invested: d.invested,
      returns: d.returns,
      profit: Math.max(0, d.cumulativeReturn),
    }));
  }, [result.yearlyData]);

  const donutData = useMemo(() => {
    const data = [];
    if (ii > 0) data.push({ name: "Initial", value: ii });
    if (ai * y > 0) data.push({ name: "Additional", value: ai * y });
    if (ae * y > 0) data.push({ name: "Expenses", value: ae * y });
    if (result.netProfit > 0) data.push({ name: "Profit", value: result.netProfit });
    return data;
  }, [ii, ai, y, ae, result.netProfit]);

  const DONUT_COLORS = ["#3b82f6", "#8b5cf6", "#ef4444", "#10b981"];

  // Smart insight
  const smartInsight = useMemo(() => {
    if (ii === 0) return "Enter your initial investment to see ROI projections.";
    if (result.roi < 0) {
      return `At ${ar}% return, this investment loses money after expenses. You need at least ${(ae / ii * 100 + 1).toFixed(1)}% annual return to break even.`;
    }
    if (result.breakEvenYear && result.breakEvenYear > y / 2) {
      return `Break-even in year ${result.breakEvenYear}. Consider reducing annual expenses by ${formatCurrency(ae * 0.2)} to improve ROI by ~${(result.roi * 0.15).toFixed(1)}%.`;
    }
    if (result.roi > 50) {
      return `Strong ${formatPercent(result.roi)} ROI over ${y} years. Every dollar invested returns $${(1 + result.roi / 100).toFixed(2)}. Consider scaling up.`;
    }
    return `${formatPercent(result.roi)} ROI over ${y} years. Net profit: ${formatCurrency(result.netProfit)}. Break-even: Year ${result.breakEvenYear || "—"}.`;
  }, [ii, ar, y, ae, result]);

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
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          <p className="text-xs font-semibold text-slate-900 mb-1">{label}</p>
          {payload.map((entry: TooltipItem) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500">{String(entry.name)}:</span>
              <span className="font-medium text-slate-900">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentType = INVESTMENT_TYPES.find((t) => t.value === invType);

  const applyPreset = (type: InvestmentType) => {
    const preset = INVESTMENT_TYPES.find((t) => t.value === type);
    if (preset) {
      setInvType(type);
      setAnnualReturn(String(preset.defaultReturn));
      setYears(String(preset.defaultYears));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
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
      <div className="border-b border-slate-200 bg-slate-50/80 mb-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">ROI Calculator</h1>
            </div>
          </div>
          <p className="text-slate-500 mt-2 max-w-xl">
            Calculate return on investment percentage and break-even point. Perfect for business decisions, side hustles, and investments.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Investment Type */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Investment Type
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {INVESTMENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => applyPreset(type.value)}
                    className={`rounded-lg border px-3 py-2.5 font-medium transition-all ${
                      invType === type.value
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {currentType && (
                <p className="text-[11px] text-slate-400 mt-2">
                  Preset: {currentType.defaultReturn}% return · {currentType.defaultYears} years
                </p>
              )}
            </div>

            {/* Investment Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Investment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Initial Investment</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="10000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Expected Annual Return</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="15"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Time Period (years)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="5"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[1, 3, 5, 10, 20].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setYears(String(yr))}
                        className="rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                      >
                        {yr}yr
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Additional (Optional)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Annual Additional Investment</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={additionalInvestment}
                      onChange={(e) => setAdditionalInvestment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Annual Expenses / Fees</label>
                  <div className="relative">
                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={annualExpenses}
                      onChange={(e) => setAnnualExpenses(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "100% Private",
                "Instant results",
                "Business-grade math",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main ROI Card */}
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                    Return on Investment
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-indigo-800 mb-2">
                    {formatPercent(result.roi)}
                  </p>
                  <div className="flex gap-4 mt-2 text-indigo-600">
                    <span>{y} years</span>
                    <span>{ar}% annual return</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Net Profit</p>
                    <p className={`text-base font-bold ${result.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {formatCurrency(result.netProfit)}
                    </p>
                  </div>
                  <div className="w-px bg-indigo-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Break-Even</p>
                    <p className="text-base font-bold text-slate-900">
                      {result.breakEvenYear ? `Year ${result.breakEvenYear}` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-[11px] text-blue-600 mb-0.5">Total Invested</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(result.totalInvested)}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-[11px] text-emerald-600 mb-0.5">Total Returned</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(result.totalReturned)}</p>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
                <p className="text-[11px] text-indigo-600 mb-0.5">Net Profit</p>
                <p className="text-xl font-bold text-indigo-700">{formatCurrency(result.netProfit)}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                <p className="text-[11px] text-amber-600 mb-0.5">ROI</p>
                <p className="text-xl font-bold text-amber-700">{formatPercent(result.roi)}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Growth Area Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Growth Over Time
                </h3>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                        <span className="text-[11px] text-slate-500">{String(value) === "invested" ? "Invested" : "Returns"}</span>
                      )} />
                      <Area type="monotone" dataKey="invested" stackId="1" stroke="#6366f1" fill="url(#colorInvested)" strokeWidth={2} name="invested" />
                      <Area type="monotone" dataKey="returns" stackId="1" stroke="#10b981" fill="url(#colorReturns)" strokeWidth={2} name="returns" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Breakdown Donut */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Investment Breakdown
                </h3>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
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
                        height={30}
                        iconType="circle"
                        formatter={(value: any) => (
                          <span className="text-[11px] text-slate-500">{String(value)}</span>
                        )}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ROI by Year Bar Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                ROI by Year
              </h3>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.yearlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `Yr ${v}`} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `${v.toFixed(0)}%`} />
                    <Tooltip
                      formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, "ROI"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="roi" fill="#6366f1" radius={[4, 4, 0, 0]} name="roi" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700">{smartInsight}</p>
            </div>

            {/* Yearly Breakdown Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Yearly Breakdown</h3>
                    <p className="text-slate-500">Detailed year-by-year projections</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showSchedule ? "rotate-90" : ""}`} />
              </button>

              {showSchedule && (
                <div className="border-t border-slate-200">
                  <div className="max-h-[400px] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Year</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Invested</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Returns</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Net Profit</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">ROI</th>
                          <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.yearlyData.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 font-medium text-slate-900">{row.year}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.invested)}</td>
                            <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(row.returns)}</td>
                            <td className={`px-3 py-2 text-right font-medium ${row.cumulativeReturn >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                              {formatCurrency(row.cumulativeReturn)}
                            </td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900">{formatPercent(row.roi)}</td>
                            <td className="px-3 py-2 text-center">
                              {row.breakEven ? (
                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Profit
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Building
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Investment Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Investment Tips
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Target, title: "Rule of 72", desc: `Divide 72 by your return rate to find doubling time. At ${ar}%, money doubles in ~${(72 / ar).toFixed(1)} years.` },
                  { icon: TrendingUp, title: "Compound Power", desc: "Reinvest returns to earn returns on returns. This is how wealth builds exponentially over time." },
                  { icon: Shield, title: "Diversify", desc: "Never put all eggs in one basket. Spread across asset classes to reduce risk while maintaining returns." },
                ].map((tip, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <tip.icon className="h-4 w-4 text-indigo-500 mb-3" />
                    <p className="font-semibold text-slate-900">{tip.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                ))}
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