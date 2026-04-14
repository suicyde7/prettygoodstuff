'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const products = [
  {
    accent: 'amber',
    icon: '◈',
    badge: 'Coming Soon',
    name: 'PGS Compass',
    tagline: 'The guided playbook for Amazon sellers.',
    description: 'An interactive, step-by-step platform that walks you through launching and growing on Amazon — from your first listing to a profitable PPC account. Not a course. Not a dashboard. Turn-by-turn directions based on exactly where you are right now.',
    features: [
      'Interactive guided workflows — Pre-launch to live in 12 steps',
      'Fix Your PPC — guided waste elimination, no expertise required',
      'Claude-powered Q&A at every step, specific to your account',
      'Progress tracking — always know what to do next',
      'Self-serve at $29/month — or add a strategy call for accountability',
    ],
    cta: 'Join the Waitlist',
  },
  {
    accent: 'warm',
    icon: '⬡',
    badge: 'Coming Soon',
    name: 'PGS Origin',
    tagline: 'Managed China procurement for FBA sellers.',
    description: 'Submit your Bill of Materials. We source from vetted vendors, inspect every batch, clear customs, and deliver FBA-ready inventory to Amazon\'s warehouse — fully handled, end to end. No freight forwarder to manage. No customs surprises. No guesswork.',
    features: [
      'BOM-based sourcing — we find the right vendor for each item',
      'Quality control inspection on every batch before it ships',
      'HTS classification + full landed cost transparency',
      'Customs cleared, FBA-compliant, delivered to Amazon',
      'Membership model — $99–$299/month, no per-project retainers',
    ],
    cta: 'Join the Waitlist',
  },
]

const styles: Record<string, {
  badge: string; dot: string; icon: string; name: string;
  feature: string; divider: string; button: string; ring: string;
}> = {
  amber: {
    badge: 'bg-amber-50 text-amber-600 border-amber-200',
    dot: 'bg-amber-500',
    icon: 'text-amber-600 bg-amber-50 border-amber-200',
    name: 'text-amber-600',
    feature: 'text-amber-600',
    divider: 'bg-amber-200',
    button: 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20',
    ring: 'hover:ring-amber-300',
  },
  warm: {
    badge: 'bg-orange-50 text-orange-800 border-orange-200',
    dot: 'bg-orange-700',
    icon: 'text-orange-800 bg-orange-50 border-orange-200',
    name: 'text-orange-800',
    feature: 'text-orange-800',
    divider: 'bg-orange-200',
    button: 'bg-orange-800 text-white hover:bg-orange-900 shadow-orange-800/20',
    ring: 'hover:ring-orange-300',
  },
}

export default function Platform() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="platform" className="bg-surfaceAlt py-24 px-8 border-y border-border">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-border pb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-accent font-light tracking-wider">03</span>
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">What's Coming</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
              Good to Great.
            </h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            Two products in development. Built on the same systems we run for our managed clients — now available as self-serve software.
          </p>
        </div>

        <div ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {products.map(({ accent, icon, badge, name, tagline, description, features, cta }) => {
            const s = styles[accent]
            return (
              <div key={name}
                className={`bg-surface border border-border rounded-lg p-8 flex flex-col gap-6 ring-2 ring-transparent transition-all duration-300 ${s.ring} hover:shadow-xl`}>

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className={`inline-flex items-center gap-2 border text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full ${s.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
                    {badge}
                  </div>
                  <div className={`text-xl p-2.5 border rounded-md ${s.icon}`}>{icon}</div>
                </div>

                {/* Product name */}
                <div>
                  <h3 className={`font-display font-bold text-3xl uppercase leading-none mb-2 ${s.name}`}>{name}</h3>
                  <p className="text-ink font-semibold text-sm italic">"{tagline}"</p>
                </div>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed">{description}</p>

                {/* Divider */}
                <div className={`h-px w-full ${s.divider} opacity-40`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-grow">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className={`text-xs mt-0.5 flex-shrink-0 ${s.feature}`}>→</span>
                      <span className="text-sm text-muted leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a href="/waitlist"
                  className={`text-center text-xs font-semibold tracking-widest uppercase py-4 rounded-full shadow-lg transition-all duration-200 ${s.button}`}>
                  {cta}
                </a>
              </div>
            )
          })}
        </div>

        <p className="text-muted/40 text-xs text-center mt-10 tracking-wide">
          Founding members get early access and locked-in rates · Join the waitlist to be first in line
        </p>

      </div>
    </section>
  )
}
