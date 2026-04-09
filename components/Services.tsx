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
    outcomes: ['Live, ranked store in 90 days', 'Lower launch costs vs. doing it wrong first'],
    tags: ['Account Setup', 'SEO Listings', 'A+ Content', 'Brand Store', 'PPC Launch'],
    accent: 'orange',
    backHeadline: '3-Month Roadmap',
    backCallout: 'End of Month 3: A+ Content live, Brand Store live, 60-day performance report & Month 4+ retainer proposal delivered.',
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
    outcomes: ['Avg. 20–35% ACOS reduction within 60 days', 'More margin, less guesswork'],
    tags: ['PPC Management', 'Listing Refresh', 'Inventory Health', 'Account Monitoring', 'Monthly Reporting'],
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
    outcomes: ['Stop defects before they reach Amazon', 'Save $0.50–$1.50/unit vs. US prep centers'],
    tags: ['QC Inspection', 'FNSKU Labeling', 'Poly Bagging', 'Direct-to-FBA', 'Defect Prevention'],
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
  icon: string; tag: string; button: string; for: string; outcome: string;
  ring: string; backTag: string; phase: string; callout: string;
}> = {
  orange: {
    icon: 'text-accent bg-accentLight border-accent/20',
    tag: 'border-accent/20 text-accent/80 bg-accentLight',
    button: 'bg-accent text-white hover:bg-accentDark shadow-accent/30',
    for: 'text-accent/70 bg-accentLight border-accent/15',
    outcome: 'text-accent',
    ring: 'group-hover:ring-accent',
    backTag: 'border-accent/25 text-accent bg-accentLight',
    phase: 'text-accent',
    callout: 'bg-accentLight border-accent/20 text-accent/80',
  },
  amber: {
    icon: 'text-amber-600 bg-amber-50 border-amber-200',
    tag: 'border-amber-200 text-amber-600/80 bg-amber-50',
    button: 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/30',
    for: 'text-amber-600/70 bg-amber-50 border-amber-200',
    outcome: 'text-amber-600',
    ring: 'group-hover:ring-amber-400',
    backTag: 'border-amber-200 text-amber-600 bg-amber-50',
    phase: 'text-amber-600',
    callout: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  warm: {
    icon: 'text-orange-800 bg-orange-50 border-orange-200',
    tag: 'border-orange-200 text-orange-800/70 bg-orange-50',
    button: 'bg-orange-800 text-white hover:bg-orange-900 shadow-orange-800/30',
    for: 'text-orange-800/70 bg-orange-50 border-orange-200',
    outcome: 'text-orange-800',
    ring: 'group-hover:ring-orange-300',
    backTag: 'border-orange-200 text-orange-800 bg-orange-50',
    phase: 'text-orange-800',
    callout: 'bg-orange-50 border-orange-200 text-orange-900',
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
          {services.map(({ num, icon, name, for: forLabel, pain, body, outcomes, tags, accent, backHeadline, backCallout, backItems }, i) => {
            const s = styles[accent]
            return (
              <div
                key={name}
                className="relative cursor-pointer group"
                style={{ perspective: '1200px' }}
                onClick={() => toggle(i)}
              >
                {/* Flip container */}
                <div
                  className="relative w-full transition-all duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    height: '720px',
                  }}
                >

                  {/* ── FRONT ── */}
                  <div
                    className={`absolute inset-0 flex flex-col p-8 bg-surface border border-border rounded-lg transition-all duration-300 group-hover:ring-2 ${s.ring} group-hover:shadow-xl group-hover:shadow-accent/10`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`text-xl p-2.5 border rounded-md ${s.icon}`}>{icon}</div>
                      <span className="text-muted/30 text-xs font-light">{num}</span>
                    </div>

                    <span className={`self-start text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border mb-5 ${s.for}`}>
                      {forLabel}
                    </span>

                    <h3 className="font-display font-semibold text-2xl text-ink uppercase mb-2 leading-tight">{name}</h3>
                    <p className="text-ink font-semibold text-sm mb-4 italic">"{pain}"</p>
                    <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">{body}</p>

                    <div className="bg-surfaceAlt rounded-md px-4 py-3 mb-6 space-y-1.5">
                      {outcomes.map((o) => (
                        <p key={o} className={`text-xs font-semibold flex items-center gap-2 ${s.outcome}`}>
                          <span>→</span>{o}
                        </p>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className={`border text-[10px] tracking-widest uppercase px-3 py-1 rounded-full ${s.tag}`}>{tag}</span>
                      ))}
                    </div>
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

                    <h3 className="font-display font-semibold text-2xl text-ink uppercase mb-5 leading-tight">{name}</h3>

                    <div className="flex-grow flex flex-col justify-between mb-5">
                      {backItems.map((item, bi) => (
                        <div key={bi} className="flex items-start gap-3">
                          <span className={`text-[10px] font-bold tracking-widest uppercase mt-1 flex-shrink-0 w-24 ${s.phase}`}>{item.phase}</span>
                          <span className="text-sm text-muted leading-relaxed">{item.result}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`rounded-md px-4 py-3 border text-xs leading-relaxed font-medium ${s.callout}`}>
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
