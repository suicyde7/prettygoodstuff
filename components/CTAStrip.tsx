'use client'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function CTAStrip() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="contact" className="relative bg-surfaceAlt py-32 px-8 overflow-hidden border-t border-border">
      {/* Soft warm glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-accentLight via-transparent to-transparent pointer-events-none opacity-60" />

      <div ref={ref}
        className={`relative z-10 max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] text-accent font-light tracking-wider">05</span>
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">Get Started</span>
            </div>
            <h2 className="font-display font-bold text-7xl md:text-9xl text-ink uppercase leading-none">
              Let's<br />
              <span className="gradient-text-accent">Talk.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end justify-end">
            <p className="text-muted text-sm leading-relaxed mb-10 max-w-sm md:text-right">
              Book a free 30-minute strategy call. No pitch, no commitment —
              just clarity on your fastest path to market.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://calendly.com/welcome-prettygoodstuff/30min"
                className="group flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-10 py-5 hover:bg-accentDark transition-all duration-200 rounded-full">
                Schedule Your Call
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
              {/* ── Replace with your real WhatsApp link ── */}
              <a href="https://wa.me/1234567890"
                className="flex items-center gap-3 border border-border text-muted font-semibold text-xs tracking-widest uppercase px-10 py-5 hover:border-accent/30 hover:text-ink transition-all duration-200 rounded-full">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
