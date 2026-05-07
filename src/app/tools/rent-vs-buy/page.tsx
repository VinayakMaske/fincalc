"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Percent,
  Home,
  Key,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Award,
  ArrowRightLeft,
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
interface YearlyComparison {
  year: number;
  rentCumulative: number;
  buyCumulative: number;
  homeValue: number;
  equity: number;
  netBuyCost: number;
  rentSavings: number;
  buySavings: number;
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

function calculateRentVsBuy(
  monthlyRent: number,
  rentIncrease: number,
  homePrice: number,
  downPayment: number,
  mortgageRate: number,
  loanTerm: number,
  propertyTax: number,
  maintenance: number,
  insurance: number,
  hoa: number,
  appreciation: number,
  investmentReturn: number,
  years: number
): {
  yearlyData: YearlyComparison[];
  rentTotal: number;
  buyTotal: number;
  equityFinal: number;
  homeValueFinal: number;
  winner: "rent" | "buy" | "tie";
  breakEvenYear: number | null;
} {
  const yearlyData: YearlyComparison[] = [];
  let rentCumulative = 0;
  let currentRent = monthlyRent;
  let loanAmount = homePrice - downPayment;
  let monthlyRate = mortgageRate / 100 / 12;
  let numPayments = loanTerm * 12;
  let monthlyMortgage = loanAmount > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;

  let homeValue = homePrice;
  let equity = downPayment;
  let loanBalance = loanAmount;
  let buyCumulative = downPayment;
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= years; year++) {
    // Rent side
    let yearRent = 0;
    for (let m = 0; m < 12; m++) {
      yearRent += currentRent;
      if ((year - 1) * 12 + m > 0 && ((year - 1) * 12 + m) % 12 === 0) {
        currentRent *= (1 + rentIncrease / 100);
      }
    }
    rentCumulative += yearRent;

    // Buy side
    let yearMortgage = monthlyMortgage * 12;
    let yearTax = homeValue * (propertyTax / 100);
    let yearMaint = homeValue * (maintenance / 100);
    let yearIns = insurance * 12;
    let yearHoa = hoa * 12;
    let yearBuyCost = yearMortgage + yearTax + yearMaint + yearIns + yearHoa;
    buyCumulative += yearBuyCost;

    // Pay down loan
    for (let m = 0; m < 12; m++) {
      if (loanBalance > 0) {
        let interest = loanBalance * monthlyRate;
        let principal = monthlyMortgage - interest;
        if (principal > loanBalance) principal = loanBalance;
        loanBalance = Math.max(0, loanBalance - principal);
        equity += principal;
      }
    }

    homeValue *= (1 + appreciation / 100);
    equity += (homeValue - homePrice * Math.pow(1 + appreciation / 100, year - 1)) - (homeValue - homePrice * Math.pow(1 + appreciation / 100, year - 1));

    let netBuyCost = buyCumulative - homeValue + loanBalance;
    let rentSavings = netBuyCost - rentCumulative;
    let buySavings = rentCumulative - netBuyCost;

    if (breakEvenYear === null && buySavings > 0) {
      breakEvenYear = year;
    }

    yearlyData.push({
      year,
      rentCumulative,
      buyCumulative,
      homeValue,
      equity,
      netBuyCost,
      rentSavings,
      buySavings,
    });
  }

  const final = yearlyData[years - 1];
  const rentTotal = final.rentCumulative;
  const buyTotal = final.buyCumulative - final.homeValue + loanBalance;

  return {
    yearlyData,
    rentTotal,
    buyTotal,
    equityFinal: final.equity,
    homeValueFinal: final.homeValue,
    winner: buyTotal < rentTotal ? "buy" : rentTotal < buyTotal ? "rent" : "tie",
    breakEvenYear,
  };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function RentVsBuyCalculatorPage() {
  const [monthlyRent, setMonthlyRent] = useState<string>("2500");
  const [rentIncrease, setRentIncrease] = useState<string>(("3"));
  const [homePrice, setHomePrice] = useState<string>("450000");
  const [downPayment, setDownPayment] = useState<string>("90000");
  const [mortgageRate, setMortgageRate] = useState<string>(("6.5"));
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [propertyTax, setPropertyTax] = useState<string>(("1.2"));
  const [maintenance, setMaintenance] = useState<string>(("1"));
  const [insurance, setInsurance] = useState<string>("150");
  const [hoa, setHoa] = useState<string>("0");
  const [appreciation, setAppreciation] = useState<string>(("3"));
  const [investmentReturn, setInvestmentReturn] = useState<string>(("7"));
  const [years, setYears] = useState<string>("10");
  const [showSchedule, setShowSchedule] = useState(false);

  const mr = Number(monthlyRent) || 0;
  const ri = Number(rentIncrease) || 0;
  const hp = Number(homePrice) || 0;
  const dp = Number(downPayment) || 0;
  const mr2 = Number(mortgageRate) || 0;
  const lt = Number(loanTerm) || 0;
  const pt = Number(propertyTax) || 0;
  const maint = Number(maintenance) || 0;
  const ins = Number(insurance) || 0;
  const hoaAmt = Number(hoa) || 0;
  const app = Number(appreciation) || 0;
  const invRet = Number(investmentReturn) || 0;
  const y = Number(years) || 0;

  const result = useMemo(
    () => calculateRentVsBuy(mr, ri, hp, dp, mr2, lt, pt, maint, ins, hoaAmt, app, invRet, y),
    [mr, ri, hp, dp, mr2, lt, pt, maint, ins, hoaAmt, app, invRet, y]
  );

  // Chart data
  const comparisonChartData = useMemo(() => {
    return result.yearlyData.map((d) => ({
      year: `Yr ${d.year}`,
      rent: d.rentCumulative,
      buy: d.netBuyCost,
      equity: d.equity,
    }));
  }, [result.yearlyData]);

  const savingsChartData = useMemo(() => {
    return result.yearlyData.map((d) => ({
      year: `Yr ${d.year}`,
      buySavings: d.buySavings > 0 ? d.buySavings : 0,
      rentSavings: d.rentSavings > 0 ? d.rentSavings : 0,
    }));
  }, [result.yearlyData]);

  // Smart insight
  const smartInsight = useMemo(() => {
    if (hp === 0 || mr === 0) return "Enter rent and home price to compare buying vs. renting.";
    if (result.winner === "buy") {
      return `Buying wins by ${formatCurrency(result.rentTotal - result.buyTotal)} over ${y} years. Break-even at year ${result.breakEvenYear || "—"}. Your home equity grows to ${formatCurrency(result.equityFinal)}.`;
    }
    if (result.winner === "rent") {
      const downPaymentOpportunity = dp * Math.pow(1 + invRet / 100, y) - dp;
      return `Renting saves ${formatCurrency(result.buyTotal - result.rentTotal)} over ${y} years. Invest that ${formatCurrency(dp)} down payment at ${invRet}% and it grows to ${formatCurrency(dp + downPaymentOpportunity)}.`;
    }
    return `Costs are nearly identical. The decision comes down to lifestyle preference, mobility needs, and local market conditions.`;
  }, [hp, mr, result, y, dp, invRet]);

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

  const monthlyMortgage = useMemo(() => {
    const loanAmount = hp - dp;
    const monthlyRate = mr2 / 100 / 12;
    const numPayments = lt * 12;
    if (loanAmount <= 0 || mr2 <= 0) return 0;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [hp, dp, mr2, lt]);

  const monthlyBuyCost = monthlyMortgage + (hp * pt / 100 / 12) + (hp * maint / 100 / 12) + ins + hoaAmt;

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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 border border-orange-200">
              <ArrowRightLeft className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">Free Calculator</p>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Rent vs. Buy Calculator</h1>
            </div>
          </div>
          <p className="text-slate-500 mt-2 max-w-xl">
            Should you rent or buy? Compare total costs over time including home appreciation, maintenance, and opportunity cost.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Rent Side */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Renting
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Monthly Rent</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="2500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Annual Rent Increase</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={rentIncrease}
                      onChange={(e) => setRentIncrease(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buy Side */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Buying
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Home Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="450000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Down Payment</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="90000"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {hp > 0 ? `${((dp / hp) * 100).toFixed(0)}% down` : ""}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Mortgage Rate</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={mortgageRate}
                      onChange={(e) => setMortgageRate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="6.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Loan Term</label>
                  <div className="flex gap-1.5">
                    {[15, 20, 30].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setLoanTerm(String(yr))}
                        className={`rounded-md border px-2 py-1 text-[10px] transition-all ${
                          lt === yr
                            ? "border-orange-300 bg-orange-50 text-orange-700"
                            : "border-slate-200 text-slate-500 hover:border-orange-300 hover:bg-orange-50"
                        }`}
                      >
                        {yr}yr
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership Costs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Ownership Costs
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Property Tax (%/year)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="1.2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Maintenance (%/year)</label>
                  <div className="relative">
                    <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={maintenance}
                      onChange={(e) => setMaintenance(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">Insurance/mo</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">HOA/mo</label>
                    <input
                      type="number"
                      value={hoa}
                      onChange={(e) => setHoa(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Market Assumptions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Market Assumptions
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Home Appreciation (%/year)</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={appreciation}
                      onChange={(e) => setAppreciation(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="3"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Investment Return (%/year)</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={investmentReturn}
                      onChange={(e) => setInvestmentReturn(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-12 pr-3 text-sm text-slate-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="7"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">What you could earn investing the down payment</p>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Comparison Period (years)</label>
                  <div className="flex gap-1.5">
                    {[5, 10, 15, 20, 30].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setYears(String(yr))}
                        className={`rounded-md border px-2 py-1 text-[10px] transition-all ${
                          y === yr
                            ? "border-orange-300 bg-orange-50 text-orange-700"
                            : "border-slate-200 text-slate-500 hover:border-orange-300 hover:bg-orange-50"
                        }`}
                      >
                        {yr}yr
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                "100% Private",
                "Instant results",
                "Full cost analysis",
              ].map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-orange-400" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Winner Card */}
            <div className={`rounded-2xl border p-6 sm:p-8 ${
              result.winner === "buy"
                ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
                : result.winner === "rent"
                ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
                : "border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className={`font-semibold uppercase tracking-wider mb-2 ${
                    result.winner === "buy" ? "text-emerald-600" : result.winner === "rent" ? "text-orange-600" : "text-slate-600"
                  }`}>
                    Winner: {result.winner === "buy" ? "Buying" : result.winner === "rent" ? "Renting" : "Tie"}
                  </p>
                  <p className={`text-4xl sm:text-5xl font-bold mb-2 ${
                    result.winner === "buy" ? "text-emerald-800" : result.winner === "rent" ? "text-orange-800" : "text-slate-800"
                  }`}>
                    {formatCurrency(Math.abs(result.rentTotal - result.buyTotal))}
                  </p>
                  <p className={`mt-2 ${
                    result.winner === "buy" ? "text-emerald-600" : result.winner === "rent" ? "text-orange-600" : "text-slate-600"
                  }`}>
                    {result.winner === "buy"
                      ? `Buying saves this much over ${y} years`
                      : result.winner === "rent"
                      ? `Renting saves this much over ${y} years`
                      : "Costs are nearly equal"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Break-Even</p>
                    <p className="text-base font-bold text-slate-900">
                      {result.breakEvenYear ? `Year ${result.breakEvenYear}` : "—"}
                    </p>
                  </div>
                  <div className={`w-px ${result.winner === "buy" ? "bg-emerald-200" : "bg-orange-200"}`} />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500">Home Equity</p>
                    <p className="text-base font-bold text-slate-900">{formatCurrency(result.equityFinal)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-[11px] text-orange-600 mb-1 font-semibold uppercase tracking-wider">Monthly Rent</p>
                <p className="text-2xl font-bold text-orange-700">{formatCurrency(mr)}</p>
                <p className="text-[10px] text-orange-500 mt-0.5">+{ri}%/year increase</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-[11px] text-emerald-600 mb-1 font-semibold uppercase tracking-wider">Monthly Buy Cost</p>
                <p className="text-2xl font-bold text-emerald-700">{formatCurrency(monthlyBuyCost)}</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">Mortgage + tax + maint + ins</p>
              </div>
            </div>

            {/* Total Cost Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] text-slate-500 mb-2 font-semibold uppercase tracking-wider">Total Rent Cost</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(result.rentTotal)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Over {y} years, no equity</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] text-slate-500 mb-2 font-semibold uppercase tracking-wider">Total Buy Cost (Net)</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(result.buyTotal)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Home value: {formatCurrency(result.homeValueFinal)}</p>
              </div>
            </div>

            {/* Cost Comparison Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Cumulative Cost Over Time
              </h3>
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={comparisonChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                      <span className="text-[11px] text-slate-500">{String(value) === "rent" ? "Renting" : String(value) === "buy" ? "Buying (Net)" : "Equity"}</span>
                    )} />
                    <Area type="monotone" dataKey="rent" stackId="1" stroke="#f97316" fill="url(#colorRent)" strokeWidth={2} name="rent" />
                    <Area type="monotone" dataKey="buy" stackId="1" stroke="#10b981" fill="url(#colorBuy)" strokeWidth={2} name="buy" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Savings Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Annual Advantage
              </h3>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={24} iconType="circle" formatter={(value: any) => (
                      <span className="text-[11px] text-slate-500">{String(value) === "buySavings" ? "Buy Advantage" : "Rent Advantage"}</span>
                    )} />
                    <Bar dataKey="buySavings" fill="#10b981" radius={[4, 4, 0, 0]} name="buySavings" />
                    <Bar dataKey="rentSavings" fill="#f97316" radius={[4, 4, 0, 0]} name="rentSavings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-4 flex items-start gap-3">
              <Zap className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <p className=" text-orange-700">{smartInsight}</p>
            </div>

            {/* Yearly Breakdown Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Yearly Breakdown</h3>
                    <p className=" text-slate-500">Detailed year-by-year cost comparison</p>
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
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Rent Cost</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Buy (Net)</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Home Value</th>
                          <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Equity</th>
                          <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Winner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.yearlyData.map((row) => {
                          const winner = row.buySavings > 0 ? "buy" : row.rentSavings > 0 ? "rent" : "tie";
                          return (
                            <tr key={row.year} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2 font-medium text-slate-900">{row.year}</td>
                              <td className="px-3 py-2 text-right text-orange-600">{formatCurrency(row.rentCumulative)}</td>
                              <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(row.netBuyCost)}</td>
                              <td className="px-3 py-2 text-right text-blue-600">{formatCurrency(row.homeValue)}</td>
                              <td className="px-3 py-2 text-right font-bold text-slate-900">{formatCurrency(row.equity)}</td>
                              <td className="px-3 py-2 text-center">
                                {winner === "buy" ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Buy</span>
                                ) : winner === "rent" ? (
                                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">Rent</span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">Tie</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Decision Tips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-500 uppercase tracking-wider mb-3">
                When to Rent vs. Buy
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Key, title: "Rent If...", items: ["You move every 2-3 years", "You have unstable income", "Home prices are declining", "Maintenance costs worry you"] },
                  { icon: Home, title: "Buy If...", items: ["You plan to stay 5+ years", "You have stable employment", "You want to build equity", "You can handle maintenance"] },
                ].map((section, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <section.icon className="h-4 w-4 text-orange-500 mb-3" />
                    <p className="font-semibold text-slate-900 mb-2">{section.title}</p>
                    <ul className="space-y-1">
                      {section.items.map((item, j) => (
                        <li key={j} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                          <span className="text-orange-400 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
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