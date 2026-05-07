"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  Download,
  Calculator,
  ChevronRight,
  Info,
  CheckCircle2,
  Shield,
  Clock,
  BarChart3,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  let monthlyPayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let amortization: AmortizationRow[] = [];

  if (annualRate === 0) {
    monthlyPayment = principal / numPayments;
    totalPayment = principal;
    totalInterest = 0;
    let balance = principal;
    let cumInterest = 0;
    for (let i = 1; i <= numPayments; i++) {
      const pmt = monthlyPayment;
      const interest = 0;
      const princ = pmt;
      balance -= princ;
      if (balance < 0.01) balance = 0;
      amortization.push({
        month: i,
        payment: pmt,
        principal: princ,
        interest,
        balance,
        totalInterest: cumInterest,
      });
    }
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    totalPayment = monthlyPayment * numPayments;
    totalInterest = totalPayment - principal;

    let balance = principal;
    let cumInterest = 0;
    for (let i = 1; i <= numPayments; i++) {
      const interest = balance * monthlyRate;
      const princ = monthlyPayment - interest;
      balance -= princ;
      cumInterest += interest;
      if (balance < 0.01) balance = 0;
      amortization.push({
        month: i,
        payment: monthlyPayment,
        principal: princ,
        interest,
        balance,
        totalInterest: cumInterest,
      });
    }
  }

  return { monthlyPayment, totalPayment, totalInterest, amortization };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState<string>("400000");
  const [downPayment, setDownPayment] = useState<string>("80000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [propertyTax, setPropertyTax] = useState<string>("2400");
  const [homeInsurance, setHomeInsurance] = useState<string>("1200");
  const [hoaFees, setHoaFees] = useState<string>("0");
  const [showAmortization, setShowAmortization] = useState(false);

  // Derived values
  const principal = Math.max(0, Number(homePrice) - Number(downPayment));
  const rate = Number(interestRate) || 0;
  const years = Number(loanTerm) || 30;

  const result = useMemo(
    () => calculateMortgage(principal, rate, years),
    [principal, rate, years]
  );

  const monthlyTax = Number(propertyTax) / 12;
  const monthlyInsurance = Number(homeInsurance) / 12;
  const monthlyHOA = Number(hoaFees);
  const totalMonthlyPayment =
    result.monthlyPayment + monthlyTax + monthlyInsurance + monthlyHOA;

  const loanToValue = Number(homePrice) > 0
    ? (principal / Number(homePrice)) * 100
    : 0;

  // Pie chart data for cost breakdown
  const breakdown = [
    { label: "Principal & Interest", value: result.monthlyPayment, color: "bg-emerald-500" },
    { label: "Property Tax", value: monthlyTax, color: "bg-blue-500" },
    { label: "Home Insurance", value: monthlyInsurance, color: "bg-amber-500" },
    { label: "HOA Fees", value: monthlyHOA, color: "bg-rose-500" },
  ].filter((d) => d.value > 0);

  const totalBreakdown = breakdown.reduce((s, d) => s + d.value, 0);

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
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
              <Home className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Free Calculator
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Mortgage Calculator
              </h1>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl">
            Estimate your monthly mortgage payment, total interest, and full amortization schedule.
            Adjust down payment, interest rate, and loan term to see how they affect your payment.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Loan Details
              </h2>

              <div className="space-y-5">
                {/* Home Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Home Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-3"
                      placeholder="400000"
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Down Payment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="80000"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    Loan amount: {formatCurrency(principal)} · LTV: {loanToValue.toFixed(1)}%
                  </p>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-3"
                      placeholder="6.5"
                    />
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Loan Term (Years)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none mb-3"
                    >
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="25">25 Years</option>
                      <option value="30">30 Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Additional Costs (Yearly)
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Property Tax
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-3"
                      placeholder="2400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Home Insurance
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-3"
                      placeholder="1200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    HOA Fees (Monthly)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-3"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              {[
                { icon: Shield, text: "100% Private — No data stored" },
                { icon: Clock, text: "Instant results as you type" },
                { icon: CheckCircle2, text: "USA mortgage formulas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <item.icon className="h-4 w-4 text-emerald-500 shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result Card */}
            <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 p-8 mb-5">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                    Estimated Monthly Payment
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-emerald-800 mb-2">
                    {formatCurrency(totalMonthlyPayment)}
                  </p>
                  <p className="text-sm text-emerald-600 mt-2">
                    Principal & Interest: {formatCurrency(result.monthlyPayment)}
                    {monthlyTax + monthlyInsurance + monthlyHOA > 0 && (
                      <span className="ml-2">
                        + Tax/Ins/HOA: {formatCurrency(monthlyTax + monthlyInsurance + monthlyHOA)}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="rounded-xl bg-white/80 border border-emerald-200 p-4">
                    <p className="text-xs text-slate-500">Total Payment</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.totalPayment)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 border border-emerald-200 p-4">
                    <p className="text-xs text-slate-500">Total Interest</p>
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
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Monthly Breakdown
                </h3>
                <div className="space-y-3">
                  {breakdown.map((item) => {
                    const pct = totalBreakdown > 0 ? (item.value / totalBreakdown) * 100 : 0;
                    return (
                      <div className="items-center" key={item.label}>
                        <div className="flex flex-col items-center mb-1">
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Stats */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-emerald-600" />
                  Loan Summary
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Loan Amount", value: formatCurrency(principal) },
                    { label: "Down Payment", value: formatCurrency(Number(downPayment)) },
                    { label: "Down Payment %", value: `${((Number(downPayment) / Number(homePrice)) * 100).toFixed(1)}%` },
                    { label: "Interest Rate", value: `${rate}%` },
                    { label: "Loan Term", value: `${years} Years` },
                    { label: "No of Payments", value: `${years * 12}` },
                    { label: "Payoff Date", value: new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className=" text-slate-600 items-center">{stat.label}</span>
                      <span className=" font-semibold text-slate-900 items-center">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Amortization Toggle — FIXED SIZE with both scroll directions */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-5">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Full Amortization Schedule
                    </h3>
                    <p className="text-sm text-slate-500">
                      {result.amortization.length} monthly payments
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    showAmortization ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showAmortization && (
                <div className="border-t border-slate-200">
                  {/* Fixed height + width container with overflow in both directions */}
                  <div className="h-[400px] overflow-auto">
                    <table className="w-full min-w-[600px] text-sm">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Payment
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Principal
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Interest
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.amortization.map((row) => (
                          <tr key={row.month} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {row.month}
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-700">
                              {formatCurrency(row.payment)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">
                              {formatCurrency(row.principal)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-rose-500">
                              {formatCurrency(row.interest)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-slate-900">
                              {formatCurrency(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  term: 15,
                  label: "15-Year Fixed",
                  benefit: "Save on total interest",
                },
                {
                  term: 30,
                  label: "30-Year Fixed",
                  benefit: "Lower monthly payment",
                },
              ].map((opt) => {
                const optResult = calculateMortgage(principal, rate, opt.term);
                const optTotal = optResult.monthlyPayment + monthlyTax + monthlyInsurance + monthlyHOA;
                return (
                  <div
                    key={opt.term}
                    className={`rounded-2xl border p-4 ${
                      Number(loanTerm) === opt.term
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {formatCurrency(optTotal)}
                      <span className="text-sm font-normal text-slate-500">/mo</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Total interest: {formatCurrency(optResult.totalInterest)}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                      {opt.benefit}
                    </p>
                  </div>
                );
              })}
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