"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  Shield,
  CheckCircle2,
  Zap,
  ChevronRight,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────
type PayFrequency = "hourly" | "weekly" | "biweekly" | "semi-monthly" | "monthly" | "annual";
type FilingStatus = "single" | "married_joint";

interface TaxEstimate {
  federalTax: number;
  ficaTax: number;
  medicareTax: number;
  stateTax: number;
  netPay: number;
  effectiveRate: number;
}

// ─── Constants ───────────────────────────────────────────────────────
const HOURS_PER_WEEK = 40;
const WEEKS_PER_YEAR = 52;

const FEDERAL_BRACKETS_2025: Record<FilingStatus, { rate: number; min: number; max: number }[]> = {
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
};

const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15750,
  married_joint: 31500,
};

const FICA_RATE = 0.062; // Social Security (up to wage base)
const MEDICARE_RATE = 0.0145; // Medicare (no cap)
const SS_WAGE_BASE_2025 = 176100;
const ADDITIONAL_MEDICARE_RATE = 0.009; // For income > $200k/$250k

const STATE_TAX_ESTIMATE = 0.05; // Rough average state tax estimate

// ─── Helpers ─────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function convertToAnnual(amount: number, frequency: PayFrequency): number {
  switch (frequency) {
    case "hourly": return amount * HOURS_PER_WEEK * WEEKS_PER_YEAR;
    case "weekly": return amount * WEEKS_PER_YEAR;
    case "biweekly": return amount * (WEEKS_PER_YEAR / 2);
    case "semi-monthly": return amount * 24;
    case "monthly": return amount * 12;
    case "annual": return amount;
  }
}

function convertFromAnnual(annual: number, frequency: PayFrequency): number {
  switch (frequency) {
    case "hourly": return annual / (HOURS_PER_WEEK * WEEKS_PER_YEAR);
    case "weekly": return annual / WEEKS_PER_YEAR;
    case "biweekly": return annual / (WEEKS_PER_YEAR / 2);
    case "semi-monthly": return annual / 24;
    case "monthly": return annual / 12;
    case "annual": return annual;
  }
}

function calculateTaxes(annualGross: number, filingStatus: FilingStatus): TaxEstimate {
  const standardDeduction = STANDARD_DEDUCTION_2025[filingStatus];
  const taxableIncome = Math.max(0, annualGross - standardDeduction);

  let federalTax = 0;
  for (const bracket of FEDERAL_BRACKETS_2025[filingStatus]) {
    if (taxableIncome <= bracket.min) break;
    const amountInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    federalTax += amountInBracket * bracket.rate;
  }

  const ficaTax = Math.min(annualGross, SS_WAGE_BASE_2025) * FICA_RATE;
  let medicareTax = annualGross * MEDICARE_RATE;

  const additionalMedicareThreshold = filingStatus === "married_joint" ? 250000 : 200000;
  if (annualGross > additionalMedicareThreshold) {
    medicareTax += (annualGross - additionalMedicareThreshold) * ADDITIONAL_MEDICARE_RATE;
  }

  const stateTax = annualGross * STATE_TAX_ESTIMATE;
  const totalTax = federalTax + ficaTax + medicareTax + stateTax;
  const netPay = annualGross - totalTax;

  return {
    federalTax,
    ficaTax,
    medicareTax,
    stateTax,
    netPay,
    effectiveRate: annualGross > 0 ? (totalTax / annualGross) * 100 : 0,
  };
}

const FREQUENCY_LABELS: Record<PayFrequency, string> = {
  hourly: "Hourly",
  weekly: "Weekly",
  biweekly: "Biweekly",
  "semi-monthly": "Semi-Monthly",
  monthly: "Monthly",
  annual: "Annual",
};

// ─── Main Component ──────────────────────────────────────────────────
export default function SalaryCalculatorPage() {
  const [amount, setAmount] = useState<string>("30");
  const [frequency, setFrequency] = useState<PayFrequency>("hourly");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const amt = Number(amount) || 0;
  const annualSalary = convertToAnnual(amt, frequency);
  const taxes = useMemo(() => calculateTaxes(annualSalary, filingStatus), [annualSalary, filingStatus]);

  // All frequencies breakdown
  const allFrequencies = useMemo(() => {
    const freqs: PayFrequency[] = ["hourly", "weekly", "biweekly", "semi-monthly", "monthly", "annual"];
    return freqs.map((f) => ({
      label: FREQUENCY_LABELS[f],
      gross: convertFromAnnual(annualSalary, f),
      net: convertFromAnnual(taxes.netPay, f),
    }));
  }, [annualSalary, taxes.netPay]);

  // Chart data
  const taxChartData = useMemo(() => [
    { name: "Federal", value: taxes.federalTax, color: "#ef4444" },
    { name: "FICA (SS)", value: taxes.ficaTax, color: "#f59e0b" },
    { name: "Medicare", value: taxes.medicareTax, color: "#8b5cf6" },
    { name: "State (est.)", value: taxes.stateTax, color: "#3b82f6" },
    { name: "Take Home", value: taxes.netPay, color: "#10b981" },
  ], [taxes]);

  const DONUT_COLORS = ["#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6", "#10b981"];

  // Smart insight
  const smartInsight = useMemo(() => {
    if (annualSalary === 0) return "Enter your wage to see salary conversions and tax estimates.";
    const hourlyRate = convertFromAnnual(annualSalary, "hourly");
    if (frequency === "hourly" && hourlyRate < 15) {
      return `At $${hourlyRate.toFixed(2)}/hour, your annual equivalent is ${formatCurrency(annualSalary)}. Federal minimum wage is $7.25 — but many states require $15+.`;
    }
    if (taxes.effectiveRate > 25) {
      return `Your effective tax rate is ${taxes.effectiveRate.toFixed(1)}%. At ${formatCurrency(annualSalary)}, you are in a higher bracket. Consider pre-tax deductions (401k, HSA) to reduce taxable income.`;
    }
    return `Gross: ${formatCurrency(annualSalary)}/year. After taxes: ${formatCurrency(taxes.netPay)}/year (${formatCurrency(convertFromAnnual(taxes.netPay, "monthly"))}/month). Effective rate: ${taxes.effectiveRate.toFixed(1)}%.`;
  }, [annualSalary, taxes, frequency]);

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-200">
              <Briefcase className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Salary & Paycheck Calculator</h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">
            Convert hourly wage to annual salary and vice versa. Includes federal tax withholding, FICA, and Medicare estimates for USA workers.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Wage Input */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Your Wage
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      placeholder="30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-2">Frequency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(FREQUENCY_LABELS) as PayFrequency[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`rounded-lg border py-2 font-medium transition-all ${
                          frequency === f
                            ? "border-teal-300 bg-teal-50 text-teal-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/30"
                        }`}
                      >
                        {FREQUENCY_LABELS[f]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filing Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Tax Setup
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: "single" as FilingStatus, label: "Single" },
                  { value: "married_joint" as FilingStatus, label: "Married Joint" },
                ]).map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setFilingStatus(status.value)}
                    className={`rounded-lg border px-3 py-2.5 font-medium transition-all ${
                      filingStatus === status.value
                        ? "border-teal-300 bg-teal-50 text-teal-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50/30"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Standard deduction: {formatCurrency(STANDARD_DEDUCTION_2025[filingStatus])} (2025)
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                "100% Private",
                "Instant results",
                "2025 IRS brackets",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-teal-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-12 space-y-4">
            {/* Main Salary Card */}
            <div className="rounded-2xl border border-teal-200 bg-linear-to-br from-teal-50 to-cyan-50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-teal-600 uppercase tracking-wider mb-2">
                    Annual Salary Equivalent
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-teal-800">
                    {formatCurrency(annualSalary)}
                  </p>
                  <div className="flex gap-4 mt-4 text-teal-600">
                    <span>${convertFromAnnual(annualSalary, "hourly").toFixed(2)}/hour</span>
                    <span>{formatCurrency(convertFromAnnual(annualSalary, "monthly"))}/month</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text- text-lg-slate-500">Gross</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(annualSalary)}</p>
                  </div>
                  <div className="w-px bg-teal-200" />
                  <div className="text-right">
                    <p className="text-lg text-slate-500">Net (est.)</p>
                    <p className="text-base font-bold text-emerald-600">{formatCurrency(taxes.netPay)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Frequency Conversion Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allFrequencies.filter((f) => f.label !== "Annual").map((f) => (
                <div key={f.label} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[11px] text-slate-500 mb-0.5">{f.label}</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(f.gross)}</p>
                  <p className="text-[10px] text-emerald-600">Net: {formatCurrency(f.net)}</p>
                </div>
              ))}
            </div>

            {/* Tax Breakdown Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Annual Tax Breakdown
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Donut */}
                <div className="w-full h-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taxChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="85%"
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {taxChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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

                {/* Tax Detail List */}
                <div className="space-y-3">
                  {[
                    { label: "Federal Income Tax", value: taxes.federalTax, color: "bg-red-500" },
                    { label: "Social Security (FICA)", value: taxes.ficaTax, color: "bg-amber-500" },
                    { label: "Medicare", value: taxes.medicareTax, color: "bg-violet-500" },
                    { label: "State Tax (est. 5%)", value: taxes.stateTax, color: "bg-blue-500" },
                    { label: "Take Home Pay", value: taxes.netPay, color: "bg-emerald-500" },
                  ].map((item) => {
                    const pct = annualSalary > 0 ? (item.value / annualSalary) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex flex-col items-center text-sm mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-medium text-slate-900">{formatCurrency(item.value)}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{pct.toFixed(1)}% of gross</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
              <p className="text-sm text-teal-700">{smartInsight}</p>
            </div>

            {/* Paycheck Breakdown Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Landmark className="h-5 w-5 text-teal-500" />
                  <div>
                    <h3 className=" font-semibold text-slate-900">Paycheck Breakdown</h3>
                    <p className=" text-slate-500">Per-period withholding estimate</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showBreakdown ? "rotate-90" : ""}`} />
              </button>

              {showBreakdown && (
                <div className="border-t border-slate-200">
                  <div className="p-5">
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { label: "Biweekly Gross", gross: convertFromAnnual(annualSalary, "biweekly"), net: convertFromAnnual(taxes.netPay, "biweekly") },
                        { label: "Monthly Gross", gross: convertFromAnnual(annualSalary, "monthly"), net: convertFromAnnual(taxes.netPay, "monthly") },
                        { label: "Weekly Gross", gross: convertFromAnnual(annualSalary, "weekly"), net: convertFromAnnual(taxes.netPay, "weekly") },
                      ].map((period) => (
                        <div key={period.label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-500 mb-2">{period.label}</p>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Gross</span>
                              <span className="font-medium text-slate-900">{formatCurrency(period.gross)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Net (est.)</span>
                              <span className="font-medium text-emerald-600">{formatCurrency(period.net)}</span>
                            </div>
                            <div className="h-px bg-slate-200 my-1" />
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Withheld</span>
                              <span className="font-medium text-red-500">{formatCurrency(period.gross - period.net)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tax Notes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Important Notes
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Users, title: "FICA (Social Security)", desc: "6.2% on first $176,100 of wages (2025 wage base). No tax above that." },
                  { icon: Shield, title: "Medicare", desc: "1.45% on all wages. Additional 0.9% for income over $200k/$250k." },
                  { icon: TrendingUp, title: "State Tax", desc: "Estimated at 5% average. Your actual state tax varies (0% in TX, FL, WA vs. 13% in CA)." },
                ].map((note, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <note.icon className="h-4 w-4 text-teal-500 mb-3" />
                    <p className="text-xs font-semibold text-slate-900">{note.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{note.desc}</p>
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