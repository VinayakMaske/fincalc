// src/app/sitemap.ts
import { MetadataRoute } from "next";

// ─── Invoice Maker Professions (Programmatic SEO) ─────────────────────
const INVOICE_PROFESSIONS = [
  "freelancer", "photographer", "legal-advisor", "truck-driver",
  "graphic-designer", "web-developer", "mechanic", "consultant",
  "real-estate", "salon", "contractor", "event-planner",
  "tutor", "therapist", "cleaning", "caterer",
  "personal-trainer", "landscaper",
];

// ─── Pay Stub Generator Professions / Worker Types ────────────────────
const PAYSTUB_WORKER_TYPES = [
  "employee", "1099-contractor", "self-employed", "freelancer",
  "small-business", "restaurant", "landscaping", "construction",
  "gig-worker", "part-time", "hourly-worker", "salaried",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://billswift.com";

  // Invoice Maker profession-specific pages
  const invoiceProfessionUrls = INVOICE_PROFESSIONS.map((profession) => ({
    url: `${baseUrl}/tools/inv-maker/${profession}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Pay Stub Generator worker-type pages
  const paystubWorkerUrls = PAYSTUB_WORKER_TYPES.map((type) => ({
    url: `${baseUrl}/tools/pay-generator/${type}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    // ─── Core Pages ──────────────────────────────────────────────
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    
    // ─── Invoice Maker ───────────────────────────────────────────
    { url: `${baseUrl}/tools/invoice-maker`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/inv-maker`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...invoiceProfessionUrls,
    
    // ─── Pay Stub Generator ─────────────────────────────────────
    { url: `${baseUrl}/tools/pay-generator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...paystubWorkerUrls,
    
    // ─── Financial Calculators ──────────────────────────────────
    { url: `${baseUrl}/tools/mortgage-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/loan-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/auto-loan-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/compound-interest-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/retirement-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/federal-tax-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/credit-card-payoff-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/salary-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/debt-payoff-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/tools/roi-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    
    // ─── DevTools (if applicable) ───────────────────────────────
    // Add your dev tools pages here if you want them indexed
    
    // ─── Legal Pages ────────────────────────────────────────────
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}