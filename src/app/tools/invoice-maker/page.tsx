"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Receipt,
  Zap,
  Shield,
  Globe,
  Clock,
  CheckCircle2,
  Star,
  FileText,
  Share2,
  Smartphone,
  Palette,
  Download,
  CreditCard,
  TrendingUp,
  Calculator,
  ChevronRight,
  Users,
  Award,
  Sparkles,
  Lock,
  Heart,
  Menu,
  X,
  Mail,
  MessageCircle,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Generate in Under 10 Seconds",
    description:
      "No complex forms. Just add your details, line items, and hit download. Your professional invoice is ready before your coffee gets cold.",
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    bgIcon: "bg-amber-50",
  },
  {
    icon: CreditCard,
    title: "Payment Details Built-In",
    description:
      "Add your Venmo, PayPal, Zelle, Stripe, or bank transfer info directly on the invoice. We format it professionally so clients know exactly how to pay you — no extra apps needed.",
    color: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    bgIcon: "bg-blue-50",
  },
  {
    icon: Smartphone,
    title: "Share on WhatsApp & Email",
    description:
      "One-click sharing to WhatsApp, Email, or SMS. No app installs needed. Your clients receive a clean, mobile-friendly invoice instantly.",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    bgIcon: "bg-emerald-50",
  },
  {
    icon: Lock,
    title: "No Login Required — Ever",
    description:
      "We do not ask for your email, phone, or credit card. Jump straight in and start invoicing. Your privacy is our default setting.",
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-200",
    iconColor: "text-violet-600",
    bgIcon: "bg-violet-50",
  },
  {
    icon: Heart,
    title: "100% Free — No Hidden Fees",
    description:
      "Unlimited invoices. Unlimited clients. Unlimited downloads. No 'Pro' tier trapping your data. Free means free, forever.",
    color: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-200",
    iconColor: "text-rose-600",
    bgIcon: "bg-rose-50",
  },
  {
    icon: Palette,
    title: "10+ Premium Templates",
    description:
      "Choose from modern, classic, minimal, and corporate designs. Each template is print-ready and optimized for US business standards.",
    color: "from-indigo-500/10 to-violet-500/10",
    border: "border-indigo-200",
    iconColor: "text-indigo-600",
    bgIcon: "bg-indigo-50",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Enter Your Details",
    description:
      "Add your business name, address, and logo. Auto-fill remembers your info for next time — stored locally, never on our servers.",
  },
  {
    step: "02",
    title: "Add Line Items & Tax",
    description:
      "List your services, set quantities, apply US sales tax (by state), and add discounts. Real-time totals update as you type.",
  },
  {
    step: "03",
    title: "Download & Share",
    description:
      "Export as a crisp PDF, send via email, or share on WhatsApp. Your client sees your payment details and pays you directly. Done.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Freelance Graphic Designer",
    location: "Austin, TX",
    text:
      "I used to spend 20 minutes on every invoice in Excel. Now it takes me literally 8 seconds. The templates look way more professional than anything I could make.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Independent Contractor",
    location: "Miami, FL",
    text:
      "I just add my Zelle info at the bottom and clients pay me the same day. No more 'How do I pay you?' emails. Plus, no login means I can invoice from my phone on job sites.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Small Business Owner",
    location: "Seattle, WA",
    text:
      "I run a cleaning business with 40+ clients. This tool saves me 3 hours every week. The tax calculations are accurate for Washington state too. And my PayPal link is right on the invoice.",
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
  { value: "150K+", label: "Invoices Created", icon: Receipt },
  { value: "$12M+", label: "Payments Processed", icon: CreditCard },
  { value: "4.9/5", label: "User Rating", icon: Star },
  { value: "$0", label: "Cost to You", icon: Heart },
];

const templates = [
  { name: "Modern Minimal", tag: "Most Popular", color: "bg-slate-800" },
  { name: "Corporate Pro", tag: "Business", color: "bg-blue-700" },
  { name: "Freelance Fresh", tag: "Creative", color: "bg-emerald-600" },
  { name: "Classic Elegant", tag: "Professional", color: "bg-slate-600" },
];

export default function InvoiceMakerLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <Receipt className="h-5 w-5 text-white" />
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
                href="/tools/inv-maker"
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                Create Invoice
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
            <Link href="/tools/invoice-maker" className="block rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white text-center" onClick={() => setMobileMenuOpen(false)}>
              Create Invoice
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/80 via-white to-white" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-6">
                <Sparkles className="h-4 w-4" />
                <span>#1 Free Invoice Maker for USA Freelancers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Create Professional
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Invoices in 10 Seconds
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                The fastest, simplest, and most trusted invoice generator for freelancers, contractors, and small businesses across America. 
                No signup. No fees. No limits.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
                <Link
                  href="/tools/inv-maker"
                  className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/25"
                >
                  Create Your First Invoice
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                >
                  See How It Works
                </Link>
              </div>

              {/* Trust Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                {trustBadges.map((badge, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <badge.icon className="h-4 w-4 text-emerald-500" />
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Visual — Invoice Preview Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                  {/* Invoice Header */}
                  <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">INVOICE #00142</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">PAID</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">From</p>
                        <p className="text-sm font-semibold text-slate-900">Acme Design Studio</p>
                        <p className="text-xs text-slate-500">Austin, TX 78701</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-sm font-semibold text-slate-900">May 7, 2026</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Services</p>
                      <div className="space-y-2">
                        {[
                          { item: "Logo Design", qty: 1, price: "$850.00" },
                          { item: "Brand Guidelines", qty: 1, price: "$1,200.00" },
                          { item: "Business Cards (250)", qty: 1, price: "$180.00" },
                        ].map((line, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-slate-700">{line.item}</span>
                            <span className="font-medium text-slate-900">{line.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium text-slate-900">$2,230.00</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Tax (8.25%)</span>
                        <span className="font-medium text-slate-900">$183.98</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-slate-900 mt-2 pt-2 border-t border-slate-100">
                        <span>Total</span>
                        <span className="text-emerald-600">$2,413.98</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3 border border-blue-100">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-blue-700 font-medium">Pay via Venmo @acmedesign · Zelle: acme@email.com</span>
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
                  <stat.icon className="h-6 w-6 text-emerald-600" />
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
              Everything You Need to Get Paid Faster
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built specifically for American freelancers, contractors, and small business owners who want professional invoices without the hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
              Create an Invoice in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No tutorials needed. If you can fill a form, you can create a stunning invoice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-lg font-bold text-emerald-600">{step.step}</span>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block flex-1 h-px bg-slate-200" />
                    )}
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
              10+ Premium Templates
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From sleek minimal to corporate professional. Every template is print-ready, mobile-optimized, and designed to impress your clients.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.name} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                <div className={`h-40 ${template.color} relative flex items-center justify-center`}>
                  <Receipt className="h-12 w-12 text-white/30" />
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                      {template.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">Print-ready · PDF · Mobile-friendly</p>
                  <Link
                    href="/tools/invoice-maker"
                    className="flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700"
                  >
                    Use This Template
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-slate-500">
              Plus 6 more templates: Creative Agency, Legal Firm, Medical Practice, Construction, Consulting, and Retail.
            </p>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Testimonials ────────────────────────── */}
      <section className="py-20 sm:py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by Freelancers Across America
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join 150,000+ professionals who switched from Excel and expensive software to our free invoice maker.
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
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
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
      <section className="py-20 sm:py-24 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Receipt className="h-12 w-12 text-emerald-100 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Stop Wasting Time on Invoicing
          </h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your first professional invoice is 10 seconds away. No credit card. No signup. No catch. 
            Just click, fill, and send.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/inv-maker"
              className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-all shadow-xl"
            >
              Create Your First Invoice — Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Unlimited Invoices
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              PDF Downloads
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Payment Details Built-In
            </span>
          </div>
        </div>
      </section>

      {/* ── Cross-Promotion: Payslip & Calculators ─────────────── */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Explore More Free Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              FinCalcPro is your all-in-one financial toolkit. Try our newly launched tools and calculators built for the USA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Payslip Promo */}
            <Link
              href="/tools/payslip-generator"
              className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-4">
                  <Sparkles className="h-3 w-3" />
                  NEWLY LAUNCHED
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Payslip Generator</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Generate detailed payslips with federal tax deductions, FICA, state tax, and net pay calculations. 
                  Perfect for small businesses and 1099 contractors across the USA.
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Try Payslip Generator
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Calculators Promo */}
            <Link
              href="/"
              className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-8 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-4">
                  <Star className="h-3 w-3" />
                  12+ FREE TOOLS
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                    <Calculator className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Financial Calculators</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  From mortgage payments and compound interest to federal tax estimates and retirement planning. 
                  All calculators are free, private, and built for the US financial system.
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
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
              Everything you need to know about our free invoice maker.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Is the Invoice Maker really 100% free?",
                a: "Yes. Absolutely. No credit card, no trial period, no hidden fees. Create unlimited invoices, download unlimited PDFs, and add your own payment details. We do not process payments ourselves — so there are no extra fees from us.",
              },
              {
                q: "Do I need to create an account or log in?",
                a: "No. We do not require any signup, email, or password. Jump straight in and start invoicing. For convenience, we optionally save your business details locally on your device so you do not have to retype them next time.",
              },
              {
                q: "Are the invoices legally valid in the USA?",
                a: "Yes. Our invoices include all required fields for US business transactions: business details, line items, quantities, rates, subtotals, tax breakdowns, and totals. They comply with standard IRS record-keeping requirements for freelancers and small businesses.",
              },
              {
                q: "Can I add sales tax for my state?",
                a: "Absolutely. Our invoice maker supports state-specific sales tax rates for all 50 US states. Simply select your state and we auto-apply the correct rate. You can also enter a custom tax rate if needed.",
              },
              {
                q: "How do I get paid through the invoice?",
                a: "You add your own payment information — like your Venmo handle, PayPal.me link, Zelle email, Stripe link, or bank transfer details. We format it professionally on the invoice. Your clients pay you directly using their preferred app. We never touch the money.",
              },
              {
                q: "Can I share invoices on WhatsApp or Email?",
                a: "Yes. After creating your invoice, you get one-click sharing options for WhatsApp, Email, SMS, and direct link copy. Your clients receive a clean, mobile-friendly preview and can download the PDF instantly.",
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
                  <Receipt className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">
                  FinCalc<span className="text-emerald-600">Pro</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                Free invoice maker, payslip generator, and financial calculators for freelancers and small businesses across the USA.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Invoice Maker
              </h4>
              <ul className="space-y-3">
                <li><Link href="/tools/inv-maker" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Create Invoice</Link></li>
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
                <li><Link href="/tools/payslip-generator" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Payslip Generator</Link></li>
                <li><Link href="/tools/invoice-maker" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Invoice Maker</Link></li>
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