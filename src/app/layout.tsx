import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BillSwift | Free Financial Calculators & Business Tools",
  description:
    "Free online financial calculators for USA users. Calculate mortgage, loan EMI, compound interest, ROI, salary, tax, and more. Plus free invoice maker and paystub generator for freelancers and small businesses.",
  keywords:
    "financial calculator, mortgage calculator, loan calculator, compound interest calculator, ROI calculator, salary calculator, tax calculator, invoice maker, paystub generator, free tools USA",
  openGraph: {
    title: "BillSwift | Free Financial Calculators & Business Tools",
    description:
      "Free online financial calculators and business tools for USA users. Professional, fast, and easy to use.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}