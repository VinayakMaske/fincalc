"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowLeft,
  DollarSign,
  Percent,
  Calendar,
  PiggyBank,
  BarChart3,
  Info,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Shield,
  Clock,
  Target,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface YearlyRow {
  year: number;
  startBalance: number;
  contribution: number;
  interestEarned: number;
  endBalance: number;
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

function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number,
  monthlyContribution: number,
  compoundFrequency: number
) {
  const rows: YearlyRow[] = [];
  let balance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  const periodsPerYear = compoundFrequency;
  const ratePerPeriod = rate / 100 / periodsPerYear;
  const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear);

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    let yearContribution = 0;
    let yearInterest = 0;

    for (let p = 0; p < periodsPerYear; p++) {
      balance += contributionPerPeriod;
      yearContribution += contributionPerPeriod;
      const interest = balance * ratePerPeriod;
      balance += interest;
      yearInterest += interest;
    }

    totalContributions += yearContribution;
    totalInterest += yearInterest;

    rows.push({
      year,
      startBalance,
      contribution: yearContribution,
      interestEarned: yearInterest,
      endBalance: balance,
    });
  }

  return { rows, totalContributions, totalInterest, finalBalance: balance };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function CompoundInterestPage() {
  const [principal, setPrincipal] = useState<string>("10000");
  const [rate, setRate] = useState<string>("7");
  const [years, setYears] = useState<string>("20");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("500");
  const [compoundFrequency, setCompoundFrequency] = useState<string>("12");
  const [showSchedule, setShowSchedule] = useState(false);

  const p = Number(principal) || 0;
  const r = Number(rate) || 0;
  const y = Number(years) || 0;
  const mc = Number(monthlyContribution) || 0;
  const freq = Number(compoundFrequency) || 12;

  const result = useMemo(
    () => calculateCompoundInterest(p, r, y, mc, freq),
    [p, r, y, mc, freq]
  );

  const withoutInterest = p + mc * 12 * y;
  const interestGain = result.finalBalance - withoutInterest;

  // Breakdown data
  const breakdown = [
    { label: "Initial Investment", value: p, color: "bg-blue-500" },
    { label: "Total Contributions", value: result.totalContributions - p, color: "bg-emerald-500" },
    { label: "Interest Earned", value: result.totalInterest, color: "bg-amber-500" },
  ].filter((d) => d.value > 0);

  const totalBreakdown = breakdown.reduce((s, d) => s + d.value, 0);

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
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Free Calculator
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Compound Interest Calculator
              </h1>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl">
            See how your money grows over time with compound interest. Add monthly contributions
            to see the power of consistent investing. Perfect for savings goals and retirement planning.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Investment Details
              </h2>

              <div className="space-y-5">
                {/* Initial Investment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Initial Investment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-3"
                      placeholder="10000"
                    />
                  </div>
                </div>

                {/* Monthly Contribution */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Monthly Contribution
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="500"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mb-3 mt-1">
                    Total contributions: {formatCurrency(mc * 12 * y)}
                  </p>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Annual Interest Rate (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm mb-3 text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="7"
                    />
                  </div>
                </div>

                {/* Years */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Time Period (Years)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm mb-3 text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="20"
                    />
                  </div>
                </div>

                {/* Compound Frequency */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Compound Frequency
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={compoundFrequency}
                      onChange={(e) => setCompoundFrequency(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm mb-3 text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                    >
                      <option value="1">Annually</option>
                      <option value="2">Semi-Annually</option>
                      <option value="4">Quarterly</option>
                      <option value="12">Monthly</option>
                      <option value="365">Daily</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-3">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Quick Scenarios
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Conservative (4%)", r: "4", mc: "300" },
                  { label: "Moderate (7%)", r: "7", mc: "500" },
                  { label: "Aggressive (10%)", r: "10", mc: "1000" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setRate(preset.r);
                      setMonthlyContribution(preset.mc);
                    }}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm mb-3 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  >
                    <span className="text-slate-700">{preset.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              {[
                { icon: Shield, text: "100% Private — No data stored" },
                { icon: Clock, text: "Instant results as you type" },
                { icon: CheckCircle2, text: "Standard compound interest formulas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <item.icon className="h-4 w-4 text-blue-500 shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result Card */}
            <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-sky-50 p-8 mb-5">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-2">
                    Final Balance
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-blue-800 mb-2">
                    {formatCurrency(result.finalBalance)}
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    You will earn {formatCurrency(interestGain)} in interest
                    ({((interestGain / result.finalBalance) * 100).toFixed(1)}% of final balance)
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="rounded-xl bg-white/80 border border-blue-200 p-4">
                    <p className="text-xs text-slate-500">Total Invested</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.totalContributions)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 border border-blue-200 p-4">
                    <p className="text-xs text-slate-500">Interest Earned</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Visual Breakdown */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Balance Breakdown
                </h3>
                <div className="space-y-3">
                  {breakdown.map((item) => {
                    const pct = totalBreakdown > 0 ? (item.value / totalBreakdown) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex flex-col items-center text-sm mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-medium text-slate-900">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{pct.toFixed(1)}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Stats */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Investment Summary
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Initial Investment", value: formatCurrency(p) },
                    { label: "Monthly Contribution", value: formatCurrency(mc) },
                    { label: "Annual Rate", value: `${r}%` },
                    { label: "Time Period", value: `${y} Years` },
                    { label: "Comp Frequency", value: freq === 1 ? "Annually" : freq === 12 ? "Monthly" : freq === 365 ? "Daily" : `${freq}x/Year` },
                    { label: "Total Contributions", value: formatCurrency(result.totalContributions) },
                    { label: "Interest vs Principal", value: `${((result.totalInterest / result.totalContributions) * 100).toFixed(1)}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className="text-sm text-slate-600">{stat.label}</span>
                      <span className="text-sm font-semibold text-slate-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Yearly Growth Visualization */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Growth Over Time
              </h3>
              <div className="space-y-3">
                {result.rows.length <= 10
                  ? result.rows.map((row) => {
                      const maxBalance = result.rows[result.rows.length - 1]?.endBalance || 1;
                      const pct = (row.endBalance / maxBalance) * 100;
                      return (
                        <div key={row.year} className="flex items-center gap-4">
                          <span className="text-sm font-medium text-slate-500 w-12 shrink-0">
                            Yr {row.year}
                          </span>
                          <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                            <div
                              className="h-full bg-linear-to-r from-blue-500 to-emerald-500 rounded-lg transition-all duration-500 flex items-center"
                              style={{ width: `${pct}%` }}
                            >
                              <span className="text-xs font-bold text-white ml-2 whitespace-nowrap">
                                {formatCurrency(row.endBalance)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : // For many years, show every Nth year
                    result.rows
                      .filter((_, i) => i === 0 || i === result.rows.length - 1 || (i + 1) % Math.ceil(result.rows.length / 10) === 0)
                      .map((row) => {
                        const maxBalance = result.rows[result.rows.length - 1]?.endBalance || 1;
                        const pct = (row.endBalance / maxBalance) * 100;
                        return (
                          <div key={row.year} className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-500 w-12 shrink-0">
                              Yr {row.year}
                            </span>
                            <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden relative">
                              <div
                                className="h-full bg-linear-to-r from-blue-500 to-emerald-500 rounded-lg transition-all duration-500 flex items-center"
                                style={{ width: `${pct}%` }}
                              >
                                <span className="text-xs font-bold text-slate-600 ml-10 p-4 whitespace-nowrap">
                                  {formatCurrency(row.endBalance)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
              </div>
            </div>

            {/* Yearly Schedule Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-5">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Year-by-Year Breakdown
                    </h3>
                    <p className="text-sm text-slate-500">
                      {result.rows.length} years of detailed growth
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    showSchedule ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showSchedule && (
                <div className="border-t border-slate-200">
                  <div className="max-h-125 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Year
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Start Balance
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Contributions
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Interest
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            End Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.rows.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {row.year}
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-700">
                              {formatCurrency(row.startBalance)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-emerald-600">
                              {formatCurrency(row.contribution)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-amber-600">
                              {formatCurrency(row.interestEarned)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                              {formatCurrency(row.endBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison: With vs Without Compound Interest */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-blue-600" />
                The Power of Compound Interest
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500 mb-1">Without Compound Interest</p>
                  <p className="text-2xl font-bold text-slate-700">
                    {formatCurrency(withoutInterest)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Simple sum of principal + contributions
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-600 mb-1">With Compound Interest</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(result.finalBalance)}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1">
                    Extra {formatCurrency(interestGain)} earned!
                  </p>
                </div>
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
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
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