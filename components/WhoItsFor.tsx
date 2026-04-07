'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const bullets = [
  'Launching a new product on Amazon USA',
  'Sourcing from China for the first time',
  'Looking for a China prep center to cut shipping costs',
  'Needing hands-on Amazon account management',
  'Ready to private label your product line',
]

export default function WhoItsFor() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="who" className="bg-cream py-24 px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 border-b border-ink/8 pb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium mb-4">
            04 — Who This Is For
          </p>
          <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
            Built for<br />Brands That<br />Move Fast
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-start transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left: Text */}
          <div>
            <p className="text-ink/45 text-lg leading-relaxed font-light mb-12">
              Whether you&apos;re a first-time importer, an established brand scaling on Amazon,
              or a manufacturer ready to sell direct — we&apos;ve built the infrastructure to
              get you there.
            </p>
            <ul className="space-y-5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-5 group">
                  <span className="w-5 h-px bg-gold mt-2.5 flex-shrink-0 group-hover:w-8 transition-all duration-300" />
                  <span className="text-ink/50 text-sm leading-relaxed font-light hover:text-ink transition-colors duration-200">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Photo */}
          <div className="relative h-[480px] overflow-hidden bg-ink/5">
            <div className="absolute inset-0 flex items-end p-8">
              <p className="text-ink/15 text-[10px] font-mono uppercase tracking-widest">
                Photo 6 — Who It&apos;s For
              </p>
            </div>
            {/* Uncomment once photo is ready:
            <Image src="/images/who.jpg" alt="Entrepreneur" fill className="object-cover opacity-80" />
            */}
          </div>
        </div>
      </div>
    </section>
  )
}
