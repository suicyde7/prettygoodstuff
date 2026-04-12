import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'China FBA Prep Center Pricing',
  description:
    'Transparent, volume-based pricing for Amazon FBA prep services from China. FNSKU labeling, poly bagging, QC inspection, and direct-to-FBA shipping. Save $0.55–$1.00/unit vs. US prep centers.',
  openGraph: {
    title: 'China FBA Prep Pricing | Pretty Good Stuff',
    description: 'Transparent volume pricing for China FBA prep. Save up to $1.00/unit vs. US prep centers.',
    url: 'https://prettygoodstuff.co/pricing/china-fba-prep',
  },
}

const tiers = [
  { volume: '1–499 units',        standard: '$0.55', premium: '$0.70', full: '$0.90' },
  { volume: '500–1,999 units',    standard: '$0.45', premium: '$0.60', full: '$0.78' },
  { volume: '2,000–4,999 units',  standard: '$0.38', premium: '$0.50', full: '$0.68' },
  { volume: '5,000+ units',       standard: 'Quote', premium: 'Quote', full: 'Quote' },
]

const addons = [
  { service: 'Bundle assembly (2–6 items)',    fee: '+$0.35/bundle' },
  { service: 'Bundle assembly (7–12 items)',   fee: '+$0.65/bundle' },
  { service: 'Bundle assembly (13–20 items)',  fee: '+$1.10/bundle' },
  { service: 'Large items (>12" per side)',    fee: '+$0.35/unit' },
  { service: 'Oversized items (>24")',         fee: '+$0.80/unit' },
  { service: 'Box re-labeling',               fee: '+$0.45/unit' },
  { service: 'Hazmat prep',                   fee: '+$0.65/unit' },
  { service: 'FBM/DTC direct fulfillment',    fee: '+$0.90/unit' },
]

const materials = [
  { item: 'Standard poly bag',   fee: 'Included in Premium & Full' },
  { item: 'XL poly bag',         fee: '+$0.15/unit' },
  { item: 'Bubble wrap',         fee: '+$0.12/unit' },
  { item: 'Carton (small)',      fee: '$2.50' },
  { item: 'Carton (medium)',     fee: '$3.50' },
  { item: 'Carton (large)',      fee: '$4.50' },
]

const freight = [
  { service: '20ft container coordination',  rate: '$280 flat' },
  { service: '40ft container coordination',  rate: '$520 flat' },
  { service: 'Express air freight',          rate: 'Quote on request' },
]

const included = [
  { icon: '✓', label: 'FNSKU labeling (Amazon-compliant)' },
  { icon: '✓', label: 'Carton labeling & packing to FBA spec' },
  { icon: '✓', label: 'Inbound shipment plan created in Seller Central' },
  { icon: '✓', label: 'Direct-to-FBA freight coordination' },
  { icon: '✓', label: 'Photo documentation of each batch' },
  { icon: '✓', label: '14-day free storage at China facility' },
]

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className={`grid bg-surfaceAlt border-b border-border`}
        style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((h, i) => (
          <div key={i} className={`px-5 py-3 ${i > 0 ? 'border-l border-border text-center' : ''}`}>
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted">{h}</p>
          </div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri}
          className={`grid ${ri < rows.length - 1 ? 'border-b border-border' : ''}`}
          style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
          {row.map((cell, ci) => (
            <div key={ci} className={`px-5 py-3.5 ${ci > 0 ? 'border-l border-border text-center' : ''}`}>
              <p className={`text-sm ${ci === 0 ? 'text-muted' : 'text-ink font-semibold'} ${cell === 'Quote' ? 'text-accent text-xs tracking-widest uppercase font-bold' : ''}`}>
                {cell}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ChinaFBAPrepPricingPage() {
  return (
    <div className="min-h-screen bg-surfaceAlt flex flex-col">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-border bg-surface">
        <Link href="/">
          <Image src="/logo.png" alt="Pretty Good Stuff" width={800} height={150} className="h-[32px] w-auto object-contain" />
        </Link>
        <Link href="/#pricing"
          className="flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 text-xs font-semibold tracking-widest uppercase">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      <main className="flex-grow px-8 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 bg-surface border border-orange-200 text-orange-800 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase">China FBA Prep Center · Transparent Pricing</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              Simple.<br />
              <span className="gradient-text-accent">Transparent.</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-lg">
              No hidden fees. No surprises on invoice. Volume-based pricing that rewards growth —
              and saves you $0.55–$1.00/unit compared to US prep centers.
            </p>
          </div>

          {/* What's always included */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-ink mb-5">Included with every order</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {included.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-accent text-sm font-bold flex-shrink-0">{icon}</span>
                  <span className="text-sm text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main pricing table */}
          <div className="mb-10">
            <h2 className="font-display font-semibold text-2xl text-ink uppercase mb-2">Standard Processing</h2>
            <p className="text-muted text-xs mb-5 leading-relaxed">
              Volume is calculated per individual shipment. Mix services across ASINs within the same shipment.
            </p>
            <Table
              headers={['Monthly Volume', 'Standard · Label Only', 'Premium · Poly + Label', 'Full Service · QC + Poly + Label + Carton']}
              rows={tiers.map(t => [t.volume, t.standard, t.premium, t.full])}
            />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tier: 'Standard', desc: 'FNSKU label applied, Amazon-compliant placement' },
                { tier: 'Premium', desc: 'Poly bag (suffocation warning) + FNSKU label' },
                { tier: 'Full Service', desc: 'Pre-shipment QC inspection + poly bag + FNSKU label + carton prep' },
              ].map(({ tier, desc }) => (
                <div key={tier} className="bg-surface border border-border rounded-md px-4 py-3">
                  <p className="text-xs font-bold tracking-widest uppercase text-ink mb-1">{tier}</p>
                  <p className="text-xs text-muted leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-10">
            <h2 className="font-display font-semibold text-2xl text-ink uppercase mb-2">Add-On Services</h2>
            <p className="text-muted text-xs mb-5">Added to base prep cost per unit or bundle.</p>
            <Table
              headers={['Service', 'Fee']}
              rows={addons.map(a => [a.service, a.fee])}
            />
          </div>

          {/* Materials */}
          <div className="mb-10">
            <h2 className="font-display font-semibold text-2xl text-ink uppercase mb-2">Boxes & Materials</h2>
            <p className="text-muted text-xs mb-5">Standard poly bags and FNSKU labels are included in Premium and Full Service tiers.</p>
            <Table
              headers={['Item', 'Fee']}
              rows={materials.map(m => [m.item, m.fee])}
            />
          </div>

          {/* Freight */}
          <div className="mb-10">
            <h2 className="font-display font-semibold text-2xl text-ink uppercase mb-2">Freight Coordination</h2>
            <p className="text-muted text-xs mb-5">We coordinate freight direct to Amazon's warehouse. You get full tracking.</p>
            <Table
              headers={['Service', 'Rate']}
              rows={freight.map(f => [f.service, f.rate])}
            />
          </div>

          {/* Terms */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-ink mb-5">Terms</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
              {[
                ['Minimum order', '100 units'],
                ['Payment', '50% deposit · 50% before shipment'],
                ['Free storage', '14 days at China facility'],
                ['Storage after 14 days', '$25/m³/month'],
                ['Returns & rework', 'Charged at same rate as original prep'],
                ['Setup fee', 'None (founding clients)'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-border pb-3">
                  <span className="text-xs text-muted">{label}</span>
                  <span className="text-xs font-semibold text-ink text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compare vs US */}
          <div className="bg-accentLight border border-accent/20 rounded-lg p-8 mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-accent mb-5">How this compares to US prep centers</p>
            <Table
              headers={['Volume', 'Typical US Center', 'PGS China (Premium)', 'Your Savings/Unit']}
              rows={[
                ['1–200 units',       '$1.70',  '$0.70', '$1.00'],
                ['201–999 units',     '$1.40',  '$0.60', '$0.80'],
                ['1,000–1,999 units', '$1.25',  '$0.60', '$0.65'],
                ['2,000+ units',      '$1.05',  '$0.50', '$0.55'],
              ]}
            />
            <p className="text-accent/70 text-xs mt-4 leading-relaxed">
              US center rates based on published industry pricing. Actual savings vary by product type and prep complexity.
              Full Service adds QC inspection — which most US centers don't offer at any price point.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-surface border border-border rounded-lg p-8 text-center">
            <p className="font-display font-semibold text-2xl text-ink uppercase mb-2">
              Ready to Switch?
            </p>
            <p className="text-muted text-sm leading-relaxed max-w-md mx-auto mb-6">
              Book a free 30-minute call. We'll review your current prep setup, run the exact numbers
              for your SKUs, and give you a custom quote — before you commit to anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://calendly.com/welcome-prettygoodstuff/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-accentDark transition-colors shadow-lg shadow-accent/20"
              >
                Book a Free Sourcing Call →
              </a>
              <Link
                href="/tools/china-fba-savings"
                className="inline-flex items-center justify-center gap-3 border border-border bg-surfaceAlt text-muted font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:border-accent/30 hover:text-ink transition-all"
              >
                Calculate Your Savings First
              </Link>
            </div>
            <p className="text-muted/40 text-xs mt-4">No commitment. No pitch. Just a real conversation about your numbers.</p>
          </div>

        </div>
      </main>

      <footer className="px-8 py-8 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted/40 text-xs">© 2026 Pretty Good Stuff · ShenCo LLC</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-muted/40 text-xs hover:text-muted transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted/40 text-xs hover:text-muted transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
