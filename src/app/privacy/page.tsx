"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Mail, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                FinCalc<span className="text-emerald-600">Pro</span>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-6">
            <Shield className="h-4 w-4" />
            <span>Last Updated: May 7, 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your privacy is our top priority. FinCalcPro is designed to be completely private — 
            we never store, track, or sell your financial data.
          </p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-emerald-600" />
              1. Our Core Privacy Promise
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-4">
              <p className="text-emerald-800 font-semibold text-lg mb-2">🔒 100% Privacy-First Design</p>
              <p className="text-emerald-700">
                All calculations, invoice generations, and payslip creations happen entirely in your browser. 
                <strong> We do not have a database.</strong> We do not store your financial information on any server. 
                When you close your browser tab, your data is gone — unless you choose to download it.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed">
              FinCalcPro operates on a strict "zero-data-collection" principle. Unlike most financial websites 
              that require accounts and store your sensitive information, we built our tools to function 
              completely client-side. This means your income, tax brackets, mortgage details, invoice data, 
              and employee payroll information never leave your device.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              2. What Data We Do NOT Collect
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                "Names, addresses, or contact information",
                "Financial figures or calculation inputs",
                "Bank account or credit card details",
                "Social Security Numbers or EINs",
                "Invoice or payslip content",
                "Browsing history or search queries",
                "Device identifiers or IP addresses",
                "Cookies for tracking or advertising",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <Shield className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              We do not use Google Analytics, Facebook Pixel, or any third-party tracking scripts. 
              We do not participate in data broker programs. We do not build user profiles. 
              We do not sell, rent, or share any information with advertisers, marketers, or data aggregators.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-violet-600" />
              3. Limited Data We Process
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The only data processing that occurs is entirely within your browser:
            </p>
            <div className="space-y-3">
              {[
                { title: "Browser LocalStorage (Optional)", desc: "If you enable auto-save features, your business name and address may be stored locally on your own device using browser LocalStorage. This is NOT sent to our servers. You can clear this anytime via your browser settings." },
                { title: "PDF Generation", desc: "When you download an invoice or payslip as PDF, the file is generated in your browser using html2canvas and jsPDF. The PDF content never passes through our servers." },
                { title: "Server Logs (Minimal)", desc: "Our hosting provider (Vercel) may collect basic server logs including your IP address and requested URL for security and performance monitoring. These logs are anonymized after 30 days and are not linked to any personal identity." },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-cyan-600" />
              4. How Our Tools Work (Client-Side Architecture)
            </h2>
            <div className="bg-slate-900 rounded-2xl p-6 text-white mb-4">
              <h3 className="font-semibold text-lg mb-3">Technical Architecture</h3>
              <div className="space-y-2 text-sm text-slate-300 font-mono">
                <p>1. User enters data → Browser (Your Device)</p>
                <p>2. Calculations run → JavaScript (Client-Side)</p>
                <p>3. PDF generated → html2canvas + jsPDF (Browser)</p>
                <p>4. File downloaded → Direct to Your Device</p>
                <p className="text-emerald-400 mt-2">✓ No data sent to FinCalcPro servers</p>
                <p className="text-emerald-400">✓ No cloud storage or database</p>
                <p className="text-emerald-400">✓ No third-party API calls with your data</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Our mortgage calculator, tax calculator, invoice maker, payslip generator, and all other tools 
              use React state management that exists only in your browser's memory. When you refresh the page, 
              the state resets unless you have explicitly enabled browser storage.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use the following third-party services strictly for hosting and delivery:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-900">Service</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-900">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-900">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Vercel</td>
                    <td className="px-4 py-3 text-slate-700">Website hosting & CDN</td>
                    <td className="px-4 py-3 text-slate-700">None (static files only)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">GitHub</td>
                    <td className="px-4 py-3 text-slate-700">Code repository</td>
                    <td className="px-4 py-3 text-slate-700">Source code only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-slate-700">Lucide React</td>
                    <td className="px-4 py-3 text-slate-700">Icon library (CDN)</td>
                    <td className="px-4 py-3 text-slate-700">None</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 leading-relaxed mt-4">
              We do not use Google Fonts, Google Analytics, Facebook Pixel, Hotjar, Mixpanel, 
              or any other tracking or analytics services that could collect your data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Children's Privacy (COPPA Compliance)</h2>
            <p className="text-slate-600 leading-relaxed">
              FinCalcPro is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us immediately. 
              If we become aware that we have collected personal information from children under 13 
              without verification of parental consent, we will take steps to remove that information.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. California Privacy Rights (CCPA)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you are a California resident, you have the following rights under the California Consumer 
              Privacy Act (CCPA):
            </p>
            <div className="space-y-2 mb-4">
              {[
                "Right to Know: Request disclosure of data collection practices (we collect none)",
                "Right to Delete: Request deletion of personal information (nothing stored to delete)",
                "Right to Opt-Out: Opt-out of sale of personal information (we never sell data)",
                "Right to Non-Discrimination: Equal service regardless of privacy choices",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">{i + 1}.</span>
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed">
              To exercise any of these rights, simply email us at the address below. Given our zero-data 
              architecture, most requests will confirm that no personal data is held.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              legal requirements, or tool functionality. The updated policy will be posted on this page 
              with a revised "Last Updated" date. We encourage you to review this policy periodically. 
              Your continued use of FinCalcPro after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or 
                our data practices, please contact us:
              </p>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">privacy@fincalcpro.com</span>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                We aim to respond to all privacy-related inquiries within 48 hours. 
                For legal matters, responses may take up to 5 business days.
              </p>
            </div>
          </section>

          <div className="border-t border-slate-200 pt-8 mt-10">
            <p className="text-sm text-slate-500 text-center">
              By using FinCalcPro, you acknowledge that you have read and understood this Privacy Policy. 
              <br />
              © 2026 FinCalcPro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}