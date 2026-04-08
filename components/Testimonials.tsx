'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const testimonials = [
  {
    quote:
      'Working with PGS completely transformed our Amazon presence. Our ACOS dropped from 45% to 18% within 60 days — and our organic rank climbed across every main keyword. The level of attention we got as a founding client was exceptional.',
    name: '[Client Name]',
    category: '[Product Category]',
    result: 'ACOS: 45% → 18%',
    accent: 'orange',
  },
  {
    quote:
      'The China FBA prep service eliminated the quality issues we\'d been battling for two years. Every batch arrives at Amazon\'s warehouse clean, labeled, and compliant. We haven\'t had a single FBA rejection since switching.',
    name: '[Client Name]',
    category: '[Product Category]',
    result: 'Zero FBA rejections',
    accent: 'amber',
  },
  {
    quote:
      'From zero to a fully live, advertising Amazon store in under 90 days. PGS handled everything — account setup, Brand Registry, A+ Content, PPC launch. We didn\'t have to learn Amazon. We just had to run our business.',
    name: '[Client Name]',
    category: '[Product Category]',
    result: 'Live store in 90 days',
    accent: 'warm',
  },
]

const styles: Record<string, { result: string; border: string; quote: string }> = {
  orange: {
    result: 'text-accent bg-accentLight border-accent/20',
    border: 'border-accent/15',
    quote: 'text-accent/30',
  },
  amber: {
    result: 'text-amber-700 bg-amber-50 border-amber-200',
    border: 'border-amber-100',
    quote: 'text-amber-300',
  },
  warm: {
    result: 'text-orange-800 bg-orange-50 border-orange-200',
    border: 'border-orange-100',
    quote: 'text-orange-300',
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
              <span className="text-muted text-xs tracking-[0.4em] uppercase">Results</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
              Client<br />Stories.
            </h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            {/* PLACEHOLDER — update when you have real clients */}
            Real results from founding clients. Names shared with permission.
          </p>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {testimonials.map(({ quote, name, category, result, accent }) => {
            const s = styles[accent]
            return (
              <div
                key={name}
                className={`bg-surface border ${s.border} rounded-lg p-8 flex flex-col gap-6`}
              >
                {/* Result pill */}
                <span className={`self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${s.result}`}>
                  {result}
                </span>

                {/* Quote mark */}
                <span className={`font-display font-bold text-6xl leading-none -mb-4 ${s.quote}`}>"</span>

                {/* Quote */}
                <p className="text-muted text-sm leading-relaxed flex-grow">
                  {quote}
                </p>

                {/* Attribution */}
                <div className="border-t border-border pt-5">
                  <p className="text-ink text-sm font-semibold">{name}</p>
                  <p className="text-muted text-xs mt-0.5">{category}</p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-muted/30 text-xs text-center mt-8 tracking-wide">
          {/* PLACEHOLDER — remove this line when testimonials are real */}
          Placeholder testimonials — replace with real client quotes before launch.
        </p>

      </div>
    </section>
  )
}
