'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const stats = [
  { value: '[X]+', label: 'Years Amazon Selling' },
  { value: '[X]+', label: 'ASINs Managed' },
  { value: '$[X]M+', label: 'Ad Spend Managed' },
]

export default function AboutStrip() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="bg-base py-20 px-8 border-b border-border">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-accent/40" />
            <span className="text-muted text-xs tracking-[0.4em] uppercase">Who We Are</span>
          </div>
          <h2 className="font-display font-bold text-5xl md:text-6xl text-ink uppercase leading-none">
            Built by<br />
            <span className="gradient-text-accent">Sellers.</span>
          </h2>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6">
          <p className="text-muted text-sm leading-relaxed">
            {/* PLACEHOLDER — replace with your real story */}
            Pretty Good Stuff was founded by [Your Name], an Amazon seller with [X] years of experience
            scaling a private label brand from zero to [X] figures. After managing [X] ASINs and [$X]
            in ad spend, we built the playbook most agencies charge to teach — and we execute it for
            every client.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            {/* PLACEHOLDER — replace with your real differentiator */}
            We operate across [Location] and China — which is why we can offer the end-to-end sourcing,
            prep, and Amazon management stack that most agencies can't. One team. One point of contact.
            No handoffs.
          </p>

          {/* Stat mini-bar */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border mt-2">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col pt-4">
                <span className="font-display font-bold text-3xl gradient-text-accent leading-none">{value}</span>
                <span className="text-muted text-[10px] tracking-widest uppercase mt-1.5 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
