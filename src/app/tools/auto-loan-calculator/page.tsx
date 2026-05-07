"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  Car,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowRightLeft,
  Shield,
  CheckCircle2,
  ChevronRight,
  Zap,
  Gauge,
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
interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
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

function calculateAutoLoan(
  carPrice: number,
  downPayment: number,
  tradeIn: number,
  salesTaxRate: number,
  annualRate: number,
  loanTermMonths: number
): {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  salesTax: number;
  schedule: AmortizationRow[];
} {
  const taxableAmount = carPrice - tradeIn;
  const salesTax = taxableAmount * (salesTaxRate / 100);
  const loanAmount = carPrice + salesTax - downPayment - tradeIn;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (annualRate === 0) {
    monthlyPayment = loanAmount / loanTermMonths;
  } else {
    monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
                     (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let cumulativeInterest = 0;

  for (let month = 1; month <= loanTermMonths; month++) {
    const interest = balance * monthlyRate;
    let principal = monthlyPayment - interest;
    if (principal > balance) principal = balance;
    balance = Math.max(0, balance - principal);
    cumulativeInterest += interest;

    schedule.push({
      month,
      payment: principal + interest,
      principal,
      interest,
      balance,
      cumulativeInterest,
    });

    if (balance <= 0.01) break;
  }

  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalCost = carPrice + salesTax + totalInterest - tradeIn;

  return { loanAmount, monthlyPayment, totalInterest, totalCost, salesTax, schedule };
}

function calculateComparison(
  carPrice: number,
  downPayment: number,
  tradeIn: number,
  salesTaxRate: number,
  annualRate: number
): { months: number; payment: number; interest: number }[] {
  const terms = [36, 48, 60, 72, 84];
  return terms.map((months) => {
    const result = calculateAutoLoan(carPrice, downPayment, tradeIn, salesTaxRate, annualRate, months);
    return {
      months,
      payment: result.monthlyPayment,
      interest: result.totalInterest,
    };
  });
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AutoLoanCalculatorPage() {
  const [carPrice, setCarPrice] = useState<string>("35000");
  const [downPayment, setDownPayment] = useState<string>("5000");
  const [tradeIn, setTradeIn] = useState<string>("8000");
  const [salesTaxRate, setSalesTaxRate] = useState<string>(("6.25"));
  const [annualRate, setAnnualRate] = useState<string>(("5.99"));
  const [loanTerm, setLoanTerm] = useState<string>("60");
  const [showSchedule, setShowSchedule] = useState(false);

  const cp = Number(carPrice) || 0;
  const dp = Number(downPayment) || 0;
  const ti = Number(tradeIn) || 0;
  const str = Number(salesTaxRate) || 0;
  const ar = Number(annualRate) || 0;
  const lt = Number(loanTerm) || 0;

  const result = useMemo(
    () => calculateAutoLoan(cp, dp, ti, str, ar, lt),
    [cp, dp, ti, str, ar, lt]
  );

  const comparison = useMemo(
    () => calculateComparison(cp, dp, ti, str, ar),
    [cp, dp, ti, str, ar]
  );

  // Chart data
  const chartData = useMemo(() => {
    return result.schedule
      .filter((_, i) => i === 0 || i === result.schedule.length - 1 || (i + 1) % Math.max(1, Math.floor(result.schedule.length / 10)) === 0)
      .map((row) => ({
        month: `Mo ${row.month}`,
        balance: row.balance,
        interest: row.cumulativeInterest,
      }));
  }, [result.schedule]);

  const donutData = useMemo(() => {
    const data = [];
    if (cp > 0) data.push({ name: "Car Price", value: cp });
    if (result.salesTax > 0) data.push({ name: "Sales Tax", value: result.salesTax });
    if (result.totalInterest > 0) data.push({ name: "Interest", value: result.totalInterest });
    if (ti > 0) data.push({ name: "Trade-In Credit", value: -ti });
    return data.filter((d) => d.value !== 0);
  }, [cp, result.salesTax, result.totalInterest, ti]);

  const DONUT_COLORS = ["#3b82f6", "#f59e0b", "#ef4444", "#10b981"];

  // Smart insight
  const smartInsight = useMemo(() => {
    if (cp === 0) return "Enter the car price to see your monthly payment and loan options.";
    const totalDown = dp + ti;
    const downPct = (totalDown / cp) * 100;
    if (downPct < 10) {
      return `Your down payment + trade-in is only ${downPct.toFixed(0)}% of the car price. Lenders prefer 20% down to avoid being "upside down" on the loan.`;
    }
    if (lt > 72) {
      return `A ${lt}-month term lowers your payment to ${formatCurrency(result.monthlyPayment)}, but you will pay ${formatCurrency(result.totalInterest)} in interest. Cars depreciate fast — long loans risk owing more than the car is worth.`;
    }
    if (ar > 8) {
      return `At ${ar}% APR, shop around. Credit unions often offer 4-6% for auto loans. A 2% rate reduction could save you ${formatCurrency(result.totalInterest * 0.3)}.`;
    }
    return `Monthly payment: ${formatCurrency(result.monthlyPayment)}. Total loan cost: ${formatCurrency(result.totalCost)}. You are financing ${formatCurrency(result.loanAmount)} after ${formatCurrency(totalDown)} down.`;
  }, [cp, dp, ti, lt, ar, result]);

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
      <div className="border-b border-slate-200 bg-slate-50/80 mb-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 border border-cyan-200">
              <Car className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-cyan-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Auto Loan Calculator</h1>
            </div>
          </div>
          <p className=" text-slate-500 mt-2 max-w-xl">
            Calculate monthly car payments, total interest, and compare loan terms. Includes trade-in value, down payment, and sales tax.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Car Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className=" font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Vehicle & Loan
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Car Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={carPrice}
                      onChange={(e) => setCarPrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="35000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Down Payment</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Trade-In Value</label>
                  <div className="relative">
                    <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={tradeIn}
                      onChange={(e) => setTradeIn(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="8000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Sales Tax Rate</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={salesTaxRate}
                      onChange={(e) => setSalesTaxRate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="6.25"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Applied to price minus trade-in</p>
                </div>
              </div>
            </div>

            {/* Loan Terms */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Loan Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Interest Rate (APR)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="5.99"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Good credit: 4-6% · Fair: 7-10%</p>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Loan Term (months)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-slate-900 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="60"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[36, 48, 60, 72, 84].map((mo) => (
                      <button
                        key={mo}
                        onClick={() => setLoanTerm(String(mo))}
                        className="rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-500 hover:border-cyan-300 hover:bg-cyan-50 transition-all"
                      >
                        {mo}mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "100% Private",
                "Instant results",
                "Real auto loan math",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Payment Card */}
            <div className="rounded-2xl border border-cyan-200 bg-linear-to-br from-cyan-50 to-sky-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className=" font-semibold text-cyan-600 uppercase tracking-wider mb-3">
                    Monthly Payment
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-cyan-800 mb-3">
                    {formatCurrency(result.monthlyPayment)}
                  </p>
                  <div className="flex gap-4 mt-3 mb-3 text-cyan-600">
                    <span>{lt} months</span>
                    <span>{ar}% APR</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Loan Amount</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(result.loanAmount)}</p>
                  </div>
                  <div className="w-px bg-cyan-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Total Interest</p>
                    <p className="text-base font-bold text-amber-600">{formatCurrency(result.totalInterest)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-[11px] text-blue-600 mb-0.5">Car Price</p>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(cp)}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                <p className="text-[11px] text-amber-600 mb-0.5">Sales Tax</p>
                <p className="text-xl font-bold text-amber-700">{formatCurrency(result.salesTax)}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-[11px] text-emerald-600 mb-0.5">Total Cost</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(result.totalCost)}</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-[11px] text-red-600 mb-0.5">Interest</p>
                <p className="text-xl font-bold text-red-700">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            {/* Term Comparison */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className=" font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Compare Loan Terms
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {comparison.map((comp) => (
                  <button
                    key={comp.months}
                    onClick={() => setLoanTerm(String(comp.months))}
                    className={`rounded-lg border p-4 text-center transition-all ${
                      lt === comp.months
                        ? "border-cyan-300 bg-cyan-50"
                        : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/30"
                    }`}
                  >
                    <p className=" font-semibold text-slate-700">{comp.months} mo</p>
                    <p className={`text-lg font-bold ${lt === comp.months ? "text-cyan-700" : "text-slate-900"}`}>
                      {formatCurrency(comp.payment)}
                    </p>
                    <p className="text-[10px] text-slate-500">{formatCurrency(comp.interest)} interest</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Balance Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className=" font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Loan Balance Over Time
                </h3>
                <div className="w-full h-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="balance" stroke="#06b6d4" fill="url(#colorBal)" strokeWidth={2} name="balance" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Donut */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
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
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 flex items-start gap-3">
              <Gauge className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
              <p className=" text-cyan-700">{smartInsight}</p>
            </div>

            {/* Amortization Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-cyan-500" />
                  <div>
                    <h3 className=" font-semibold text-slate-900">Amortization Schedule</h3>
                    <p className=" text-slate-500">Month-by-month payoff breakdown</p>
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
                        {result.schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 font-medium text-slate-900">{row.month}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.payment)}</td>
                            <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(row.principal)}</td>
                            <td className="px-3 py-2 text-right text-amber-500">{formatCurrency(row.interest)}</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900">{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Car Buying Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Car Buying Tips
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: TrendingUp, title: "20/4/10 Rule", desc: "20% down, 4-year max term, 10% of monthly income for payment." },
                  { icon: Shield, title: "Gap Insurance", desc: "Consider it if you put less than 20% down. Covers the gap if totaled." },
                  { icon: Wallet, title: "Pre-Approval", desc: "Get loan pre-approved before visiting dealers. You will get a better rate." },
                ].map((tip, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <tip.icon className="h-4 w-4 text-cyan-500 mb-3" />
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