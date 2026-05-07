// src/app/tools/payslip-generator/page.tsx
"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft, FileText, Plus, Trash2, Download, Share2, Mail, Smartphone,
  CheckCircle2, ChevronDown, X, Sparkles, Palette, Eye, PenLine, Loader2,
  Calculator, Receipt, Star, ChevronRight,
} from "lucide-react";

// ─── SEO-Optimized Keywords Data ──────────────────────────────────────
// Primary: "pay stub" / "paystub" (USA spelling - 10x more searches than "pay stub")
// Secondary: "check stub", "paycheck stub", "payroll stub"
// Long-tail: "free pay stub generator", "1099 pay stub", "self employed pay stub"

const SEO_KEYWORDS = {
  primary: "Free Pay Stub Generator",
  secondary: "Check Stub Maker",
  tertiary: "Paycheck Stub Creator",
  longTail: [
    "free pay stub generator USA",
    "online pay stub maker",
    "instant pay stub generator",
    "1099 pay stub generator free",
    "self employed pay stub maker",
    "W-2 pay stub creator",
    "contractor pay stub generator",
    "payroll stub maker free",
    "create pay stub online free",
    "printable pay stub template",
  ],
};

type FilingStatus = "single" | "married_joint" | "married_separate" | "head_household" | "not_applicable";

interface Earning { id: string; type: string; hours: number; rate: number; }
interface Deduction { id: string; name: string; amount: number; isPreTax: boolean; }
interface TaxItem { id: string; name: string; rate: number; amount: number; enabled: boolean; category: "federal" | "fica" | "state"; }

interface PayslipData {
  employeeName: string; employeeId: string; employeeAddress: string; employeeCity: string;
  employeeState: string; employeeZip: string; ssnLast4: string; payPeriodStart: string;
  payPeriodEnd: string; payDate: string; companyName: string; companyAddress: string;
  companyCity: string; companyState: string; companyZip: string; companyEIN: string;
  filingStatus: FilingStatus; allowances: number; earnings: Earning[]; deductions: Deduction[];
  taxes: TaxItem[]; notes: string; logo: string | null;
}

interface Template {
  id: string; name: string; primary: string; secondary: string; accent: string;
  bg: string; headerBg: string; headerText: string; bodyText: string; border: string;
  tableHeader: string; tableRow: string; footerBg: string; font: string;
}

const templates: Template[] = [
  { id: "modern", name: "Modern Standard", primary: "#0f172a", secondary: "#64748b", accent: "#10b981", bg: "#ffffff", headerBg: "#0f172a", headerText: "#ffffff", bodyText: "#334155", border: "#e2e8f0", tableHeader: "#f8fafc", tableRow: "#ffffff", footerBg: "#f8fafc", font: "font-sans" },
  { id: "corporate", name: "Corporate Detail", primary: "#1e3a5f", secondary: "#6b7280", accent: "#2563eb", bg: "#ffffff", headerBg: "#1e3a5f", headerText: "#ffffff", bodyText: "#374151", border: "#d1d5db", tableHeader: "#eff6ff", tableRow: "#ffffff", footerBg: "#f8fafc", font: "font-sans" },
  { id: "contractor", name: "Contractor Simple", primary: "#064e3b", secondary: "#6b7280", accent: "#059669", bg: "#ffffff", headerBg: "#064e3b", headerText: "#ffffff", bodyText: "#374151", border: "#d1d5db", tableHeader: "#ecfdf5", tableRow: "#ffffff", footerBg: "#f0fdf4", font: "font-sans" },
  { id: "hourly", name: "Hourly Breakdown", primary: "#78350f", secondary: "#6b7280", accent: "#d97706", bg: "#ffffff", headerBg: "#78350f", headerText: "#ffffff", bodyText: "#374151", border: "#d1d5db", tableHeader: "#fffbeb", tableRow: "#ffffff", footerBg: "#fffbeb", font: "font-sans" },
];

// 2025 Federal Tax Brackets
const FEDERAL_BRACKETS: Record<Exclude<FilingStatus, "not_applicable">, { rate: number; min: number; max: number }[]> = {
  single: [
    { rate: 0.10, min: 0, max: 11925 }, { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 }, { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 }, { rate: 0.35, min: 250525, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity },
  ],
  married_joint: [
    { rate: 0.10, min: 0, max: 23850 }, { rate: 0.12, min: 23850, max: 96950 },
    { rate: 0.22, min: 96950, max: 206700 }, { rate: 0.24, min: 206700, max: 394600 },
    { rate: 0.32, min: 394600, max: 501050 }, { rate: 0.35, min: 501050, max: 751600 },
    { rate: 0.37, min: 751600, max: Infinity },
  ],
  married_separate: [
    { rate: 0.10, min: 0, max: 11925 }, { rate: 0.12, min: 11925, max: 48475 },
    { rate: 0.22, min: 48475, max: 103350 }, { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250525 }, { rate: 0.35, min: 250525, max: 375800 },
    { rate: 0.37, min: 375800, max: Infinity },
  ],
  head_household: [
    { rate: 0.10, min: 0, max: 17000 }, { rate: 0.12, min: 17000, max: 64850 },
    { rate: 0.22, min: 64850, max: 103350 }, { rate: 0.24, min: 103350, max: 197300 },
    { rate: 0.32, min: 197300, max: 250500 }, { rate: 0.35, min: 250500, max: 626350 },
    { rate: 0.37, min: 626350, max: Infinity },
  ],
};

const STANDARD_DEDUCTION: Record<Exclude<FilingStatus, "not_applicable">, number> = {
  single: 15750, married_joint: 31500, married_separate: 15750, head_household: 23625,
};

const US_STATES: Record<string, number> = {
  AL: 4.0, AK: 0.0, AZ: 5.6, AR: 6.5, CA: 7.25, CO: 2.9, CT: 6.35, DE: 0.0,
  FL: 6.0, GA: 4.0, HI: 4.0, ID: 6.0, IL: 6.25, IN: 7.0, IA: 6.0, KS: 6.5,
  KY: 6.0, LA: 4.45, ME: 5.5, MD: 6.0, MA: 6.25, MI: 6.0, MN: 6.875, MS: 7.0,
  MO: 4.225, MT: 0.0, NE: 5.5, NV: 6.85, NH: 0.0, NJ: 6.625, NM: 5.125, NY: 4.0,
  NC: 4.75, ND: 5.0, OH: 5.75, OK: 4.5, OR: 0.0, PA: 6.0, RI: 7.0, SC: 6.0,
  SD: 4.5, TN: 7.0, TX: 6.25, UT: 4.85, VT: 6.0, VA: 5.3, WA: 6.5, WV: 6.0,
  WI: 5.0, WY: 4.0, DC: 6.0,
};

function generateId() { return Math.random().toString(36).substring(2, 9); }
function formatCurrency(n: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function formatDate(d: string) { if (!d) return ""; return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }

function calculateFederalTax(gross: number, filingStatus: FilingStatus): number {
  if (filingStatus === "not_applicable") return 0;
  const brackets = FEDERAL_BRACKETS[filingStatus];
  const standardDeduction = STANDARD_DEDUCTION[filingStatus];
  const taxableIncome = Math.max(0, gross * 52 - standardDeduction);
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const amount = Math.min(taxableIncome, bracket.max) - bracket.min;
    tax += amount * bracket.rate;
  }
  return tax / 52;
}


export default function PayslipGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const payslipRef = useRef<HTMLDivElement>(null);
  const modalPayslipRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split("T")[0];
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const defaultTaxes: TaxItem[] = [
    { id: generateId(), name: "Federal Income Tax", rate: 0, amount: 0, enabled: true, category: "federal" },
    { id: generateId(), name: "Social Security", rate: 6.2, amount: 0, enabled: true, category: "fica" },
    { id: generateId(), name: "Medicare", rate: 1.45, amount: 0, enabled: true, category: "fica" },
  ];

  const [data, setData] = useState<PayslipData>({
    employeeName: "", employeeId: "", employeeAddress: "", employeeCity: "",
    employeeState: "", employeeZip: "", ssnLast4: "", payPeriodStart: twoWeeksAgo,
    payPeriodEnd: today, payDate: today, companyName: "", companyAddress: "",
    companyCity: "", companyState: "", companyZip: "", companyEIN: "",
    filingStatus: "single", allowances: 0,
    earnings: [{ id: generateId(), type: "Regular Pay", hours: 80, rate: 0 }],
    deductions: [{ id: generateId(), name: "Health Insurance", amount: 0, isPreTax: true }],
    taxes: defaultTaxes,
    notes: "", logo: null,
  });

  const template = templates.find((t) => t.id === selectedTemplate) || templates[0];

  // ─── Calculations ──────────────────────────────────────────────────
  const grossPay = useMemo(() => data.earnings.reduce((sum, e) => sum + e.hours * e.rate, 0), [data.earnings]);
  const preTaxDeductions = useMemo(() => data.deductions.filter((d) => d.isPreTax).reduce((sum, d) => sum + d.amount, 0), [data.deductions]);
  const taxableGross = useMemo(() => Math.max(0, grossPay - preTaxDeductions), [grossPay, preTaxDeductions]);

  // Auto-calculate tax amounts based on taxable gross
  const calculatedTaxes = useMemo(() => {
    return data.taxes.map((tax) => {
      if (!tax.enabled) return { ...tax, amount: 0 };
      let amount = 0;
      if (tax.category === "federal") {
        amount = calculateFederalTax(taxableGross, data.filingStatus);
      } else if (tax.category === "fica" && tax.name === "Social Security") {
        amount = Math.min(taxableGross * 0.062, 10903.20 / 26);
      } else if (tax.category === "fica" && tax.name === "Medicare") {
        amount = taxableGross * 0.0145;
      } else if (tax.category === "state") {
        const stateRate = data.employeeState ? US_STATES[data.employeeState] || 0 : 0;
        amount = taxableGross * (stateRate / 100);
      }
      return { ...tax, amount };
    });
  }, [data.taxes, taxableGross, data.filingStatus, data.employeeState]);

  const totalTax = useMemo(() => calculatedTaxes.filter((t) => t.enabled).reduce((sum, t) => sum + t.amount, 0), [calculatedTaxes]);
  const postTaxDeductions = useMemo(() => data.deductions.filter((d) => !d.isPreTax).reduce((sum, d) => sum + d.amount, 0), [data.deductions]);
  const netPay = useMemo(() => taxableGross - totalTax - postTaxDeductions, [taxableGross, totalTax, postTaxDeductions]);

  // ─── Handlers ──────────────────────────────────────────────────────
  function updateField<K extends keyof PayslipData>(field: K, value: PayslipData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function addEarning() {
    setData((prev) => ({ ...prev, earnings: [...prev.earnings, { id: generateId(), type: "Overtime", hours: 0, rate: 0 }] }));
  }
  function removeEarning(id: string) {
    if (data.earnings.length <= 1) return;
    setData((prev) => ({ ...prev, earnings: prev.earnings.filter((e) => e.id !== id) }));
  }
  function updateEarning(id: string, field: keyof Earning, value: string | number) {
    setData((prev) => ({ ...prev, earnings: prev.earnings.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }));
  }

  function addDeduction() {
    setData((prev) => ({ ...prev, deductions: [...prev.deductions, { id: generateId(), name: "", amount: 0, isPreTax: false }] }));
  }
  function removeDeduction(id: string) {
    if (data.deductions.length <= 1) return;
    setData((prev) => ({ ...prev, deductions: prev.deductions.filter((d) => d.id !== id) }));
  }
  function updateDeduction(id: string, field: keyof Deduction, value: string | number | boolean) {
    setData((prev) => ({ ...prev, deductions: prev.deductions.map((d) => (d.id === id ? { ...d, [field]: value } : d)) }));
  }

  function addTax() {
    setData((prev) => ({ ...prev, taxes: [...prev.taxes, { id: generateId(), name: "Custom Tax", rate: 0, amount: 0, enabled: true, category: "state" }] }));
  }
  function removeTax(id: string) {
    setData((prev) => ({ ...prev, taxes: prev.taxes.filter((t) => t.id !== id) }));
  }
  function updateTax(id: string, field: keyof TaxItem, value: string | number | boolean) {
    setData((prev) => ({ ...prev, taxes: prev.taxes.map((t) => (t.id === id ? { ...t, [field]: value } : t)) }));
  }
  function toggleTax(id: string) {
    setData((prev) => ({ ...prev, taxes: prev.taxes.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)) }));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateField("logo", ev.target?.result as string);
    reader.readAsDataURL(file);
  }
  function removeLogo() { updateField("logo", null); }

  // Auto-add state tax when state selected
  function handleStateChange(state: string) {
    updateField("employeeState", state);
    if (state && US_STATES[state] > 0) {
      // Check if state tax already exists
      const hasStateTax = data.taxes.some((t) => t.category === "state" && t.name.includes(state));
      if (!hasStateTax) {
        setData((prev) => ({
          ...prev,
          employeeState: state,
          taxes: [...prev.taxes, { id: generateId(), name: `${state} State Tax`, rate: US_STATES[state], amount: 0, enabled: true, category: "state" }],
        }));
      } else {
        updateField("employeeState", state);
      }
    } else {
      updateField("employeeState", state);
    }
  }

  // ─── PDF Generation ──────────────────────────────────────────────────
  async function generatePDF(ref: React.RefObject<HTMLDivElement | null>): Promise<Blob | null> {
    if (!ref.current) return null;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true, logging: false, backgroundColor: template.bg });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      return pdf.output("blob");
    } catch (error) { console.error("PDF generation failed:", error); return null; }
    finally { setIsDownloading(false); }
  }

  async function downloadPDF() {
    const blob = await generatePDF(payslipRef); if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Payslip-${data.employeeName.replace(/\s+/g, "-") || "Employee"}.pdf`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  }

  async function downloadAndShareWhatsApp() {
    const blob = await generatePDF(payslipRef); if (!blob) return;
    const file = new File([blob], `Payslip-${data.employeeName || "Employee"}.pdf`, { type: "application/pdf" });
    const companyName = data.companyName || "My Company";
    const text = `Hey, here is your pay stub from ${companyName}. Pay Period: ${formatDate(data.payPeriodStart)} - ${formatDate(data.payPeriodEnd)}. Net Pay: ${formatCurrency(netPay)}`;
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: `Pay Stub - ${data.employeeName}`, text }); return; } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function downloadAndShareEmail() {
    const blob = await generatePDF(payslipRef); if (!blob) return;
    const file = new File([blob], `Payslip-${data.employeeName || "Employee"}.pdf`, { type: "application/pdf" });
    const companyName = data.companyName || "My Company";
    const subject = `Pay Stub - ${formatDate(data.payPeriodStart)} to ${formatDate(data.payPeriodEnd)} from ${companyName}`;
    const body = `Hey ${data.employeeName || "there"},%0D%0A%0D%0APlease find your pay stub attached for the pay period ${formatDate(data.payPeriodStart)} - ${formatDate(data.payPeriodEnd)}.%0D%0A%0D%0ANet Pay: ${formatCurrency(netPay)}%0D%0AGross Pay: ${formatCurrency(grossPay)}%0D%0A%0D%0AThank you!`;
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: subject, text: `Pay stub from ${companyName}` }); return; } catch {}
    }
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
  }

  const handleTogglePreview = useCallback(() => { setActiveTab("preview"); setShowPreviewModal(true); }, []);
  const handleToggleEdit = useCallback(() => { setActiveTab("edit"); setShowPreviewModal(false); }, []);


  const PayslipPreviewContent = ({ forPrint = false, refProp }: { forPrint?: boolean; refProp?: React.Ref<HTMLDivElement> }) => {
    const t = template;
    const enabledTaxes = calculatedTaxes.filter((tax) => tax.enabled);
    return (
      <div ref={refProp} className={`${t.font} ${forPrint ? "" : "bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"}`} style={forPrint ? { padding: "40px", maxWidth: "800px", margin: "0 auto", backgroundColor: t.bg } : { backgroundColor: t.bg }}>
        {/* Header */}
        <div className="px-8 py-8 relative overflow-hidden" style={{ backgroundColor: t.headerBg, color: t.headerText }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: t.accent }} />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-5">
              {data.logo && <img src={data.logo} alt="Logo" className="h-20 w-20 object-contain rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px" }} />}
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: t.headerText }}>PAY STUB</h1>
                <p className="text-sm opacity-70 mt-1 tracking-wider">{data.companyName || "Your Company"}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-3"><p className="text-xs opacity-60 uppercase tracking-widest font-medium">Pay Date</p><p className="font-semibold text-lg">{formatDate(data.payDate)}</p></div>
              <div><p className="text-xs opacity-60 uppercase tracking-widest font-medium">Pay Period</p><p className="font-semibold">{formatDate(data.payPeriodStart)} — {formatDate(data.payPeriodEnd)}</p></div>
            </div>
          </div>
        </div>

        {/* Employee / Company */}
        <div className="px-8 py-8 grid grid-cols-2 gap-10">
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: t.accent }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Employee</p>
            <p className="font-bold text-xl mb-1" style={{ color: t.primary }}>{data.employeeName || "Employee Name"}</p>
            <p className="text-sm" style={{ color: t.secondary }}>ID: {data.employeeId || "N/A"}</p>
            {data.ssnLast4 && <p className="text-sm" style={{ color: t.secondary }}>SSN: ***-**-{data.ssnLast4}</p>}
            {(data.employeeAddress || data.employeeCity) && <p className="text-sm mt-2 leading-relaxed" style={{ color: t.secondary }}>{data.employeeAddress}{data.employeeAddress && <br />}{data.employeeCity}{data.employeeCity && ", "}{data.employeeState} {data.employeeZip}</p>}
          </div>
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: t.border }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.secondary }}>Employer</p>
            <p className="font-bold text-xl mb-1" style={{ color: t.primary }}>{data.companyName || "Company Name"}</p>
            {data.companyEIN && <p className="text-sm" style={{ color: t.secondary }}>EIN: {data.companyEIN}</p>}
            {(data.companyAddress || data.companyCity) && <p className="text-sm mt-2 leading-relaxed" style={{ color: t.secondary }}>{data.companyAddress}{data.companyAddress && <br />}{data.companyCity}{data.companyCity && ", "}{data.companyState} {data.companyZip}</p>}
          </div>
        </div>

        {/* Earnings Table */}
        <div className="px-8 py-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Earnings</p>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: t.tableHeader, borderBottom: `3px solid ${t.accent}` }}>
              <th className="text-left py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Type</th>
              <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Hours</th>
              <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Rate</th>
              <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Amount</th>
            </tr></thead>
            <tbody>
              {data.earnings.map((e, i) => (
                <tr key={e.id} style={{ backgroundColor: i % 2 === 0 ? t.tableRow : t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
                  <td className="py-4 px-4 font-medium" style={{ color: t.bodyText }}>{e.type}</td>
                  <td className="text-right py-4 px-4" style={{ color: t.bodyText }}>{e.hours}</td>
                  <td className="text-right py-4 px-4" style={{ color: t.bodyText }}>{formatCurrency(e.rate)}</td>
                  <td className="text-right py-4 px-4 font-bold" style={{ color: t.primary }}>{formatCurrency(e.hours * e.rate)}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: t.footerBg, borderTop: `2px solid ${t.accent}` }}>
                <td colSpan={3} className="py-4 px-4 font-bold text-sm uppercase tracking-wider" style={{ color: t.primary }}>Gross Pay</td>
                <td className="text-right py-4 px-4 font-bold text-lg" style={{ color: t.accent }}>{formatCurrency(grossPay)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pre-Tax Deductions (if any) */}
        {preTaxDeductions > 0 && (
          <div className="px-8 py-2">
            <table className="w-full text-sm">
              <tbody>
                <tr style={{ backgroundColor: t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
                  <td className="py-3 px-4 font-medium" style={{ color: t.secondary }}>Pre-Tax Deductions</td>
                  <td className="text-right py-3 px-4 font-medium text-red-600">-{formatCurrency(preTaxDeductions)}</td>
                </tr>
                <tr style={{ backgroundColor: t.footerBg }}>
                  <td className="py-3 px-4 font-bold" style={{ color: t.primary }}>Taxable Gross</td>
                  <td className="text-right py-3 px-4 font-bold" style={{ color: t.primary }}>{formatCurrency(taxableGross)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Tax Breakdown */}
        <div className="px-8 py-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Tax Withholdings</p>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: t.tableHeader, borderBottom: `3px solid ${t.accent}` }}>
              <th className="text-left py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Tax Type</th>
              <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Rate</th>
              <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Amount</th>
            </tr></thead>
            <tbody>
              {enabledTaxes.length === 0 ? (
                <tr><td colSpan={3} className="py-4 px-4 text-center text-sm italic" style={{ color: t.secondary }}>No taxes applied (Not Applicable selected)</td></tr>
              ) : (
                enabledTaxes.map((tax, i) => (
                  <tr key={tax.id} style={{ backgroundColor: i % 2 === 0 ? t.tableRow : t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
                    <td className="py-4 px-4 font-medium" style={{ color: t.bodyText }}>
                      {tax.name}
                      {tax.category === "federal" && <span className="text-xs ml-2" style={{ color: t.secondary }}>({data.filingStatus.replace("_", " ")})</span>}
                    </td>
                    <td className="text-right py-4 px-4" style={{ color: t.secondary }}>{tax.rate > 0 ? `${tax.rate}%` : "Progressive"}</td>
                    <td className="text-right py-4 px-4 font-medium text-red-600">-{formatCurrency(tax.amount)}</td>
                  </tr>
                ))
              )}
              {enabledTaxes.length > 0 && (
                <tr style={{ backgroundColor: t.footerBg, borderTop: `2px solid ${t.accent}` }}>
                  <td colSpan={2} className="py-4 px-4 font-bold text-sm uppercase tracking-wider" style={{ color: t.primary }}>Total Tax Withheld</td>
                  <td className="text-right py-4 px-4 font-bold text-red-600">-{formatCurrency(totalTax)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Post-Tax Deductions (if any) */}
        {postTaxDeductions > 0 && (
          <div className="px-8 py-2">
            <table className="w-full text-sm">
              <tbody>
                {data.deductions.filter((d) => !d.isPreTax).map((d, i) => (
                  <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? t.tableRow : t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
                    <td className="py-3 px-4 font-medium" style={{ color: t.bodyText }}>{d.name || "Post-Tax Deduction"}</td>
                    <td className="text-right py-3 px-4 font-medium text-red-600">-{formatCurrency(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Net Pay */}
        <div className="px-8 py-8">
          <div className="flex justify-end">
            <div className="w-full max-w-sm">
              <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: t.footerBg, borderColor: t.accent }}>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm" style={{ color: t.secondary }}><span>Gross Pay</span><span className="font-semibold" style={{ color: t.primary }}>{formatCurrency(grossPay)}</span></div>
                  {preTaxDeductions > 0 && <div className="flex justify-between text-sm" style={{ color: t.secondary }}><span>Pre-Tax Deductions</span><span className="font-semibold">-{formatCurrency(preTaxDeductions)}</span></div>}
                  <div className="flex justify-between text-sm" style={{ color: t.secondary }}><span>Taxable Gross</span><span className="font-semibold" style={{ color: t.primary }}>{formatCurrency(taxableGross)}</span></div>
                  {enabledTaxes.length > 0 && <div className="flex justify-between text-sm text-red-600"><span>Total Tax Withheld</span><span className="font-semibold">-{formatCurrency(totalTax)}</span></div>}
                  {postTaxDeductions > 0 && <div className="flex justify-between text-sm text-red-600"><span>Post-Tax Deductions</span><span className="font-semibold">-{formatCurrency(postTaxDeductions)}</span></div>}
                  <div className="flex justify-between text-2xl font-bold pt-4 border-t-2" style={{ borderColor: t.accent, color: t.primary }}><span>Net Pay</span><span style={{ color: t.accent }}>{formatCurrency(netPay)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Summary Breakdown */}
        <div className="px-8 py-6 border-t-2" style={{ borderColor: t.border, backgroundColor: t.footerBg }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: t.accent }}>Pay Summary Breakdown</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: t.secondary }}>Gross Pay</p>
              <p className="text-lg font-bold" style={{ color: t.primary }}>{formatCurrency(grossPay)}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: t.secondary }}>Total Deductions</p>
              <p className="text-lg font-bold text-red-600">-{formatCurrency(preTaxDeductions + totalTax + postTaxDeductions)}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: t.secondary }}>Taxable Gross</p>
              <p className="text-lg font-bold" style={{ color: t.primary }}>{formatCurrency(taxableGross)}</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: t.secondary }}>Net Pay</p>
              <p className="text-lg font-bold" style={{ color: t.accent }}>{formatCurrency(netPay)}</p>
            </div>
          </div>
        </div>

        {data.notes && <div className="px-8 py-6 border-t" style={{ borderColor: t.border, backgroundColor: t.footerBg }}><p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.accent }}>Notes</p><p className="text-sm" style={{ color: t.bodyText }}>{data.notes}</p></div>}

        {/* Footer */}
        <div className="px-8 py-5 border-t" style={{ borderColor: t.border, backgroundColor: t.footerBg }}>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: t.secondary }}>This pay stub was generated on {formatDate(today)} {data.filingStatus !== "not_applicable" && `· Filing Status: ${data.filingStatus.replace("_", " " )}`}</p>
            <Link href="/" className="flex items-center gap-2 text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: t.accent }}><FileText className="h-3 w-3" />Made using BillSwift</Link>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Bill<span className="text-emerald-600">Swift</span></span>
            </Link>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowTemplatePicker(!showTemplatePicker)} className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <Palette className="h-4 w-4" />{template.name}<ChevronDown className="h-4 w-4" />
              </button>
              <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                <button onClick={handleToggleEdit} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === "edit" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}><PenLine className="h-4 w-4" />Edit</button>
                <button onClick={handleTogglePreview} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === "preview" ? "bg-emerald-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}><Eye className="h-4 w-4" />Preview</button>
              </div>
              <Link href="/" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Back</span></Link>
            </div>
          </div>
        </div>
      </nav>

      {showTemplatePicker && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Choose Template</h3>
            <button onClick={() => setShowTemplatePicker(false)}><X className="h-4 w-4 text-slate-400 hover:text-slate-600" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setShowTemplatePicker(false); }} className={`relative overflow-hidden rounded-xl border p-3 text-left transition-all ${selectedTemplate === t.id ? "border-emerald-400 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-emerald-300 hover:shadow-md"}`}>
                <div className="h-12 w-full rounded-lg mb-2" style={{ backgroundColor: t.headerBg }} />
                <div className="h-2 w-8 rounded-full mb-1" style={{ backgroundColor: t.accent }} />
                <p className="text-xs font-semibold text-slate-900">{t.name}</p>
                {selectedTemplate === t.id && <div className="absolute top-2 right-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>}
              </button>
            ))}
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowPreviewModal(false); setActiveTab("edit"); }} />
          <div className="relative bg-slate-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3"><Eye className="h-5 w-5 text-emerald-600" /><h2 className="text-lg font-semibold text-slate-900">Pay Stub Preview</h2><span className="text-sm text-slate-500">{template.name}</span></div>
              <div className="flex items-center gap-2">
                <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">{isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}{isDownloading ? "Generating..." : "Download PDF"}</button>
                <button onClick={() => { setShowPreviewModal(false); setActiveTab("edit"); }} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-8"><PayslipPreviewContent refProp={modalPayslipRef} /></div>
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">Previewing <span className="font-semibold text-slate-900">{template.name}</span> template</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { downloadAndShareEmail(); setIsSharing(false); }} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all"><Mail className="h-4 w-4 text-blue-500" />Email</button>
                <button onClick={() => { downloadAndShareWhatsApp(); setIsSharing(false); }} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-green-300 hover:bg-green-50 transition-all"><Smartphone className="h-4 w-4 text-green-500" />WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Company Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2"><Sparkles className="h-5 w-5 text-emerald-600" />Company Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                  <div className="flex items-center gap-3">
                    {data.logo ? (
                      <div className="relative"><img src={data.logo} alt="Logo" className="h-16 w-16 object-contain rounded-xl border border-slate-200" /><button onClick={removeLogo} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X className="h-3 w-3" /></button></div>
                    ) : (
                      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    )}
                    <p className="text-xs text-slate-500">Upload company logo (optional)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label><input type="text" value={data.companyName} onChange={(e) => updateField("companyName", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Acme Corp" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">EIN</label><input type="text" value={data.companyEIN} onChange={(e) => updateField("companyEIN", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="XX-XXXXXXX" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Address</label><input type="text" value={data.companyAddress} onChange={(e) => updateField("companyAddress", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="123 Business St" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">City</label><input type="text" value={data.companyCity} onChange={(e) => updateField("companyCity", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Austin" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">State</label><select value={data.companyState} onChange={(e) => updateField("companyState", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"><option value="">Select State</option>{Object.keys(US_STATES).sort().map((s) => (<option key={s} value={s}>{s}</option>))}</select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label><input type="text" value={data.companyZip} onChange={(e) => updateField("companyZip", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="78701" /></div>
                </div>
              </div>
            </div>

            {/* Employee Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2"><svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>Employee Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label><input type="text" value={data.employeeName} onChange={(e) => updateField("employeeName", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="John Doe" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label><input type="text" value={data.employeeId} onChange={(e) => updateField("employeeId", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="EMP-001" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">SSN (Last 4)</label><input type="text" maxLength={4} value={data.ssnLast4} onChange={(e) => updateField("ssnLast4", e.target.value.replace(/\D/g, ""))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="1234" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Filing Status</label><select value={data.filingStatus} onChange={(e) => updateField("filingStatus", e.target.value as FilingStatus)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"><option value="single">Single</option><option value="married_joint">Married Filing Jointly</option><option value="married_separate">Married Filing Separately</option><option value="head_household">Head of Household</option><option value="not_applicable">Not Applicable (No Federal Tax)</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Address</label><input type="text" value={data.employeeAddress} onChange={(e) => updateField("employeeAddress", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="456 Home Ave" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">City</label><input type="text" value={data.employeeCity} onChange={(e) => updateField("employeeCity", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Dallas" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">State</label><select value={data.employeeState} onChange={(e) => handleStateChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"><option value="">Select State</option>{Object.keys(US_STATES).sort().map((s) => (<option key={s} value={s}>{s}</option>))}</select></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label><input type="text" value={data.employeeZip} onChange={(e) => updateField("employeeZip", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="75201" /></div>
                </div>
              </div>
            </div>

            {/* Pay Period */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2"><FileText className="h-5 w-5 text-amber-600" />Pay Period</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label><input type="date" value={data.payPeriodStart} onChange={(e) => updateField("payPeriodStart", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">End Date</label><input type="date" value={data.payPeriodEnd} onChange={(e) => updateField("payPeriodEnd", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Pay Date</label><input type="date" value={data.payDate} onChange={(e) => updateField("payDate", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" /></div>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Earnings</h2>
                <button onClick={addEarning} className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"><Plus className="h-4 w-4" />Add Earning</button>
              </div>
              <div className="space-y-3">
                {data.earnings.map((e) => (
                  <div key={e.id} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-4"><input type="text" value={e.type} onChange={(ev) => updateEarning(e.id, "type", ev.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Regular Pay" /></div>
                    <div className="col-span-2"><input type="number" min="0" value={e.hours} onChange={(ev) => updateEarning(e.id, "hours", Number(ev.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Hours" /></div>
                    <div className="col-span-3"><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span><input type="number" min="0" step="0.01" value={e.rate} onChange={(ev) => updateEarning(e.id, "rate", Number(ev.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Rate" /></div></div>
                    <div className="col-span-3 flex items-center justify-end gap-2"><span className="text-sm font-medium text-slate-700">{formatCurrency(e.hours * e.rate)}</span><button onClick={() => removeEarning(e.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>Deductions</h2>
                <button onClick={addDeduction} className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"><Plus className="h-4 w-4" />Add Deduction</button>
              </div>
              <div className="space-y-3">
                {data.deductions.map((d) => (
                  <div key={d.id} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-4"><input type="text" value={d.name} onChange={(ev) => updateDeduction(d.id, "name", ev.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Health Insurance" /></div>
                    <div className="col-span-3"><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span><input type="number" min="0" step="0.01" value={d.amount} onChange={(ev) => updateDeduction(d.id, "amount", Number(ev.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Amount" /></div></div>
                    <div className="col-span-3 flex items-center gap-2"><input type="checkbox" checked={d.isPreTax} onChange={(ev) => updateDeduction(d.id, "isPreTax", ev.target.checked)} className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" /><label className="text-xs text-slate-600">Pre-Tax</label></div>
                    <div className="col-span-2 flex items-center justify-end"><button onClick={() => removeDeduction(d.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Taxes — Employer Controlled */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                  Tax Withholdings
                  <span className="text-xs font-normal text-slate-500 ml-2">(Toggle to enable/disable)</span>
                </h2>
                <button onClick={addTax} className="flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                  <Plus className="h-4 w-4" />Add Tax
                </button>
              </div>

              <div className="space-y-3">
                {data.taxes.map((tax) => (
                  <div key={tax.id} className={`grid grid-cols-12 gap-3 items-start p-3 rounded-xl border transition-all ${tax.enabled ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 opacity-60"}`}>
                    <div className="col-span-1 flex items-center justify-center">
                      <button 
                        onClick={() => toggleTax(tax.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tax.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tax.enabled ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={tax.name} 
                        onChange={(ev) => updateTax(tax.id, "name", ev.target.value)} 
                        disabled={!tax.enabled}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={tax.rate} 
                          onChange={(ev) => updateTax(tax.id, "rate", Number(ev.target.value))}
                          disabled={!tax.enabled || tax.category === "federal"}
                          className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input 
                          type="text" 
                          value={tax.enabled ? formatCurrency(tax.amount) : "$0.00"} 
                          readOnly
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-7 pr-3 text-sm text-slate-600"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${tax.category === "federal" ? "bg-blue-100 text-blue-700" : tax.category === "fica" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
                        {tax.category === "federal" ? "Federal" : tax.category === "fica" ? "FICA" : "State"}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      {tax.category !== "federal" && tax.category !== "fica" && (
                        <button onClick={() => removeTax(tax.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax Summary */}
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tax Breakdown Summary</p>
                <div className="space-y-2">
                  {calculatedTaxes.filter((t) => t.enabled).map((tax) => (
                    <div key={tax.id} className="flex justify-between text-sm">
                      <span className="text-slate-700">{tax.name} {tax.rate > 0 && `(${tax.rate}%)`}</span>
                      <span className="font-medium text-red-600">-{formatCurrency(tax.amount)}</span>
                    </div>
                  ))}
                  {calculatedTaxes.filter((t) => t.enabled).length === 0 && (
                    <p className="text-sm text-slate-500 italic">No taxes enabled. Select a filing status or toggle taxes on.</p>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200">
                    <span className="text-slate-900">Total Tax Withheld</span>
                    <span className="text-red-600">-{formatCurrency(totalTax)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Pay Summary
              </h2>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Gross Pay</span><span className="font-semibold text-slate-900">{formatCurrency(grossPay)}</span></div>
                {preTaxDeductions > 0 && <div className="flex justify-between text-sm"><span className="text-slate-600">Pre-Tax Deductions</span><span className="font-semibold text-slate-900">-{formatCurrency(preTaxDeductions)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-slate-600">Taxable Gross</span><span className="font-semibold text-slate-900">{formatCurrency(taxableGross)}</span></div>
                {calculatedTaxes.filter((t) => t.enabled).map((tax) => (
                  <div key={tax.id} className="flex justify-between text-sm text-red-600">
                    <span>{tax.name}</span>
                    <span className="font-semibold">-{formatCurrency(tax.amount)}</span>
                  </div>
                ))}
                {postTaxDeductions > 0 && <div className="flex justify-between text-sm text-red-600"><span>Post-Tax Deductions</span><span className="font-semibold">-{formatCurrency(postTaxDeductions)}</span></div>}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-900">Net Pay</span>
                  <span className="text-emerald-600">{formatCurrency(netPay)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Notes
              </h2>
              <textarea value={data.notes} onChange={(e) => updateField("notes", e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="Additional notes or comments..." />
            </div>
          </div>

          {/* ── Right: Live Preview (Desktop Only) ───────────────── */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
                <div className="flex items-center gap-2">
                  <button onClick={downloadPDF} disabled={isDownloading} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                    {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {isDownloading ? "Generating..." : "Download PDF"}
                  </button>
                  <div className="relative">
                    <button onClick={() => setIsSharing(!isSharing)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                      <Share2 className="h-4 w-4" />Share
                    </button>
                    {isSharing && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50">
                        <button onClick={() => { downloadAndShareEmail(); setIsSharing(false); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 transition-colors">
                          <Mail className="h-4 w-4 text-blue-500" />Send via Email
                        </button>
                        <button onClick={() => { downloadAndShareWhatsApp(); setIsSharing(false); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-green-50 transition-colors">
                          <Smartphone className="h-4 w-4 text-green-500" />Share on WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <PayslipPreviewContent refProp={payslipRef} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer: Explore More Tools ─────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Explore More Free Tools</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">BillSwift is your all-in-one financial toolkit. Try our other free tools built for the USA.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/tools/invoice-maker" className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-8 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 mb-4"><Sparkles className="h-3 w-3" />POPULAR</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200"><Receipt className="h-6 w-6 text-emerald-600" /></div>
                  <h3 className="text-xl font-semibold text-slate-900">Invoice Maker</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">Create professional invoices in seconds. Add your logo, line items, taxes, and download as PDF instantly. No watermarks. No signup.</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Try Invoice Maker<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></div>
              </div>
            </Link>
            <Link href="/" className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-4"><Star className="h-3 w-3" />12+ FREE TOOLS</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-200"><Calculator className="h-6 w-6 text-blue-600" /></div>
                  <h3 className="text-xl font-semibold text-slate-900">Financial Calculators</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">From mortgage payments and compound interest to federal tax estimates and retirement planning. All calculators are free, private, and built for the US financial system.</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">Explore All Calculators<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}