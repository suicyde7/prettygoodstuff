'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const steps = [
  { num: '01', title: 'Strategy Call', description: '30 minutes. We map your goals, products, budget, and timeline — no commitment required.' },
  { num: '02', title: 'Custom Proposal', description: 'A scoped plan with clear deliverables, pricing, and milestones built for your situation.' },
  { num: '03', title: 'We Execute', description: 'You sell. Clear milestones, regular reporting, and direct access throughout.' },
]

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="process" className="bg-base py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-16 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-accent/50 font-light tracking-wider">02</span>
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">Process</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
              How It<br />Works
            </h2>
          </div>
        </div>

        <div ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {steps.map(({ num, title, description }) => (
            <div key={num} className="bg-surface border border-border rounded-lg p-10">
              <span className="font-display font-light text-7xl text-ink/6 block mb-6 leading-none select-none">{num}</span>
              <div className="w-8 h-0.5 bg-accent mb-6 rounded" />
              <h3 className="font-display font-semibold text-2xl text-ink uppercase mb-4">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
