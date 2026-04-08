import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of Pretty Good Stuff services and the prettygoodstuff.co website.',
}

const LAST_UPDATED = 'April 8, 2026'
const CONTACT_EMAIL = 'welcome@prettygoodstuff.co'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surfaceAlt flex flex-col">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-border">
        <Link href="/">
          <Image src="/logo.png" alt="Pretty Good Stuff" width={800} height={150} className="h-[32px] w-auto object-contain" />
        </Link>
        <Link href="/"
          className="flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 text-xs font-semibold tracking-widest uppercase">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      <main className="flex-grow px-8 py-20">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">Legal</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              Terms of<br />
              <span className="gradient-text-accent">Service.</span>
            </h1>
            <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-12 text-muted text-sm leading-relaxed">

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">1. Agreement</h2>
              <p>
                By accessing or using the website at <span className="text-ink">prettygoodstuff.co</span> or
                engaging Pretty Good Stuff for consulting services, you agree to be bound by these Terms of
                Service. If you do not agree, please do not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">2. Services</h2>
              <p className="mb-4">
                Pretty Good Stuff provides Amazon account management, FBA prep coordination, and
                related e-commerce consulting services. Specific deliverables, timelines, and pricing
                are defined in individual service agreements signed with each client.
              </p>
              <p>
                Waitlist sign-ups for PGS Compass and PGS Origin do not constitute a purchase,
                subscription, or binding commitment on either party. Early access details will be
                communicated before any billing begins.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">3. Payment & Refunds</h2>
              <p className="mb-4">
                {/* PLACEHOLDER — update with your real payment terms */}
                Payment terms are specified in each client&apos;s service agreement. Generally:
              </p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Consulting engagements are invoiced as agreed (monthly, milestone, or project-based)</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Month-to-month services require 30 days written notice to cancel</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Fixed-scope project fees are non-refundable once work has commenced</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Disputes must be raised within 14 days of the relevant invoice date</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">4. Client Responsibilities</h2>
              <p className="mb-4">To enable us to deliver services effectively, clients agree to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Provide accurate and complete information about their products and Amazon account</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Grant necessary account access via Amazon Seller Central user permissions</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Respond to requests for approvals or information in a timely manner</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Comply with Amazon&apos;s Seller Policies and applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">5. Intellectual Property</h2>
              <p>
                All content on this website — including copy, design, and structure — is the property of
                Pretty Good Stuff. Strategy documents, playbooks, and deliverables created for a client
                become the client&apos;s property upon full payment. We reserve the right to reference
                the engagement as a case study (with client approval) after completion.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">6. Disclaimer of Warranties</h2>
              <p>
                Amazon results — including sales rank, organic position, ACOS, and account health —
                depend on many factors outside our control, including Amazon algorithm changes, market
                competition, and product quality. We do not guarantee specific results. Our commitments
                are to process, effort, and transparency — not to specific revenue outcomes.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Pretty Good Stuff shall not be liable for any
                indirect, incidental, or consequential damages arising from the use of our services or
                website, including but not limited to lost profits, Amazon account suspension, or
                inventory loss. Our total liability for any claim shall not exceed the fees paid in the
                30 days preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">8. Confidentiality</h2>
              <p>
                Both parties agree to keep confidential any non-public business information shared
                during the engagement. This includes pricing, strategy, supplier relationships, and
                account performance data. This obligation survives termination of the engagement.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">9. Governing Law</h2>
              <p>
                {/* PLACEHOLDER — update with your jurisdiction */}
                These Terms are governed by the laws of [Your State/Country]. Any disputes shall be
                resolved through good-faith negotiation first, followed by binding arbitration if
                unresolved within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">10. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of our website or services
                after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">11. Contact</h2>
              <p>
                Questions about these Terms? Email us at{' '}
                <span className="text-ink">{CONTACT_EMAIL}</span>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <footer className="px-8 py-8 border-t border-border">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted/40 text-xs">© 2026 Pretty Good Stuff. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-muted/50 text-xs hover:text-muted transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-accent text-xs hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
