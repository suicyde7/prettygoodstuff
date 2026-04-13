'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sendLead } from '@/lib/sendLead'

type Complexity    = 'simple' | 'standard' | 'full'
type PrepSituation = 'us_3pl' | 'self_prep' | 'no_prep' | 'already_china'

const COMPLEXITY: Record<Complexity, { cost: number; label: string; desc: string }> = {
  simple:   { cost: 0.45, label: 'Standard',    desc: 'FNSKU label only' },
  standard: { cost: 0.60, label: 'Premium',      desc: 'Poly bag + FNSKU label' },
  full:     { cost: 0.78, label: 'Full Service', desc: 'QC inspection + poly bag + label + carton prep' },
}

const PREP_OPTIONS: { value: PrepSituation; label: string; sub: string }[] = [
  { value: 'us_3pl',        label: 'US 3PL / prep center',            sub: 'Paying a third-party warehouse in the US to prep' },
  { value: 'self_prep',     label: 'Self-prepping in the US',          sub: 'Doing it in-house before sending to FBA' },
  { value: 'no_prep',       label: "I don't have a prep solution yet", sub: 'Still figuring out the logistics' },
  { value: 'already_china', label: 'Already using a China service',    sub: 'Looking to compare or switch' },
]

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
function fmtUnit(n: number) { return `$${n.toFixed(2)}` }

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ChinaFBASavingsPage() {
  const [currentCost, setCurrentCost]     = useState('')
  const [units, setUnits]                 = useState('')
  const [shipments, setShipments]         = useState('')
  const [complexity, setComplexity]       = useState<Complexity>('standard')
  const [prepSituation, setPrepSituation] = useState<PrepSituation | ''>('')
  const resultsRef = useRef<HTMLDivElement>(null)

  const [results, setResults] = useState<null | {
    savingsPerUnit: number; savingsPerShipment: number
    annualSavings: number; threeYearSavings: number
    currentAnnual: number; chinaAnnual: number
    chinaCost: number; noSavings: boolean
  }>(null)
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')

  function calculate() {
    const c = parseFloat(currentCost)
    const u = parseInt(units)
    const s = parseInt(shipments)
    const chinaCost = COMPLEXITY[complexity].cost
    if (!c || !u || !s || c <= 0 || u <= 0 || s <= 0) return
    const savingsPerUnit     = c - chinaCost
    const savingsPerShipment = savingsPerUnit * u
    const annualSavings      = savingsPerShipment * s
    const r = {
      savingsPerUnit, savingsPerShipment, annualSavings,
      threeYearSavings: annualSavings * 3,
      currentAnnual: c * u * s,
      chinaAnnual: chinaCost * u * s,
      chinaCost, noSavings: savingsPerUnit <= 0,
    }
    setResults(r)
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    sendLead({
      tool:               'China FBA Savings',
      name:               name.trim(),
      email:              email.trim(),
      prepSituation:      prepSituation || '',
      currentCostPerUnit: c,
      unitsPerShipment:   u,
      shipmentsPerYear:   s,
      complexityTier:     COMPLEXITY[complexity].label,
      annualSavings:      Math.round(r.annualSavings),
      unitsPerYear:       u * s,
      noSavings:          r.noSavings,
    })
  }

  const isValid = currentCost && units && shipments &&
    parseFloat(currentCost) > 0 && parseInt(units) > 0 && parseInt(shipments) > 0 &&
    /\S+@\S+\.\S+/.test(email)

  return (
    <div className="min-h-screen bg-surfaceAlt flex flex-col">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-border bg-surface">
        <Link href="/">
          <Image src="/logo.png" alt="Pretty Good Stuff" width={800} height={150} className="h-[32px] w-auto object-contain" />
        </Link>
        <Link href="/#services" className="flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 text-xs font-semibold tracking-widest uppercase">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </Link>
      </div>

      <main className="flex-grow px-8 py-16">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-surface border border-orange-200 text-orange-800 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase">Free Tool · China FBA Prep</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              How Much<br /><span className="gradient-text-accent">Could You Save?</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Most FBA sellers using a US prep center are overpaying by $0.50–$1.50 per unit.
              Enter your numbers and find out what that's costing you annually.
            </p>
          </div>

          {/* View Full Pricing CTA */}
          <a
            href="/pricing/china-fba-prep"
            className="flex items-center justify-between gap-4 bg-surface border-2 border-accent/30 hover:border-accent hover:bg-accentLight rounded-lg px-6 py-5 mb-8 transition-all duration-200 group"
          >
            <div>
              <p className="font-display font-semibold text-base text-ink uppercase tracking-wide">View Full Pricing Card</p>
              <p className="text-muted text-xs mt-0.5">All tiers, volume breaks, and service inclusions — before you calculate</p>
            </div>
            <span className="text-accent font-bold text-sm tracking-widest group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0">→</span>
          </a>

          {/* Calculator */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-8">
            <p className="font-display font-semibold text-xl text-ink uppercase mb-6">Calculate Your Estimated Savings</p>
            <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-7">

              {/* Current prep cost */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Current prep cost per unit</label>
                <p className="text-muted text-xs mb-3">What your US 3PL or prep center charges per unit</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">$</span>
                  <input type="number" min="0" step="0.01" placeholder="2.00"
                    value={currentCost} onChange={e => { setCurrentCost(e.target.value); setResults(null) }}
                    className="w-full bg-surfaceAlt border border-border rounded-lg pl-8 pr-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
              </div>

              {/* Units + shipments */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Units per shipment</label>
                  <p className="text-muted text-xs mb-3">Typical FBA batch size</p>
                  <input type="number" min="1" step="1" placeholder="500"
                    value={units} onChange={e => { setUnits(e.target.value); setResults(null) }}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Shipments per year</label>
                  <p className="text-muted text-xs mb-3">How often you restock</p>
                  <input type="number" min="1" step="1" placeholder="4"
                    value={shipments} onChange={e => { setShipments(e.target.value); setResults(null) }}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Prep complexity</label>
                <p className="text-muted text-xs mb-3">Rates shown at 500–1,999 units/shipment (mid-volume tier)</p>
                <div className="flex flex-col gap-2">
                  {(Object.entries(COMPLEXITY) as [Complexity, typeof COMPLEXITY[Complexity]][]).map(([key, { label, desc }]) => (
                    <button key={key} type="button" onClick={() => { setComplexity(key); setResults(null) }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all duration-200 ${complexity === key ? 'border-accent bg-accentLight' : 'border-border bg-surfaceAlt hover:border-accent/30'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${complexity === key ? 'border-accent bg-accent' : 'border-muted/30'}`}>
                        {complexity === key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold tracking-widest uppercase ${complexity === key ? 'text-accent' : 'text-ink'}`}>{label}</p>
                        <p className="text-muted text-xs mt-0.5">{desc}</p>
                      </div>
                      <span className={`ml-auto text-xs font-semibold ${complexity === key ? 'text-accent' : 'text-muted/50'}`}>~${COMPLEXITY[key].cost.toFixed(2)}/unit</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Qualifying question — prep situation */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Where are you currently prepping?</label>
                <p className="text-muted text-xs mb-3">Helps us give you the most relevant comparison</p>
                <div className="flex flex-col gap-2">
                  {PREP_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => { setPrepSituation(opt.value); setResults(null) }}
                      className={`flex items-center gap-4 p-3.5 rounded-lg border-2 text-left transition-all duration-150 ${prepSituation === opt.value ? 'border-accent bg-accentLight' : 'border-border bg-surfaceAlt hover:border-accent/30'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${prepSituation === opt.value ? 'border-accent bg-accent' : 'border-muted/30'}`}>
                        {prepSituation === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold tracking-widest uppercase ${prepSituation === opt.value ? 'text-accent' : 'text-ink'}`}>{opt.label}</p>
                        <p className="text-muted text-xs mt-0.5">{opt.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email */}
              <div className="border-t border-border pt-6 flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Your name <span className="text-muted/40 font-normal normal-case tracking-normal">(optional)</span></label>
                  <input type="text" placeholder="First name"
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Email <span className="text-accent text-[10px]">required</span></label>
                  <input type="email" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                  <p className="text-muted/40 text-xs mt-1.5">No spam. One follow-up with personalised recommendations.</p>
                </div>
              </div>

              {/* Calculate */}
              <button onClick={calculate} disabled={!isValid}
                className="group flex items-center justify-center gap-3 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-accent/30 ring-2 ring-accent/20">
                Calculate My Savings
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>

            </div>
          </div>

          {/* Results */}
          {results && (
            <div ref={resultsRef} className="flex flex-col gap-4 animate-in fade-in duration-500">

              {results.noSavings ? (
                <div className="bg-surface border border-border rounded-lg p-8 text-center">
                  <p className="font-display font-bold text-3xl text-ink uppercase mb-3">You're Already Efficient</p>
                  <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto">
                    Your current prep cost ({fmtUnit(parseFloat(currentCost))}) is at or below what China prep typically costs for {COMPLEXITY[complexity].label.toLowerCase()} service.
                    {complexity === 'full'
                      ? " That said, our Full Service includes pre-shipment QC inspection — which most US centers don't offer at any price."
                      : " If defect risk is a concern, our Full Service adds pre-shipment QC inspection for a small premium."}
                  </p>
                  <a href="https://calendly.com/welcome-prettygoodstuff/30min" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-colors shadow-xl shadow-accent/30 ring-2 ring-accent/20">
                    Talk to Us About QC →
                  </a>
                </div>
              ) : (
                <>
                  <div className="bg-surface border border-border rounded-lg p-8 text-center">
                    <p className="text-muted text-xs tracking-widest uppercase mb-3">Estimated Annual Savings</p>
                    <p className="font-display font-bold text-7xl md:text-8xl gradient-text-accent leading-none mb-2">{fmt(results.annualSavings)}</p>
                    <p className="text-muted text-sm">{fmt(results.threeYearSavings)} over 3 years</p>
                  </div>

                  <div className="bg-surface border border-border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 bg-surfaceAlt border-b border-border">
                      <div className="px-6 py-3" />
                      <div className="px-6 py-3 text-center border-l border-border">
                        <p className="text-xs font-bold tracking-widest uppercase text-muted">Current</p>
                      </div>
                      <div className="px-6 py-3 text-center border-l border-border bg-accentLight">
                        <p className="text-xs font-bold tracking-widest uppercase text-accent">PGS China</p>
                      </div>
                    </div>
                    {[
                      { label: 'Per unit', current: fmtUnit(parseFloat(currentCost)), china: fmtUnit(results.chinaCost) },
                      { label: `Per shipment (${parseInt(units).toLocaleString()} units)`, current: fmt(parseFloat(currentCost) * parseInt(units)), china: fmt(results.chinaCost * parseInt(units)) },
                      { label: `Per year (${parseInt(shipments)} shipments)`, current: fmt(results.currentAnnual), china: fmt(results.chinaAnnual) },
                    ].map(({ label, current, china }, i) => (
                      <div key={i} className={`grid grid-cols-3 ${i < 2 ? 'border-b border-border' : ''}`}>
                        <div className="px-6 py-4"><p className="text-xs text-muted leading-snug">{label}</p></div>
                        <div className="px-6 py-4 text-center border-l border-border"><p className="text-sm font-semibold text-ink">{current}</p></div>
                        <div className="px-6 py-4 text-center border-l border-border bg-accentLight/40"><p className="text-sm font-semibold text-accent">{china}</p></div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-accentLight border border-accent/20 rounded-lg px-6 py-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-accent mb-1">Your savings</p>
                      <p className="text-muted text-xs">{fmtUnit(results.savingsPerUnit)}/unit · {fmt(results.savingsPerShipment)}/shipment · <span className="font-semibold text-accent">{fmt(results.annualSavings)}/year</span></p>
                    </div>
                    <p className="font-display font-bold text-3xl text-accent flex-shrink-0">{fmt(results.annualSavings)}</p>
                  </div>

                  <div className="bg-surface border border-border rounded-lg p-8 text-center">
                    <p className="font-display font-semibold text-xl text-ink uppercase mb-2">Ready to start saving?</p>
                    <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6">
                      In a free 30-minute call we'll run the exact numbers for your SKUs — including freight, duties, and landed cost — before you commit to anything.
                    </p>
                    <a href="https://calendly.com/welcome-prettygoodstuff/30min" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-colors shadow-xl shadow-accent/30 ring-2 ring-accent/20">
                      Book a Free Sourcing Call →
                    </a>
                    <p className="text-muted/40 text-xs mt-4">No commitment. We'll run the numbers together.</p>
                  </div>
                </>
              )}

            </div>
          )}

        </div>
      </main>

      <footer className="px-8 py-8 border-t border-border">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted/40 text-xs">© 2026 Pretty Good Stuff · ShenCo LLC</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-muted/40 text-xs hover:text-muted transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-muted/40 text-xs hover:text-muted transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
