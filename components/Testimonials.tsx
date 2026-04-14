'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const outcomes = [
  {
    service:  'Amazon Growth Management',
    result:   'ACOS: 35–45% → under 20%',
    headline: 'Stop bleeding ad spend on terms that never convert.',
    body:     'Most accounts we audit have 15–25% of their ad budget going to zero-converting search terms. We identify and cut them in month one — typically recovering enough wasted spend to cover our management fee before month two begins.',
    timeline: 'Typical improvement: 60 days',
    accent:   'orange',
  },
  {
    service:  'China FBA Prep & QC',
    result:   'Zero FBA rejections after switch',
    headline: 'Every batch arrives clean, labeled, and compliant.',
    body:     'Sellers switching from US prep to our China facility eliminate the labeling errors, poly bag non-compliance, and defect batches that generate A-to-Z claims and account health warnings. We inspect before anything leaves the factory.',
    timeline: 'Active from your first shipment',
    accent:   'amber',
  },
  {
    service:  'Full Amazon Launch Bundle',
    result:   'Live, advertising store in 90 days',
    headline: 'From zero account to fully optimized, advertising store.',
    body:     'Account setup, Brand Registry, trademark guidance, SEO-optimized listings, A+ Content, Brand Store, and PPC campaigns — all built and live within 90 days. You run your business. We handle Amazon.',
    timeline: '90-day fixed timeline',
    accent:   'warm',
  },
]

const styles: Record<string, { result: string; border: string; accent: string; timeline: string }> = {
  orange: {
    result:   'text-accent bg-accentLight border-accent/20',
    border:   'border-accent/15',
    accent:   'text-accent/30',
    timeline: 'text-accent/60',
  },
  amber: {
    result:   'text-amber-700 bg-amber-50 border-amber-200',
    border:   'border-amber-100',
    accent:   'text-amber-300',
    timeline: 'text-amber-600/60',
  },
  warm: {
    result:   'text-orange-800 bg-orange-50 border-orange-200',
    border:   'border-orange-100',
    accent:   'text-orange-300',
    timeline: 'text-orange-700/60',
  },
}

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="bg-surfaceAlt py-24 px-8 border-b border-border">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-16 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">What to Expect</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
              Real<br />Outcomes.
            </h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            Benchmarks from our work — what clients typically see and when.
          </p>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {outcomes.map(({ service, result, headline, body, timeline, accent }) => {
            const s = styles[accent]
            return (
              <div
                key={service}
                className={`bg-surface border ${s.border} rounded-lg p-8 flex flex-col gap-5`}
              >
                {/* Result pill */}
                <span className={`self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${s.result}`}>
                  {result}
                </span>

                {/* Service label */}
                <p className={`text-[10px] font-semibold tracking-widest uppercase ${s.timeline}`}>
                  {service}
                </p>

                {/* Headline */}
                <h3 className="font-display font-semibold text-lg text-ink uppercase leading-tight">
                  {headline}
                </h3>

                {/* Body */}
                <p className="text-muted text-sm leading-relaxed flex-grow">
                  {body}
                </p>

                {/* Timeline */}
                <div className="border-t border-border pt-4">
                  <p className={`text-xs font-semibold tracking-widest uppercase ${s.timeline}`}>
                    {timeline}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Honest note */}
        <p className="text-muted/40 text-xs text-center mt-8 tracking-wide">
          We're taking on founding clients now — these are the benchmarks we hold ourselves to.
        </p>

      </div>
    </section>
  )
}
