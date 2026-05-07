// src/app/tools/invoice-maker/[[...profession]]/layout.tsx
import type { Metadata } from "next";

const PROFESSION_META: Record<string, { title: string; description: string }> = {
  freelancer: {
    title: "Free Invoice Maker for Freelancers | No Signup | BillSwift",
    description: "Free invoice maker for freelancers and 1099 contractors in the USA. No signup, no fees. Add Venmo, PayPal, Zelle. Create professional invoices in 10 seconds.",
  },
  photographer: {
    title: "Free Invoice Maker for Photographers | Wedding & Event Billing",
    description: "Free invoice maker for photographers and videographers in the USA. Wedding, portrait, event, and commercial photography billing. No signup, instant PDF download.",
  },
  "legal-advisor": {
    title: "Free Invoice Maker for Attorneys & Legal Advisors | Trust Accounting",
    description: "Free invoice maker for attorneys, paralegals, and legal advisors in the USA. Hourly billing, retainer invoices, trust accounting. Professional PDFs in 10 seconds. No signup.",
  },
  "truck-driver": {
    title: "Free Invoice Maker for Truck Drivers | Owner-Operator Billing",
    description: "Free invoice maker for truck drivers and owner-operators in the USA. Per-mile billing, fuel surcharges, detention fees. Mobile-friendly. No signup, instant PDF.",
  },
  "graphic-designer": {
    title: "Free Invoice Maker for Graphic Designers | Creative Billing",
    description: "Free invoice maker for graphic designers and web designers in the USA. Brand-ready templates, revision tracking, portfolio links. No signup, instant PDF download.",
  },
  "web-developer": {
    title: "Free Invoice Maker for Web Developers | Sprint Billing",
    description: "Free invoice maker for web developers and software engineers in the USA. Sprint billing, milestone payments, retainer invoices. No signup, professional PDFs in seconds.",
  },
  mechanic: {
    title: "Free Invoice Maker for Auto Mechanics | Shop Invoicing",
    description: "Free invoice maker for auto mechanics and repair shops in the USA. Parts, labor, diagnostics, warranty tracking. Shop-branded PDFs. No signup, instant download.",
  },
  consultant: {
    title: "Free Invoice Maker for Business Consultants | Executive Billing",
    description: "Free invoice maker for business and management consultants in the USA. Executive templates, hourly billing, retainer agreements. No signup, professional PDFs instantly.",
  },
  "real-estate": {
    title: "Free Invoice Maker for Real Estate Agents | Commission Tracking",
    description: "Free invoice maker for real estate agents and brokers in the USA. Commission tracking, MLS references, staging costs. Broker-ready PDFs. No signup, instant download.",
  },
  salon: {
    title: "Free Invoice Maker for Salons & Beauty Professionals",
    description: "Free invoice maker for salons, barbers, and beauty professionals in the USA. Service + retail billing, tip tracking, gift cards. Beautiful branded PDFs. No signup.",
  },
  contractor: {
    title: "Free Invoice Maker for Contractors | Construction Billing",
    description: "Free invoice maker for general contractors and builders in the USA. Progress billing, change orders, AIA-style formatting. Construction-grade PDFs. No signup, instant download.",
  },
  "event-planner": {
    title: "Free Invoice Maker for Event Planners | Wedding Billing",
    description: "Free invoice maker for event planners and coordinators in the USA. Wedding, corporate, and private event billing. Vendor payments, deposit tracking. No signup, instant PDFs.",
  },
  tutor: {
    title: "Free Invoice Maker for Tutors & Educators | Session Billing",
    description: "Free invoice maker for tutors and private educators in the USA. Session tracking, package billing, progress reports. Parent-friendly PDFs. No signup, instant download.",
  },
  cleaning: {
    title: "Free Invoice Maker for Cleaning Services | Maid Billing",
    description: "Free invoice maker for cleaning services and maids in the USA. Residential, commercial, deep cleaning billing. Recurring invoices. No signup, instant PDFs.",
  },
  caterer: {
    title: "Free Invoice Maker for Caterers | Per-Person Pricing",
    description: "Free invoice maker for caterers and private chefs in the USA. Per-person pricing, staffing, equipment rentals. Event-ready PDFs. No signup, instant download.",
  },
  "personal-trainer": {
    title: "Free Invoice Maker for Personal Trainers | Package Billing",
    description: "Free invoice maker for personal trainers and fitness coaches in the USA. Session packages, nutrition plans, progress tracking. No signup, instant PDFs.",
  },
  landscaper: {
    title: "Free Invoice Maker for Landscapers | Lawn Care Billing",
    description: "Free invoice maker for landscapers and lawn care services in the USA. Maintenance contracts, installations, seasonal cleanups. No signup, instant PDFs.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ profession?: string[] }> }): Promise<Metadata> {
  const { profession } = await params;
  const slug = profession?.[0] || "generic";
  const meta = PROFESSION_META[slug] || {
    title: "Free Invoice Maker | No Signup | Professional PDFs | BillSwift",
    description: "Free invoice maker for all businesses in the USA. No signup, no fees. Professional PDFs with payment links. Create invoices in 10 seconds.",
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: [slug === "generic" ? "invoice maker" : slug, "free invoice", "USA", "PDF", "billing", "professional invoice"],
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://billswift.com/tools/invoice-maker${slug === "generic" ? "" : `/${slug}`}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}