'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const INTERVAL_MS = 3000

const SLIDES = [
  {
    badge: {
      dot: true,
      text: 'Now Accepting Founding Clients - Limited Spots',
      className: 'bg-surface border border-accent/20 text-accent',
    },
    headline: [
      { text: 'Launch on Amazon.', className: 'gradient-text' },
      { text: 'Source from China.', className: 'text-ink/15' },
      { text: 'Grow Your Brand.',   className: 'gradient-text-accent' },
    ],
    description: 'Expert Amazon management for brands launching and scaling — with China sourcing, FBA prep, and a guided seller platform coming soon.',
    ctas: [
      { label: 'Book a Free Strategy Call', href: '#contact',  primary: true },
      { label: 'See Services',              href: '#services', primary: false },
    ],
  },
  {
    badge: {
      dot: false,
      text: 'Free Tool · Amazon Opportunity Score',
      className: 'bg-surface border border-orange-200 text-orange-800',
    },
    headline: [
      { text: 'Is Your Product', className: 'gradient-text' },
      { text: 'Ready to',        className: 'text-ink/15' },
      { text: 'Launch?',         className: 'gradient-text-accent' },
    ],
    description: "Not a revenue predictor. A reality check. Answer 6 questions and find out how strong your market opportunity is — and exactly what's standing between you and a live store.",
    ctas: [
      { label: 'Check My Score', href: '/tools/amazon-opportunity', primary: true },
    ],
  },
  {
    badge: {
      dot: false,
      text: 'Free Tool · Listing Quality Grader',
      className: 'bg-surface border border-orange-200 text-orange-800',
    },
    headline: [
      { text: 'Is Your Listing', className: 'gradient-text' },
      { text: 'Leaking',         className: 'text-ink/15' },
      { text: 'Conversions?',    className: 'gradient-text-accent' },
    ],
    description: 'Paste your title and bullet points. Get a full audit with a letter grade, score breakdown, and a prioritized fix list — in 60 seconds.',
    ctas: [
      { label: 'Grade My Listing', href: '/tools/listing-grader', primary: true },
    ],
  },
  {
    badge: {
      dot: false,
      text: 'Free Tool · China FBA Prep',
      className: 'bg-surface border border-orange-200 text-orange-800',
    },
    headline: [
      { text: 'How Much Are You', className: 'gradient-text' },
      { text: 'Overpaying',       className: 'text-ink/15' },
      { text: 'for Prep?',        className: 'gradient-text-accent' },
    ],
    description: "Most FBA sellers using a US prep center are overpaying by $0.50–$1.50 per unit. Enter your numbers and find out what that's costing you annually.",
    ctas: [
      { label: 'Calculate My Savings', href: '/tools/china-fba-savings', primary: true },
    ],
  },
]

export default function Hero() {
  const [loaded, setLoaded]   = useState(false)
  const [active, setActive]   = useState(0)
  const [progress, setProgress] = useState(0)
  const startRef              = useRef<number>(Date.now())
  const rafRef                = useRef<number | null>(null)

  // Advance to a specific slide and reset the timer
  const goTo = useCallback((idx: number) => {
    setActive(idx)
    setProgress(0)
    startRef.current = Date.now()
  }, [])

  // Single rAF loop — drives both progress bar and slide advance
  useEffect(() => {
    startRef.current = Date.now()

    function tick() {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / INTERVAL_MS) * 100, 100)
      setProgress(pct)

      if (elapsed >= INTERVAL_MS) {
        startRef.current = Date.now()
        setActive(prev => (prev + 1) % SLIDES.length)
        setProgress(0)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // When goTo resets startRef, the rAF loop picks it up automatically — no restart needed

  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-surfaceAlt">
      {/* Warm glow shapes */}
      <div className="absolute top-0 right-0 w-[700px] h-[600px] bg-gradient-to-bl from-accentLight via-surfaceAlt to-transparent opacity-90 pointer-events-none rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-to-tr from-surfaceAlt/60 to-transparent pointer-events-none" />

      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${
            i === active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className={`relative z-10 px-8 max-w-7xl mx-auto w-full pt-16 md:pt-44 pb-24 md:pb-36 transition-all duration-700 delay-100 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 shadow-sm ${slide.badge.className}`}>
              {slide.badge.dot && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              <span className="text-xs font-semibold tracking-widest uppercase">{slide.badge.text}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-[11vw] md:text-[8vw] leading-[0.9] tracking-tightest uppercase mb-8">
              {slide.headline.map((line, li) => (
                <span key={li} className={line.className}>
                  {line.text}{li < slide.headline.length - 1 && <br />}
                </span>
              ))}
            </h1>

            {/* Bottom row */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t border-border pt-10 mt-4">
              <p className="text-muted text-base leading-relaxed max-w-md">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {slide.ctas.map((cta, ci) =>
                  cta.primary ? (
                    <Link
                      key={ci}
                      href={cta.href}
                      className="group flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:bg-accentDark transition-all duration-200 rounded-full shadow-lg shadow-accent/20"
                    >
                      {cta.label}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  ) : (
                    <Link
                      key={ci}
                      href={cta.href}
                      className="flex items-center gap-3 border border-border bg-surface text-muted font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:border-accent/30 hover:text-ink transition-all duration-200 rounded-full"
                    >
                      {cta.label}
                    </Link>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      ))}

      {/* ── Centered nav + progress bar ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-64">

        {/* Progress bar */}
        <div className="w-full h-[3px] bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full"
            style={{ width: `${progress}%`, transition: 'none' }}
          />
        </div>

        {/* Dots + counter */}
        <div className="flex items-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === active
                  ? 'w-6 h-1.5 bg-accent'
                  : 'w-1.5 h-1.5 bg-border hover:bg-muted/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <span className="ml-1 text-[10px] text-muted/40 tracking-widest tabular-nums">
            {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>

      </div>

    </section>
  )
}
