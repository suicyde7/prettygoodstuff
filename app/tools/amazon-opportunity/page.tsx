'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sendLead } from '@/lib/sendLead'

// ── Category data ──────────────────────────────────────────────────────────────

type DemandTier = 'high' | 'medium' | 'competitive'

interface Category {
  label:       string
  demand:      DemandTier
  competition: 'low' | 'medium' | 'high'
  note:        string
}

const CATEGORIES: Record<string, Category> = {
  home_kitchen:     { label: 'Home & Kitchen',           demand: 'high',        competition: 'high',   note: 'Massive search volume. Differentiation is critical — generic products get buried.' },
  sports_outdoors:  { label: 'Sports & Outdoors',        demand: 'high',        competition: 'medium', note: 'Strong recurring demand. Niche sub-categories often have less competition than the top level.' },
  health_household: { label: 'Health & Household',       demand: 'high',        competition: 'high',   note: 'High intent buyers. Regulated sub-categories (supplements) add compliance complexity.' },
  beauty_personal:  { label: 'Beauty & Personal Care',   demand: 'high',        competition: 'high',   note: 'Brand loyalty matters. A+ Content and strong imagery are table stakes to compete.' },
  pet_supplies:     { label: 'Pet Supplies',             demand: 'high',        competition: 'medium', note: 'High repeat purchase rate. Consumables outperform one-time buys in LTV.' },
  toys_games:       { label: 'Toys & Games',             demand: 'medium',      competition: 'medium', note: 'Seasonal spikes (Q4). Year-round sub-niches exist but require careful timing.' },
  tools_home_imp:   { label: 'Tools & Home Improvement', demand: 'medium',      competition: 'medium', note: 'Practical, search-driven buys. Technical listings with strong specs convert well.' },
  office_products:  { label: 'Office Products',          demand: 'medium',      competition: 'low',    note: 'B2B buyer overlap creates bulk order potential. Often overlooked by new sellers.' },
  baby_products:    { label: 'Baby Products',            demand: 'medium',      competition: 'high',   note: 'High trust threshold — reviews and safety certifications matter more here than anywhere else.' },
  grocery_gourmet:  { label: 'Grocery & Gourmet Food',  demand: 'medium',      competition: 'medium', note: 'Subscriptions and Subscribe & Save drive strong LTV. Perishables require FBA planning.' },
  clothing_apparel: { label: 'Clothing & Apparel',       demand: 'competitive', competition: 'high',   note: 'Returns are high, sizing complexity hurts conversion. Hardest category for new sellers to win.' },
  electronics:      { label: 'Electronics',              demand: 'competitive', competition: 'high',   note: 'Dominated by established brands. White-label accessories can work in tight sub-niches.' },
  automotive:       { label: 'Automotive',               demand: 'medium',      competition: 'low',    note: 'Fitment data is complex but filters out competition. Strong niche opportunity for focused sellers.' },
  arts_crafts:      { label: 'Arts, Crafts & Sewing',   demand: 'medium',      competition: 'low',    note: 'Passionate, high-intent buyers. Small niche — easier to rank but smaller TAM.' },
  garden_outdoor:   { label: 'Patio, Lawn & Garden',     demand: 'medium',      competition: 'medium', note: 'Seasonal demand with long windows. Private label tools and decor perform consistently.' },
}

type Trademark      = 'yes' | 'in_progress' | 'no'
type Differentiated = 'yes' | 'somewhat' | 'no'
type YesNo          = 'yes' | 'no'
type LaunchTimeline = 'ready' | '3mo' | '6mo' | 'researching'

interface Inputs {
  keyword1:       string
  keyword2:       string
  keyword3:       string
  category:       string
  pricePoint:     string
  supplier:       YesNo
  differentiated: Differentiated
  trademark:      Trademark
  photos:         YesNo
  hasWebsite:     YesNo
  websiteUrl:     string
  launchTimeline: LaunchTimeline
}

interface Results {
  opportunityScore: number
  readinessScore:   number
  demandTier:       DemandTier
  demandLabel:      string
  competitionLabel: string
  categoryNote:     string
  gaps:             { title: string; body: string; blocking: boolean }[]
  timeToLive:       string
  verdict:          string
}

// ── Scoring ────────────────────────────────────────────────────────────────────

function computeResults(inp: Inputs): Results {
  const cat   = CATEGORIES[inp.category]
  const price = parseFloat(inp.pricePoint) || 0

  let opp = 0
  if (cat.demand === 'high') opp += 40
  else if (cat.demand === 'medium') opp += 28
  else opp += 15

  if (cat.competition === 'low') opp += 25
  else if (cat.competition === 'medium') opp += 15
  else opp += 5

  if (price >= 25 && price <= 120) opp += 20
  else if (price >= 20 && price < 25) opp += 14
  else if (price > 120) opp += 10
  else opp += 4

  if (inp.differentiated === 'yes') opp += 15
  else if (inp.differentiated === 'somewhat') opp += 7
  opp = Math.min(opp, 100)

  let ready = 0
  if (inp.supplier === 'yes') ready += 30
  if (inp.photos === 'yes') ready += 20
  if (inp.trademark === 'yes') ready += 20
  else if (inp.trademark === 'in_progress') ready += 10
  if (inp.differentiated === 'yes') ready += 15
  else if (inp.differentiated === 'somewhat') ready += 7
  if (inp.hasWebsite === 'yes') ready += 15
  ready = Math.min(ready, 100)

  const gaps: Results['gaps'] = []

  if (inp.supplier === 'no') gaps.push({
    title: 'No supplier or manufacturer',
    body: "Without a confirmed source, you can't control cost, quality, or lead time. This is the most foundational gap — everything else depends on it.",
    blocking: true,
  })
  if (inp.differentiated === 'no') gaps.push({
    title: 'Generic / undifferentiated product',
    body: "Selling the same product as 50 other sellers means competing on price alone. Amazon's algorithm rewards reviews and velocity — which new sellers don't have. You need a real angle.",
    blocking: true,
  })
  else if (inp.differentiated === 'somewhat') gaps.push({
    title: 'Weak differentiation',
    body: "A vague differentiator won't hold up against established sellers. Identify one specific, defensible claim: a unique feature, a bundle, a certification, or a better experience.",
    blocking: false,
  })
  if (inp.trademark === 'no') gaps.push({
    title: 'No trademark — Brand Registry locked out',
    body: "Without Brand Registry you can't use A+ Content, Brand Store, Sponsored Brands ads, or Amazon Vine. File a USPTO trademark now (takes 8–12 months; an IP Accelerator filing can unlock Brand Registry in weeks).",
    blocking: false,
  })
  if (inp.photos === 'no') gaps.push({
    title: 'No professional product photos',
    body: "Your main image is the first — and sometimes only — thing a shopper sees. Unprofessional photos collapse click-through before anyone reads your listing.",
    blocking: false,
  })
  if (price > 0 && price < 20) gaps.push({
    title: `Price point too low for FBA ($${price})`,
    body: "After FBA fulfillment fees (~$3.31+ for a standard item), referral fees (8–15%), and minimum PPC spend, products under $20 rarely generate meaningful margin.",
    blocking: false,
  })
  if (cat.competition === 'high' && inp.differentiated !== 'yes') gaps.push({
    title: `High competition in ${cat.label} without strong differentiation`,
    body: `${cat.label} is one of the most competitive Amazon categories. Without a clear, defensible differentiator you'll be fighting for visibility against sellers with thousands of reviews and established PPC history.`,
    blocking: false,
  })

  gaps.sort((a, b) => (b.blocking ? 1 : 0) - (a.blocking ? 1 : 0))

  let timeToLive: string
  if (ready >= 80) timeToLive = '60–90 days'
  else if (ready >= 60) timeToLive = '90–120 days'
  else if (ready >= 35) timeToLive = '3–6 months (gaps to resolve first)'
  else timeToLive = '6+ months (foundational work needed)'

  const blockingCount = gaps.filter(g => g.blocking).length
  let verdict: string
  if (blockingCount >= 2) verdict = 'Not ready to launch. Resolve the blocking gaps below before investing further.'
  else if (blockingCount === 1) verdict = 'One critical gap is blocking launch. Fix it and you have a real path forward.'
  else if (opp >= 65 && ready >= 65) verdict = 'Strong opportunity with solid readiness. You can move forward confidently.'
  else if (opp >= 50 && ready >= 50) verdict = 'Viable opportunity. Address the gaps below to improve your launch odds.'
  else if (opp < 40) verdict = 'The market opportunity is limited in this category at this price point. Consider repositioning.'
  else verdict = 'The opportunity exists — but your readiness needs work before you commit resources.'

  return {
    opportunityScore: opp,
    readinessScore:   ready,
    demandTier:       cat.demand,
    demandLabel:      ({ high: 'High Demand', medium: 'Solid Niche', competitive: 'Highly Competitive' })[cat.demand],
    competitionLabel: ({ low: 'Low Competition', medium: 'Moderate Competition', high: 'High Competition' })[cat.competition],
    categoryNote:     cat.note,
    gaps:             gaps.slice(0, 4),
    timeToLive,
    verdict,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  return s >= 70 ? 'border-green-400' : s >= 45 ? 'border-amber-400' : 'border-red-400'
}
function scoreTextColor(s: number) {
  return s >= 70 ? 'text-green-600' : s >= 45 ? 'text-amber-600' : 'text-red-500'
}

function RadioGroup<T extends string>({ label, sublabel, options, value, onChange }: {
  label: string; sublabel?: string
  options: { value: T; label: string; sub?: string }[]
  value: T; onChange: (v: T) => void
}) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">{label}</label>
      {sublabel && <p className="text-muted text-xs mb-3">{sublabel}</p>}
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`flex items-center gap-4 p-3.5 rounded-lg border-2 text-left transition-all duration-150 ${value === opt.value ? 'border-accent bg-accentLight' : 'border-border bg-surfaceAlt hover:border-accent/30'}`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${value === opt.value ? 'border-accent bg-accent' : 'border-muted/30'}`}>
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className={`text-xs font-bold tracking-widest uppercase ${value === opt.value ? 'text-accent' : 'text-ink'}`}>{opt.label}</p>
              {opt.sub && <p className="text-muted text-xs mt-0.5">{opt.sub}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const defaultInputs: Inputs = {
  keyword1: '', keyword2: '', keyword3: '',
  category: '', pricePoint: '',
  supplier: 'no', differentiated: 'somewhat',
  trademark: 'no', photos: 'no',
  hasWebsite: 'no', websiteUrl: '',
  launchTimeline: 'researching',
}

function buildTrendsUrl(keywords: string[]): string {
  const items = keywords
    .filter(k => k.trim())
    .map(k => ({ keyword: k.trim(), geo: 'US', time: 'today 12-m' }))
  const req = JSON.stringify({ comparisonItem: items, category: 0, property: '' })
  return `https://trends.google.com/trends/embed/explore/TIMESERIES?req=${encodeURIComponent(req)}&tz=-300`
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AmazonOpportunityPage() {
  const [inp, setInp]         = useState<Inputs>(defaultInputs)
  const [results, setResults] = useState<Results | null>(null)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')

  function set<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    setInp(prev => ({ ...prev, [key]: val }))
    setResults(null)
  }

  const isValid = inp.keyword1.trim() !== '' && inp.category !== '' && parseFloat(inp.pricePoint) > 0 && /\S+@\S+\.\S+/.test(email)

  function calculate() {
    if (!isValid) return
    const r = computeResults(inp)
    setResults(r)
    sendLead({
      tool:             'Opportunity Score',
      name:             name.trim(),
      email:            email.trim(),
      keyword1:         inp.keyword1,
      keyword2:         inp.keyword2 || '',
      keyword3:         inp.keyword3 || '',
      category:         CATEGORIES[inp.category]?.label ?? inp.category,
      pricePoint:       parseFloat(inp.pricePoint) || 0,
      hasWebsite:       inp.hasWebsite,
      websiteUrl:       inp.websiteUrl || '',
      launchTimeline:   inp.launchTimeline,
      opportunityScore: r.opportunityScore,
      readinessScore:   r.readinessScore,
      verdict:          r.verdict,
    })
  }

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
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-surface border border-orange-200 text-orange-800 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase">Free Tool · Amazon Launch</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              Amazon<br /><span className="gradient-text-accent">Opportunity Score</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Not a revenue predictor. A reality check. Answer 7 questions and find out how strong your market opportunity is — and what's blocking your launch.
            </p>
          </div>

          {/* Form */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-8 flex flex-col gap-8">

            {/* Keywords */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Product keywords</label>
              <p className="text-muted text-xs mb-3">Enter up to 3 search terms a customer would use to find your product. We'll show you the demand trend for each one.</p>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest uppercase text-accent/60">01</span>
                  <input type="text" placeholder="e.g. roasted coffee beans"
                    value={inp.keyword1} onChange={e => set('keyword1', e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest uppercase text-muted/40">02</span>
                  <input type="text" placeholder="e.g. ground coffee (optional)"
                    value={inp.keyword2} onChange={e => set('keyword2', e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest uppercase text-muted/40">03</span>
                  <input type="text" placeholder="e.g. whole bean coffee (optional)"
                    value={inp.keyword3} onChange={e => set('keyword3', e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Product category</label>
              <p className="text-muted text-xs mb-3">Which Amazon category does your product belong to?</p>
              <select value={inp.category} onChange={e => set('category', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                <option value="" disabled>Select a category…</option>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Target retail price</label>
              <p className="text-muted text-xs mb-3">What price do you plan to sell at on Amazon?</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">$</span>
                <input type="number" min="1" step="1" placeholder="e.g. 34"
                  value={inp.pricePoint} onChange={e => { set('pricePoint', e.target.value) }}
                  className="w-full bg-surfaceAlt border border-border rounded-lg pl-8 pr-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              {parseFloat(inp.pricePoint) >= 25 && parseFloat(inp.pricePoint) <= 120 && (
                <p className="text-green-600 text-xs mt-1.5">✓ Strong price point for FBA economics.</p>
              )}
            </div>

            {/* Supplier */}
            <RadioGroup label="Do you have a manufacturer or supplier?"
              sublabel="A confirmed source you can place an order with today"
              value={inp.supplier} onChange={v => set('supplier', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Confirmed supplier, sampled the product' },
                { value: 'no',  label: 'No',  sub: "Haven't sourced a supplier yet" },
              ]} />

            {/* Differentiation */}
            <RadioGroup label="Is your product differentiated?"
              sublabel="Does it have a specific angle that separates it from what's already on Amazon?"
              value={inp.differentiated} onChange={v => set('differentiated', v)}
              options={[
                { value: 'yes',      label: 'Yes — clearly differentiated', sub: 'Unique feature, bundle, or certification competitors lack' },
                { value: 'somewhat', label: 'Somewhat',                      sub: 'Minor differences but mostly comparable' },
                { value: 'no',       label: 'No — generic product',          sub: "It's the same as what's already selling" },
              ]} />

            {/* Trademark */}
            <RadioGroup label="Trademark or Brand Registry status"
              sublabel="Do you have a registered trademark, or is one in progress?"
              value={inp.trademark} onChange={v => set('trademark', v)}
              options={[
                { value: 'yes',         label: 'Yes — registered',  sub: 'Brand Registry active or eligible now' },
                { value: 'in_progress', label: 'In progress',       sub: 'USPTO or equivalent application filed' },
                { value: 'no',          label: 'No trademark',      sub: "Haven't filed yet" },
              ]} />

            {/* Photos */}
            <RadioGroup label="Professional product photography"
              sublabel="Do you have professional-quality product photos ready?"
              value={inp.photos} onChange={v => set('photos', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Pro photos on white + lifestyle shots' },
                { value: 'no',  label: 'No',  sub: "Haven't organized photography yet" },
              ]} />

            {/* Website */}
            <RadioGroup label="Do you have an existing website or DTC store?"
              sublabel="A live site where customers can already find and buy your product"
              value={inp.hasWebsite} onChange={v => set('hasWebsite', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Live website or Shopify store with real customers' },
                { value: 'no',  label: 'No',  sub: "Selling only on Amazon or haven't launched yet" },
              ]} />

            {inp.hasWebsite === 'yes' && (
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Website URL</label>
                <p className="text-muted text-xs mb-3">Paste your site URL — we'll take a look before your strategy call.</p>
                <input type="url" placeholder="https://yourstore.com"
                  value={inp.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
                  className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
            )}

            {/* Qualifying question */}
            <RadioGroup label="When are you planning to launch on Amazon?"
              sublabel="Helps us give you the most relevant advice"
              value={inp.launchTimeline} onChange={v => set('launchTimeline', v as LaunchTimeline)}
              options={[
                { value: 'ready',      label: 'Ready now',         sub: 'I have everything in place to launch' },
                { value: '3mo',        label: 'Within 3 months',   sub: 'Moving quickly' },
                { value: '6mo',        label: '3–6 months',        sub: 'Still in planning' },
                { value: 'researching', label: 'Just researching', sub: 'Early stage, exploring options' },
              ]} />

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

            {/* Submit */}
            <button onClick={calculate} disabled={!isValid}
              className="group flex items-center justify-center gap-3 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-accent/30 ring-2 ring-accent/20">
              See My Score
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>

          {/* Full results */}
          {results && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-500">

              {/* Score rings */}
              <div className="bg-surface border border-border rounded-lg p-8">
                <div className="flex items-start justify-around gap-6 mb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-24 h-24 rounded-full border-4 ${scoreColor(results.opportunityScore)} flex items-center justify-center mb-3`}>
                      <span className="font-display font-bold text-3xl text-ink leading-none">{results.opportunityScore}</span>
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase text-ink">Opportunity Score</p>
                    <p className="text-xs text-muted mt-0.5">Market strength</p>
                  </div>
                  <div className="w-px bg-border self-stretch" />
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-24 h-24 rounded-full border-4 ${scoreColor(results.readinessScore)} flex items-center justify-center mb-3`}>
                      <span className="font-display font-bold text-3xl text-ink leading-none">{results.readinessScore}</span>
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase text-ink">Readiness Score</p>
                    <p className="text-xs text-muted mt-0.5">How prepared you are</p>
                  </div>
                </div>

                <div className="flex gap-2 justify-center flex-wrap mb-6">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${results.demandTier === 'high' ? 'bg-green-100 text-green-800 border-green-200' : results.demandTier === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {results.demandLabel}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-border bg-surfaceAlt text-muted">{results.competitionLabel}</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-border bg-surfaceAlt text-muted">Time to live: {results.timeToLive}</span>
                </div>

                <div className="bg-surfaceAlt border border-border rounded-md px-4 py-3 mb-5">
                  <p className="text-xs text-muted leading-relaxed">{results.categoryNote}</p>
                </div>

                <div className={`rounded-md px-4 py-3 border text-sm font-medium leading-relaxed ${results.gaps.some(g => g.blocking) ? 'bg-red-50 border-red-200 text-red-800' : results.opportunityScore >= 65 && results.readinessScore >= 65 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                  {results.verdict}
                </div>
              </div>

              {/* Gaps */}
              {results.gaps.length > 0 && (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-surfaceAlt">
                    <p className="font-display font-semibold text-lg text-ink uppercase">Gaps to Address</p>
                    <p className="text-xs text-muted mt-1">Fix these before investing in your launch — blocking issues are marked in red.</p>
                  </div>
                  <div className="divide-y divide-border">
                    {results.gaps.map((gap, i) => (
                      <div key={i} className="px-6 py-5 flex items-start gap-4">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${gap.blocking ? 'bg-red-100 border border-red-200' : 'bg-amber-100 border border-amber-200'}`}>
                          <span className={`text-[10px] font-bold ${gap.blocking ? 'text-red-600' : 'text-amber-700'}`}>{gap.blocking ? '!' : i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-ink">{gap.title}</p>
                            {gap.blocking && <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Blocking</span>}
                          </div>
                          <p className="text-xs text-muted leading-relaxed">{gap.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.gaps.length === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-5">
                  <p className="text-sm font-semibold text-green-800 mb-1">No critical gaps identified</p>
                  <p className="text-xs text-green-700 leading-relaxed">Your inputs show strong market alignment and launch readiness. The next step is validating at the ASIN level — keyword research, competitor review count, and pricing analysis.</p>
                </div>
              )}

              {/* Demand Trend */}
              {inp.keyword1.trim() && (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-surfaceAlt">
                    <p className="font-display font-semibold text-lg text-ink uppercase">Demand Trend</p>
                    <p className="text-xs text-muted mt-1">
                      12-month Google search interest for {[inp.keyword1, inp.keyword2, inp.keyword3].filter(k => k.trim()).join(', ')} — powered by Google Trends.
                    </p>
                  </div>
                  <div className="p-4">
                    <iframe
                      src={buildTrendsUrl([inp.keyword1, inp.keyword2, inp.keyword3])}
                      className="w-full rounded-md"
                      style={{ height: '380px', border: 'none' }}
                      loading="lazy"
                      title="Google Trends — keyword demand"
                    />
                    <p className="text-muted/40 text-xs mt-3 text-center">Interest shown on a 0–100 scale relative to peak popularity. 100 = highest search interest in the period.</p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <p className="font-display font-semibold text-xl text-ink uppercase mb-2">Ready to Go Deeper?</p>
                <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6">
                  In a free 30-minute strategy call we'll validate your specific product — keyword demand, competitor landscape, and a realistic launch plan before you spend a dollar.
                </p>
                <a href="https://calendly.com/welcome-prettygoodstuff/30min" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-colors shadow-xl shadow-accent/30 ring-2 ring-accent/20">
                  Book a Free Strategy Call →
                </a>
                <p className="text-muted/40 text-xs mt-4">No commitment. No pitch. Just a real look at your numbers.</p>
              </div>

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
