'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import CountUp from './CountUp'

// ── UPDATE THESE before going live ──────────────────────────────────────────
// Replace the stat values and body copy with your real numbers and story.
const stats = [
  { target: 5,  prefix: '',  suffix: '+',  decimals: 0, label: 'Years Amazon Selling' },  // ← update
  { target: 30, prefix: '',  suffix: '+',  decimals: 0, label: 'ASINs Managed' },          // ← update
  { target: 1,  prefix: '$', suffix: 'M+', decimals: 0, label: 'Ad Spend Managed' },       // ← update
]
// ─────────────────────────────────────────────────────────────────────────────

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

        {/* Right — UPDATE body copy with your real founder story */}
        <div className="flex flex-col gap-6">
          <p className="text-muted text-sm leading-relaxed">
            Pretty Good Stuff was built from the inside out. Our team comes from Amazon selling,
            not agency backgrounds — we've managed private label brands end-to-end, from sourcing
            in China to ranking on page one. The playbook we run for clients is the one we built
            for ourselves.
          </p>
          <p className="text-muted text-sm leading-relaxed">
            We operate across the US and China — giving us coverage that most Amazon agencies
            simply can't match. One team handles your listings, your PPC, your FBA prep, and
            your supplier relationships. No handoffs, no coordination overhead, no gaps.
          </p>

          {/* Stat mini-bar */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border mt-2">
            {stats.map(({ target, prefix, suffix, decimals, label }) => (
              <div key={label} className="flex flex-col pt-4">
                <CountUp
                  target={target}
                  prefix={prefix}
                  suffix={suffix}
                  decimals={decimals}
                  duration={1600}
                  className="font-display font-bold text-3xl gradient-text-accent leading-none"
                />
                <span className="text-muted text-[10px] tracking-widest uppercase mt-1.5 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
