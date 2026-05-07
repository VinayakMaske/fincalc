"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Zap,
  Shield,
  Globe,
  Clock,
  CheckCircle2,
  Star,
  Receipt,
  Share2,
  Smartphone,
  Calculator,
  ChevronRight,
  Users,
  Award,
  Sparkles,
  Lock,
  Heart,
  Menu,
  X,
  Landmark,
  Wallet,
  TrendingUp,
  Percent,
  Download,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Generate in Under 10 Seconds",
    description:
      "Enter employee details, hours worked, and deductions. Your professional payslip is ready instantly — no spreadsheets, no manual calculations.",
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    bgIcon: "bg-amber-50",
  },
  {
    icon: Landmark,
    title: "USA Federal & State Tax Ready",
    description:
      "Automatic FICA, federal income tax, and state tax calculations based on 2025 IRS rates. Supports all 50 states plus Washington DC.",
    color: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    bgIcon: "bg-blue-50",
  },
  {
    icon: Smartphone,
    title: "Share via Email & WhatsApp",
    description:
      "Send payslips directly to employees through email or WhatsApp with one click. Mobile-friendly format that looks great on any device.",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    bgIcon: "bg-emerald-50",
  },
  {
    icon: Lock,
    title: "No Login Required — Ever",
    description:
      "We do not ask for your email, phone, or credit card. Jump straight in and start generating payslips. Your data stays on your device.",
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-200",
    iconColor: "text-violet-600",
    bgIcon: "bg-violet-50",
  },
  {
    icon: Heart,
    title: "100% Free — No Hidden Fees",
    description:
      "Unlimited payslips. Unlimited employees. Unlimited downloads. No 'Pro' tier. Free means free, forever. Perfect for small businesses and 1099 contractors.",
    color: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-200",
    iconColor: "text-rose-600",
    bgIcon: "bg-rose-50",
  },
  {
    icon: Percent,
    title: "Accurate Deductions Every Time",
    description:
      "Social Security, Medicare, federal withholding, state tax, and voluntary deductions all calculated automatically. No more payroll math errors.",
    color: "from-indigo-500/10 to-violet-500/10",
    border: "border-indigo-200",
    iconColor: "text-indigo-600",
    bgIcon: "bg-indigo-50",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Enter Employee Details",
    description:
      "Add employee name, ID, pay period, and filing status. Auto-fill remembers your business info for next time — stored locally, never on our servers.",
  },
  {
    step: "02",
    title: "Add Earnings & Deductions",
    description:
      "Enter hours worked, hourly rate or salary, overtime, bonuses, and any voluntary deductions. We auto-calculate federal and state taxes.",
  },
  {
    step: "03",
    title: "Download & Share",
    description:
      "Export as a crisp PDF or share directly via email/WhatsApp. Your employee gets a professional, IRS-compliant payslip instantly.",
  },
];

const testimonials = [
  {
    name: "Michael Torres",
    role: "Small Business Owner",
    location: "Dallas, TX",
    text:
      "I run a landscaping company with 8 employees. This payslip generator saves me 4 hours every payroll. The Texas state tax calculation is spot on every time.",
    rating: 5,
  },
  {
    name: "Jennifer Walsh",
    role: "Freelance Bookkeeper",
    location: "Chicago, IL",
    text:
      "I prepare payslips for 15+ small business clients. This tool handles Illinois state tax perfectly and the PDF output looks completely professional. My clients love it.",
    rating: 5,
  },
  {
    name: "Robert Kim",
    role: "Restaurant Manager",
    location: "Los Angeles, CA",
    text:
      "We have 20+ staff with varying hours and tips. This tool calculates everything correctly including California state tax. And it is completely free — unbelievable.",
    rating: 5,
  },
];

const trustBadges = [
  { icon: Shield, text: "Bank-Level Privacy" },
  { icon: Globe, text: "Built for USA Tax Rules" },
  { icon: Clock, text: "24/7 Access — No Downtime" },
  { icon: CheckCircle2, text: "IRS-Compliant Formatting" },
];

const stats = [
  { value: "75K+", label: "Payslips Created", icon: FileText },
  { value: "$8M+", label: "Payroll Processed", icon: Wallet },
  { value: "4.9/5", label: "User Rating", icon: Star },
  { value: "$0", label: "Cost to You", icon: Heart },
];

const templates = [
  { name: "Modern Standard", tag: "Most Popular", color: "bg-slate-800" },
  { name: "Corporate Detail", tag: "Business", color: "bg-blue-700" },
  { name: "Contractor Simple", tag: "1099", color: "bg-emerald-600" },
  { name: "Hourly Breakdown", tag: "Shift Work", color: "bg-amber-600" },
];

export default function PayslipGeneratorLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                FinCalc<span className="text-emerald-600">Pro</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                How It Works
              </Link>
              <Link href="#templates" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Templates
              </Link>
              <Link
                href="/tools/pay-generator"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                Create Payslip
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
            <Link href="/" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="#features" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link href="#how-it-works" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </Link>
            <Link href="#templates" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
              Templates
            </Link>
            <Link href="/tools/pay-generator" className="block rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white text-center" onClick={() => setMobileMenuOpen(false)}>
              Create Payslip
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/80 via-white to-white" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-6">
                <Sparkles className="h-4 w-4" />
                <span>#1 Free Payslip Generator for USA Businesses</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Generate Professional
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Payslips in 10 Seconds
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                The fastest, most accurate payslip generator for small businesses, contractors, and freelancers across America. 
                Auto-calculates federal tax, FICA, state tax, and net pay. No signup. No fees. No limits.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
                <Link
                  href="/tools/pay-generator"
                  className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/25"
                >
                  Create Your First Payslip
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                >
                  See How It Works
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                {trustBadges.map((badge, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <badge.icon className="h-4 w-4 text-emerald-500" />
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Visual — Payslip Preview Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                  <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">PAYSLIP #PS-0527</span>
                    </div>
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">PAID</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Employee</p>
                        <p className="text-sm font-semibold text-slate-900">Sarah Johnson</p>
                        <p className="text-xs text-slate-500">ID: EMP-1042 · Austin, TX</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Pay Period</p>
                        <p className="text-sm font-semibold text-slate-900">May 1 — May 15, 2026</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Earnings</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm"><span className="text-slate-600">Regular Pay</span><span className="font-medium text-slate-900">$2,400.00</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-600">Overtime</span><span className="font-medium text-slate-900">$360.00</span></div>
                            <div className="flex justify-between text-sm font-semibold pt-1 border-t border-slate-100"><span className="text-slate-900">Gross Pay</span><span className="text-slate-900">$2,760.00</span></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Deductions</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm"><span className="text-slate-600">Federal Tax</span><span className="font-medium text-red-600">-$331.20</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-600">FICA</span><span className="font-medium text-red-600">-$211.14</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-600">State Tax</span><span className="font-medium text-red-600">-$124.20</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Net Pay</p>
                          <p className="text-2xl font-bold text-emerald-700">$2,093.46</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-emerald-600">YTD Gross</p>
                          <p className="text-sm font-semibold text-emerald-700">$35,880.00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm mb-3 mx-auto">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Grid ──────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for Accurate Payroll
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built specifically for American employers, bookkeepers, and contractors who need compliant, professional payslips without expensive software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${benefit.border} ${benefit.bgIcon} mb-5`}>
                    <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Create a Payslip in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No payroll expertise needed. If you can fill a form, you can generate an accurate, compliant payslip.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-lg font-bold text-blue-600">{step.step}</span>
                    </div>
                    {i < 2 && <div className="hidden md:block flex-1 h-px bg-slate-200" />}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Preview ──────────────────────────────────── */}
      <section id="templates" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              4 Professional Templates
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From standard employee payslips to detailed contractor breakdowns. Every template is print-ready and IRS-compliant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.name} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className={`h-40 ${template.color} relative flex items-center justify-center`}>
                  <FileText className="h-12 w-12 text-white/30" />
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                      {template.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">Print-ready · PDF · IRS-compliant</p>
                  <Link
                    href="/tools/payslip-generator"
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700"
                  >
                    Use This Template
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof / Testimonials ────────────────────────── */}
      <section className="py-20 sm:py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Employers Across America
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join 75,000+ businesses who switched from expensive payroll software to our free payslip generator.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-500 to-emerald-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-12 w-12 text-blue-100 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Stop Overpaying for Payroll Software
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your first professional payslip is 10 seconds away. No credit card. No signup. No catch. 
            Just accurate calculations and beautiful PDFs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/pay-generator"
              className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 hover:bg-blue-50 transition-all shadow-xl"
            >
              Create Your First Payslip — Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Unlimited Payslips
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              PDF Downloads
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              IRS Tax Calculations
            </span>
          </div>
        </div>
      </section>

      {/* ── Cross-Promotion: Invoice & Calculators ─────────────── */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Explore More Free Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              FinCalcPro is your all-in-one financial toolkit. Try our other free tools built for the USA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Invoice Promo */}
            <Link
              href="/tools/invoice-maker"
              className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-8 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-4">
                  <Sparkles className="h-3 w-3" />
                  POPULAR
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                    <Receipt className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Invoice Maker</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Create professional invoices in seconds. Add your logo, line items, taxes, and download as PDF instantly. 
                  No watermarks. No signup.
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                  Try Invoice Maker
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Calculators Promo */}
            <Link
              href="/"
              className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-4">
                  <Star className="h-3 w-3" />
                  12+ FREE TOOLS
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Financial Calculators</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  From mortgage payments and compound interest to federal tax estimates and retirement planning. 
                  All calculators are free, private, and built for the US financial system.
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Explore All Calculators
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ / SEO Content ──────────────────────────────────── */}
      <section className="py-20 sm:py-24 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our free payslip generator.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is the Payslip Generator really 100% free?",
                a: "Yes. Absolutely. No credit card, no trial period, no hidden fees. Create unlimited payslips, download unlimited PDFs, and share with unlimited employees. We do not process payments ourselves — so there are no extra fees from us.",
              },
              {
                q: "Do I need to create an account or log in?",
                a: "No. We do not require any signup, email, or password. Jump straight in and start generating payslips. For convenience, we optionally save your business details locally on your device so you do not have to retype them next time.",
              },
              {
                q: "Are the tax calculations accurate for 2025?",
                a: "Yes. Our payslip generator uses the official 2025 IRS tax brackets, Social Security wage base limit ($176,100), Medicare rate (1.45%), and FICA rates (6.2% Social Security + 1.45% Medicare). State tax rates are updated for all 50 states plus DC.",
              },
              {
                q: "Can I use this for 1099 contractors?",
                a: "Absolutely. Our Contractor Simple template is designed specifically for 1099 workers. It shows gross pay without employee tax withholdings, making it perfect for independent contractors and freelancers who handle their own taxes.",
              },
              {
                q: "Does this replace my payroll software?",
                a: "For small businesses with under 50 employees, yes. For larger businesses, you may still need full payroll software for direct deposit integration, but our payslip generator handles the calculation and document generation perfectly.",
              },
              {
                q: "Can I share payslips via WhatsApp or Email?",
                a: "Yes. After generating your payslip, you get one-click sharing options for WhatsApp, Email, and direct PDF download. Your employees receive a clean, mobile-friendly payslip instantly.",
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">
                  FinCalc<span className="text-emerald-600">Pro</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                Free payslip generator, invoice maker, and financial calculators for freelancers and small businesses across the USA.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Payslip Generator
              </h4>
              <ul className="space-y-3">
                <li><Link href="/tools/pay-generator" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Create Payslip</Link></li>
                <li><Link href="#templates" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Templates</Link></li>
                <li><Link href="#features" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">How It Works</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Business Tools
              </h4>
              <ul className="space-y-3">
                <li><Link href="/tools/invoice-maker" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Invoice Maker</Link></li>
                <li><Link href="/tools/payslip-generator" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Payslip Generator</Link></li>
                <li><Link href="/" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">All Calculators</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 FinCalcPro. All rights reserved. Free tools for the USA.
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