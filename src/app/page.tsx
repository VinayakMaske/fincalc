"use client";

import Link from "next/link";
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Home,
  Briefcase,
  Receipt,
  FileText,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Menu,
  X,
  Landmark,
  Wallet,
  Building2,
  HandCoins,
  Scale,
  BarChart3,
  RefreshCw,
  Search,
  Star,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { useState } from "react";

const financialCalculators = [
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    description:
      "Estimate monthly payments, total interest, and full amortization schedule for your home loan. Compare 15-year vs 30-year terms.",
    icon: Home,
    tags: ["#1 Searched", "Home Loan", "Amortization"],
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    bgIcon: "bg-emerald-50",
    featured: true,
  },
  {
    slug: "loan-calculator",
    title: "Loan Calculator",
    description:
      "Calculate EMI, total interest payable, and repayment schedule for personal, auto, or student loans with flexible terms.",
    icon: HandCoins,
    tags: ["Personal", "Auto", "Student"],
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-200",
    iconColor: "text-violet-600",
    bgIcon: "bg-violet-50",
    featured: false,
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    description:
      "See how your money grows over time with compound interest. Perfect for savings goals, investments, and APY comparisons.",
    icon: TrendingUp,
    tags: ["Savings", "Investments", "APY"],
    color: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    bgIcon: "bg-blue-50",
    featured: true,
  },
  {
    slug: "retirement-calculator",
    title: "Retirement & 401k Calculator",
    description:
      "Plan your retirement with 401k projections, employer match estimates, and social security integration.",
    icon: PiggyBank,
    tags: ["401k", "Retirement", "Savings"],
    color: "from-sky-500/10 to-indigo-500/10",
    border: "border-sky-200",
    iconColor: "text-sky-600",
    bgIcon: "bg-sky-50",
    featured: true,
  },
  {
    slug: "tax-calculator",
    title: "Federal Income Tax Calculator",
    description:
      "Estimate your federal income tax, take-home pay, and tax brackets based on 2025 IRS rates. Includes standard deductions.",
    icon: Landmark,
    tags: ["IRS 2025", "Federal", "Take-Home"],
    color: "from-lime-500/10 to-green-500/10",
    border: "border-lime-200",
    iconColor: "text-lime-600",
    bgIcon: "bg-lime-50",
    featured: true,
  },
  {
    slug: "salary-calculator",
    title: "Salary & Paycheck Calculator",
    description:
      "Convert hourly wage to annual salary and vice versa. Includes federal tax withholding and FICA estimates for USA workers.",
    icon: DollarSign,
    tags: ["Hourly to Salary", "Withholding", "USA"],
    color: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-200",
    iconColor: "text-rose-600",
    bgIcon: "bg-rose-50",
    featured: false,
  },
  {
    slug: "auto-loan-calculator",
    title: "Auto Loan Calculator",
    description:
      "Calculate monthly car payments, total interest, and compare loan terms. Includes trade-in and down payment options.",
    icon: Building2,
    tags: ["Car Payment", "Trade-In", "Down Payment"],
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    bgIcon: "bg-amber-50",
    featured: false,
  },
  {
    slug: "credit-card-payoff",
    title: "Credit Card Payoff Calculator",
    description:
      "See how long it will take to pay off your credit card debt. Compare minimum payments vs accelerated payoff strategies.",
    icon: CreditCard,
    tags: ["Debt Free", "Minimum Payment", "Strategy"],
    color: "from-red-500/10 to-orange-500/10",
    border: "border-red-200",
    iconColor: "text-red-600",
    bgIcon: "bg-red-50",
    featured: true,
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator",
    description:
      "Create a debt payoff strategy using avalanche or snowball method. See your debt-free date and total interest saved.",
    icon: Scale,
    tags: ["Snowball", "Avalanche", "Debt Free"],
    color: "from-red-500/10 to-rose-500/10",
    border: "border-red-200",
    iconColor: "text-red-600",
    bgIcon: "bg-red-50",
    featured: false,
  },
  {
    slug: "roi-calculator",
    title: "ROI Calculator",
    description:
      "Calculate return on investment percentage and break-even point. Perfect for business decisions, side hustles, and investments.",
    icon: BarChart3,
    tags: ["Investment", "Business", "Returns"],
    color: "from-indigo-500/10 to-violet-500/10",
    border: "border-indigo-200",
    iconColor: "text-indigo-600",
    bgIcon: "bg-indigo-50",
    featured: false,
  },
  {
    slug: "refinance-calculator",
    title: "Refinance Calculator",
    description:
      "Compare your current mortgage with refinancing options. See break-even point and lifetime savings from a lower rate.",
    icon: RefreshCw,
    tags: ["Rate Drop", "Break-Even", "Savings"],
    color: "from-teal-500/10 to-emerald-500/10",
    border: "border-teal-200",
    iconColor: "text-teal-600",
    bgIcon: "bg-teal-50",
    featured: false,
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs. Buy Calculator",
    description:
      "Should you rent or buy? Compare total costs over time including home appreciation, maintenance, and opportunity cost.",
    icon: Wallet,
    tags: ["First-Time Buyer", "Comparison", "Cost Analysis"],
    color: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-200",
    iconColor: "text-cyan-600",
    bgIcon: "bg-cyan-50",
    featured: false,
  },
];

const newTools = [
  {
    slug: "invoice-maker",
    title: "Invoice Maker",
    description:
      "Create professional invoices in seconds. Add your logo, line items, taxes, and download as PDF instantly. No watermarks.",
    icon: Receipt,
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    bgIcon: "bg-emerald-50",
    badge: "NEW",
  },
  {
    slug: "paystub-generator",
    title: "Paystub Generator",
    description:
      "Generate detailed payslips with federal deductions, taxes, and net pay. Perfect for small businesses and 1099 contractors.",
    icon: FileText,
    color: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    bgIcon: "bg-blue-50",
    badge: "NEW",
  },
];

const stats = [
  { value: "12+", label: "Free Calculators", icon: Calculator },
  { value: "100%", label: "Free Forever", icon: Star },
  { value: "2M+", label: "Calculations Done", icon: BarChart3 },
  { value: "0", label: "Data Stored", icon: Shield },
];

const features = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get calculations in real-time as you type. No waiting, no refreshing, no page reloads.",
  },
  {
    icon: Shield,
    title: "100% Free & Private",
    description: "All calculations happen in your browser. We never store, track, or sell your financial data.",
  },
  {
    icon: Globe,
    title: "Built for USA",
    description: "Tailored for US financial systems — IRS tax brackets, FHA loans, 401k rules, FICA, and more.",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "No signups, no subscriptions, no limits. Use our tools anytime, anywhere, on any device.",
  },
];

const quickLinks = [
  { label: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
  { label: "Compound Interest", href: "/tools/compound-interest" },
  { label: "Loan Calculator", href: "/tools/loan-calculator" },
  { label: "Retirement / 401k", href: "/tools/retirement-calculator" },
  { label: "Tax Calculator", href: "/tools/tax-calculator" },
  { label: "Salary Calculator", href: "/tools/salary-calculator" },
  { label: "Auto Loan", href: "/tools/auto-loan-calculator" },
  { label: "Credit Card Payoff", href: "/tools/credit-card-payoff" },
  { label: "Debt Payoff", href: "/tools/debt-payoff" },
  { label: "ROI Calculator", href: "/tools/roi-calculator" },
  { label: "Refinance", href: "/tools/refinance-calculator" },
  { label: "Rent vs. Buy", href: "/tools/rent-vs-buy" },
  { label: "Invoice Maker", href: "/tools/invoice-maker" },
  { label: "Paystub Generator", href: "/tools/paystub-generator" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCalculators = financialCalculators.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
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

            <div className="hidden md:flex items-center gap-8">
              <Link href="#calculators" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Calculators
              </Link>
              <Link href="#new-tools" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Business Tools
              </Link>
              <Link href="#why-us" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Why Us
              </Link>
              <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link
                href="/tools/invoice-maker"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                Try Invoice Maker
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <Link href="#calculators" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              Calculators
            </Link>
            <Link href="#new-tools" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              Business Tools
            </Link>
            <Link href="#why-us" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              Why Us
            </Link>
            <Link href="#about" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/tools/invoice-maker" className="block rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white text-center" onClick={() => setMobileMenuOpen(false)}>
              Try Invoice Maker
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/80 via-white to-white" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/40 rounded-full blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-6">
                <Award className="h-4 w-4" />
                <span>Trusted by 50,000+ Users Monthly</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.15]">
                Free Financial
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Calculators & Tools
                </span>
                <br />
                for Everyone
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                12+ professional-grade calculators for mortgages, loans, taxes, retirement, and more.
                Plus free invoice maker & paystub generator for freelancers and small businesses across the USA.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="#calculators"
                  className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/25"
                >
                  Explore All Calculators
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/tools/invoice-maker"
                  className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                >
                  <Receipt className="h-5 w-5 text-emerald-600" />
                  Create Free Invoice
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                        <Home className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Mortgage Calculator</p>
                        <p className="text-xs text-slate-500">Most Popular Tool</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">FREE</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Loan Amount</span>
                      <span className="font-semibold text-slate-900">$400,000</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Interest Rate</span>
                      <span className="font-semibold text-slate-900">6.5%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-blue-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Loan Term</span>
                      <span className="font-semibold text-slate-900">30 Years</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider mb-1">Monthly Payment</p>
                    <p className="text-3xl font-bold text-emerald-700">$2,528.27</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            {[
              { icon: CheckCircle2, text: "No Signup Required" },
              { icon: CheckCircle2, text: "100% Free Forever" },
              { icon: Shield, text: "Privacy First — No Data Stored" },
              { icon: Globe, text: "Built for USA Financial System" },
            ].map((badge, i) => (
              <span key={i} className="flex items-center gap-2">
                <badge.icon className="h-4 w-4 text-emerald-500" />
                {badge.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm mb-3 mx-auto">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section id="why-us" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Professionals Choose BillSwift
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We built these tools because we were tired of paywalled calculators and clunky interfaces.
              Here is what makes us different.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 mb-5 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors">
                  <feature.icon className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Calculators Grid */}
      <section id="calculators" className="py-20 sm:py-24 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Free Financial Calculators
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The most searched financial calculators in the USA. Accurate, fast, and completely free.
              No account needed.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-14">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search calculators (e.g. mortgage, tax, 401k)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
              />
            </div>
          </div>

          {/* Featured Row */}
          {!searchQuery && (
            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                Most Popular
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {financialCalculators
                  .filter((t) => t.featured)
                  .map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-6 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${tool.border} ${tool.bgIcon}`}>
                            <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                          </div>
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                            POPULAR
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.title}</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">{tool.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tool.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                          Use Calculator
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* All Calculators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery ? filteredCalculators : financialCalculators.filter((t) => !t.featured)).map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${tool.border} ${tool.bgIcon} mb-4`}>
                    <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tool.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                    Calculate Now
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {searchQuery && filteredCalculators.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No calculators found for &quot;{searchQuery}&quot;</p>
              <p className="text-slate-400 text-sm mt-1">Try searching for mortgage, tax, loan, or retirement</p>
            </div>
          )}
        </div>
      </section>

      {/* New Business Tools Section */}
      <section id="new-tools" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-6">
                <Zap className="h-4 w-4" />
                <span>Just Launched — May 2025</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                New Business Tools
                <br />
                <span className="text-emerald-600">For Freelancers & Small Business</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We just launched two powerful tools to help freelancers, contractors, and small
                business owners in the USA. Create professional invoices and detailed payslips in
                seconds — no subscription, no watermarks, no limits.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {newTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${tool.border} ${tool.bgIcon}`}>
                          <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{tool.title}</h3>
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{tool.description}</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                        Try Now — It is Free
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="absolute -top-4 -right-4">
                  <span className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
                    FREE FOREVER
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  What You Get
                </h3>
                <div className="space-y-4">
                  {[
                    "No account or credit card required",
                    "PDF downloads with no watermarks",
                    "USA-specific tax calculations & formats",
                    "Mobile-friendly and blazing fast",
                    "Your data stays on your device",
                    "Unlimited invoices and payslips",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">12,000+</span> professionals use us daily
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-16 bg-emerald-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="h-8 w-8 text-emerald-200 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">50,000+</p>
              <p className="text-emerald-100 text-sm mt-1">Monthly Active Users</p>
            </div>
            <div>
              <Calculator className="h-8 w-8 text-emerald-200 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">2 Million+</p>
              <p className="text-emerald-100 text-sm mt-1">Calculations Completed</p>
            </div>
            <div>
              <Star className="h-8 w-8 text-emerald-200 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">4.9/5</p>
              <p className="text-emerald-100 text-sm mt-1">User Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* About / SEO Content Section */}
      <section id="about" className="py-20 sm:py-24 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Free Financial Tools Built for Americans
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Whether you are buying your first home, planning retirement, managing business finances,
              or calculating taxes — BillSwift gives you the accurate numbers you need, instantly.
              Every tool is designed with USA-specific rules: IRS tax brackets, FHA loan limits,
              401k contribution limits, FICA rates, and state-specific calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <Home className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Home & Mortgage</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Use our mortgage calculator to estimate monthly payments, compare 15-year vs 30-year
                loans, and see your full amortization schedule. Perfect for first-time homebuyers
                and refinancers across the USA.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <TrendingUp className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Invest & Retire</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Plan your financial future with compound interest, ROI, and retirement calculators.
                See how much your 401k will be worth, when you can retire, and how much you need to save.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <Receipt className="h-10 w-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Business Tools</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create professional invoices and payslips that comply with standard US business formats.
                Download as PDF and send to clients instantly. Perfect for freelancers and small businesses.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 text-sm max-w-3xl mx-auto leading-relaxed">
              BillSWift is your one-stop destination for free online financial calculators.
              From mortgage payments and compound interest to salary conversions and tax estimates,
              every tool is designed with accuracy and simplicity in mind. Our invoice maker and
              paystub generator help freelancers, contractors, and small business owners streamline
              their billing without expensive software. No signups, no subscriptions, no hidden fees —
              just powerful tools that work.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <Calculator className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">
                  Bill<span className="text-emerald-600">Swift</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                Free financial calculators and business tools for everyone in the USA.
                Accurate, private, and built to help you make smarter money decisions.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Top Calculators
              </h4>
              <ul className="space-y-3">
                {quickLinks.slice(0, 7).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                More Tools
              </h4>
              <ul className="space-y-3">
                {quickLinks.slice(7, 12).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Business & Legal
              </h4>
              <ul className="space-y-3">
                {quickLinks.slice(12).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/privacy" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2025 BillSwift. All rights reserved. Free tools for the USA.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4" />
              <span>Your data never leaves your browser</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}