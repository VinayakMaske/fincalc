// src/app/tools/invoice-maker/[[...profession]]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Receipt, Zap, Shield, Globe, Clock, CheckCircle2, Star,
  FileText, CreditCard, Smartphone, Palette, Lock, Heart, Menu, X,
  Sparkles, ChevronRight, Calculator, Briefcase, Camera, Scale, Truck,
  Paintbrush, Code, Wrench, Users, Home, Scissors, HardHat, GraduationCap,
  Utensils, Dumbbell, TreePine, ArrowUpRight,
} from "lucide-react";

// ── Profession Images ──────────────────────────────────────
const PROFESSION_IMAGES: Record<string, string> = {
  freelancer: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  photographer: "https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80",
  "legal-advisor": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
  "truck-driver": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
  "graphic-designer": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "web-developer": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  mechanic: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80",
  consultant: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  "real-estate": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  contractor: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  "event-planner": "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  tutor: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  caterer: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
  "personal-trainer": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  landscaper: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80",
};

// ── Profession Data Interface ──────────────────────────────
interface ProfessionData {
  slug: string;
  title: string;
  professionName: string;
  professionPlural: string;
  icon: React.ElementType;
  heroHeadline: string;
  heroSubheadline: string;
  testimonialRole: string;
  testimonialLocation: string;
  testimonialText: string;
  servicesExample: { item: string; qty: number; price: string }[];
  paymentMethod: string;
  faqExtra: { q: string; a: string }[];
  statsModifier: string;
}

// ── PROFESSIONS Data (Part 2/4) ────────────────────────────

const PROFESSIONS: Record<string, ProfessionData> = {
  freelancer: {
    slug: "freelancer",
    title: "Free Invoice Maker for Freelancers",
    professionName: "Freelancer",
    professionPlural: "Freelancers",
    icon: Briefcase,
    heroHeadline: "The #1 Free Invoice Maker Built for Freelancers",
    heroSubheadline: "Stop losing money to unpaid invoices. Create professional, payment-ready invoices in 10 seconds — designed specifically for independent contractors and gig workers across America.",
    testimonialRole: "Freelance Graphic Designer",
    testimonialLocation: "Austin, TX",
    testimonialText: "I used to spend 20 minutes on every invoice in Excel. Now it takes me literally 8 seconds. The templates look way more professional than anything I could make, and clients pay me the same day because my Zelle info is right there.",
    servicesExample: [
      { item: "Logo Design", qty: 1, price: "$850.00" },
      { item: "Brand Guidelines", qty: 1, price: "$1,200.00" },
      { item: "Social Media Kit", qty: 1, price: "$450.00" },
    ],
    paymentMethod: "Pay via Venmo @designstudio · Zelle: design@email.com",
    faqExtra: [
      { q: "Do 1099 contractors need special invoices?", a: "Yes. Our invoices include all fields the IRS requires for 1099 record-keeping: your business name, TIN/EIN if applicable, dates, services rendered, and amounts. This makes tax season painless for freelancers." },
      { q: "Can I invoice for hourly work?", a: "Absolutely. Set your hourly rate, add hours worked, and we calculate the total automatically. Perfect for writers, developers, consultants, and virtual assistants." },
    ],
    statsModifier: "Freelancers",
  },

  photographer: {
    slug: "photographer",
    title: "Free Invoice Maker for Photographers",
    professionName: "Photographer",
    professionPlural: "Photographers",
    icon: Camera,
    heroHeadline: "Free Invoice Maker for Photographers & Videographers",
    heroSubheadline: "From wedding shoots to real estate listings — create stunning invoices that match your creative brand. Add your portfolio link, payment details, and print-ready deliverables list in seconds.",
    testimonialRole: "Wedding Photographer",
    testimonialLocation: "Miami, FL",
    testimonialText: "I shoot 30+ weddings a year. This tool saves me hours every month. I add my PayPal.me link and clients pay deposits within hours. The 'Modern Minimal' template matches my brand perfectly.",
    servicesExample: [
      { item: "Wedding Coverage (8 hrs)", qty: 1, price: "$2,500.00" },
      { item: "Engagement Session", qty: 1, price: "$450.00" },
      { item: "Premium Album (20 pgs)", qty: 2, price: "$380.00" },
    ],
    paymentMethod: "Pay via PayPal.me/PhotoStudio · Venmo: @PhotoStudio",
    faqExtra: [
      { q: "Can I add a deposit requirement to my invoice?", a: "Yes. Create a 'Deposit Invoice' with 50% upfront, then a final invoice for the balance. Both link together so clients see the full project cost clearly." },
      { q: "Do you support print release and licensing fees?", a: "Absolutely. Add line items for 'Print Release License', 'Digital Gallery Access', or 'Commercial Usage Rights' with custom pricing per image or package." },
    ],
    statsModifier: "Photographers",
  },

  "legal-advisor": {
    slug: "legal-advisor",
    title: "Free Invoice Maker for Legal Advisors & Attorneys",
    professionName: "Legal Advisor",
    professionPlural: "Legal Professionals",
    icon: Scale,
    heroHeadline: "Professional Invoicing for Attorneys & Legal Advisors",
    heroSubheadline: "Bill by the hour, by case, or by retainer. Our invoice maker supports trust accounting, multiple billing rates, and detailed time entries — all formatted to meet state bar standards.",
    testimonialRole: "Solo Practitioner",
    testimonialLocation: "Chicago, IL",
    testimonialText: "I bill at $350/hour and need every minute documented. This tool lets me add detailed time entries, case numbers, and trust account references. My clients trust the transparency, and I get paid faster.",
    servicesExample: [
      { item: "Legal Consultation (2.5 hrs)", qty: 1, price: "$875.00" },
      { item: "Contract Review & Drafting", qty: 1, price: "$1,200.00" },
      { item: "Court Filing Fees", qty: 1, price: "$350.00" },
    ],
    paymentMethod: "Pay via Zelle: legal@firm.com · Wire Transfer: Chase ****4532",
    faqExtra: [
      { q: "Can I add trust account details?", a: "Yes. Add your IOLTA trust account information, case numbers, and matter references. Our templates maintain the professional formatting expected by courts and bar associations." },
      { q: "Does this support multiple billing rates?", a: "Absolutely. Set different rates for paralegal work ($150/hr), attorney time ($350/hr), and flat-fee services. Each line item shows the rate clearly." },
    ],
    statsModifier: "Legal Pros",
  },

  "truck-driver": {
    slug: "truck-driver",
    title: "Free Invoice Maker for Truck Drivers & Owner-Operators",
    professionName: "Truck Driver",
    professionPlural: "Truck Drivers",
    icon: Truck,
    heroHeadline: "Invoice Generator for Truckers & Owner-Operators",
    heroSubheadline: "Get paid for every mile and every load. Create DOT-compliant invoices with fuel surcharges, detention fees, and per-mile rates — all from your phone at the truck stop.",
    testimonialRole: "Owner-Operator",
    testimonialLocation: "Dallas, TX",
    testimonialText: "I haul 4 loads a week and used to wait weeks for brokers to send invoices. Now I create and send invoices from my cab using my phone. Detention fees, fuel surcharges, everything itemized. Game changer.",
    servicesExample: [
      { item: "Load: Dallas → Atlanta (850 mi)", qty: 1, price: "$1,700.00" },
      { item: "Fuel Surcharge", qty: 1, price: "$280.00" },
      { item: "Detention (4 hrs @ $50/hr)", qty: 1, price: "$200.00" },
    ],
    paymentMethod: "Pay via Zelle: trucking@email.com · ACH: Routing 021000021",
    faqExtra: [
      { q: "Can I add BOL and load numbers?", a: "Yes. Add BOL numbers, load IDs, MC numbers, and rate confirmation references. This helps brokers process your payment faster and reduces disputes." },
      { q: "Does it calculate fuel surcharges automatically?", a: "Enter your base rate and fuel surcharge percentage, and we calculate it automatically based on current DOE national average rates." },
    ],
    statsModifier: "Truckers",
  },

  "graphic-designer": {
    slug: "graphic-designer",
    title: "Free Invoice Maker for Graphic Designers",
    professionName: "Graphic Designer",
    professionPlural: "Graphic Designers",
    icon: Paintbrush,
    heroHeadline: "Invoice Maker Built for Graphic & Web Designers",
    heroSubheadline: "Brand your invoices like you brand your clients' businesses. Add your logo, portfolio link, and color-coded line items for concepts, revisions, and final deliverables.",
    testimonialRole: "Brand Designer",
    testimonialLocation: "Seattle, WA",
    testimonialText: "I was losing money on 'just one more change' requests. Now I itemize 'Concept Development', 'Revision Round 1', 'Revision Round 2' with clear prices. Clients respect the boundaries and pay on time.",
    servicesExample: [
      { item: "Brand Identity Concept (3 dirs)", qty: 1, price: "$2,400.00" },
      { item: "Revision Round 2", qty: 1, price: "$350.00" },
      { item: "Final File Package (all formats)", qty: 1, price: "$200.00" },
    ],
    paymentMethod: "Pay via PayPal.me/DesignStudio · Venmo: @DesignStudio",
    faqExtra: [
      { q: "Can I add my design portfolio link?", a: "Yes. Add your Behance, Dribbble, or personal website link to the invoice header. Clients can view your work while reviewing the bill, building trust and justifying your rates." },
      { q: "How do I bill for unlimited revisions?", a: "Use our 'Revision Packages' line item — bill a flat fee for 3 rounds, then add additional rounds at your hourly rate. This protects your time and income." },
    ],
    statsModifier: "Designers",
  },

  "web-developer": {
    slug: "web-developer",
    title: "Free Invoice Maker for Web Developers & Programmers",
    professionName: "Web Developer",
    professionPlural: "Web Developers",
    icon: Code,
    heroHeadline: "Invoice Generator for Developers & Software Engineers",
    heroSubheadline: "Bill for sprints, features, bug fixes, and maintenance. Support for hourly rates, milestone payments, and retainer agreements — all with GitHub-friendly formatting.",
    testimonialRole: "Full-Stack Developer",
    testimonialLocation: "San Francisco, CA",
    testimonialText: "I bill $150/hour for development and used to lose track of hours across Jira, Trello, and spreadsheets. Now I export my time entries directly into a clean invoice with sprint references. Clients love the transparency.",
    servicesExample: [
      { item: "Sprint 3: User Auth System", qty: 1, price: "$3,200.00" },
      { item: "Bug Fixes (12 hrs @ $150/hr)", qty: 1, price: "$1,800.00" },
      { item: "Monthly Maintenance Retainer", qty: 1, price: "$800.00" },
    ],
    paymentMethod: "Pay via Stripe: pay.devstudio.com · ACH: Silicon Valley Bank",
    faqExtra: [
      { q: "Can I link to GitHub commits or project boards?", a: "Yes. Add URLs to GitHub issues, pull requests, or project milestones in the line item descriptions. Clients see exactly what they're paying for." },
      { q: "How do I handle milestone-based payments?", a: "Create separate invoices for each milestone (Design → Development → Launch) or combine them into one invoice with milestone subtotals. Both options are fully supported." },
    ],
    statsModifier: "Developers",
  },

// ── PROFESSIONS Data (Part 3/4) ────────────────────────────

  mechanic: {
    slug: "mechanic",
    title: "Free Invoice Maker for Auto Mechanics & Repair Shops",
    professionName: "Mechanic",
    professionPlural: "Mechanics",
    icon: Wrench,
    heroHeadline: "Professional Invoicing for Auto Mechanics & Shops",
    heroSubheadline: "Itemize parts, labor, diagnostics, and warranty work. Create shop-branded invoices with your logo, ASE certifications, and payment terms that get you paid before the customer drives away.",
    testimonialRole: "Shop Owner",
    testimonialLocation: "Phoenix, AZ",
    testimonialText: "We do 40+ repairs a day. This tool lets my service writers create invoices with parts numbers, labor hours, and warranty info in under a minute. Customers pay at the counter with Zelle or card. No more net-30 headaches.",
    servicesExample: [
      { item: "Brake Pad Replacement (Front)", qty: 1, price: "$280.00" },
      { item: "Labor (2.5 hrs @ $95/hr)", qty: 1, price: "$237.50" },
      { item: "Diagnostic Fee", qty: 1, price: "$89.00" },
    ],
    paymentMethod: "Pay at counter: Card · Zelle: shop@repair.com · Cash Accepted",
    faqExtra: [
      { q: "Can I add parts numbers and warranty info?", a: "Yes. Add OEM part numbers, warranty terms (12mo/12k miles), and labor descriptions. This protects your shop from comebacks and builds customer trust." },
      { q: "Does it support multiple technicians?", a: "Absolutely. Add technician names and certification numbers to each line item. Perfect for shops with ASE-certified specialists billing at different rates." },
    ],
    statsModifier: "Mechanics",
  },

  consultant: {
    slug: "consultant",
    title: "Free Invoice Maker for Business Consultants",
    professionName: "Consultant",
    professionPlural: "Consultants",
    icon: Users,
    heroHeadline: "Executive-Level Invoicing for Business Consultants",
    heroSubheadline: "Bill for strategy sessions, market research, and implementation support. Our corporate templates project authority while itemizing every hour of your expertise.",
    testimonialRole: "Management Consultant",
    testimonialLocation: "New York, NY",
    testimonialText: "I bill Fortune 500 clients $500/hour. They expect Fortune 500-level invoices. The 'Corporate Pro' template looks like it came from a $10k billing system. And I add '2% 10 Net 30' terms to get paid in 10 days instead of 60.",
    servicesExample: [
      { item: "Strategic Planning Session (8 hrs)", qty: 1, price: "$4,000.00" },
      { item: "Market Analysis Report", qty: 1, price: "$3,500.00" },
      { item: "Implementation Support (20 hrs)", qty: 1, price: "$10,000.00" },
    ],
    paymentMethod: "Wire Transfer: JP Morgan Chase · ACH: Consultant LLC · Check Accepted",
    faqExtra: [
      { q: "Can I add early payment discounts?", a: "Yes. Add terms like '2% 10 Net 30' (2% discount if paid in 10 days, net due in 30) to incentivize faster payment from corporate clients." },
      { q: "Does it support retainer agreements?", a: "Absolutely. Create monthly retainer invoices with 'Retainer Fee' line items, hours used vs. hours remaining, and rollover hour tracking." },
    ],
    statsModifier: "Consultants",
  },

  "real-estate": {
    slug: "real-estate",
    title: "Free Invoice Maker for Real Estate Agents & Brokers",
    professionName: "Real Estate Agent",
    professionPlural: "Real Estate Professionals",
    icon: Home,
    heroHeadline: "Commission & Fee Invoicing for Real Estate Pros",
    heroSubheadline: "Invoice for buyer representation, listing fees, staging costs, and referral commissions. MLS-compliant formatting with broker approval workflows and E&O insurance references.",
    testimonialRole: "Realtor",
    testimonialLocation: "Denver, CO",
    testimonialText: "I close 2-3 deals a month and need to invoice my broker for commissions plus itemize staging and photography costs. This tool handles both in one invoice. My broker processes it same-day because everything is documented.",
    servicesExample: [
      { item: "Buyer Representation Commission", qty: 1, price: "$8,500.00" },
      { item: "Professional Photography", qty: 1, price: "$350.00" },
      { item: "Home Staging Consultation", qty: 1, price: "$200.00" },
    ],
    paymentMethod: "Broker Disbursement: Wire to Wells Fargo ****7821 · Check to Brokerage",
    faqExtra: [
      { q: "Can I add MLS numbers and closing dates?", a: "Yes. Add MLS listing numbers, closing dates, property addresses, and broker of record information. This streamlines commission disbursement." },
      { q: "Does it handle referral commissions?", a: "Absolutely. Create referral invoices with the originating agent's info, referral percentage (typically 25%), and closing documentation." },
    ],
    statsModifier: "Realtors",
  },

  salon: {
    slug: "salon",
    title: "Free Invoice Maker for Salons & Beauty Professionals",
    professionName: "Salon Owner",
    professionPlural: "Beauty Professionals",
    icon: Scissors,
    heroHeadline: "Beautiful Invoicing for Salons, Barbers & Spas",
    heroSubheadline: "Create branded receipts and invoices for services, retail products, and package deals. Support for tips, gift cards, and loyalty program tracking — all with a style that matches your salon's aesthetic.",
    testimonialRole: "Salon Owner",
    testimonialLocation: "Los Angeles, CA",
    testimonialText: "We sell Kerastase products alongside cuts and colors. This tool lets us itemize every service, add retail with SKU numbers, and include tip lines. Clients pay via Venmo before they leave the chair. No more 'I'll Venmo you later' that never comes.",
    servicesExample: [
      { item: "Balayage Color & Treatment", qty: 1, price: "$280.00" },
      { item: "Kerastase Elixir (Retail)", qty: 1, price: "$48.00" },
      { item: "Blowout & Style", qty: 1, price: "$65.00" },
    ],
    paymentMethod: "Pay via Square: salon.square.site · Venmo: @GlamSalon · Tip Appreciated",
    faqExtra: [
      { q: "Can I add tip lines to invoices?", a: "Yes. Add a 'Gratuity' line item or include a tip suggestion section (15%, 20%, 25%). Clients can add tips via Venmo, PayPal, or cash." },
      { q: "Does it support package deals and memberships?", a: "Absolutely. Create 'Monthly Membership' invoices with discounted service bundles, or 'Package of 6' invoices with per-session breakdowns." },
    ],
    statsModifier: "Salons",
  },

  contractor: {
    slug: "contractor",
    title: "Free Invoice Maker for General Contractors & Builders",
    professionName: "Contractor",
    professionPlural: "Contractors",
    icon: HardHat,
    heroHeadline: "Construction Invoicing for Contractors & Builders",
    heroSubheadline: "Handle progress billing, change orders, material costs, and subcontractor payments. AIA-style formatting with lien waiver references and retainage tracking for commercial and residential projects.",
    testimonialRole: "General Contractor",
    testimonialLocation: "Atlanta, GA",
    testimonialText: "I run a $2M remodeling business. This tool handles our progress billing (30/50/20), change orders with photo documentation, and subcontractor payments. The 'Construction' template looks like it came from Procore but costs nothing.",
    servicesExample: [
      { item: "Kitchen Remodel - Phase 2 (50%)", qty: 1, price: "$18,500.00" },
      { item: "Change Order: Granite Upgrade", qty: 1, price: "$2,800.00" },
      { item: "Permit & Inspection Fees", qty: 1, price: "$450.00" },
    ],
    paymentMethod: "Pay via Check: GC Construction LLC · Wire: Bank of America ****9921",
    faqExtra: [
      { q: "Does it support AIA-style progress billing?", a: "Yes. Use our 'Progress Billing' template with percentage complete (e.g., 30% deposit, 50% mid-project, 20% final), retainage tracking, and lien waiver references." },
      { q: "Can I attach change order documentation?", a: "Absolutely. Add change order numbers, before/after photo references, and client approval signatures to line item descriptions for legal protection." },
    ],
    statsModifier: "Contractors",
  },

  "event-planner": {
    slug: "event-planner",
    title: "Free Invoice Maker for Event Planners & Coordinators",
    professionName: "Event Planner",
    professionPlural: "Event Planners",
    icon: Sparkles,
    heroHeadline: "Event Planning Invoicing for Weddings & Corporate Events",
    heroSubheadline: "Manage deposits, vendor payments, and final balances for weddings, corporate events, and private parties. Timeline-based invoicing with vendor coordination and gratuity tracking.",
    testimonialRole: "Wedding Planner",
    testimonialLocation: "Nashville, TN",
    testimonialText: "I coordinate 25+ weddings a year with 8-12 vendors each. This tool lets me create separate vendor payment invoices and client billing invoices, all linked to the same event. No more confusion about who paid what and when.",
    servicesExample: [
      { item: "Full Wedding Coordination", qty: 1, price: "$4,500.00" },
      { item: "Vendor Coordination Fee (12 vendors)", qty: 1, price: "$1,200.00" },
      { item: "Day-of Coordination (12 hrs)", qty: 1, price: "$1,800.00" },
    ],
    paymentMethod: "Pay via Venmo: @EliteEvents · Zelle: planner@events.com · Check",
    faqExtra: [
      { q: "Can I create separate vendor and client invoices?", a: "Yes. Create 'Vendor Payment' invoices for caterers, florists, DJs, etc., and 'Client Billing' invoices for your coordination fee + vendor markups. All linked to the same event." },
      { q: "How do I handle event deposits and final payments?", a: "Use our deposit schedule: 50% to book, 25% at 30 days out, 25% final payment 2 weeks before the event. Each invoice references the event date and venue." },
    ],
    statsModifier: "Planners",
  },

  tutor: {
    slug: "tutor",
    title: "Free Invoice Maker for Tutors & Educators",
    professionName: "Tutor",
    professionPlural: "Tutors",
    icon: GraduationCap,
    heroHeadline: "Simple Invoicing for Tutors & Private Educators",
    heroSubheadline: "Bill for sessions, packages, and test prep courses. Parent-friendly formatting with progress reports, subject breakdowns, and flexible payment options including HSA/FSA for special education services.",
    testimonialRole: "Math Tutor",
    testimonialLocation: "Boston, MA",
    testimonialText: "I tutor 15 students a week in SAT prep. Parents love getting invoices that show exactly which topics we covered, practice test scores, and hours logged. I get paid monthly instead of chasing weekly payments.",
    servicesExample: [
      { item: "SAT Math Prep (8 sessions)", qty: 1, price: "$640.00" },
      { item: "Practice Test & Review", qty: 2, price: "$120.00" },
      { item: "Study Materials (Books/Online)", qty: 1, price: "$85.00" },
    ],
    paymentMethod: "Pay via Venmo: @MathTutor · Zelle: tutor@email.com · Check from Parent",
    faqExtra: [
      { q: "Can I add session notes and progress tracking?", a: "Yes. Add detailed session descriptions like 'Covered: Quadratic Functions, Practice Test #3 Score: 1420 → 1480'. Parents see the value in every dollar spent." },
      { q: "Does it support monthly package billing?", a: "Absolutely. Create 'Monthly Tutoring Package' invoices with 4, 8, or 12 sessions, bulk discounts, and make-up session credits." },
    ],
    statsModifier: "Tutors",
  },

  cleaning: {
    slug: "cleaning",
    title: "Free Invoice Maker for Cleaning Services",
    professionName: "Cleaning Pro",
    professionPlural: "Cleaning Professionals",
    icon: Sparkles,
    heroHeadline: "Spotless Invoicing for Cleaning Services & Maids",
    heroSubheadline: "Bill for residential, commercial, and deep cleaning services. Add square footage, room counts, and special requests. Recurring weekly/monthly invoices with automatic scheduling reminders.",
    testimonialRole: "Cleaning Business Owner",
    testimonialLocation: "Houston, TX",
    testimonialText: "We clean 40 homes a week. This tool lets us create 'Weekly Maintenance' invoices for recurring clients and 'Deep Clean' invoices for one-offs. We add room counts and square footage so clients know exactly what they're paying for.",
    servicesExample: [
      { item: "Weekly Maintenance (3 bed/2 bath)", qty: 4, price: "$480.00" },
      { item: "Deep Clean - Kitchen & Bathrooms", qty: 1, price: "$280.00" },
      { item: "Move-Out Clean (1,800 sq ft)", qty: 1, price: "$450.00" },
    ],
    paymentMethod: "Pay via Venmo: @CleanPro · Zelle: clean@service.com · Cash",
    faqExtra: [
      { q: "Can I bill by square footage or room count?", a: "Yes. Add 'Weekly Service - 4 visits @ $80/visit' or '3 Bed / 2 Bath - Deep Clean' with per-square-foot or per-room pricing." },
      { q: "Does it support recurring weekly/monthly invoices?", a: "Absolutely. Create template invoices for 'Weekly Maintenance', 'Bi-Weekly Service', or 'Monthly Deep Clean' and duplicate them with updated dates." },
    ],
    statsModifier: "Cleaners",
  },

  caterer: {
    slug: "caterer",
    title: "Free Invoice Maker for Caterers & Private Chefs",
    professionName: "Caterer",
    professionPlural: "Caterers",
    icon: Utensils,
    heroHeadline: "Gourmet Invoicing for Caterers & Private Chefs",
    heroSubheadline: "Handle per-person pricing, menu packages, staffing fees, and equipment rentals. Event-based invoicing with dietary restrictions, head counts, and gratuity breakdowns for weddings and corporate events.",
    testimonialRole: "Private Chef",
    testimonialLocation: "Charleston, SC",
    testimonialText: "I cater weddings for 150+ guests with last-minute head count changes. This tool lets me create invoices with 'Minimum Guaranteed' and 'Final Count' tiers, plus staffing and rental line items. No more eating costs when the count drops.",
    servicesExample: [
      { item: "Wedding Dinner (150 guests @ $85/pp)", qty: 1, price: "$12,750.00" },
      { item: "Service Staff (4 servers @ $35/hr x 8 hrs)", qty: 1, price: "$1,120.00" },
      { item: "Rental: Linens & Tableware", qty: 1, price: "$680.00" },
    ],
    paymentMethod: "Pay via Venmo: @ChefEvents · Zelle: chef@events.com · Check",
    faqExtra: [
      { q: "Can I handle changing head counts?", a: "Yes. Create invoices with 'Minimum Guaranteed: 120 guests @ $85' and 'Final Count: 150 guests @ $85' tiers. Add a 'Head Count Adjustment' line item if numbers change." },
      { q: "Does it support dietary restriction tracking?", a: "Absolutely. Add notes for '15 Vegan Meals', '8 Gluten-Free', '2 Nut Allergy' to line item descriptions for kitchen coordination." },
    ],
    statsModifier: "Caterers",
  },

  "personal-trainer": {
    slug: "personal-trainer",
    title: "Free Invoice Maker for Personal Trainers & Coaches",
    professionName: "Personal Trainer",
    professionPlural: "Fitness Coaches",
    icon: Dumbbell,
    heroHeadline: "Fit Invoicing for Personal Trainers & Fitness Coaches",
    heroSubheadline: "Bill for sessions, packages, nutrition plans, and online coaching. Client progress tracking with session counts, body measurements, and fitness goal milestones built into every invoice.",
    testimonialRole: "Personal Trainer",
    testimonialLocation: "San Diego, CA",
    testimonialText: "I sell 12-session packages and used to lose track of who had how many left. Now my invoices show 'Session 4 of 12 - Expires 08/15/2026' with progress notes. Clients show up because they see their investment.",
    servicesExample: [
      { item: "12-Session Package (Strength)", qty: 1, price: "$960.00" },
      { item: "Nutrition Plan & Meal Prep Guide", qty: 1, price: "$150.00" },
      { item: "Body Composition Assessment", qty: 1, price: "$75.00" },
    ],
    paymentMethod: "Pay via Venmo: @FitCoach · Zelle: trainer@fitness.com · Cash",
    faqExtra: [
      { q: "Can I track session usage on invoices?", a: "Yes. Add 'Session 5 of 12' or '8 sessions remaining - Expires: [Date]' to each invoice. Clients see their package status and are motivated to use sessions." },
      { q: "Does it support online coaching billing?", a: "Absolutely. Add 'Zoom Training Session', 'Custom Workout Plan', or 'Weekly Check-in' line items with virtual delivery notes." },
    ],
    statsModifier: "Trainers",
  },

  landscaper: {
    slug: "landscaper",
    title: "Free Invoice Maker for Landscapers & Lawn Care",
    professionName: "Landscaper",
    professionPlural: "Landscapers",
    icon: TreePine,
    heroHeadline: "Green Industry Invoicing for Landscapers & Lawn Care",
    heroSubheadline: "Bill for maintenance contracts, installations, seasonal cleanups, and irrigation services. Property-based invoicing with square footage, plant counts, and material costs clearly itemized.",
    testimonialRole: "Landscaping Business Owner",
    testimonialLocation: "Orlando, FL",
    testimonialText: "We maintain 60 properties weekly. This tool lets us create 'Seasonal Contract' invoices with 'March: Mow/Edge/Blow x 4 visits' and 'Spring Cleanup: 2,500 sq ft property' with mulch and plant costs itemized. No surprises.",
    servicesExample: [
      { item: "Weekly Maintenance (Mar 2026 - 4 visits)", qty: 1, price: "$320.00" },
      { item: "Spring Cleanup (2,500 sq ft)", qty: 1, price: "$450.00" },
      { item: "Mulch Installation (5 cu yds @ $65/yd)", qty: 1, price: "$325.00" },
    ],
    paymentMethod: "Pay via Check: GreenScapes LLC · Zelle: green@landscape.com",
    faqExtra: [
      { q: "Can I bill by property size or visit count?", a: "Yes. Add 'Weekly Service - 4 visits @ $80/visit' or 'Per-Square-Foot Installation: 2,500 sq ft @ $0.18/sq ft' for transparent pricing." },
      { q: "Does it handle seasonal contracts?", a: "Absolutely. Create 'Spring/Summer/Fall' contract invoices with monthly breakdowns, snow removal add-ons, and holiday decoration line items." },
    ],
    statsModifier: "Landscapers",
  },
};

const DEFAULT_PROFESSION: ProfessionData = {
  slug: "generic",
  title: "Free Invoice Maker for Any Business",
  professionName: "Business Owner",
  professionPlural: "Businesses",
  icon: Receipt,
  heroHeadline: "The #1 Free Invoice Maker for USA Businesses",
  heroSubheadline: "Create professional, payment-ready invoices in 10 seconds. No signup, no fees, no limits. Built for freelancers, contractors, and small businesses across America.",
  testimonialRole: "Small Business Owner",
  testimonialLocation: "USA",
  testimonialText: "I switched from Excel to this tool and now create invoices in under 10 seconds. My clients pay faster because my Venmo and Zelle info is right on the invoice. Completely free and looks incredibly professional.",
  servicesExample: [
    { item: "Professional Service", qty: 1, price: "$1,500.00" },
    { item: "Consultation Fee", qty: 1, price: "$250.00" },
    { item: "Materials & Supplies", qty: 1, price: "$180.00" },
  ],
  paymentMethod: "Pay via Venmo · Zelle · PayPal · Check",
  faqExtra: [],
  statsModifier: "Businesses",
};

// ── All Professions for Footer ───────────────────────────────
const ALL_PROFESSIONS = Object.values(PROFESSIONS);

// ── Main Component (Part 4/6) ──────────────────────────────

export default function DynamicInvoiceLandingPage() {
  const params = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const professionSlug = useMemo(() => {
    const slug = params?.profession;
    if (Array.isArray(slug) && slug.length > 0) return slug[0].toLowerCase();
    if (typeof slug === "string") return slug.toLowerCase();
    return "generic";
  }, [params]);

  const data = PROFESSIONS[professionSlug] || DEFAULT_PROFESSION;
  const ProfessionIcon = data.icon;
  const professionImage = PROFESSION_IMAGES[professionSlug] || PROFESSION_IMAGES["freelancer"];

  const subtotal = data.servicesExample.reduce((acc, s) => acc + parseFloat(s.price.replace(/[$,]/g, "")), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Bill<span className="text-emerald-600">Swift</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Home</Link>
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How It Works</Link>
              <Link href="#templates" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Templates</Link>
              <Link href={`/tools/inv-maker?profession=${data.slug}`} className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                Create Invoice
              </Link>
            </div>

            <button className="md:hidden p-2 text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium text-slate-600 hover:text-emerald-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="#features" className="block text-sm font-medium text-slate-600 hover:text-emerald-600" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="block text-sm font-medium text-slate-600 hover:text-emerald-600" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link href="#templates" className="block text-sm font-medium text-slate-600 hover:text-emerald-600" onClick={() => setMobileMenuOpen(false)}>Templates</Link>
            <Link href={`/tools/inv-maker?profession=${data.slug}`} className="block rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white text-center" onClick={() => setMobileMenuOpen(false)}>Create Invoice</Link>
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
                <ProfessionIcon className="h-4 w-4" />
                <span>#1 Free Invoice Maker for {data.professionPlural} in the USA</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                {data.heroHeadline}
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                {data.heroSubheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
                <Link href={`/tools/inv-maker?profession=${data.slug}`} className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40">
                  Create Your First {data.professionName} Invoice
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#how-it-works" className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                  See How It Works
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" />Bank-Level Privacy</span>
                <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-emerald-500" />Built for USA {data.professionPlural}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-500" />24/7 Access</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />IRS-Compliant</span>
              </div>
            </div>

            {/* Hero Visual with Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-3xl blur-2xl opacity-30" />

                {/* Profession Image */}
                <div className="relative mb-4 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                  <img 
                    src={professionImage} 
                    alt={`${data.professionName} at work`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <ProfessionIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">{data.professionName} Services</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Preview Card */}
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                  <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <ProfessionIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold text-sm">INVOICE #00142</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">PAID</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">From</p>
                        <p className="text-sm font-semibold text-slate-900">{data.professionName} Services LLC</p>
                        <p className="text-xs text-slate-500">{data.testimonialLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-sm font-semibold text-slate-900">May 7, 2026</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Services</p>
                      <div className="space-y-2">
                        {data.servicesExample.map((line, i) => (
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
                        <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Tax (8.25%)</span>
                        <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-slate-900 mt-2 pt-2 border-t border-slate-100">
                        <span>Total</span>
                        <span className="text-emerald-600">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3 border border-blue-100">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-blue-700 font-medium">{data.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

// ── Stats Strip ──────────────────────────────────────────
      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "150K+", label: `${data.statsModifier} Invoiced`, icon: Receipt },
              { value: "$12M+", label: "Payments Processed", icon: CreditCard },
              { value: "4.9/5", label: `${data.statsModifier} Rating`, icon: Star },
              { value: "$0", label: "Cost to You", icon: Heart },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm mb-3 mx-auto group-hover:border-emerald-300 group-hover:shadow-md transition-all">
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
              Everything {data.professionPlural} Need to Get Paid Faster
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built specifically for {data.professionName.toLowerCase()}s across America who want professional invoices without the hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Generate in Under 10 Seconds", description: `No complex forms. Just add your ${data.professionName.toLowerCase()} details, line items, and hit download.`, color: "from-amber-500/10 to-orange-500/10", border: "border-amber-200", iconColor: "text-amber-600", bgIcon: "bg-amber-50" },
              { icon: CreditCard, title: "Payment Details Built-In", description: `Add Venmo, PayPal, Zelle directly on the invoice. ${data.professionPlural} get paid faster.`, color: "from-blue-500/10 to-cyan-500/10", border: "border-blue-200", iconColor: "text-blue-600", bgIcon: "bg-blue-50" },
              { icon: Smartphone, title: "Share on WhatsApp & Email", description: "One-click sharing. No app installs needed.", color: "from-emerald-500/10 to-teal-500/10", border: "border-emerald-200", iconColor: "text-emerald-600", bgIcon: "bg-emerald-50" },
              { icon: Lock, title: "No Login Required — Ever", description: "Jump straight in and start invoicing. Your privacy is our default.", color: "from-violet-500/10 to-purple-500/10", border: "border-violet-200", iconColor: "text-violet-600", bgIcon: "bg-violet-50" },
              { icon: Heart, title: "100% Free — No Hidden Fees", description: `Unlimited invoices. ${data.professionPlural} use it free, forever.`, color: "from-rose-500/10 to-pink-500/10", border: "border-rose-200", iconColor: "text-rose-600", bgIcon: "bg-rose-50" },
              { icon: Palette, title: "10+ Premium Templates", description: `Print-ready templates optimized for ${data.professionName.toLowerCase()} business standards.`, color: "from-indigo-500/10 to-violet-500/10", border: "border-indigo-200", iconColor: "text-indigo-600", bgIcon: "bg-indigo-50" },
            ].map((benefit) => (
              <div key={benefit.title} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
              Create a {data.professionName} Invoice in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No tutorials needed. If you can fill a form, you can create a stunning {data.professionName.toLowerCase()} invoice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Enter Your Details", description: `Add your ${data.professionName.toLowerCase()} business name, address, and logo.` },
              { step: "02", title: "Add Line Items & Tax", description: `List your ${data.professionName.toLowerCase()} services, set quantities, apply US sales tax.` },
              { step: "03", title: "Download & Share", description: "Export as PDF, send via email, or share on WhatsApp. Done." },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-lg font-bold text-emerald-600">{step.step}</span>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">10+ Templates Perfect for {data.professionPlural}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Every template is print-ready, mobile-optimized, and designed to impress your {data.professionName.toLowerCase()} clients.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Modern Minimal", tag: "Most Popular", color: "bg-slate-800" },
              { name: "Corporate Pro", tag: "Business", color: "bg-blue-700" },
              { name: "Freelance Fresh", tag: "Creative", color: "bg-emerald-600" },
              { name: "Classic Elegant", tag: "Professional", color: "bg-slate-600" },
            ].map((template) => (
              <div key={template.name} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                <div className={`h-40 ${template.color} relative flex items-center justify-center`}>
                  <ProfessionIcon className="h-12 w-12 text-white/30" />
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">{template.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">Print-ready · PDF · Mobile-friendly</p>
                  <Link href={`/tools/inv-maker?profession=${data.slug}`} className="flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                    Use for {data.professionName}
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Loved by {data.professionPlural} Across America</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Join 150,000+ {data.professionPlural.toLowerCase()} who switched from Excel to our free invoice maker.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  &ldquo;{i === 0 ? data.testimonialText : i === 1 ? `As a ${data.professionName.toLowerCase()} in ${data.testimonialLocation}, this tool changed everything. I create invoices between jobs and get paid before I even get home.` : `I recommend this to every ${data.professionName.toLowerCase()} I meet. It's free, professional, and takes literally seconds.`}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
                    {["S", "J", "M"][i]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{["Sarah", "James", "Emily"][i]} {["Mitchell", "Rodriguez", "Chen"][i]}</p>
                    <p className="text-xs text-slate-500">{i === 0 ? data.testimonialRole : `${data.professionName}`} · {i === 0 ? data.testimonialLocation : "USA"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <ProfessionIcon className="h-12 w-12 text-emerald-100 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Stop Wasting Time on {data.professionName} Invoicing</h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your first professional {data.professionName.toLowerCase()} invoice is 10 seconds away. No credit card. No signup. No catch.
          </p>
          <Link href={`/tools/inv-maker?profession=${data.slug}`} className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl">
            Create Your {data.professionName} Invoice — Free
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-200">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Unlimited Invoices</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />PDF Downloads</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Payment Details Built-In</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{data.professionName} Invoice FAQs</h2>
            <p className="text-lg text-slate-600">Everything {data.professionPlural.toLowerCase()} need to know.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: `Is this really free for ${data.professionPlural.toLowerCase()}?`, a: `Yes. No credit card, no hidden fees. ${data.professionPlural} create unlimited invoices, download unlimited PDFs.` },
              { q: `Do ${data.professionPlural.toLowerCase()} need to create an account?`, a: "No signup, email, or password required. Jump straight in and start invoicing." },
              { q: `Are invoices legally valid for ${data.professionName.toLowerCase()}s?`, a: `Yes. Our invoices include all required fields for US business transactions and comply with IRS record-keeping requirements.` },
              { q: `Can ${data.professionName.toLowerCase()}s add sales tax?`, a: "Supports state-specific sales tax rates for all 50 US states. Select your state and we auto-apply the correct rate." },
              { q: `How do ${data.professionName.toLowerCase()}s get paid?`, a: "Add your Venmo, PayPal, Zelle, or bank details. We format it professionally. Clients pay you directly." },
              { q: `Can ${data.professionPlural.toLowerCase()} share on WhatsApp?`, a: "Yes. One-click sharing to WhatsApp, Email, SMS. Clients receive a clean, mobile-friendly preview." },
              ...data.faqExtra,
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-300 transition-colors">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

// ── Cross-Promotion ──────────────────────────────────────
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">More Free Tools for {data.professionPlural}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">BillSwift is your all-in-one financial toolkit.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/tools/paystub-generator" className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-4">
                  <Sparkles className="h-3 w-3" />NEWLY LAUNCHED
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Paystub Generator</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Generate detailed payslips with federal tax deductions, FICA, state tax, and net pay calculations.</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Try Paystub Generator<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/" className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-8 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-4">
                  <Star className="h-3 w-3" />12+ FREE TOOLS
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                    <Calculator className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Financial Calculators</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">From mortgage payments to retirement planning. All calculators are free and built for the US financial system.</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                  Explore All Calculators<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:shadow-md transition-shadow">
                  <Receipt className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">Bill<span className="text-emerald-600">Swift</span></span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">Free invoice maker, paystub generator, and financial calculators for {data.professionPlural.toLowerCase()} across the USA.</p>
            </div>

            {/* Current Profession */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">{data.professionName} Invoice Maker</h4>
              <ul className="space-y-3">
                <li><Link href={`/tools/inv-maker?profession=${data.slug}`} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Create Invoice</Link></li>
                <li><Link href="#templates" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Templates</Link></li>
                <li><Link href="#features" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Features</Link></li>
              </ul>
            </div>

            {/* All Professions Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Invoice Makers by Profession</h4>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {ALL_PROFESSIONS.map((prof) => (
                  <li key={prof.slug}>
                    <Link 
                      href={`/tools/invoice-maker/${prof.slug}`} 
                      className="text-sm text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                    >
                      <prof.icon className="h-3 w-3" />
                      {prof.professionName}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Tools & Legal */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Business Tools</h4>
              <ul className="space-y-3">
                <li><Link href="/tools/paystub-generator" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Paystub Generator</Link></li>
                <li><Link href="/tools/inv-maker" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Invoice Maker</Link></li>
                <li><Link href="/" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">All Calculators</Link></li>
                <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2026 BillSwift. Free tools for {data.professionPlural.toLowerCase()} in the USA.</p>
            <div className="flex items-center gap-2 text-sm text-slate-500"><Shield className="h-4 w-4" /><span>Your data never leaves your browser</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}