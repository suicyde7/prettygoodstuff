'use client'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const plans = [
  {
    num: '01',
    tag: 'Founding Client Rate',
    service: 'Full Amazon Launch Bundle - 3 Months',
    forIf: 'You have a product and want to launch on Amazon the right way — fully set up, optimized, and advertising from day one.',
    price: '$3,000', originalPrice: '$4,500', discount: '33% off',
    unit: '3-month launch package',
    features: [
      'Amazon Professional account setup',
      'Up to 5 ASINs — fully SEO-optimized',
      'Brand Registry & trademark guidance',
      'A+ Content for all ASINs',
      'Amazon Brand Store (multi-page)',
      'PPC campaigns built & launched',
      'Weekly optimization for 90 days',
      'Final strategy & handoff document',
    ],
    cta: 'Book a Free Strategy Call',
    accent: 'orange',
    steps: [
      { num: '01', title: 'Free Strategy Call', desc: '30 min. We review your product, market & goals. Zero commitment required.' },
      { num: '02', title: 'Proposal & Scope', desc: 'Custom plan with clear deliverables, milestones & pricing — delivered within 3 days.' },
      { num: '03', title: 'Account & Research', desc: 'Account setup, keyword research, competitor deep dive. Weeks 1–2.' },
      { num: '04', title: 'Build Phase', desc: 'Listings, A+ Content, Brand Store & PPC campaigns built and live. Weeks 3–8.' },
      { num: '05', title: 'Launch & Optimise', desc: 'Weekly monitoring, bid adjustments & reporting through week 12. Handoff at close.' },
    ],
  },
  {
    num: '02',
    tag: 'Most Popular — Founding Rate',
    service: 'Amazon Growth Management',
    forIf: 'You\'re already selling but growth has stalled, ACOS is too high, and you\'re tired of leaving money on the table every month.',
    price: '$1,800', originalPrice: '$2,800', discount: '36% off',
    unit: 'per month',
    features: [
      'Full PPC audit + ongoing management',
      'Keyword refresh (up to 10 ASINs)',
      'A+ Content refresh & optimization',
      'Inventory health & FBA fee reduction',
      'Account health & case management',
      'Buy Box & hijacker monitoring',
      'Pricing & promotions strategy',
      'Monthly P&L, ACOS/TACOS report',
    ],
    cta: 'Book a Free Strategy Call',
    accent: 'amber',
    steps: [
      { num: '01', title: 'Free Account Audit', desc: 'We pull your data — ACOS, wasted spend, listing health, ODR. Free, no strings attached.' },
      { num: '02', title: 'Custom Action Plan', desc: 'Priority list of what to fix first, with expected impact per item. Delivered in 5 days.' },
      { num: '03', title: 'Month 1: Foundation', desc: 'PPC restructure, listing keyword refresh, negative keywords, account cleanup.' },
      { num: '04', title: 'Month 2+: Optimise', desc: 'Weekly dial-turning on bids, listings & inventory. Strategy call every 30 days.' },
      { num: '05', title: 'Monthly Reporting', desc: 'Full P&L, ACOS/TACOS, BSR movement & next-month priorities. Transparent every step.' },
    ],
  },
  {
    num: '03',
    tag: 'Add-On Service',
    service: 'China FBA Prep Center',
    forIf: 'You source from China and a bad batch has either already cost you — or you know it\'s only a matter of time. Cut defect risk, cut costs, ship direct to FBA.',
    price: 'From $0.50', originalPrice: undefined, discount: undefined,
    unit: 'per unit — volume discounts available',
    features: [
      'FNSKU labeling (Amazon-compliant)',
      'Poly bagging with suffocation warning',
      'Bundle & kit assembly',
      'Pre-shipment QC inspection',
      'Carton labeling & packing',
      'Shipment plan creation in Seller Central',
      'Direct-to-FBA freight coordination',
      'Saves $0.50–$1.50/unit vs. US prep',
    ],
    cta: 'Get a Custom Quote',
    accent: 'warm',
    steps: [
      { num: '01', title: 'Share Your Specs', desc: 'Send your ASIN list, FNSKU codes, product dimensions & prep requirements.' },
      { num: '02', title: 'Shipment Plan Created', desc: 'We build your inbound shipment in Seller Central & generate all FBA labels within 24 hrs.' },
      { num: '03', title: 'Factory → Prep Center', desc: 'Your factory ships directly to our China prep facility. We receive, count & document.' },
      { num: '04', title: 'Inspect, Label & Pack', desc: 'QC inspection, FNSKU labeling, poly bagging, bundling & carton packing to Amazon spec.' },
      { num: '05', title: 'Direct to FBA', desc: 'We coordinate freight and ship directly to Amazon\'s warehouse. You get tracking updates.' },
    ],
  },
]

const styles: Record<string, {
  tag: string; price: string; check: string; forBox: string; forLabel: string;
  unit: string; num: string; ring: string; button: string;
  circle: string; stepTitle: string; stepDesc: string; connector: string; arrow: string;
}> = {
  orange: {
    tag: 'border-accent/25 text-accent bg-accentLight',
    price: 'gradient-text-accent',
    check: 'text-accent',
    forBox: 'bg-surfaceAlt',
    forLabel: 'text-muted/50',
    unit: 'text-muted/50',
    num: 'text-muted/30',
    ring: 'group-hover:ring-accent',
    button: 'bg-accent text-white hover:bg-accentDark shadow-accent/30',
    circle: 'bg-accentLight border-accent/25 text-accent',
    stepTitle: 'text-ink',
    stepDesc: 'text-muted',
    connector: 'bg-accent/20',
    arrow: 'text-accent/40',
  },
  amber: {
    tag: 'border-amber-200 text-amber-600 bg-amber-50',
    price: 'text-amber-600',
    check: 'text-amber-500',
    forBox: 'bg-amber-50/60',
    forLabel: 'text-amber-600/50',
    unit: 'text-muted/50',
    num: 'text-muted/30',
    ring: 'group-hover:ring-amber-400',
    button: 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/30',
    circle: 'bg-amber-50 border-amber-200 text-amber-600',
    stepTitle: 'text-ink',
    stepDesc: 'text-muted',
    connector: 'bg-amber-200',
    arrow: 'text-amber-400',
  },
  warm: {
    tag: 'border-orange-200 text-orange-800 bg-orange-50',
    price: 'text-orange-800',
    check: 'text-orange-700',
    forBox: 'bg-orange-50/60',
    forLabel: 'text-orange-800/50',
    unit: 'text-muted/50',
    num: 'text-muted/30',
    ring: 'group-hover:ring-orange-300',
    button: 'bg-orange-800 text-white hover:bg-orange-900 shadow-orange-800/30',
    circle: 'bg-orange-50 border-orange-200 text-orange-800',
    stepTitle: 'text-ink',
    stepDesc: 'text-muted',
    connector: 'bg-orange-200',
    arrow: 'text-orange-400',
  },
}

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal()
  const [flipped, setFlipped] = useState([false, false, false])
  const toggle = (i: number) => setFlipped(prev => prev.map((v, idx) => idx === i ? !v : v))

  return (
    <section id="pricing" className="bg-surfaceAlt py-24 px-8 border-y border-border">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-6 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-accent font-light tracking-wider">02</span>
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">Investment</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
              Founding Client Pricing.
            </h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            We're taking on our first clients at below-market rates. Spots are limited
          </p>
        </div>

        {/* Urgency banner */}
        <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-lg px-6 py-4 mb-10">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
          <p className="text-accent text-xs font-semibold tracking-wide">
            Founding spots are limited. Once filled, pricing moves to standard agency rates. Your founding rate locks in for 12 months from sign-on.
          </p>
        </div>

        <div ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {plans.map(({ num, tag, service, forIf, price, originalPrice, discount, unit, features, accent, steps }, i) => {
            const s = styles[accent]
            return (
              <div
                key={service}
                className="relative cursor-pointer group"
                style={{ perspective: '1200px', height: '780px' }}
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
                    className={`absolute inset-0 flex flex-col p-8 rounded-lg border border-border bg-surface transition-all duration-300 group-hover:ring-2 ${s.ring} group-hover:shadow-xl group-hover:shadow-accent/10`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <span className={`text-xs font-light ${s.num}`}>{num}</span>
                      <span className={`text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${s.tag}`}>{tag}</span>
                    </div>

                    <h3 className="font-display font-semibold text-xl uppercase mb-3 leading-tight text-ink">
                      {service}
                    </h3>

                    <div className={`rounded-md px-4 py-3 mb-5 ${s.forBox}`}>
                      <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${s.forLabel}`}>This is for you if...</p>
                      <p className="text-sm leading-relaxed text-muted">{forIf}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-end gap-3 flex-wrap">
                        <p className={`font-display font-bold text-5xl pb-1 ${s.price}`}>{price}</p>
                        {originalPrice && (
                          <p className="font-display text-2xl line-through mb-1 text-muted/40">{originalPrice}</p>
                        )}
                        {discount && (
                          <span className="mb-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                            {discount}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs tracking-widest uppercase mt-3 ${s.unit}`}>{unit}</p>
                    </div>

                    <ul className="space-y-3">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <span className={`text-sm mt-0.5 flex-shrink-0 ${s.check}`}>✓</span>
                          <span className="text-sm leading-relaxed text-muted">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ── BACK ── */}
                  <div
                    className={`absolute inset-0 flex flex-col p-8 rounded-lg border border-border bg-surface transition-all duration-300 group-hover:ring-2 ${s.ring} group-hover:shadow-xl group-hover:shadow-accent/10`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <span className={`text-xs font-light ${s.num}`}>{num}</span>
                      <span className={`text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border ${s.tag}`}>How It Works</span>
                    </div>

                    <h3 className="font-display font-semibold text-xl uppercase mb-6 leading-tight text-ink">
                      {service}
                    </h3>

                    {/* Steps */}
                    <div className="flex flex-col gap-3 overflow-y-auto">
                      {steps.map((step, si) => (
                        <div key={si} className="flex flex-col items-center">
                          <div className="flex items-start gap-4 w-full">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${s.circle}`}>
                              {step.num}
                            </div>
                            <div className="flex-1 pb-1">
                              <p className={`text-sm font-bold uppercase tracking-wide mb-0.5 ${s.stepTitle}`}>
                                {step.title}
                              </p>
                              <p className={`text-sm leading-relaxed ${s.stepDesc}`}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                          {si < steps.length - 1 && (
                            <div className="self-start mt-1.5 mb-1.5 flex flex-col items-center" style={{ marginLeft: '15px' }}>
                              <div className={`w-px h-3 ${s.connector}`} />
                              <span className={`text-[10px] ${s.arrow}`}>↓</span>
                              <div className={`w-px h-3 ${s.connector}`} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )
          })}
        </div>

        {/* Single CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Not sure which service fits? Book a free 30-minute call — we'll tell you exactly what your account needs.
          </p>
          <a
            href="https://calendly.com/welcome-prettygoodstuff/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-12 py-5 rounded-full hover:bg-accentDark transition-all duration-200 shadow-lg shadow-accent/20"
          >
            Book a Free Strategy Call
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
          <p className="text-muted/40 text-xs">No commitment. No pitch. Just clarity.</p>
        </div>

      </div>
    </section>
  )
}
