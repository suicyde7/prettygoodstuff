'use client'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const services = [
  {
    num: '01', icon: '▲',
    name: 'Full Amazon Launch',
    for: 'For brands not yet on Amazon',
    pain: 'Your product is ready. Amazon isn\'t.',
    body: 'Every month without a presence is revenue handed to your competitors. We take you from zero to a fully live, optimized, advertising store in 90 days — done right the first time.',
    milestones: ['Month 1 · Account setup & listings', 'Month 2 · FBA shipment & PPC launch', 'Month 3 · A+ Content & Brand Store'],
    accent: 'orange',
    backHeadline: '3-Month Roadmap',
    backCallout: 'End of Month 3: your store is fully live, optimized, and advertising — with a clear Month 4+ growth plan.',
    backItems: [
      { phase: 'Month 1', result: 'Account setup, USPTO trademark filed, Brand Registry submitted, all ASINs live with full SEO & barcodes' },
      { phase: 'Month 2', result: 'First FBA shipment coordinated & received, PPC (Sponsored Products) launched with keyword targeting' },
      { phase: 'Month 2', result: 'Amazon Vine Program enrolled, A+ Content designed using live conversion data' },
      { phase: 'Month 3', result: 'A+ Content submitted & live (~7 business days), Brand Store published, Sponsored Brands activated' },
      { phase: 'Month 3', result: 'Listings optimised using 60-day CTR data, coupon strategy live, inventory health reviewed' },
    ],
  },
  {
    num: '02', icon: '◈',
    name: 'Amazon Growth Management',
    for: 'For existing sellers hitting a ceiling',
    pain: 'You\'re live. But ACOS is bleeding you dry.',
    body: 'Most accounts we audit have 15–25% of ad spend going to zero-converting terms — recoverable budget we find in month one. We take over PPC, listings, and account health, and turn the dials every week.',
    milestones: ['Month 1 · PPC audit & keyword cull', 'Month 2 · Bid strategy & listing refresh', 'Monthly · P&L report & strategy call'],
    accent: 'amber',
    backHeadline: 'What we move, and when',
    backCallout: 'Most clients recover enough wasted ad spend in Month 1 to cover our management fee entirely.',
    backItems: [
      { phase: 'Month 1', result: 'Full PPC audit complete — zero-converting terms identified & cut, ACOS trending down' },
      { phase: 'Month 1', result: 'Listing keyword refresh done — titles, bullets & backend terms updated, organic rank improving' },
      { phase: 'Month 2', result: 'Bid strategy refined — negative keyword list expanded, TACOS declining, BSR stabilising' },
      { phase: 'Month 2+', result: 'Buy Box % improving, inventory health & storage fees monitored & actioned weekly' },
      { phase: 'Monthly', result: 'Full P&L, ACOS/TACOS, BSR movement report + strategy call — every 30 days' },
    ],
  },
  {
    num: '03', icon: '⬡',
    name: 'China FBA Prep & Quality Control',
    for: 'For sellers sourcing from China',
    pain: 'A defective batch sent to Amazon can destroy your store overnight.',
    body: 'If a defective batch reaches Amazon\'s warehouse, the damage is immediate — negative reviews, A-to-Z claims, account suspension. We inspect, prep, and ship from China, catching problems before they ever leave the source.',
    milestones: ['Audit · Cost & compliance review', 'Prep plan · Per-ASIN checklist built', 'Execution · Inspect, label, ship to FBA'],
    accent: 'warm',
    backHeadline: 'Audit, plan, then execute',
    backCallout: 'Most sellers switching from US prep save $0.50–$1.50/unit. We run the numbers for you before you commit.',
    backItems: [
      { phase: 'Audit', result: 'Review your current prep costs, shipping routes, FBA compliance gaps & recurring labeling issues' },
      { phase: 'Cost analysis', result: 'Compare China vs. US prep cost per unit — identify exact savings available for your SKUs' },
      { phase: 'Prep plan', result: 'Build a custom checklist: poly bag spec, FNSKU placement, bundle & carton requirements per ASIN' },
      { phase: 'Execution', result: 'Each batch received at our China facility — inspected, labeled & packed to Amazon FBA spec' },
      { phase: 'Shipment', result: 'FBA shipment plan created in Seller Central, freight coordinated direct to Amazon warehouse' },
    ],
  },
]

const styles: Record<string, {
  icon: string; for: string; ring: string;
  backTag: string; phase: string; callout: string;
  milestone: string; milestoneRow: string; hint: string;
}> = {
  orange: {
    icon: 'text-accent bg-accentLight border-accent/20',
    for: 'text-accent/70 bg-accentLight border-accent/15',
    ring: 'group-hover:ring-accent',
    backTag: 'border-accent/25 text-accent bg-accentLight',
    phase: 'text-accent',
    callout: 'bg-accentLight border-accent/20 text-accent/80',
    milestone: 'text-accent/60',
    milestoneRow: 'bg-accentLight border-accent/15',
    hint: 'text-accent/50',
  },
  amber: {
    icon: 'text-amber-600 bg-amber-50 border-amber-200',
    for: 'text-amber-600/70 bg-amber-50 border-amber-200',
    ring: 'group-hover:ring-amber-400',
    backTag: 'border-amber-200 text-amber-600 bg-amber-50',
    phase: 'text-amber-600',
    callout: 'bg-amber-50 border-amber-200 text-amber-700',
    milestone: 'text-amber-500/70',
    milestoneRow: 'bg-amber-50 border-amber-200',
    hint: 'text-amber-500/50',
  },
  warm: {
    icon: 'text-orange-800 bg-orange-50 border-orange-200',
    for: 'text-orange-800/70 bg-orange-50 border-orange-200',
    ring: 'group-hover:ring-orange-300',
    backTag: 'border-orange-200 text-orange-800 bg-orange-50',
    phase: 'text-orange-800',
    callout: 'bg-orange-50 border-orange-200 text-orange-900',
    milestone: 'text-orange-700/60',
    milestoneRow: 'bg-orange-50 border-orange-200',
    hint: 'text-orange-700/50',
  },
}

export default function Services() {
  const { ref, isVisible } = useScrollReveal()
  const [flipped, setFlipped] = useState([false, false, false])
  const toggle = (i: number) => setFlipped(prev => prev.map((v, idx) => idx === i ? !v : v))

  return (
    <section id="services" className="bg-base py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-16 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-accent font-light tracking-wider">01</span>
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">What We Do</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">PGS Helm Services</h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            We fix the exact problems that are costing you revenue right now.
          </p>
        </div>

        <div ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {services.map(({ num, icon, name, for: forLabel, pain, body, milestones, accent, backHeadline, backCallout, backItems }, i) => {
            const s = styles[accent]
            return (
              <div
                key={name}
                className="relative cursor-pointer group"
                style={{ perspective: '1200px' }}
                onClick={() => toggle(i)}
              >
                <div
                  className="relative w-full transition-all duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    height: '600px',
                  }}
                >

                  {/* ── FRONT ── */}
                  <div
                    className={`absolute inset-0 flex flex-col p-8 bg-surface border border-border rounded-lg transition-all duration-300 group-hover:ring-2 ${s.ring} group-hover:shadow-xl group-hover:shadow-accent/10`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className={`text-xl p-2.5 border rounded-md ${s.icon}`}>{icon}</div>
                      <span className="text-muted/30 text-xs font-light">{num}</span>
                    </div>

                    {/* For badge */}
                    <span className={`self-start text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border mb-4 ${s.for}`}>
                      {forLabel}
                    </span>

                    {/* Name + pain */}
                    <h3 className="font-display font-semibold text-2xl text-ink uppercase mb-2 leading-tight">{name}</h3>
                    <p className="text-ink font-semibold text-sm italic mb-4">"{pain}"</p>

                    {/* Body */}
                    <p className="text-muted text-sm leading-relaxed flex-grow">{body}</p>

                    {/* Milestones */}
                    <div className="border-t border-border pt-4 mt-auto flex flex-col gap-2">
                      {milestones.map((m, mi) => {
                        const [phase, ...rest] = m.split(' · ')
                        return (
                          <div key={mi} className={`flex items-center gap-3 px-3 py-2 rounded-md border ${s.milestoneRow}`}>
                            <span className={`text-[10px] font-bold tracking-widest uppercase flex-shrink-0 ${s.phase}`}>{phase}</span>
                            <span className="w-px h-3 bg-border flex-shrink-0" />
                            <span className="text-[11px] text-muted font-medium">{rest.join(' · ')}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Flip hint */}
                    <p className={`text-[10px] tracking-widest uppercase mt-3 ${s.hint}`}>
                      See full roadmap →
                    </p>
                  </div>

                  {/* ── BACK ── */}
                  <div
                    className={`absolute inset-0 flex flex-col p-8 bg-surface border border-border rounded-lg transition-all duration-300 group-hover:ring-2 ${s.ring} group-hover:shadow-xl group-hover:shadow-accent/10`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`text-xl p-2.5 border rounded-md ${s.icon}`}>{icon}</div>
                      <span className={`text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${s.backTag}`}>
                        {backHeadline}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-xl text-ink uppercase mb-5 leading-tight">{name}</h3>

                    <div className="flex flex-col gap-3">
                      {backItems.map((item, bi) => (
                        <div key={bi} className="flex items-start gap-3">
                          <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 flex-shrink-0 w-24 ${s.phase}`}>{item.phase}</span>
                          <span className="text-xs text-muted leading-relaxed">{item.result}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-auto rounded-md px-4 py-3 border text-xs leading-relaxed font-medium ${s.callout}`}>
                      {backCallout}
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
