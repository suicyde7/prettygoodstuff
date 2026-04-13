'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const INTERVAL_MS = 5000

const TOOLS = [
  {
    num: '01',
    label: 'Listing Quality Grader',
    headline: 'Is Your Listing\nLeaking Conversions?',
    prompt: 'Paste your title and bullet points. Get a full audit with a letter grade and a prioritized fix list — in 60 seconds.',
    href: '/tools/listing-grader',
    cta: 'Grade My Listing',
  },
  {
    num: '02',
    label: 'Amazon Opportunity Score',
    headline: 'Is Your Product\nReady to Launch?',
    prompt: 'Answer 6 questions about your product. Get a market opportunity score and an honest readiness check before you invest.',
    href: '/tools/amazon-opportunity',
    cta: 'Check My Score',
  },
  {
    num: '03',
    label: 'China FBA Savings',
    headline: 'How Much Are You\nOverpaying for Prep?',
    prompt: 'Enter your current prep cost and shipment volume. See exactly what switching to China prep saves you per year.',
    href: '/tools/china-fba-savings',
    cta: 'Calculate Savings',
  },
]

export default function Hero() {
  const [loaded, setLoaded]     = useState(false)
  const [active, setActive]     = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused]     = useState(false)
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef             = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((idx: number) => {
    setActive(idx)
    setProgress(0)
  }, [])

  const next = useCallback(() => {
    setActive(prev => (prev + 1) % TOOLS.length)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(next, INTERVAL_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, next])

  useEffect(() => {
    if (paused) { setProgress(0); return }
    const tick = 50
    progressRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + (tick / INTERVAL_MS) * 100, 100))
    }, tick)
    return () => { if (progressRef.current) clearInterval(progressRef.current) }
  }, [paused, active])

  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-surfaceAlt">
      {/* Warm glow shapes */}
      <div className="absolute top-0 right-0 w-[700px] h-[600px] bg-gradient-to-bl from-accentLight via-surfaceAlt to-transparent opacity-90 pointer-events-none rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-to-tr from-surfaceAlt/60 to-transparent pointer-events-none" />

      <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pt-16 md:pt-44 pb-16 md:pb-28">
        <div className={`transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-accent/20 text-accent px-4 py-2 rounded-full mb-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase">Now Accepting Founding Clients - Limited Spots</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-[11vw] md:text-[8vw] leading-[0.9] tracking-tightest uppercase mb-8">
            <span className="gradient-text">Launch on Amazon.</span><br />
            <span className="text-ink/15">Source from China.</span><br />
            <span className="gradient-text-accent">Grow Your Brand.</span>
          </h1>

          {/* Bottom row — description + CTAs left, carousel right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-border pt-10 mt-4">

            {/* Left: description + main CTAs */}
            <div className="flex flex-col justify-between gap-8">
              <p className="text-muted text-base leading-relaxed">
                Expert Amazon management for brands launching and scaling — with China sourcing,
                FBA prep, and a guided seller platform coming soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#contact"
                  className="group flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:bg-accentDark transition-all duration-200 rounded-full">
                  Book a Free Strategy Call
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </a>
                <a href="#services"
                  className="flex items-center gap-3 border border-border bg-surface text-muted font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:border-accent/30 hover:text-ink transition-all duration-200 rounded-full">
                  See Services
                </a>
              </div>
            </div>

            {/* Right: tools carousel */}
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] text-muted/40 font-light tracking-widest">Free Tools</span>
                <span className="w-4 h-px bg-border" />
                <span className="text-[10px] text-muted/40 tracking-widest">{active + 1} / {TOOLS.length}</span>
              </div>

              {/* Track */}
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {TOOLS.map((tool, i) => (
                    <div
                      key={i}
                      className="w-full flex-shrink-0 bg-surface border border-border rounded-lg px-6 py-6 flex flex-col gap-4"
                    >
                      {/* Tool label */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted/40 font-light tracking-widest">{tool.num}</span>
                        <span className="w-3 h-px bg-border" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-accent/70 bg-accentLight border border-accent/15 px-2.5 py-0.5 rounded-full">
                          {tool.label}
                        </span>
                      </div>

                      {/* Headline */}
                      <h2 className="font-display font-bold text-xl md:text-2xl text-ink uppercase leading-tight whitespace-pre-line">
                        {tool.headline}
                      </h2>

                      {/* Prompt */}
                      <p className="text-muted text-xs leading-relaxed">
                        {tool.prompt}
                      </p>

                      {/* CTA */}
                      <Link
                        href={tool.href}
                        className="group self-start inline-flex items-center gap-2 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded-full hover:bg-accentDark transition-all duration-200 shadow-md shadow-accent/20"
                      >
                        {tool.cta}
                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border rounded-b-lg overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${progress}%`, transition: 'none' }}
                  />
                </div>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-2.5 mt-3">
                {TOOLS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === active
                        ? 'w-5 h-1.5 bg-accent'
                        : 'w-1.5 h-1.5 bg-border hover:bg-muted/30'
                    }`}
                    aria-label={`Go to ${TOOLS[i].label}`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
