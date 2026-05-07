"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Percent,
  CreditCard,
  TrendingDown,
  Clock,
  Target,
  Zap,
  Shield,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────
interface PayoffRow {
  month: number;
  startingBalance: number;
  interestPaid: number;
  principalPaid: number;
  payment: number;
  endingBalance: number;
  cumulativeInterest: number;
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

function calculatePayoff(
  balance: number,
  apr: number,
  monthlyPayment: number,
  extraPayment: number
): {
  rows: PayoffRow[];
  totalMonths: number;
  totalInterest: number;
  totalPaid: number;
  payoffDate: string;
} {
  const monthlyRate = apr / 100 / 12;
  const rows: PayoffRow[] = [];
  let currentBalance = balance;
  let cumulativeInterest = 0;
  let month = 0;

  const minPayment = Math.max(
    balance * monthlyRate + balance * 0.01,
    25
  );

  const payment = Math.max(monthlyPayment + extraPayment, minPayment);

  while (currentBalance > 0 && month < 600) {
    month++;
    const interest = currentBalance * monthlyRate;
    const principal = Math.min(payment - interest, currentBalance);
    const actualPayment = principal + interest;

    if (principal <= 0 && interest >= payment) {
      // Payment doesn't cover interest — debt grows
      break;
    }

    const startBalance = currentBalance;
    currentBalance = Math.max(0, currentBalance - principal);
    cumulativeInterest += interest;

    rows.push({
      month,
      startingBalance: startBalance,
      interestPaid: interest,
      principalPaid: principal,
      payment: actualPayment,
      endingBalance: currentBalance,
      cumulativeInterest,
    });
  }

  const now = new Date();
  const payoff = new Date(now.getFullYear(), now.getMonth() + month, 1);
  const payoffDate = payoff.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return {
    rows,
    totalMonths: month,
    totalInterest: cumulativeInterest,
    totalPaid: balance + cumulativeInterest,
    payoffDate,
  };
}

function calculateMinPaymentOnly(
  balance: number,
  apr: number
): {
  months: number;
  interest: number;
} {
  const monthlyRate = apr / 100 / 12;
  let currentBalance = balance;
  let months = 0;
  let totalInterest = 0;

  while (currentBalance > 0 && months < 600) {
    months++;
    const interest = currentBalance * monthlyRate;
    const minPayment = Math.max(currentBalance * monthlyRate + currentBalance * 0.01, 25);
    const principal = Math.min(minPayment - interest, currentBalance);
    currentBalance = Math.max(0, currentBalance - principal);
    totalInterest += interest;
  }

  return { months, interest: totalInterest };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function CreditCardPayoffPage() {
  const [balance, setBalance] = useState<string>("5000");
  const [apr, setApr] = useState<string>("24.99");
  const [monthlyPayment, setMonthlyPayment] = useState<string>("200");
  const [extraPayment, setExtraPayment] = useState<string>("0");
  const [showSchedule, setShowSchedule] = useState(false);

  const bal = Number(balance) || 0;
  const rate = Number(apr) || 0;
  const payment = Number(monthlyPayment) || 0;
  const extra = Number(extraPayment) || 0;

  const result = useMemo(
    () => calculatePayoff(bal, rate, payment, extra),
    [bal, rate, payment, extra]
  );

  const minOnly = useMemo(() => calculateMinPaymentOnly(bal, rate), [bal, rate]);

  // Chart data
  const chartData = useMemo(() => {
    return result.rows
      .filter((_, i) => i === 0 || i === result.rows.length - 1 || (i + 1) % Math.max(1, Math.floor(result.rows.length / 12)) === 0)
      .map((row) => ({
        month: `Mo ${row.month}`,
        balance: row.endingBalance,
        interest: row.cumulativeInterest,
      }));
  }, [result.rows]);

  const donutData = useMemo(() => {
    const data = [];
    if (bal > 0) data.push({ name: "Principal", value: bal });
    if (result.totalInterest > 0) data.push({ name: "Interest", value: result.totalInterest });
    return data;
  }, [bal, result.totalInterest]);

  const DONUT_COLORS = ["#3b82f6", "#ef4444"]; // blue, red

  // Smart insight
  const smartInsight = useMemo(() => {
    if (bal === 0) return "Enter your balance to see your payoff plan.";
    const interestSaved = minOnly.interest - result.totalInterest;
    const monthsSaved = minOnly.months - result.totalMonths;

    if (monthsSaved > 0 && interestSaved > 0) {
      return `Paying $${(payment + extra).toFixed(0)}/month saves you ${formatCurrency(interestSaved)} in interest and gets you debt-free ${monthsSaved} months sooner than minimum payments only.`;
    }
    if (result.totalMonths > 120) {
      return `At this rate, it will take over 10 years to pay off. Increasing your monthly payment by even $50 could save thousands in interest.`;
    }
    return `You will be debt-free in ${result.totalMonths} months. Total cost: ${formatCurrency(result.totalPaid)}.`;
  }, [bal, payment, extra, result, minOnly]);

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
              <span className="text-slate-500">{entry.name === "balance" ? "Balance" : "Interest Paid"}:</span>
              <span className="font-medium text-slate-900">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalMonthly = payment + extra;

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 border border-violet-200">
              <CreditCard className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Credit Card Payoff Calculator</h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            See exactly how long it will take to pay off your credit card and how much interest you will pay. Compare minimum vs. accelerated payments.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card Balance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Card Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Current Balance</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">APR (Annual Rate)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={apr}
                      onChange={(e) => setApr(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      placeholder="24.99"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average US credit card APR is ~24%</p>
                </div>
              </div>
            </div>

            {/* Payment Plan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Payment Plan
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Payment</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={monthlyPayment}
                      onChange={(e) => setMonthlyPayment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      placeholder="200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Extra Payment (optional)</label>
                  <div className="relative">
                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Additional amount above your base payment</p>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quick Scenarios
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Min. Only", p: Math.max(bal * (rate / 100 / 12) + bal * 0.01, 25).toFixed(0) },
                  { label: "$200/mo", p: "200" },
                  { label: "$500/mo", p: "500" },
                  { label: "$1000/mo", p: "1000" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => { setMonthlyPayment(preset.p); setExtraPayment("0"); }}
                    className="rounded-lg border border-slate-200 bg-white py-2 text-xs font-medium text-slate-600 hover:border-violet-300 hover:bg-violet-50/30 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "100% Private",
                "Instant results",
                "Real APR formulas",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-violet-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Result Card */}
            <div className="rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 to-purple-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">
                    Debt-Free Date
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-violet-800">
                    {result.payoffDate}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-violet-600">
                    <span>{result.totalMonths} months</span>
                    <span>Total paid {formatCurrency(result.totalPaid)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Interest</p>
                    <p className="text-base font-bold text-red-600">{formatCurrency(result.totalInterest)}</p>
                  </div>
                  <div className="w-px bg-violet-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Principal</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(bal)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-[11px] text-red-600 mb-0.5">Min. Payment Only</p>
                <p className="text-xl font-bold text-red-700">{minOnly.months} mo</p>
                <p className="text-[10px] text-red-500 mt-0.5">{formatCurrency(minOnly.interest)} interest</p>
              </div>
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <p className="text-[11px] text-violet-600 mb-0.5">Your Plan</p>
                <p className="text-xl font-bold text-violet-700">{result.totalMonths} mo</p>
                <p className="text-[10px] text-violet-500 mt-0.5">{formatCurrency(result.totalInterest)} interest</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Balance Area Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Balance Over Time
                </h3>
                <div className="w-full h-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="balance" stroke="#8b5cf6" fill="url(#colorBal)" strokeWidth={2} name="balance" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Donut Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Total Cost Breakdown
                </h3>
                <div className="w-full h-50">
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
                        height={30}
                        iconType="circle"
                        formatter={(value: any) => (
                          <span className="text-[11px] text-slate-500">{String(value)}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-sm text-violet-700">{smartInsight}</p>
            </div>

            {/* Monthly Payment Schedule Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-violet-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Payment Schedule</h3>
                    <p className="text-xs text-slate-500">Month-by-month payoff breakdown</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showSchedule ? "rotate-90" : ""}`} />
              </button>

              {showSchedule && (
                <div className="border-t border-slate-200">
                  <div className="max-h-100 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Payment</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Principal</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Interest</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.rows.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 font-medium text-slate-900">{row.month}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.payment)}</td>
                            <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(row.principalPaid)}</td>
                            <td className="px-3 py-2 text-right text-red-500">{formatCurrency(row.interestPaid)}</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900">{formatCurrency(row.endingBalance)}</td>
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
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Payoff Strategies
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Target, title: "Avalanche Method", desc: "Pay highest APR cards first. Saves the most interest." },
                  { icon: TrendingDown, title: "Snowball Method", desc: "Pay smallest balances first. Best for motivation." },
                  { icon: Shield, title: "Balance Transfer", desc: "Move debt to a 0% APR card. Watch transfer fees." },
                ].map((tip, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <tip.icon className="h-4 w-4 text-violet-500 mb-2" />
                    <p className="text-xs font-semibold text-slate-900">{tip.title}</p>
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