"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Receipt,
  Plus,
  Trash2,
  Download,
  Share2,
  Mail,
  Smartphone,
  CheckCircle2,
  CreditCard,
  ChevronDown,
  X,
  Sparkles,
  Palette,
  Eye,
  PenLine,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  fromAddress: string;
  fromCity: string;
  fromState: string;
  fromZip: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  toCity: string;
  toState: string;
  toZip: string;
  items: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
  paymentMethod: string;
  logo: string | null;
}

interface Template {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  headerBg: string;
  headerText: string;
  bodyText: string;
  border: string;
  tableHeader: string;
  tableRow: string;
  footerBg: string;
  font: string;
}

// ─── 10 Premium Templates ─────────────────────────────────────────────
const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Minimal",
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#10b981",
    bg: "#ffffff",
    headerBg: "#0f172a",
    headerText: "#ffffff",
    bodyText: "#334155",
    border: "#e2e8f0",
    tableHeader: "#f8fafc",
    tableRow: "#ffffff",
    footerBg: "#f8fafc",
    font: "font-sans",
  },
  {
    id: "corporate",
    name: "Corporate Pro",
    primary: "#1e3a5f",
    secondary: "#6b7280",
    accent: "#2563eb",
    bg: "#ffffff",
    headerBg: "#1e3a5f",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#eff6ff",
    tableRow: "#ffffff",
    footerBg: "#f8fafc",
    font: "font-sans",
  },
  {
    id: "freelance",
    name: "Freelance Fresh",
    primary: "#064e3b",
    secondary: "#6b7280",
    accent: "#059669",
    bg: "#ffffff",
    headerBg: "#064e3b",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#ecfdf5",
    tableRow: "#ffffff",
    footerBg: "#f0fdf4",
    font: "font-sans",
  },
  {
    id: "classic",
    name: "Classic Elegant",
    primary: "#374151",
    secondary: "#6b7280",
    accent: "#4b5563",
    bg: "#ffffff",
    headerBg: "#f9fafb",
    headerText: "#374151",
    bodyText: "#4b5563",
    border: "#d1d5db",
    tableHeader: "#f3f4f6",
    tableRow: "#ffffff",
    footerBg: "#f9fafb",
    font: "font-serif",
  },
  {
    id: "creative",
    name: "Creative Agency",
    primary: "#581c87",
    secondary: "#6b7280",
    accent: "#9333ea",
    bg: "#ffffff",
    headerBg: "#581c87",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#faf5ff",
    tableRow: "#ffffff",
    footerBg: "#faf5ff",
    font: "font-sans",
  },
  {
    id: "legal",
    name: "Legal Firm",
    primary: "#1c1917",
    secondary: "#78716c",
    accent: "#92400e",
    bg: "#ffffff",
    headerBg: "#1c1917",
    headerText: "#ffffff",
    bodyText: "#44403c",
    border: "#d6d3d1",
    tableHeader: "#fafaf9",
    tableRow: "#ffffff",
    footerBg: "#fafaf9",
    font: "font-serif",
  },
  {
    id: "medical",
    name: "Medical Practice",
    primary: "#0c4a6e",
    secondary: "#6b7280",
    accent: "#0284c7",
    bg: "#ffffff",
    headerBg: "#0c4a6e",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#f0f9ff",
    tableRow: "#ffffff",
    footerBg: "#f0f9ff",
    font: "font-sans",
  },
  {
    id: "construction",
    name: "Construction",
    primary: "#7c2d12",
    secondary: "#6b7280",
    accent: "#ea580c",
    bg: "#ffffff",
    headerBg: "#7c2d12",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#fff7ed",
    tableRow: "#ffffff",
    footerBg: "#fff7ed",
    font: "font-sans",
  },
  {
    id: "consulting",
    name: "Consulting",
    primary: "#1e1b4b",
    secondary: "#6b7280",
    accent: "#4f46e5",
    bg: "#ffffff",
    headerBg: "#1e1b4b",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#eef2ff",
    tableRow: "#ffffff",
    footerBg: "#eef2ff",
    font: "font-sans",
  },
  {
    id: "retail",
    name: "Retail Store",
    primary: "#881337",
    secondary: "#6b7280",
    accent: "#e11d48",
    bg: "#ffffff",
    headerBg: "#881337",
    headerText: "#ffffff",
    bodyText: "#374151",
    border: "#d1d5db",
    tableHeader: "#fff1f2",
    tableRow: "#ffffff",
    footerBg: "#fff1f2",
    font: "font-sans",
  },
];

// ─── US States for Tax ──────────────────────────────────────────────
const US_STATES: Record<string, number> = {
  AL: 4.0, AK: 0.0, AZ: 5.6, AR: 6.5, CA: 7.25, CO: 2.9, CT: 6.35, DE: 0.0,
  FL: 6.0, GA: 4.0, HI: 4.0, ID: 6.0, IL: 6.25, IN: 7.0, IA: 6.0, KS: 6.5,
  KY: 6.0, LA: 4.45, ME: 5.5, MD: 6.0, MA: 6.25, MI: 6.0, MN: 6.875, MS: 7.0,
  MO: 4.225, MT: 0.0, NE: 5.5, NV: 6.85, NH: 0.0, NJ: 6.625, NM: 5.125, NY: 4.0,
  NC: 4.75, ND: 5.0, OH: 5.75, OK: 4.5, OR: 0.0, PA: 6.0, RI: 7.0, SC: 6.0,
  SD: 4.5, TN: 7.0, TX: 6.25, UT: 4.85, VT: 6.0, VA: 5.3, WA: 6.5, WV: 6.0,
  WI: 5.0, WY: 4.0, DC: 6.0,
};

// ─── Helpers ─────────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Main Component ──────────────────────────────────────────────────
export default function InvoiceMakerPage() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);
  const modalInvoiceRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    fromName: "",
    fromEmail: "",
    fromPhone: "",
    fromAddress: "",
    fromCity: "",
    fromState: "",
    fromZip: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    toCity: "",
    toState: "",
    toZip: "",
    items: [
      { id: generateId(), description: "", quantity: 1, rate: 0 },
    ],
    taxRate: 0,
    discount: 0,
    notes: "Thank you for your business!",
    paymentMethod: "",
    logo: null,
  });

  const template = templates.find((t) => t.id === selectedTemplate) || templates[0];

  // Calculations
  const subtotal = useMemo(
    () => data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0),
    [data.items]
  );
  const discountAmount = useMemo(() => subtotal * (data.discount / 100), [subtotal, data.discount]);
  const taxableAmount = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);
  const taxAmount = useMemo(() => taxableAmount * (data.taxRate / 100), [taxableAmount, data.taxRate]);
  const total = useMemo(() => taxableAmount + taxAmount, [taxableAmount, taxAmount]);

  // Handlers
  function updateField<K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function addItem() {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: generateId(), description: "", quantity: 1, rate: 0 }],
    }));
  }

  function removeItem(id: string) {
    if (data.items.length <= 1) return;
    setData((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  }

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateField("logo", ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    updateField("logo", null);
  }

  // ─── ACTUAL PDF GENERATION ───────────────────────────────────────────
  async function generatePDF(ref: React.RefObject<HTMLDivElement | null>): Promise<Blob | null> {
    if (!ref.current) return null;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: template.bg,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      return pdf.output("blob");
    } catch (error) {
      console.error("PDF generation failed:", error);
      return null;
    } finally {
      setIsDownloading(false);
    }
  }

  async function downloadPDF() {
    const blob = await generatePDF(invoiceRef);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${data.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function downloadAndShareWhatsApp() {
    const blob = await generatePDF(invoiceRef);
    if (!blob) return;

    const file = new File([blob], `Invoice-${data.invoiceNumber}.pdf`, { type: "application/pdf" });

    const businessName = data.fromName || "My Business";
    const text = `Hey, this is the invoice from ${businessName}. Total: ${formatCurrency(total)}`;

    // Try Web Share API first (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Invoice ${data.invoiceNumber}`,
          text: text,
        });
        return;
      } catch {
        // Fallback to WhatsApp web
      }
    }

    // Fallback: open WhatsApp with text, user manually attaches PDF
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function downloadAndShareEmail() {
    const blob = await generatePDF(invoiceRef);
    if (!blob) return;

    const file = new File([blob], `Invoice-${data.invoiceNumber}.pdf`, { type: "application/pdf" });

    const businessName = data.fromName || "My Business";
    const subject = `Invoice ${data.invoiceNumber} from ${businessName}`;
    const body = `Hey, this is the invoice from ${businessName}.%0D%0A%0D%0AInvoice #: ${data.invoiceNumber}%0D%0ATotal: ${formatCurrency(total)}%0D%0A%0D%0APlease find the invoice attached.%0D%0A%0D%0AThank you!`;

    // Try Web Share API first (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: subject,
          text: `Invoice from ${businessName}`,
        });
        return;
      } catch {
        // Fallback to mailto
      }
    }

    // Fallback: mailto (no attachment possible via mailto, but we try)
    window.open(`mailto:${data.toEmail || ""}?subject=${encodeURIComponent(subject)}&body=${body}`);
  }

  // ─── Toggle Handler ──────────────────────────────────────────────────
  const handleTogglePreview = useCallback(() => {
    setActiveTab("preview");
    setShowPreviewModal(true);
  }, []);

  const handleToggleEdit = useCallback(() => {
    setActiveTab("edit");
    setShowPreviewModal(false);
  }, []);

  // ─── Invoice Preview Component ─────────────────────────────────────
  const InvoicePreviewContent = ({ forPrint = false, refProp }: { forPrint?: boolean; refProp?: React.Ref<HTMLDivElement> }) => {
    const t = template;
    return (
      <div
        ref={refProp}
        className={`${t.font} ${forPrint ? "" : "bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"}`}
        style={forPrint ? { padding: "40px", maxWidth: "800px", margin: "0 auto", backgroundColor: t.bg } : { backgroundColor: t.bg }}
      >
        {/* Header */}
        <div
          className="px-8 py-8 relative overflow-hidden"
          style={{
            backgroundColor: t.headerBg,
            color: t.headerText,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: t.accent }}
          />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-5">
              {data.logo && (
                <img
                  src={data.logo}
                  alt="Logo"
                  className="h-20 w-20 object-contain rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px" }}
                />
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: t.headerText }}>
                  INVOICE
                </h1>
                <p className="text-sm opacity-70 mt-1 tracking-wider">{data.invoiceNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-3">
                <p className="text-xs opacity-60 uppercase tracking-widest font-medium">Invoice Date</p>
                <p className="font-semibold text-lg">{formatDate(data.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-xs opacity-60 uppercase tracking-widest font-medium">Due Date</p>
                <p className="font-semibold text-lg">{formatDate(data.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="px-8 py-8 grid grid-cols-2 gap-10">
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: t.accent }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>From</p>
            <p className="font-bold text-xl mb-1" style={{ color: t.primary }}>{data.fromName || "Your Business Name"}</p>
            {data.fromEmail && <p className="text-sm mt-1" style={{ color: t.bodyText }}>{data.fromEmail}</p>}
            {data.fromPhone && <p className="text-sm" style={{ color: t.bodyText }}>{data.fromPhone}</p>}
            {(data.fromAddress || data.fromCity) && (
              <p className="text-sm mt-2 leading-relaxed" style={{ color: t.secondary }}>
                {data.fromAddress}{data.fromAddress && <br />}{data.fromCity}{data.fromCity && ", "}{data.fromState} {data.fromZip}
              </p>
            )}
          </div>
          <div className="relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: t.border }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.secondary }}>Bill To</p>
            <p className="font-bold text-xl mb-1" style={{ color: t.primary }}>{data.toName || "Client Name"}</p>
            {data.toEmail && <p className="text-sm mt-1" style={{ color: t.bodyText }}>{data.toEmail}</p>}
            {(data.toAddress || data.toCity) && (
              <p className="text-sm mt-2 leading-relaxed" style={{ color: t.secondary }}>
                {data.toAddress}{data.toAddress && <br />}{data.toCity}{data.toCity && ", "}{data.toState} {data.toZip}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: t.tableHeader, borderBottom: `3px solid ${t.accent}` }}>
                <th className="text-left py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>#</th>
                <th className="text-left py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Description</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Qty</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Rate</th>
                <th className="text-right py-4 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: t.primary }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={item.id} style={{ backgroundColor: i % 2 === 0 ? t.tableRow : t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
                  <td className="py-4 px-4 font-medium" style={{ color: t.secondary }}>{i + 1}</td>
                  <td className="py-4 px-4 font-medium" style={{ color: t.bodyText }}>{item.description || "Service description"}</td>
                  <td className="text-right py-4 px-4" style={{ color: t.bodyText }}>{item.quantity}</td>
                  <td className="text-right py-4 px-4" style={{ color: t.bodyText }}>{formatCurrency(item.rate)}</td>
                  <td className="text-right py-4 px-4 font-bold" style={{ color: t.primary }}>{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-8 py-8">
          <div className="flex justify-end">
            <div className="w-full max-w-sm">
              <div className="rounded-2xl p-6 border-2" style={{ backgroundColor: t.footerBg, borderColor: t.border }}>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm" style={{ color: t.secondary }}>
                    <span>Subtotal</span>
                    <span className="font-semibold" style={{ color: t.primary }}>{formatCurrency(subtotal)}</span>
                  </div>
                  {data.discount > 0 && (
                    <div className="flex justify-between text-sm" style={{ color: t.accent }}>
                      <span>Discount ({data.discount}%)</span>
                      <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  {data.taxRate > 0 && (
                    <div className="flex justify-between text-sm" style={{ color: t.secondary }}>
                      <span>Tax ({data.taxRate}%)</span>
                      <span className="font-semibold" style={{ color: t.primary }}>{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-bold pt-4 border-t-2" style={{ borderColor: t.accent, color: t.primary }}>
                    <span>Total</span>
                    <span style={{ color: t.accent }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Payment */}
        <div className="px-8 py-8 border-t-2" style={{ borderColor: t.border, backgroundColor: t.footerBg }}>
          <div className="grid grid-cols-2 gap-8">
            {data.notes && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: t.accent }}>Notes & Terms</p>
                <p className="text-sm leading-relaxed" style={{ color: t.bodyText }}>{data.notes}</p>
              </div>
            )}
            {data.paymentMethod && (
              <div className="rounded-xl p-5 border-2" style={{ backgroundColor: t.bg, borderColor: t.accent }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.accent }}>Payment Method</p>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: t.primary }}>{data.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer — Made Using FinCalcPro */}
        <div className="px-8 py-5 border-t" style={{ borderColor: t.border, backgroundColor: t.footerBg }}>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: t.secondary }}>
              This invoice was generated on {formatDate(new Date().toISOString().split("T")[0])}
            </p>
            <Link href="/" className="flex items-center gap-2 text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: t.accent }}>
              <Receipt className="h-3 w-3" />
              Made using FinCalcPro
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
              >
                <Palette className="h-4 w-4" />
                {template.name}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                <button
                  onClick={handleToggleEdit}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === "edit"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <PenLine className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleTogglePreview}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === "preview"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              </div>

              <Link href="/" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Template Picker Dropdown */}
      {showTemplatePicker && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Choose Template</h3>
            <button onClick={() => setShowTemplatePicker(false)}>
              <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedTemplate(t.id); setShowTemplatePicker(false); }}
                className={`relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                  selectedTemplate === t.id
                    ? "border-emerald-400 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-emerald-300 hover:shadow-md"
                }`}
              >
                <div className="h-12 w-full rounded-lg mb-2" style={{ backgroundColor: t.headerBg }} />
                <div className="h-2 w-8 rounded-full mb-1" style={{ backgroundColor: t.accent }} />
                <p className="text-xs font-semibold text-slate-900">{t.name}</p>
                <p className="text-[10px] text-slate-500">{t.font === "font-serif" ? "Serif" : "Sans"}</p>
                {selectedTemplate === t.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Preview Modal ────────────────────────────────────── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowPreviewModal(false); setActiveTab("edit"); }} />
          <div className="relative bg-slate-100 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-900">Invoice Preview</h2>
                <span className="text-sm text-slate-500">{template.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPDF}
                  disabled={isDownloading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isDownloading ? "Generating..." : "Download PDF"}
                </button>
                <button
                  onClick={() => { setShowPreviewModal(false); setActiveTab("edit"); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <InvoicePreviewContent refProp={modalInvoiceRef} />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Previewing <span className="font-semibold text-slate-900">{template.name}</span> template
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { downloadAndShareEmail(); setIsSharing(false); }}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <Mail className="h-4 w-4 text-blue-500" />
                  Email
                </button>
                <button
                  onClick={() => { downloadAndShareWhatsApp(); setIsSharing(false); }}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  <Smartphone className="h-4 w-4 text-green-500" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Left: Editor ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Your Business
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                  <div className="flex items-center gap-3">
                    {data.logo ? (
                      <div className="relative">
                        <img src={data.logo} alt="Logo" className="h-16 w-16 object-contain rounded-xl border border-slate-200" />
                        <button onClick={removeLogo} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    )}
                    <p className="text-xs text-slate-500">Upload your logo (optional)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                    <input type="text" value={data.fromName} onChange={(e) => updateField("fromName", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Acme Design Studio" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={data.fromEmail} onChange={(e) => updateField("fromEmail", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="you@business.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" value={data.fromPhone} onChange={(e) => updateField("fromPhone", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="(555) 123-4567" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input type="text" value={data.fromAddress} onChange={(e) => updateField("fromAddress", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="123 Main St" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input type="text" value={data.fromCity} onChange={(e) => updateField("fromCity", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Austin" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <select value={data.fromState} onChange={(e) => updateField("fromState", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option value="">Select State</option>
                      {Object.keys(US_STATES).sort().map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label>
                    <input type="text" value={data.fromZip} onChange={(e) => updateField("fromZip", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="78701" />
                  </div>
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Client Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                    <input type="text" value={data.toName} onChange={(e) => updateField("toName", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Client Email</label>
                    <input type="email" value={data.toEmail} onChange={(e) => updateField("toEmail", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="client@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input type="text" value={data.toAddress} onChange={(e) => updateField("toAddress", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="456 Client Ave" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <input type="text" value={data.toCity} onChange={(e) => updateField("toCity", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="New York" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <select value={data.toState} onChange={(e) => updateField("toState", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                      <option value="">Select State</option>
                      {Object.keys(US_STATES).sort().map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label>
                    <input type="text" value={data.toZip} onChange={(e) => updateField("toZip", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="10001" />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-amber-600" />
                Invoice Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Invoice #</label>
                    <input type="text" value={data.invoiceNumber} onChange={(e) => updateField("invoiceNumber", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input type="date" value={data.invoiceDate} onChange={(e) => updateField("invoiceDate", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input type="date" value={data.dueDate} onChange={(e) => updateField("dueDate", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Line Items
                </h2>
                <button onClick={addItem} className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>
              <div className="space-y-3">
                {data.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-5">
                      <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Service description" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-sm font-medium text-slate-700">{formatCurrency(item.quantity * item.rate)}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax, Discount, Totals */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Tax & Discount
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate (%)</label>
                    <div className="relative">
                      <select value={data.taxRate > 0 ? "custom" : ""} onChange={(e) => { const val = e.target.value; if (val === "custom" || val === "") updateField("taxRate", 0); else updateField("taxRate", US_STATES[val] || 0); }} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-2">
                        <option value="">No Tax</option>
                        <option value="custom">Custom Rate</option>
                        {Object.entries(US_STATES).sort().map(([state, rate]) => (<option key={state} value={state}>{state} — {rate}%</option>))}
                      </select>
                      <input type="number" min="0" step="0.01" value={data.taxRate} onChange={(e) => updateField("taxRate", Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Enter tax %" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                    <input type="number" min="0" max="100" value={data.discount} onChange={(e) => updateField("discount", Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="0" />
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span></div>
                  {data.discount > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-600">Discount ({data.discount}%)</span><span className="font-semibold text-emerald-600">-{formatCurrency(discountAmount)}</span></div>}
                  {data.taxRate > 0 && <div className="flex justify-between text-sm"><span className="text-slate-600">Tax ({data.taxRate}%)</span><span className="font-semibold text-slate-900">{formatCurrency(taxAmount)}</span></div>}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200"><span className="text-slate-900">Total</span><span className="text-emerald-600">{formatCurrency(total)}</span></div>
                </div>
              </div>
            </div>

            {/* Notes & Payment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Notes & Payment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Terms</label>
                  <textarea value={data.notes} onChange={(e) => updateField("notes", e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" placeholder="Thank you for your business! Payment due within 14 days." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Method
                    <span className="text-xs text-slate-400 font-normal ml-2">(Your Venmo, PayPal, Zelle, etc.)</span>
                  </label>
                  <input type="text" value={data.paymentMethod} onChange={(e) => updateField("paymentMethod", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Venmo: @mybusiness · Zelle: mybusiness@email.com · PayPal: paypal.me/mybusiness" />
                  <p className="text-xs text-slate-500 mt-1">Add your preferred payment info. Clients will see this on the invoice.</p>
                </div>
              </div>
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
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                    {isSharing && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-50">
                        <button onClick={() => { downloadAndShareEmail(); setIsSharing(false); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-50 transition-colors">
                          <Mail className="h-4 w-4 text-blue-500" />
                          Send via Email
                        </button>
                        <button onClick={() => { downloadAndShareWhatsApp(); setIsSharing(false); }} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-green-50 transition-colors">
                          <Smartphone className="h-4 w-4 text-green-500" />
                          Share on WhatsApp
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <InvoicePreviewContent refProp={invoiceRef} />
            </div>
          </div>
        </div>
      </div>


      {/* ── Footer: Explore More Tools ─────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Payslip Generator</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Generate detailed payslips with federal tax deductions, FICA, state tax, and net pay calculations. 
                  Perfect for small businesses and 1099 contractors across the USA.
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  Try Payslip Generator
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  12+ FREE TOOLS
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Financial Calculators</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  From mortgage payments and compound interest to federal tax estimates and retirement planning. 
                  All calculators are free, private, and built for the US financial system.
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                  Explore All Calculators
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}