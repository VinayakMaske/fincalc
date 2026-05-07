"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PiggyBank,
  ArrowLeft,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  Briefcase,
  Target,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Shield,
  Clock,
  Award,
  User,
  Building2,
  BarChart3,
  Info,
  Zap,
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
interface YearlyRow {
  age: number;
  startBalance: number;
  employeeContribution: number;
  employerMatch: number;
  totalContribution: number;
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

function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  annualSalary: number,
  contributionPercent: number,
  employerMatchPercent: number,
  employerMatchLimit: number,
  expectedReturn: number,
  salaryGrowth: number
) {
  const rows: YearlyRow[] = [];
  let balance = currentBalance;
  let salary = annualSalary;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;
  let totalInterest = 0;

  for (let age = currentAge + 1; age <= retirementAge; age++) {
    salary = salary * (1 + salaryGrowth / 100);
    const employeeContrib = salary * (contributionPercent / 100);
    const employerMatchAmount = Math.min(
      employeeContrib * (employerMatchPercent / 100),
      salary * (employerMatchLimit / 100)
    );
    const totalContribution = employeeContrib + employerMatchAmount;
    const interest = balance * (expectedReturn / 100);

    const startBalance = balance;
    balance = balance + totalContribution + interest;

    totalEmployeeContrib += employeeContrib;
    totalEmployerContrib += employerMatchAmount;
    totalInterest += interest;

    rows.push({
      age,
      startBalance,
      employeeContribution: employeeContrib,
      employerMatch: employerMatchAmount,
      totalContribution,
      interestEarned: interest,
      endBalance: balance,
    });
  }

  return {
    rows,
    totalEmployeeContrib,
    totalEmployerContrib,
    totalInterest,
    finalBalance: balance,
    yearsToRetirement: retirementAge - currentAge,
  };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("65");
  const [currentBalance, setCurrentBalance] = useState<string>("25000");
  const [annualSalary, setAnnualSalary] = useState<string>("75000");
  const [contributionPercent, setContributionPercent] = useState<string>("6");
  const [employerMatchPercent, setEmployerMatchPercent] = useState<string>("50");
  const [employerMatchLimit, setEmployerMatchLimit] = useState<string>(("6"));
  const [expectedReturn, setExpectedReturn] = useState<string>(("7"));
  const [salaryGrowth, setSalaryGrowth] = useState<string>(("3"));
  const [showSchedule, setShowSchedule] = useState(false);

  const ca = Number(currentAge) || 30;
  const ra = Number(retirementAge) || 65;
  const cb = Number(currentBalance) || 0;
  const sal = Number(annualSalary) || 0;
  const cp = Number(contributionPercent) || 0;
  const emp = Number(employerMatchPercent) || 0;
  const eml = Number(employerMatchLimit) || 0;
  const er = Number(expectedReturn) || 0;
  const sg = Number(salaryGrowth) || 0;

  const result = useMemo(
    () => calculateRetirement(ca, ra, cb, sal, cp, emp, eml, er, sg),
    [ca, ra, cb, sal, cp, emp, eml, er, sg]
  );


  const totalContributions = result.totalEmployeeContrib + result.totalEmployerContrib;

  // Prepare chart data from result rows
  const chartData = useMemo(() => {
    return result.rows.map((row) => ({
      age: row.age,
      employeeContribution: row.employeeContribution,
      employerMatch: row.employerMatch,
      interestEarned: row.interestEarned,
      endBalance: row.endBalance,
      startBalance: row.startBalance,
    }));
  }, [result.rows]);

  // Donut chart data
  const donutData = useMemo(() => {
    const data = [];
    if (result.totalEmployeeContrib > 0) {
      data.push({ name: "Your Contributions", value: result.totalEmployeeContrib });
    }
    if (result.totalEmployerContrib > 0) {
      data.push({ name: "Employer Match", value: result.totalEmployerContrib });
    }
    if (result.totalInterest > 0) {
      data.push({ name: "Investment Growth", value: result.totalInterest });
    }
    return data;
  }, [result.totalEmployeeContrib, result.totalEmployerContrib, result.totalInterest]);

  const DONUT_COLORS = ["#10b981", "#3b82f6", "#f59e0b"]; // emerald-500, blue-500, amber-500

  // Smart Insights
  const smartInsight = useMemo(() => {
    const total = totalContributions + result.totalInterest;
    if (total === 0) return "Start contributing to see your retirement projections.";
    const growthPct = ((result.totalInterest / total) * 100).toFixed(1);
    const contribPct = ((totalContributions / total) * 100).toFixed(1);
    if (Number(growthPct) > Number(contribPct)) {
      return `At this rate, your investment growth will account for ${growthPct}% of your total wealth — compound interest is doing the heavy lifting!`;
    }
    return `Your contributions make up ${contribPct}% of your projected wealth. Increase your contribution rate to let compound interest accelerate your growth.`;
  }, [totalContributions, result.totalInterest]);

  // Custom tooltip for area chart
  interface TooltipPayloadItem {
    dataKey: string;
    color: string;
    value: number;
    name: string;
  }
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <p className="text-sm font-semibold text-slate-900 mb-2">Age {label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: TooltipPayloadItem) => (
              <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600">
                  {entry.name === "employeeContribution"
                    ? "Your Contributions"
                    : entry.name === "employerMatch"
                    ? "Employer Match"
                    : "Investment Growth"}
                  :
                </span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-1.5 mt-1.5">
              <span className="text-xs text-slate-500">Total Balance: </span>
              <span className="text-xs font-semibold text-slate-900">
                {formatCurrency(
                  payload.reduce((sum: number, entry: TooltipPayloadItem) => sum + (entry.value || 0), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const monthlyIncomeAt4Percent = result.finalBalance * 0.04 / 12;
  const monthlyIncomeAt5Percent = result.finalBalance * 0.05 / 12;

  // IRS 2025 limits
  const employeeLimit2025 = 23500;
  const catchUp50Plus = 7500;
  const totalLimitUnder50 = 70000;

  const employeeContribAmount = sal * (cp / 100);
  const isNearLimit = employeeContribAmount > employeeLimit2025 * 0.8;
  const canCatchUp = ca >= 50;

  // Breakdown
  const breakdown = [
    { label: "Your Contributions", value: result.totalEmployeeContrib, color: "bg-emerald-500" },
    { label: "Employer Match", value: result.totalEmployerContrib, color: "bg-blue-500" },
    { label: "Investment Growth", value: result.totalInterest, color: "bg-amber-500" },
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-200">
              <PiggyBank className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                Free Calculator
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Retirement & 401k Calculator
              </h1>
            </div>
          </div>
          <p className="text-slate-600 max-w-2xl">
            Plan your retirement with 401k projections, employer match estimates, and investment growth.
            See how much you will have when you retire and how long your savings will last.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Inputs ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <User className="h-5 w-5 text-sky-600" />
                Personal Details
              </h2>
              <div className="space-y-5">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Retirement Age
                  </label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {result.yearsToRetirement} years until retirement
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current 401k Balance
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Income & Contributions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-sky-600" />
                Income & Contributions
              </h2>
              <div className="space-y-5">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Annual Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="75000"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Your Contribution (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.5"
                      value={contributionPercent}
                      onChange={(e) => setContributionPercent(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="6"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Annual: {formatCurrency(employeeContribAmount)}
                    {isNearLimit && (
                      <span className="text-amber-600 ml-1">
                        Near IRS ${formatCurrency(employeeLimit2025)} limit
                      </span>
                    )}
                  </p>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Employer Match (%)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={employerMatchPercent}
                      onChange={(e) => setEmployerMatchPercent(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="50"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    e.g., 50% = employer puts in $0.50 for every $1 you contribute
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Employer Match Limit (% of salary)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      value={employerMatchLimit}
                      onChange={(e) => setEmployerMatchLimit(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sky-600" />
                Assumptions
              </h2>
              <div className="space-y-5">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Expected Annual Return (%)
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="7"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Annual Salary Growth (%)
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.5"
                      value={salaryGrowth}
                      onChange={(e) => setSalaryGrowth(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* IRS 2025 Limits Info */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 mb-5">
              <h3 className="text-sm font-semibold text-sky-800 mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                IRS 2025 401k Limits
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sky-700">Employee Limit (under 50)</span>
                  <span className="font-semibold text-sky-800">{formatCurrency(employeeLimit2025)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700">Catch-up (50+)</span>
                  <span className="font-semibold text-sky-800">+{formatCurrency(catchUp50Plus)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-700">Total Limit (under 50)</span>
                  <span className="font-semibold text-sky-800">{formatCurrency(totalLimitUnder50)}</span>
                </div>
                {canCatchUp && (
                  <p className="text-xs text-sky-600 mt-2 pt-2 border-t border-sky-200">
                    You are 50+ — eligible for catch-up contributions!
                  </p>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              {[
                { icon: Shield, text: "100% Private — No data stored" },
                { icon: Clock, text: "Instant results as you type" },
                { icon: CheckCircle2, text: "USA 401k & IRS formulas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <item.icon className="h-4 w-4 text-sky-500 shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Results ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result Card */}
            <div className="rounded-2xl border border-sky-200 bg-linear-to-br from-sky-50 to-indigo-50 p-8 mb-5">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-sky-700 uppercase tracking-wider mb-4">
                    Estimated 401k Balance at Age {ra}
                  </p>
                  <p className="text-4xl sm:text-5xl font-bold text-sky-800 mb-2">
                    {formatCurrency(result.finalBalance)}
                  </p>
                  <p className="text-sm text-sky-600 mt-2">
                    Total contributions: {formatCurrency(totalContributions)} · 
                    Investment growth: {formatCurrency(result.totalInterest)}
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <div className="rounded-xl bg-white/80 border border-sky-200 p-2 mb-2">
                    <p className="text-xs text-slate-500">Your Contributions</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.totalEmployeeContrib)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 border border-sky-200 p-2">
                    <p className="text-xs text-slate-500">Employer Match</p>
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(result.totalEmployerContrib)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Retirement Income Estimate */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-sky-600" />
                Estimated Monthly Retirement Income
              </h3>
              <div className="grid sm:grid-cols-1 gap-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-600 mb-1">Conservative (4% rule)</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {formatCurrency(monthlyIncomeAt4Percent)}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1">
                    Per month · {formatCurrency(monthlyIncomeAt4Percent * 12)}/year
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-600 mb-1">Moderate (5% rule)</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {formatCurrency(monthlyIncomeAt5Percent)}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">
                    Per month · {formatCurrency(monthlyIncomeAt5Percent * 12)}/year
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Based on the 4% and 5% withdrawal rules. Actual income depends on market performance,
                inflation, and your specific retirement strategy.
              </p>
            </div>

            {/* Breakdown + Donut Chart */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Visual Breakdown with Donut Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-sky-600" />
                  Balance Composition
                </h3>
                <div className="flex flex-col items-center">
                  <div className="w-full h-50 sm:h-55">
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
                          height={36}
                          iconType="circle"
                          formatter={(value: any) => (
                            <span className="text-xs text-slate-600">{String(value)}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full space-y-3 mt-2">
                    {breakdown.map((item) => {
                      const pct = totalBreakdown > 0 ? (item.value / totalBreakdown) * 100 : 0;
                      return (
                        <div key={item.label}>
                          <div className="flex flex-col mb-3">
                            <span className="text-slate-600 font-extralight text-center mb-2">{item.label}</span>
                            <span className="font-bold text-slate-900 text-center mb-2 ">
                              {formatCurrency(item.value)}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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
              </div>

              {/* Key Stats */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-sky-600" />
                  Retirement Summary
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Years to Retirement", value: `${result.yearsToRetirement}` },
                    { label: "Starting Balance", value: formatCurrency(cb) },
                    { label: "Your Total Contributions", value: formatCurrency(result.totalEmployeeContrib) },
                    { label: "Employer Total Match", value: formatCurrency(result.totalEmployerContrib) },
                    { label: "Investment Growth", value: formatCurrency(result.totalInterest) },
                    { label: "Growth vs Contributions", value: `${((result.totalInterest / totalContributions) * 100).toFixed(1)}%` },
                    { label: "Final Annual Salary", value: formatCurrency(sal * Math.pow(1 + sg / 100, result.yearsToRetirement)) },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className=" text-slate-600 text-center mb-2">{stat.label}</span>
                      <span className="font-bold text-slate-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
{/* Growth Visualization - Stacked Area Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-5">
              <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sky-600" />
                401k Growth Over Time
              </h3>
              <div className="w-full h-80 sm:h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorEmployee" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorEmployer" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="age"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                      label={{ value: "Age", position: "insideBottom", offset: -5, style: { fill: "#64748b", fontSize: 12 } }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                      label={{ value: "Balance", angle: -90, position: "insideLeft", style: { fill: "#64748b", fontSize: 12 } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      formatter={(value: any) => {
                        const labels: Record<string, string> = {
                          employeeContribution: "Your Contributions",
                          employerMatch: "Employer Match",
                          interestEarned: "Investment Growth",
                        };
                        return <span className="text-sm text-slate-600">{labels[String(value)] || String(value)}</span>;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="employeeContribution"
                      stackId="1"
                      stroke="#10b981"
                      fill="url(#colorEmployee)"
                      strokeWidth={2}
                      name="employeeContribution"
                    />
                    <Area
                      type="monotone"
                      dataKey="employerMatch"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="url(#colorEmployer)"
                      strokeWidth={2}
                      name="employerMatch"
                    />
                    <Area
                      type="monotone"
                      dataKey="interestEarned"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="url(#colorInterest)"
                      strokeWidth={2}
                      name="interestEarned"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-2xl border border-sky-200 bg-linear-to-br from-sky-50 to-indigo-50 p-6 shadow-sm mb-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-sky-200 shrink-0">
                  <Zap className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-sky-800 mb-1">Smart Insight</h3>
                  <p className="text-sm text-sky-700 leading-relaxed">{smartInsight}</p>
                </div>
              </div>
            </div>
{/* Yearly Schedule Toggle */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-200">
                    <Calendar className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Year-by-Year Breakdown
                    </h3>
                    <p className="text-sm text-slate-500">
                      {result.rows.length} years of detailed projections
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
                  <div className="max-h-12 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Age
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Start Balance
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            You Contribute
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Employer Match
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Growth
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            End Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.rows.map((row) => (
                          <tr key={row.age} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {row.age}
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-700">
                              {formatCurrency(row.startBalance)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-emerald-600">
                              {formatCurrency(row.employeeContribution)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-blue-600">
                              {formatCurrency(row.employerMatch)}
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