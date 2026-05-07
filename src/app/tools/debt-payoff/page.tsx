"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  Snowflake,
  Mountain,
  Clock,
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
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────
type PayoffMethod = "avalanche" | "snowball";

interface Debt {
  id: string;
  name: string;
  balance: number;
  minPayment: number;
  apr: number;
}

interface PayoffRow {
  month: number;
  totalBalance: number;
  totalPaid: number;
  cumulativeInterest: number;
}

interface DebtResult {
  debt: Debt;
  payoffMonth: number;
  interestPaid: number;
  totalPaid: number;
}

interface StrategyResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  payoffDate: string;
  schedule: PayoffRow[];
  debtResults: DebtResult[];
  interestSaved: number;
  monthsSaved: number;
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

function calculateStrategy(
  debts: Debt[],
  extraPayment: number,
  method: PayoffMethod
): StrategyResult {
  if (debts.length === 0) {
    return {
      months: 0,
      totalInterest: 0,
      totalPaid: 0,
      payoffDate: "—",
      schedule: [],
      debtResults: [],
      interestSaved: 0,
      monthsSaved: 0,
    };
  }

  // Sort debts by method
  const sortedDebts = [...debts].sort((a, b) => {
    if (method === "avalanche") return b.apr - a.apr; // Highest APR first
    return a.balance - b.balance; // Lowest balance first
  });

  let month = 0;
  let cumulativeInterest = 0;
  let totalPaid = 0;
  const schedule: PayoffRow[] = [];
  const debtResults: DebtResult[] = [];
  const activeDebts = sortedDebts.map((d) => ({ ...d, currentBalance: d.balance, paidOff: false }));
  const totalMinPayment = debts.reduce((s, d) => s + d.minPayment, 0);
  const monthlyBudget = totalMinPayment + extraPayment;

  while (activeDebts.some((d) => !d.paidOff) && month < 600) {
    month++;
    let monthInterest = 0;
    let monthPrincipal = 0;
    let availablePayment = monthlyBudget;

    // Pay minimums on all active debts
    for (const debt of activeDebts) {
      if (debt.paidOff) continue;
      const monthlyRate = debt.apr / 100 / 12;
      const interest = debt.currentBalance * monthlyRate;
      monthInterest += interest;
      debt.currentBalance += interest;

      const minPay = Math.min(debt.minPayment, debt.currentBalance);
      debt.currentBalance -= minPay;
      availablePayment -= minPay;
      monthPrincipal += minPay;
    }

    // Apply extra to target debt (first non-paid-off in sorted order)
    for (const debt of activeDebts) {
      if (debt.paidOff) continue;
      if (availablePayment <= 0) break;
      const extra = Math.min(availablePayment, debt.currentBalance);
      debt.currentBalance -= extra;
      availablePayment -= extra;
      monthPrincipal += extra;

      if (debt.currentBalance <= 0.01) {
        debt.paidOff = true;
        debtResults.push({
          debt,
          payoffMonth: month,
          interestPaid: 0, // Will calculate after
          totalPaid: 0,
        });
      }
      break; // Only extra to one debt
    }

    // Check for any debts that got paid off by minimum payments
    for (const debt of activeDebts) {
      if (!debt.paidOff && debt.currentBalance <= 0.01) {
        debt.paidOff = true;
        debtResults.push({
          debt,
          payoffMonth: month,
          interestPaid: 0,
          totalPaid: 0,
        });
      }
    }

    cumulativeInterest += monthInterest;
    totalPaid += monthPrincipal + monthInterest;

    const totalBalance = activeDebts.reduce((s, d) => s + Math.max(0, d.currentBalance), 0);
    schedule.push({
      month,
      totalBalance,
      totalPaid,
      cumulativeInterest,
    });
  }

  const now = new Date();
  const payoff = new Date(now.getFullYear(), now.getMonth() + month, 1);

  return {
    months: month,
    totalInterest: cumulativeInterest,
    totalPaid,
    payoffDate: payoff.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    schedule,
    debtResults,
    interestSaved: 0,
    monthsSaved: 0,
  };
}

function calculateMinOnly(debts: Debt[]): { months: number; interest: number } {
  const result = calculateStrategy(debts, 0, "avalanche");
  return { months: result.months, interest: result.totalInterest };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function DebtPayoffCalculatorPage() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: "1", name: "Credit Card 1", balance: 5000, minPayment: 150, apr: 24.99 },
    { id: "2", name: "Credit Card 2", balance: 3200, minPayment: 100, apr: 19.99 },
    { id: "3", name: "Student Loan", balance: 12000, minPayment: 250, apr: 5.5 },
  ]);
  const [extraPayment, setExtraPayment] = useState<string>("200");
  const [method, setMethod] = useState<PayoffMethod>("avalanche");
  const [showSchedule, setShowSchedule] = useState(false);

  const extra = Number(extraPayment) || 0;

  const avalancheResult = useMemo(() => calculateStrategy(debts, extra, "avalanche"), [debts, extra]);
  const snowballResult = useMemo(() => calculateStrategy(debts, extra, "snowball"), [debts, extra]);
  const minOnly = useMemo(() => calculateMinOnly(debts), [debts]);

  const currentResult = method === "avalanche" ? avalancheResult : snowballResult;
  const otherResult = method === "avalanche" ? snowballResult : avalancheResult;

  // Chart data
  const chartData = useMemo(() => {
    const avData = avalancheResult.schedule;
    const sbData = snowballResult.schedule;
    const maxMonths = Math.max(avData.length, sbData.length);
    const data = [];
    for (let i = 0; i < maxMonths; i++) {
      if (i === 0 || i === maxMonths - 1 || (i + 1) % Math.max(1, Math.floor(maxMonths / 12)) === 0) {
        data.push({
          month: `Mo ${i + 1}`,
          avalanche: avData[i]?.totalBalance || 0,
          snowball: sbData[i]?.totalBalance || 0,
        });
      }
    }
    return data;
  }, [avalancheResult.schedule, snowballResult.schedule]);

  const addDebt = () => {
    const newId = String(debts.length + 1);
    setDebts([...debts, { id: newId, name: `Debt ${newId}`, balance: 0, minPayment: 0, apr: 0 }]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: string) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, [field]: field === "name" ? value : Number(value) || 0 } : d)));
  };

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0);

  // Smart insight
  const smartInsight = useMemo(() => {
    if (debts.length === 0 || totalDebt === 0) return "Add your debts to see your payoff strategy.";
    const interestSaved = minOnly.interest - currentResult.totalInterest;
    const monthsSaved = minOnly.months - currentResult.months;
    const methodName = method === "avalanche" ? "Avalanche" : "Snowball";

    if (monthsSaved > 0 && interestSaved > 0) {
      return `${methodName} method gets you debt-free ${monthsSaved} months sooner and saves ${formatCurrency(interestSaved)} in interest compared to minimum payments only.`;
    }
    if (method === "avalanche" && avalancheResult.totalInterest < snowballResult.totalInterest) {
      const saved = snowballResult.totalInterest - avalancheResult.totalInterest;
      return `Avalanche saves ${formatCurrency(saved)} more in interest than Snowball, but Snowball pays off the first debt ${snowballResult.debtResults[0]?.payoffMonth || 0} months sooner.`;
    }
    return `${methodName} method: debt-free in ${currentResult.months} months. Total interest: ${formatCurrency(currentResult.totalInterest)}.`;
  }, [debts, totalDebt, method, currentResult, minOnly, avalancheResult, snowballResult]);

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
                FinCalc<span className="text-emerald-600">Pro</span>
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 border border-rose-200">
              <Target className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Debt Payoff Calculator</h1>
            </div>
          </div>
          <p className=" text-slate-500 mt-2 max-w-xl">
            Create a debt payoff strategy using avalanche or snowball method. See your debt-free date and total interest saved.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Debts List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className=" font-semibold text-slate-500 uppercase tracking-wider">
                  Your Debts ({debts.length})
                </h2>
                <button
                  onClick={addDebt}
                  className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 font-medium text-rose-600 hover:bg-rose-100 transition-all"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {debts.map((debt) => (
                  <div key={debt.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                        className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 font-medium text-slate-900 focus:border-rose-400 focus:outline-none"
                      />
                      <button
                        onClick={() => removeDebt(debt.id)}
                        className="rounded-md p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">Balance</label>
                        <input
                          type="number"
                          value={debt.balance}
                          onChange={(e) => updateDebt(debt.id, "balance", e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-900 focus:border-rose-400 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Min Pay</label>
                        <input
                          type="number"
                          value={debt.minPayment}
                          onChange={(e) => updateDebt(debt.id, "minPayment", e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-900 focus:border-rose-400 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">APR %</label>
                        <input
                          type="number"
                          step="0.01"
                          value={debt.apr}
                          onChange={(e) => updateDebt(debt.id, "apr", e.target.value)}
                          className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-900 focus:border-rose-400 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
                <span className="text-slate-500">Total Debt</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-slate-500">Min. Payments</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalMin)}/mo</span>
              </div>
            </div>

            {/* Extra Payment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className=" font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Extra Payment
              </h2>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Additional Monthly</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    placeholder="200"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Total monthly budget: {formatCurrency(totalMin + extra)}/mo</p>
              </div>
            </div>

            {/* Method Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className=" font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Payoff Method
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMethod("avalanche")}
                  className={`rounded-lg border px-3 py-3 font-medium transition-all ${
                    method === "avalanche"
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50/30"
                  }`}
                >
                  <Mountain className="h-3.5 w-3.5 mx-auto mb-1" />
                  Avalanche
                </button>
                <button
                  onClick={() => setMethod("snowball")}
                  className={`rounded-lg border px-3 py-4 font-medium transition-all ${
                    method === "snowball"
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50/30"
                  }`}
                >
                  <Snowflake className="h-3.5 w-3.5 mx-auto mb-1" />
                  Snowball
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {method === "avalanche"
                  ? "Pay highest APR first. Saves the most money."
                  : "Pay smallest balance first. Best for motivation."}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                "100% Private",
                "Instant results",
                "Real payoff math",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-rose-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Result Card */}
            <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className=" font-semibold text-rose-600 uppercase tracking-wider mb-2">
                    Debt-Free Date · {method === "avalanche" ? "Avalanche" : "Snowball"}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-rose-800 mb-3">
                    {currentResult.payoffDate}
                  </p>
                  <div className="flex gap-4 mt-2 text-rose-600">
                    <span>{currentResult.months} months</span>
                    <span>{formatCurrency(currentResult.totalInterest)} interest</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Total Paid</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(currentResult.totalPaid)}</p>
                  </div>
                  <div className="w-px bg-rose-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">vs. Min Only</p>
                    <p className="text-base font-bold text-emerald-600">
                      {formatCurrency(minOnly.interest - currentResult.totalInterest)} saved
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-[11px] text-slate-500 mb-0.5">Min. Payments Only</p>
                <p className="text-xl font-bold text-slate-700">{minOnly.months} mo</p>
                <p className="text-[10px] text-slate-400">{formatCurrency(minOnly.interest)} interest</p>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
                <p className="text-[11px] text-rose-600 mb-0.5">{method === "avalanche" ? "Avalanche" : "Snowball"}</p>
                <p className="text-xl font-bold text-rose-700">{currentResult.months} mo</p>
                <p className="text-[10px] text-rose-400">{formatCurrency(currentResult.totalInterest)} interest</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-[11px] text-emerald-600 mb-0.5">You Save</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(minOnly.interest - currentResult.totalInterest)}</p>
                <p className="text-[10px] text-emerald-400">{minOnly.months - currentResult.months} months sooner</p>
              </div>
            </div>

            {/* Method Comparison Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className=" font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Avalanche vs. Snowball Balance
              </h3>
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorAv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorSb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                      <span className="text-[11px] text-slate-500">{String(value) === "avalanche" ? "Avalanche" : "Snowball"}</span>
                    )} />
                    <Area type="monotone" dataKey="avalanche" stroke="#f43f5e" fill="url(#colorAv)" strokeWidth={2} name="avalanche" />
                    <Area type="monotone" dataKey="snowball" stroke="#3b82f6" fill="url(#colorSb)" strokeWidth={2} name="snowball" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Debt Payoff Order */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className=" font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Payoff Order · {method === "avalanche" ? "Avalanche" : "Snowball"}
              </h3>
              <div className="space-y-2">
                {(method === "avalanche"
                  ? [...debts].sort((a, b) => b.apr - a.apr)
                  : [...debts].sort((a, b) => a.balance - b.balance)
                ).map((debt, i) => {
                  const resultDebt = currentResult.debtResults.find((d) => d.debt.id === debt.id);
                  return (
                    <div key={debt.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-600">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{debt.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {formatCurrency(debt.balance)} · {debt.apr}% APR · Min {formatCurrency(debt.minPayment)}/mo
                        </p>
                      </div>
                      {resultDebt && (
                        <div className="text-right shrink-0">
                          <p className="font-bold text-emerald-600">Mo {resultDebt.payoffMonth}</p>
                          <p className="text-[10px] text-slate-400">Paid off</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-rose-700">{smartInsight}</p>
            </div>

            {/* Amortization Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-rose-500" />
                  <div>
                    <h3 className=" font-semibold text-slate-900">Payoff Schedule</h3>
                    <p className="text-slate-500">Month-by-month total balance</p>
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
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Balance</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Paid</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Interest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentResult.schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 font-medium text-slate-900">{row.month}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.totalBalance)}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.totalPaid)}</td>
                            <td className="px-3 py-2 text-right text-amber-500">{formatCurrency(row.cumulativeInterest)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Strategy Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Strategy Tips
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Mountain, title: "Avalanche Wins", desc: "Mathematically saves the most money by targeting highest APR debts first." },
                  { icon: Snowflake, title: "Snowball Motivates", desc: "Paying off small debts first creates quick wins that keep you committed." },
                  { icon: Award, title: "Hybrid Approach", desc: "Start with Snowball for 1-2 quick wins, then switch to Avalanche for maximum savings." },
                ].map((tip, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <tip.icon className="h-4 w-4 text-rose-500 mb-3" />
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