"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle2, Globe, Ban, Shield } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Bill<span className="text-emerald-600">Swift</span>
              </span>
            </Link>
            <Link href="/" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
              <ArrowLeft className="h-4 w-4" />Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-6">
            <Scale className="h-4 w-4" />
            <span>Last Updated: May 7, 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Please read these terms carefully before using BillSwift. By accessing or using our tools, 
            you agree to be bound by these terms.
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              By accessing, downloading, or using BillSwift ("the Website," "we," "us," or "our"), 
              including but not limited to our financial calculators, invoice maker, paystub generator, 
              and any other tools or services offered (collectively, "the Services"), you agree to be 
              bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must 
              not access or use the Services.
            </p>
            <p className="text-slate-600 leading-relaxed">
              These Terms constitute a legally binding agreement between you and BillSwift regarding 
              your use of the Services. You acknowledge that you have read, understood, and agree to 
              be bound by these Terms, as well as our Privacy Policy, which is incorporated herein by reference.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              2. Description of Services
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              BillSwift provides free online financial tools and document generators designed for users 
              in the United States. Our Services include, but are not limited to:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                "Mortgage, loan, and compound interest calculators",
                "Federal income tax and retirement (401k) calculators",
                "Salary, auto loan, and debt payoff calculators",
                "Credit card payoff and ROI calculators",
                "Refinance and rent vs. buy calculators",
                "Professional invoice maker with PDF export",
                "Detailed paystub generator with tax calculations",
                "Additional financial tools as they become available",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              All calculations are performed client-side in your browser. We do not store your financial 
              data, calculation inputs, or generated documents on our servers. PDF downloads are generated 
              locally and saved directly to your device.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-violet-600" />
              3. No Account Required
            </h2>
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-4">
              <p className="text-violet-800 font-semibold text-lg mb-2">🎉 Completely Free, No Signup</p>
              <p className="text-violet-700">
                BillSwift does not require user registration, account creation, email verification, 
                or payment information. All tools are accessible immediately without creating an account. 
                We do not offer "premium tiers," "Pro versions," or paid subscriptions.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Because no accounts exist, we cannot recover lost data, restore previous calculations, 
              or provide "account-related" support. We recommend downloading your invoices, payslips, 
              and calculation results if you wish to retain them.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Accuracy of Calculations & Disclaimers</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-semibold mb-2">Important Disclaimer</p>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    BillSwift provides estimates and calculations for informational purposes only. 
                    While we strive for accuracy using current IRS tax brackets, federal rates, and 
                    standard formulas, <strong>we do not guarantee the accuracy, completeness, or reliability 
                    of any calculation or generated document.</strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-slate-600 leading-relaxed">
                <strong>Tax Calculations:</strong> Federal and state tax estimates are based on simplified 
                formulas and 2025 IRS published brackets. They do not account for all possible deductions, 
                credits, Alternative Minimum Tax (AMT), self-employment tax, or complex tax situations. 
                Always consult a qualified tax professional or the IRS directly for official tax advice.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>Financial Calculators:</strong> Mortgage, loan, and investment calculators use standard 
                mathematical formulas. Actual lender terms, interest rates, fees, and market conditions 
                may differ. These tools are for planning purposes only and do not constitute financial advice.
              </p>
              <p className="text-slate-600 leading-relaxed">
                <strong>Invoices & Payslips:</strong> Generated documents are templates designed for general 
                business use. We do not guarantee they meet all legal requirements for your specific jurisdiction, 
                industry, or employment situation. You are responsible for ensuring compliance with local, 
                state, and federal laws regarding invoicing, payroll, and tax documentation.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed font-semibold">
              YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. THE SERVICES ARE 
              PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To the maximum extent permitted by applicable law, BillSwift and its operators shall not 
              be liable for any direct, indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to:
            </p>
            <div className="space-y-2 mb-4">
              {[
                "Loss of profits, revenue, data, or business opportunities",
                "Tax penalties, fines, or underpayment resulting from calculator estimates",
                "Disputes with clients, employees, or tax authorities over generated invoices or payslips",
                "Errors in financial planning or investment decisions based on calculator outputs",
                "Any damages arising from reliance on the Services for legal, tax, or financial decisions",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Ban className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              This limitation applies regardless of the legal theory (contract, tort, negligence, strict 
              liability, or otherwise) and even if we have been advised of the possibility of such damages. 
              In no event shall our total liability exceed $100 USD.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Acceptable Use</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You agree to use the Services only for lawful purposes and in accordance with these Terms. 
              You agree NOT to:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                "Use the Services for any illegal or fraudulent purpose",
                "Generate false, misleading, or fraudulent invoices or payslips",
                "Attempt to hack, disrupt, or overload our servers or infrastructure",
                "Scrape, crawl, or use automated tools to extract data from the Services",
                "Reproduce, duplicate, copy, sell, or resell the Services without permission",
                "Use the Services to harass, abuse, or harm others",
                "Circumvent any security features or access controls",
                "Upload malicious code, viruses, or harmful files",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-50 rounded-xl p-4 border border-red-200">
                  <Ban className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to terminate or suspend your access to the Services immediately, 
              without prior notice or liability, for any reason whatsoever, including without limitation 
              if you breach these Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The Services and their original content, features, and functionality are and will remain 
              the exclusive property of BillSwift and its licensors. The Services are protected by 
              copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Your Content:</strong> You retain all rights to any content you input into the 
              Services (calculation data, business information, employee details). We claim no ownership 
              over your data. Generated invoices, payslips, and calculation results belong to you and 
              may be used for any lawful purpose.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Our Content:</strong> The BillSwift name, logo, website design, calculator interfaces, 
              template designs, and software code are our intellectual property. You may not copy, modify, 
              distribute, or create derivative works from our proprietary content without explicit written 
              permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Modifications to Services</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Services (or any part thereof) 
              at any time, with or without notice. We shall not be liable to you or any third party for 
              any modification, suspension, or discontinuation. We may also update tax brackets, rates, 
              and formulas periodically to reflect current laws, but we do not guarantee real-time accuracy 
              of all regulatory changes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Governing Law & Jurisdiction</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the State of 
              Delaware, United States, without regard to its conflict of law provisions. Any dispute 
              arising from these Terms or your use of the Services shall be resolved exclusively in the 
              state or federal courts located in Delaware. You agree to submit to the personal jurisdiction 
              of such courts for the purpose of litigating all such claims.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Severability</h2>
            <p className="text-slate-600 leading-relaxed">
              If any provision of these Terms is held to be invalid, illegal, or unenforceable by a 
              court of competent jurisdiction, such provision shall be eliminated or limited to the minimum 
              extent necessary, and the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Entire Agreement</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you 
              and BillSwift regarding the Services and supersede all prior agreements, understandings, 
              and representations, whether written or oral.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="flex items-center gap-3 text-slate-700">
                <Scale className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">support@billswift.com</span>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                For general inquiries, use our main contact page. Legal inquiries are typically 
                responded to within 5 business days.
              </p>
            </div>
          </section>

          <div className="border-t border-slate-200 pt-8 mt-10">
            <p className="text-sm text-slate-500 text-center">
              By using BillSwift, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms of Service.
              <br />
              © 2026 BillSwift. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}