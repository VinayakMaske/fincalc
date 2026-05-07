"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Shield,
  CheckCircle2,
  ChevronRight,
  Zap,
  Landmark,
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
type LoanType = "personal" | "auto" | "student" | "home";

interface ScheduleRow {
  month: number;
  emi: number;
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

function calculateLoan(
  principal: number,
  annualRate: number,
  years: number,
  loanType: LoanType
): {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: ScheduleRow[];
} {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;

  let emi: number;
  if (annualRate === 0) {
    emi = principal / months;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
  }

  const schedule: ScheduleRow[] = [];
  let balance = principal;
  let cumulativeInterest = 0;

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    let principalPaid = emi - interest;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance = Math.max(0, balance - principalPaid);
    cumulativeInterest += interest;

    schedule.push({
      month,
      emi: principalPaid + interest,
      principal: principalPaid,
      interest,
      balance,
      cumulativeInterest,
    });

    if (balance <= 0.01) break;
  }

  const totalPayment = schedule.reduce((s, r) => s + r.emi, 0);
  const totalInterest = totalPayment - principal;

  return { emi, totalPayment, totalInterest, schedule };
}

const LOAN_TYPES: { value: LoanType; label: string; icon: string; minApr: number; maxApr: number }[] = [
  { value: "personal", label: "Personal", icon: "Wallet", minApr: 6, maxApr: 36 },
  { value: "auto", label: "Auto", icon: "Car", minApr: 4, maxApr: 15 },
  { value: "student", label: "Student", icon: "GraduationCap", minApr: 4, maxApr: 14 },
  { value: "home", label: "Mortgage", icon: "Home", minApr: 5, maxApr: 8 },
];

// ─── Main Component ──────────────────────────────────────────────────
export default function LoanCalculatorPage() {
  const [loanType, setLoanType] = useState<LoanType>("personal");
  const [principal, setPrincipal] = useState<string>("25000");
  const [annualRate, setAnnualRate] = useState<string>(("10.5"));
  const [years, setYears] = useState<string>("5");
  const [showSchedule, setShowSchedule] = useState(false);

  const p = Number(principal) || 0;
  const r = Number(annualRate) || 0;
  const y = Number(years) || 0;

  const result = useMemo(
    () => calculateLoan(p, r, y, loanType),
    [p, r, y, loanType]
  );

  // Chart data
  const chartData = useMemo(() => {
    return result.schedule
      .filter((_, i) => i === 0 || i === result.schedule.length - 1 || (i + 1) % Math.max(1, Math.floor(result.schedule.length / 12)) === 0)
      .map((row) => ({
        month: `Mo ${row.month}`,
        principal: row.principal,
        interest: row.interest,
        balance: row.balance,
      }));
  }, [result.schedule]);

  const donutData = useMemo(() => {
    const data = [];
    if (p > 0) data.push({ name: "Principal", value: p });
    if (result.totalInterest > 0) data.push({ name: "Interest", value: result.totalInterest });
    return data;
  }, [p, result.totalInterest]);

  const DONUT_COLORS = ["#3b82f6", "#f59e0b"]; // blue, amber

  // Smart insight
  const smartInsight = useMemo(() => {
    if (p === 0) return "Enter your loan amount to see your EMI and repayment plan.";
    const totalCostRatio = (result.totalPayment / p) * 100;
    if (r > 15) {
      return `At ${r}% APR, you will pay ${formatCurrency(result.totalInterest)} in interest — ${(totalCostRatio - 100).toFixed(1)}% of your principal. Consider refinancing if your credit score has improved.`;
    }
    if (y > 7) {
      return `A ${y}-year term keeps monthly payments low at ${formatCurrency(result.emi)}, but you will pay ${formatCurrency(result.totalInterest)} in total interest. A shorter term could save thousands.`;
    }
    return `Your EMI is ${formatCurrency(result.emi)}/month. Total cost: ${formatCurrency(result.totalPayment)} (${formatCurrency(result.totalInterest)} interest).`;
  }, [p, r, y, result]);

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
              <span className="text-slate-500">
                {entry.name === "principal" ? "Principal" : entry.name === "interest" ? "Interest" : "Balance"}:
              </span>
              <span className="font-medium text-slate-900">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const currentLoanInfo = LOAN_TYPES.find((l) => l.value === loanType);

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
              <Landmark className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Loan Calculator (EMI)</h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Calculate EMI, total interest, and full repayment schedule for personal, auto, student, or home loans.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Loan Type */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className=" font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Loan Type
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {LOAN_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setLoanType(type.value)}
                    className={`rounded-lg border px-3 py-2.5 font-medium transition-all mb-1.5 ${
                      loanType === type.value
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50/30"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {currentLoanInfo && (
                <p className="text-[11px] text-slate-400 mt-2">
                  Typical APR range: {currentLoanInfo.minApr}% – {currentLoanInfo.maxApr}%
                </p>
              )}
            </div>

            {/* Loan Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className=" font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Loan Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Loan Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="25000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Interest Rate (APR)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="10.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Loan Term (years)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="5"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[3, 5, 7, 10, 15, 30].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setYears(String(yr))}
                        className="rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-500 hover:border-amber-300 hover:bg-amber-50 transition-all"
                      >
                        {yr}yr
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
                "Amortization math",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-amber-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main EMI Card */}
            <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className=" font-semibold text-amber-600 uppercase tracking-wider mb-1">
                    Monthly EMI
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-amber-800 mb-2">
                    {formatCurrency(result.emi)}
                  </p>
                  <div className="flex gap-4 mt-2 text-amber-600">
                    <span>{y * 12} months</span>
                    <span>{r}% APR</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Total Interest</p>
                    <p className="text-base font-bold text-amber-700">{formatCurrency(result.totalInterest)}</p>
                  </div>
                  <div className="w-px bg-amber-200" />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Total Cost</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(result.totalPayment)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-[11px] text-blue-600 mb-0.5">Loan Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{formatCurrency(p)}</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                <p className="text-[11px] text-amber-600 mb-0.5">Total Interest</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-700">{formatCurrency(result.totalInterest)}</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-[11px] text-emerald-600 mb-0.5">Total Payment</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-700">{formatCurrency(result.totalPayment)}</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Stacked Area Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Principal vs. Interest
                </h3>
                <div className="w-full h-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                        <span className="text-[11px] text-slate-500">{String(value) === "principal" ? "Principal" : "Interest"}</span>
                      )} />
                      <Area type="monotone" dataKey="principal" stackId="1" stroke="#3b82f6" fill="url(#colorPrincipal)" strokeWidth={2} name="principal" />
                      <Area type="monotone" dataKey="interest" stackId="1" stroke="#f59e0b" fill="url(#colorInterest)" strokeWidth={2} name="interest" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Breakdown Donut */}
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
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{smartInsight}</p>
            </div>

            {/* Amortization Schedule Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-500" />
                  <div>
                    <h3 className=" font-semibold text-slate-900">Amortization Schedule</h3>
                    <p className=" text-slate-500">Month-by-month repayment breakdown</p>
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
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">EMI</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Principal</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Interest</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 font-medium text-slate-900">{row.month}</td>
                            <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.emi)}</td>
                            <td className="px-3 py-2 text-right text-blue-600">{formatCurrency(row.principal)}</td>
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

            {/* Loan Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Borrowing Tips
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: TrendingDown, title: "Shorter Term", desc: "Higher EMI but far less total interest paid over the life of the loan." },
                  { icon: Wallet, title: "Extra Payments", desc: "Even one extra EMI per year can shave months off your loan and save interest." },
                  { icon: Shield, title: "Credit Score", desc: "A score above 740 typically gets you the best APR rates. Check before applying." },
                ].map((tip, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <tip.icon className="h-4 w-4 text-amber-500 mb-3" />
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