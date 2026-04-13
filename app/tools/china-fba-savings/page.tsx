'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Complexity = 'simple' | 'standard' | 'full'

// Costs reflect PGS published pricing at 500–1,999 unit tier (mid-volume)
const COMPLEXITY: Record<Complexity, { cost: number; label: string; desc: string }> = {
  simple:   { cost: 0.45, label: 'Standard',     desc: 'FNSKU label only' },
  standard: { cost: 0.60, label: 'Premium',       desc: 'Poly bag + FNSKU label' },
  full:     { cost: 0.78, label: 'Full Service',  desc: 'QC inspection + poly bag + label + carton prep' },
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
function fmtUnit(n: number) {
  return `$${n.toFixed(2)}`
}

export default function ChinaFBASavingsPage() {
  const [currentCost, setCurrentCost]           = useState('')
  const [units, setUnits]                       = useState('')
  const [shipments, setShipments]               = useState('')
  const [complexity, setComplexity]             = useState<Complexity>('standard')
  const [results, setResults]                   = useState<null | {
    savingsPerUnit: number
    savingsPerShipment: number
    annualSavings: number
    threeYearSavings: number
    currentAnnual: number
    chinaAnnual: number
    chinaCost: number
    noSavings: boolean
  }>(null)

  function calculate() {
    const c = parseFloat(currentCost)
    const u = parseInt(units)
    const s = parseInt(shipments)
    const chinaCost = COMPLEXITY[complexity].cost
    if (!c || !u || !s || c <= 0 || u <= 0 || s <= 0) return

    const savingsPerUnit      = c - chinaCost
    const savingsPerShipment  = savingsPerUnit * u
    const annualSavings       = savingsPerShipment * s
    const threeYearSavings    = annualSavings * 3
    const currentAnnual       = c * u * s
    const chinaAnnual         = chinaCost * u * s

    setResults({
      savingsPerUnit,
      savingsPerShipment,
      annualSavings,
      threeYearSavings,
      currentAnnual,
      chinaAnnual,
      chinaCost,
      noSavings: savingsPerUnit <= 0,
    })
  }

  const isValid = currentCost && units && shipments &&
    parseFloat(currentCost) > 0 && parseInt(units) > 0 && parseInt(shipments) > 0

  return (
    <div className="min-h-screen bg-surfaceAlt flex flex-col">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-border bg-surface">
        <Link href="/">
          <Image src="/logo.png" alt="Pretty Good Stuff" width={800} height={150} className="h-[32px] w-auto object-contain" />
        </Link>
        <Link href="/#services"
          className="flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 text-xs font-semibold tracking-widest uppercase">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      <main className="flex-grow px-8 py-16">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-surface border border-orange-200 text-orange-800 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase">Free Tool · China FBA Prep</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              How Much<br />
              <span className="gradient-text-accent">Could You Save?</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Most FBA sellers using a US prep center are overpaying by $0.50–$1.50 per unit.
              Enter your numbers and find out what that's costing you annually.
            </p>
          </div>

          {/* Form */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-8">
            <div className="flex flex-col gap-7">

              {/* Current prep cost */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                  Current prep cost per unit
                </label>
                <p className="text-muted text-xs mb-3">What your US 3PL or prep center charges per unit</p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2.00"
                    value={currentCost}
                    onChange={e => { setCurrentCost(e.target.value); setResults(null) }}
                    className="w-full bg-surfaceAlt border border-border rounded-lg pl-8 pr-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Units + shipments — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                    Units per shipment
                  </label>
                  <p className="text-muted text-xs mb-3">Typical FBA batch size</p>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="500"
                    value={units}
                    onChange={e => { setUnits(e.target.value); setResults(null) }}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                    Shipments per year
                  </label>
                  <p className="text-muted text-xs mb-3">How often you restock</p>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="4"
                    value={shipments}
                    onChange={e => { setShipments(e.target.value); setResults(null) }}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>

              {/* Complexity */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                  Prep complexity
                </label>
                <p className="text-muted text-xs mb-3">Rates shown at 500–1,999 units/shipment (mid-volume tier). <a href="/pricing/china-fba-prep" className="underline underline-offset-2 hover:text-ink transition-colors">View full pricing →</a></p>
                <div className="flex flex-col gap-2">
                  {(Object.entries(COMPLEXITY) as [Complexity, typeof COMPLEXITY[Complexity]][]).map(([key, { label, desc }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setComplexity(key); setResults(null) }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        complexity === key
                          ? 'border-accent bg-accentLight'
                          : 'border-border bg-surfaceAlt hover:border-accent/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        complexity === key ? 'border-accent bg-accent' : 'border-muted/30'
                      }`}>
                        {complexity === key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold tracking-widest uppercase ${complexity === key ? 'text-accent' : 'text-ink'}`}>
                          {label}
                        </p>
                        <p className="text-muted text-xs mt-0.5">{desc}</p>
                      </div>
                      <span className={`ml-auto text-xs font-semibold ${complexity === key ? 'text-accent' : 'text-muted/50'}`}>
                        ~${COMPLEXITY[key].cost.toFixed(2)}/unit
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculate button */}
              <button
                onClick={calculate}
                disabled={!isValid}
                className="group flex items-center justify-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-5 rounded-full hover:bg-accentDark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
              >
                Calculate My Savings
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>

            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-500">

              {results.noSavings ? (
                /* Already efficient */
                <div className="bg-surface border border-border rounded-lg p-8 text-center">
                  <p className="font-display font-bold text-3xl text-ink uppercase mb-3">You're Already Efficient</p>
                  <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto">
                    Your current prep cost per unit ({fmtUnit(parseFloat(currentCost))}) is at or below what
                    China prep typically costs for {COMPLEXITY[complexity].label.toLowerCase()} service.
                    {complexity === 'full'
                      ? " That said, our Full Service includes pre-shipment QC inspection — which most US centers don't offer at any price."
                      : " If defect risk is a concern, our Full Service adds pre-shipment QC inspection for a small premium."}
                  </p>
                  <a href="https://calendly.com/welcome-prettygoodstuff/30min"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 bg-accent text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-full hover:bg-accentDark transition-colors shadow-lg shadow-accent/20">
                    Talk to Us About QC →
                  </a>
                </div>
              ) : (
                <>
                  {/* Hero savings number */}
                  <div className="bg-surface border border-border rounded-lg p-8 text-center">
                    <p className="text-muted text-xs tracking-widest uppercase mb-3">Estimated Annual Savings</p>
                    <p className="font-display font-bold text-7xl md:text-8xl gradient-text-accent leading-none mb-2">
                      {fmt(results.annualSavings)}
                    </p>
                    <p className="text-muted text-sm">
                      {fmt(results.threeYearSavings)} over 3 years
                    </p>
                  </div>

                  {/* Breakdown table */}
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
                      {
                        label: 'Per unit',
                        current: fmtUnit(parseFloat(currentCost)),
                        china: fmtUnit(results.chinaCost),
                      },
                      {
                        label: `Per shipment (${parseInt(units).toLocaleString()} units)`,
                        current: fmt(parseFloat(currentCost) * parseInt(units)),
                        china: fmt(results.chinaCost * parseInt(units)),
                      },
                      {
                        label: `Per year (${parseInt(shipments)} shipments)`,
                        current: fmt(results.currentAnnual),
                        china: fmt(results.chinaAnnual),
                      },
                    ].map(({ label, current, china }, i) => (
                      <div key={i} className={`grid grid-cols-3 ${i < 2 ? 'border-b border-border' : ''}`}>
                        <div className="px-6 py-4">
                          <p className="text-xs text-muted leading-snug">{label}</p>
                        </div>
                        <div className="px-6 py-4 text-center border-l border-border">
                          <p className="text-sm font-semibold text-ink">{current}</p>
                        </div>
                        <div className="px-6 py-4 text-center border-l border-border bg-accentLight/40">
                          <p className="text-sm font-semibold text-accent">{china}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Savings highlight */}
                  <div className="bg-accentLight border border-accent/20 rounded-lg px-6 py-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-accent mb-1">Your savings</p>
                      <p className="text-muted text-xs leading-relaxed">
                        {fmtUnit(results.savingsPerUnit)}/unit · {fmt(results.savingsPerShipment)}/shipment · <span className="font-semibold text-accent">{fmt(results.annualSavings)}/year</span>
                      </p>
                    </div>
                    <p className="font-display font-bold text-3xl text-accent flex-shrink-0">{fmt(results.annualSavings)}</p>
                  </div>

                  {/* CTA */}
                  <div className="bg-surface border border-border rounded-lg p-8 text-center">
                    <p className="font-display font-semibold text-xl text-ink uppercase mb-2">
                      Ready to start saving?
                    </p>
                    <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6">
                      In a free 30-minute call we'll run the exact numbers for your SKUs —
                      including freight, duties, and landed cost — before you commit to anything.
                    </p>
                    <a
                      href="https://calendly.com/welcome-prettygoodstuff/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-accentDark transition-colors shadow-lg shadow-accent/20"
                    >
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

      {/* Footer */}
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
