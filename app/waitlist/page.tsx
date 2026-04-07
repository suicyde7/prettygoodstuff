'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 'compass',
    name: 'PGS Compass',
    icon: '◈',
    tagline: 'Step-by-step guided Amazon seller platform',
    color: 'amber',
  },
  {
    id: 'origin',
    name: 'PGS Origin',
    icon: '⬡',
    tagline: 'Managed China procurement for FBA sellers',
    color: 'warm',
  },
]

const styles: Record<string, { border: string; bg: string; text: string; check: string }> = {
  amber: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    check: 'bg-amber-500',
  },
  warm: {
    border: 'border-orange-300',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    check: 'bg-orange-700',
  },
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function WaitlistPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    email: '',
    name: '',
    phone: '',
    company: '',
    storeUrl: '',
  })

  function toggleProduct(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || selected.length === 0) return
    setFormState('submitting')

    try {
      // ── Replace YOUR_FORM_ID with your Formspree endpoint ID ──
      // Get a free endpoint at https://formspree.io
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name || '—',
          phone: form.phone || '—',
          company: form.company || '—',
          amazon_store_url: form.storeUrl || '—',
          interested_in: selected.join(', '),
        }),
      })
      if (res.ok) {
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  return (
    <div className="min-h-screen bg-surfaceAlt flex flex-col">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-border">
        <Link href="/">
          <Image src="/logo.png" alt="Pretty Good Stuff" width={800} height={150} className="h-[32px] w-auto object-contain" />
        </Link>
        <Link href="/"
          className="flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 text-xs font-semibold tracking-widest uppercase">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      <main className="flex-grow flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-xl">

          {formState === 'success' ? (
            /* ── Success state ── */
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accentLight border border-accent/20 mb-8">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-display font-bold text-5xl text-ink uppercase leading-none mb-4">You're In.</h1>
              <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-10">
                We'll reach out with early access details before the public launch.
                Founding members get locked-in rates and priority onboarding.
              </p>
              <Link href="/"
                className="inline-flex items-center gap-2 bg-accent text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-full hover:bg-accentDark transition-colors duration-200">
                Back to Homepage →
              </Link>
            </div>
          ) : (
            <>
              {/* ── Header ── */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-surface border border-accent/20 text-accent px-4 py-2 rounded-full mb-8 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-widest uppercase">Early Access · Limited Spots</span>
                </div>
                <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
                  Be<br /><span className="gradient-text-accent">First.</span>
                </h1>
                <p className="text-muted text-sm leading-relaxed max-w-sm">
                  Join the waitlist for PGS Compass and PGS Origin. Founding members get early access,
                  direct onboarding support, and locked-in rates before public launch.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Product selector */}
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-ink mb-3">
                    I'm interested in <span className="text-accent">*</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map(({ id, name, icon, tagline, color }) => {
                      const s = styles[color]
                      const isSelected = selected.includes(id)
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleProduct(id)}
                          className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? `${s.border} ${s.bg}`
                              : 'border-border bg-surface hover:border-accent/30'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ? `${s.check} border-transparent` : 'border-muted/30'
                            }`}>
                              {isSelected && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className={`text-xs font-bold tracking-widest uppercase ${isSelected ? s.text : 'text-ink'}`}>
                              {icon} {name}
                            </p>
                            <p className="text-muted text-xs leading-snug mt-0.5">{tagline}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Email — required */}
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-ink mb-2">
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors duration-200"
                  />
                </div>

                {/* Optional fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company or brand"
                    className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-2">
                    Amazon Store URL
                  </label>
                  <input
                    type="url"
                    name="storeUrl"
                    value={form.storeUrl}
                    onChange={handleChange}
                    placeholder="https://amazon.com/stores/yourbrand"
                    className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors duration-200"
                  />
                </div>

                {formState === 'error' && (
                  <p className="text-red-500 text-xs">Something went wrong. Please try again or email us directly.</p>
                )}

                <button
                  type="submit"
                  disabled={!form.email || selected.length === 0 || formState === 'submitting'}
                  className="group flex items-center justify-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-5 rounded-full hover:bg-accentDark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-accent/20 mt-2"
                >
                  {formState === 'submitting' ? 'Submitting...' : 'Join the Waitlist'}
                  {formState !== 'submitting' && (
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  )}
                </button>

                <p className="text-muted/40 text-xs text-center">
                  No spam. We'll only reach out about early access and launch updates.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
