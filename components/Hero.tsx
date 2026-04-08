'use client'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setLoaded(true) }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-surfaceAlt">
      {/* Warm glow shapes */}
      <div className="absolute top-0 right-0 w-[700px] h-[600px] bg-gradient-to-bl from-accentLight via-surfaceAlt to-transparent opacity-90 pointer-events-none rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-to-tr from-surfaceAlt/60 to-transparent pointer-events-none" />

      <div className="relative z-10 px-8 max-w-7xl mx-auto w-full pt-44 pb-28">
        <div className={`transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-accent/20 text-accent px-4 py-2 rounded-full mb-10 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase">Now Accepting Founding Clients — Limited Spots</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-[11vw] md:text-[8vw] leading-[0.9] tracking-tightest uppercase mb-8">
            <span className="gradient-text">Launch on Amazon.</span><br />
            <span className="text-ink/15">Source from China.</span><br />
            <span className="gradient-text-accent">Grow Your Brand.</span>
          </h1>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t border-border pt-10 mt-4">
            <p className="text-muted text-base leading-relaxed max-w-md">
              Expert Amazon management for brands launching and scaling — with China sourcing,
              FBA prep, and a guided seller platform coming soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/waitlist"
                className="group flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:bg-accentDark transition-all duration-200 rounded-full">
                Claim Your Spot
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
              <a href="#services"
                className="flex items-center gap-3 border border-border bg-surface text-muted font-semibold text-xs tracking-widest uppercase px-8 py-4 hover:border-accent/30 hover:text-ink transition-all duration-200 rounded-full">
                See Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
