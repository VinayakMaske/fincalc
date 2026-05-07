"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Percent,
  Home,
  TrendingDown,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  ChevronRight,
  ArrowRightLeft,
  Award,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────
interface LoanScenario {
  label: string;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  balanceData: { month: number; balance: number }[];
}

interface ComparisonRow {
  month: number;
  currentBalance: number;
  newBalance: number;
  savings: number;
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

function calculateLoanScenario(
  balance: number,
  rate: number,
  months: number,
  closingCosts: number
): LoanScenario {
  const monthlyRate = rate / 100 / 12;
  let payment: number;
  if (rate === 0) {
    payment = balance / months;
  } else {
    payment = (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1);
  }

  const balanceData: { month: number; balance: number }[] = [];
  let currentBalance = balance;
  let totalInterest = 0;

  for (let month = 1; month <= months; month++) {
    const interest = currentBalance * monthlyRate;
    let principal = payment - interest;
    if (principal > currentBalance) principal = currentBalance;
    currentBalance = Math.max(0, currentBalance - principal);
    totalInterest += interest;

    if (month === 1 || month % 12 === 0 || currentBalance <= 0.01) {
      balanceData.push({ month, balance: currentBalance });
    }
  }

  const totalCost = balance + totalInterest + closingCosts;

  return {
    label: months <= 360 ? `${(months / 12).toFixed(0)}-year` : "Current",
    monthlyPayment: payment,
    totalInterest,
    totalCost,
    balanceData,
  };
}

function calculateRefinanceSavings(
  currentBalance: number,
  currentRate: number,
  currentMonthsRemaining: number,
  newRate: number,
  newTermMonths: number,
  closingCosts: number
): {
  current: LoanScenario;
  refinanced: LoanScenario;
  monthlySavings: number;
  breakEvenMonths: number;
  lifetimeSavings: number;
  comparisonData: ComparisonRow[];
} {
  const current = calculateLoanScenario(currentBalance, currentRate, currentMonthsRemaining, 0);
  const refinanced = calculateLoanScenario(currentBalance, newRate, newTermMonths, closingCosts);

  const monthlySavings = current.monthlyPayment - refinanced.monthlyPayment;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
  const lifetimeSavings = current.totalCost - refinanced.totalCost;

  const comparisonData: ComparisonRow[] = [];
  const maxMonths = Math.max(current.balanceData.length, refinanced.balanceData.length);
  for (let i = 0; i < maxMonths; i++) {
    const currentBal = current.balanceData[i]?.balance || 0;
    const newBal = refinanced.balanceData[i]?.balance || 0;
    comparisonData.push({
      month: i + 1,
      currentBalance: currentBal,
      newBalance: newBal,
      savings: currentBal - newBal,
    });
  }

  return {
    current,
    refinanced,
    monthlySavings,
    breakEvenMonths,
    lifetimeSavings,
    comparisonData,
  };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function RefinanceCalculatorPage() {
  const [homeValue, setHomeValue] = useState<string>("450000");
  const [currentBalance, setCurrentBalance] = useState<string>("320000");
  const [currentRate, setCurrentRate] = useState<string>(("6.5"));
  const [currentYearsLeft, setCurrentYearsLeft] = useState<string>("25");
  const [newRate, setNewRate] = useState<string>(("5.25"));
  const [newTerm, setNewTerm] = useState<string>("30");
  const [closingCosts, setClosingCosts] = useState<string>("4000");
  const [showSchedule, setShowSchedule] = useState(false);

  const hv = Number(homeValue) || 0;
  const cb = Number(currentBalance) || 0;
  const cr = Number(currentRate) || 0;
  const cyl = Number(currentYearsLeft) || 0;
  const nr = Number(newRate) || 0;
  const nt = Number(newTerm) || 0;
  const cc = Number(closingCosts) || 0;

  const currentMonthsRemaining = cyl * 12;
  const newTermMonths = nt * 12;

  const result = useMemo(
    () => calculateRefinanceSavings(cb, cr, currentMonthsRemaining, nr, newTermMonths, cc),
    [cb, cr, currentMonthsRemaining, nr, newTermMonths, cc]
  );

  // Chart data
  const balanceChartData = useMemo(() => {
    return result.comparisonData.filter((_, i) => i === 0 || i === result.comparisonData.length - 1 || (i + 1) % Math.max(1, Math.floor(result.comparisonData.length / 10)) === 0).map((row) => ({
      year: `Yr ${Math.ceil(row.month / 12)}`,
      current: row.currentBalance,
      refinanced: row.newBalance,
    }));
  }, [result.comparisonData]);

  const savingsChartData = useMemo(() => {
    const data = [];
    for (let year = 1; year <= Math.max(cyl, nt); year++) {
      const monthlySavings = result.monthlySavings;
      const cumulativeSavings = monthlySavings * year * 12 - (year <= Math.ceil(result.breakEvenMonths / 12) ? cc : 0);
      data.push({
        year: `Yr ${year}`,
        savings: Math.max(0, cumulativeSavings),
        costs: year <= Math.ceil(result.breakEvenMonths / 12) ? cc : 0,
      });
    }
    return data;
  }, [result, cyl, nt, cc]);

  // Smart insight
  const smartInsight = useMemo(() => {
    if (cb === 0) return "Enter your current mortgage details to compare refinance options.";
    if (result.monthlySavings <= 0) {
      return `Refinancing to ${nr}% actually increases your monthly payment by ${formatCurrency(Math.abs(result.monthlySavings))}. Only consider this if you need cash-out or a shorter term.`;
    }
    if (result.breakEvenMonths > 36) {
      return `Break-even is ${Math.ceil(result.breakEvenMonths)} months — over 3 years. Only refinance if you plan to stay in the home longer than that. Closing costs are ${formatCurrency(cc)}.`;
    }
    if (result.lifetimeSavings > 50000) {
      return `Excellent deal! You save ${formatCurrency(result.monthlySavings)}/month and ${formatCurrency(result.lifetimeSavings)} over the loan life. Break-even in just ${Math.ceil(result.breakEvenMonths)} months.`;
    }
    return `Save ${formatCurrency(result.monthlySavings)}/month (${formatCurrency(result.monthlySavings * 12)}/year). Break-even: ${Math.ceil(result.breakEvenMonths)} months. Lifetime savings: ${formatCurrency(result.lifetimeSavings)}.`;
  }, [cb, nr, result]);

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

  const ltv = hv > 0 ? (cb / hv) * 100 : 0;

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 border border-sky-200">
              <Home className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Refinance Calculator</h1>
            </div>
          </div>
          <p className="text-slate-500 mt-2 max-w-xl">
            Compare your current mortgage with refinancing options. See break-even point and lifetime savings from a lower rate.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current Loan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Current Mortgage
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Home Value</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={homeValue}
                      onChange={(e) => setHomeValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="450000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Current Balance</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="320000"
                    />
                  </div>
                  {ltv > 0 && (
                    <p className="text-[11px] text-slate-400 mt-0.5">LTV: {ltv.toFixed(1)}%</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Current Rate</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={currentRate}
                      onChange={(e) => setCurrentRate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="6.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Years Remaining</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={currentYearsLeft}
                      onChange={(e) => setCurrentYearsLeft(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="25"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New Loan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                New Loan (Refinance)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">New Rate</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="5.25"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Current avg: 6.5% · Good rate: 5-6%</p>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">New Term (years)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="30"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[15, 20, 25, 30].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setNewTerm(String(yr))}
                        className="rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-500 hover:border-sky-300 hover:bg-sky-50 transition-all"
                      >
                        {yr}yr
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Closing Costs</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={closingCosts}
                      onChange={(e) => setClosingCosts(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="4000"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Typically 2-5% of loan amount</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "100% Private",
                "Instant results",
                "Real mortgage math",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 mb-5 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-sky-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Savings Card */}
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-sky-600 uppercase tracking-wider mb-2">
                    Monthly Savings
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-sky-800 mb-2">
                    {formatCurrency(result.monthlySavings)}
                  </p>
                  <div className="flex gap-4 mt-2 text-sky-600">
                    <span>Break-even: {result.breakEvenMonths === Infinity ? "—" : `${Math.ceil(result.breakEvenMonths)} mo`}</span>
                    <span>LTV: {ltv.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Lifetime Savings</p>
                    <p className="text-base font-bold text-emerald-600">{formatCurrency(result.lifetimeSavings)}</p>
                  </div>
                  <div className="w-px bg-sky-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Closing Costs</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(cc)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] text-slate-500 mb-2 font-semibold uppercase tracking-wider">Current Loan</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Payment</span>
                    <span className="font-bold text-slate-900">{formatCurrency(result.current.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Interest</span>
                    <span className="font-medium text-amber-600">{formatCurrency(result.current.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Cost</span>
                    <span className="font-medium text-slate-700">{formatCurrency(result.current.totalCost)}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-[11px] text-sky-600 mb-2 font-semibold uppercase tracking-wider">Refinanced</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Payment</span>
                    <span className="font-bold text-sky-700">{formatCurrency(result.refinanced.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Interest</span>
                    <span className="font-medium text-amber-600">{formatCurrency(result.refinanced.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Cost</span>
                    <span className="font-medium text-slate-700">{formatCurrency(result.refinanced.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Comparison Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Balance Comparison
              </h3>
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                      <span className="text-[11px] text-slate-500">{String(value) === "current" ? "Current" : "Refinanced"}</span>
                    )} />
                    <Area type="monotone" dataKey="current" stroke="#94a3b8" fill="url(#colorCurrent)" strokeWidth={2} name="current" />
                    <Area type="monotone" dataKey="refinanced" stroke="#0ea5e9" fill="url(#colorNew)" strokeWidth={2} name="refinanced" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cumulative Savings Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Cumulative Savings vs. Closing Costs
              </h3>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                      <span className="text-[11px] text-slate-500">{String(value) === "savings" ? "Savings" : "Closing Costs"}</span>
                    )} />
                    <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} name="savings" />
                    <Bar dataKey="costs" fill="#ef4444" radius={[4, 4, 0, 0]} name="costs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
              <p className="text-sky-700">{smartInsight}</p>
            </div>

            {/* Rate Comparison Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-4">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-sky-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Rate Impact Analysis</h3>
                    <p className="text-slate-500">See how different rates affect your payment</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showSchedule ? "rotate-90" : ""}`} />
              </button>

              {showSchedule && (
                <div className="border-t border-slate-200">
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[nr - 1, nr - 0.5, nr, nr + 0.5, nr + 1].filter((r) => r > 0).map((rate) => {
                        const scenario = calculateLoanScenario(cb, rate, newTermMonths, cc);
                        const savings = result.current.monthlyPayment - scenario.monthlyPayment;
                        return (
                          <div key={rate} className={`rounded-lg border p-4 text-center ${rate === nr ? "border-sky-300 bg-sky-50" : "border-slate-100 bg-slate-50"}`}>
                            <p className="text-xs font-semibold text-slate-700">{rate.toFixed(2)}%</p>
                            <p className="text-lg font-bold text-slate-900">{formatCurrency(scenario.monthlyPayment)}</p>
                            <p className="text-[10px] text-emerald-600">{savings > 0 ? `Save ${formatCurrency(savings)}/mo` : `+${formatCurrency(Math.abs(savings))}/mo`}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Refinance Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                When to Refinance
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: TrendingDown, title: "Rate Drop", desc: "Refinance when rates drop 0.75-1% below your current rate. That is when savings justify closing costs." },
                  { icon: Clock, title: "Break-Even Rule", desc: "Only refinance if you will stay in the home longer than the break-even period. Otherwise costs eat savings." },
                  { icon: Award, title: "Remove PMI", desc: "If your LTV dropped below 80%, refinance to eliminate PMI and save $100-300/month." },
                ].map((tip, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <tip.icon className="h-4 w-4 text-sky-500 mb-3" />
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