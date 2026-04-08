import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Pretty Good Stuff collects, uses, and protects your personal information.',
}

const LAST_UPDATED = 'April 8, 2026'
const CONTACT_EMAIL = 'welcome@prettygoodstuff.co'

export default function PrivacyPage() {
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
              Privacy<br />
              <span className="gradient-text-accent">Policy.</span>
            </h1>
            <p className="text-muted text-sm">Last updated: {LAST_UPDATED}</p>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-12 text-muted text-sm leading-relaxed">

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">1. Who We Are</h2>
              <p>
                Pretty Good Stuff (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website{' '}
                <span className="text-ink">prettygoodstuff.co</span> and provides Amazon store management,
                China FBA prep, and related consulting services. This Privacy Policy explains how we collect,
                use, and protect personal information you provide to us.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">2. Information We Collect</h2>
              <p className="mb-4">We collect personal information you voluntarily provide, including:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Email address (required for waitlist sign-up)</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Full name</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Phone number</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Company or brand name</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Amazon store URL</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Product interests (Compass, Origin, or both)</li>
              </ul>
              <p className="mt-4">
                We do not collect payment information directly. We do not use cookies for tracking or advertising.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information you provide to:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Contact you about early access to PGS Compass and PGS Origin</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Send launch updates and founding member communications</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Respond to direct inquiries submitted via contact channels</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> Improve our services and understand demand</li>
              </ul>
              <p className="mt-4">We will never sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">4. How We Store Your Data</h2>
              <p>
                Waitlist form submissions are processed via Google Apps Script and stored in Google Sheets,
                hosted by Google LLC. Google&apos;s data handling practices are governed by their{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-accent hover:underline">Privacy Policy</a>.
                Scheduling is handled via Calendly, whose{' '}
                <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-accent hover:underline">Privacy Policy</a>{' '}
                applies to data entered through their booking flow.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">5. Third-Party Services</h2>
              <p className="mb-4">This site uses the following third-party services:</p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> <strong className="text-ink">Google Translate</strong> — for language switching. Google may collect usage data.</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> <strong className="text-ink">Calendly</strong> — for scheduling strategy calls.</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> <strong className="text-ink">Google Apps Script / Google Sheets</strong> — for form submissions.</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> <strong className="text-ink">Vercel</strong> — for hosting and analytics (if enabled).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">6. Your Rights</h2>
              <p className="mb-4">
                Depending on your location, you may have rights under GDPR, CCPA, or applicable local law, including:
              </p>
              <ul className="flex flex-col gap-2 pl-4">
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> The right to access personal data we hold about you</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> The right to request correction or deletion of your data</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-1 flex-shrink-0">→</span> The right to opt out of marketing communications at any time</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, email us at{' '}
                <span className="text-ink">{CONTACT_EMAIL}</span>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">7. Data Retention</h2>
              <p>
                We retain your information for as long as needed to fulfill the purposes described above,
                or until you request deletion. Waitlist data is reviewed and pruned periodically.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at
                the top of this page reflects the most recent revision. Continued use of our website after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink uppercase mb-4">9. Contact</h2>
              <p>
                Questions about this policy? Email us at{' '}
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
            <Link href="/privacy" className="text-accent text-xs hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-muted/50 text-xs hover:text-muted transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
