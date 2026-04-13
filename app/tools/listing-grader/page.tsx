'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── Scoring config ──────────────────────────────────────────────────────────

type BulletQuality = 'short' | 'mixed' | 'detailed'
type BackendKeywords = 'full' | 'partial' | 'no' | 'unknown'
type ThreeOption = 'yes' | 'no' | 'unknown'

interface Inputs {
  titleLength:      string
  bulletCount:      string
  bulletQuality:    BulletQuality
  imageCount:       string
  hasVideo:         'yes' | 'no'
  hasAPlus:         ThreeOption
  hasBrandStore:    'yes' | 'no'
  brandRegistry:    'yes' | 'no'
  backendKeywords:  BackendKeywords
}

interface ScoreBreakdown {
  factor:    string
  earned:    number
  max:       number
  label:     string
  tip:       string | null
}

interface Results {
  total:     number
  grade:     'A' | 'B' | 'C' | 'D'
  gradeLabel: string
  breakdown: ScoreBreakdown[]
  fixes:     { impact: number; text: string }[]
}

function scoreInputs(inp: Inputs): Results {
  const breakdown: ScoreBreakdown[] = []
  const fixes: { impact: number; text: string }[] = []

  const titleLen = parseInt(inp.titleLength) || 0
  let titlePts = 0
  if (titleLen >= 150) titlePts = 15
  else if (titleLen >= 80) titlePts = 8
  const titleGap = 15 - titlePts
  breakdown.push({
    factor: 'Title Length',
    earned: titlePts, max: 15,
    label: titleLen >= 150 ? 'Strong (150+ chars)' : titleLen >= 80 ? 'Moderate (80–149 chars)' : 'Thin (<80 chars)',
    tip: titleLen < 150 ? `Your title is ${titleLen} characters. Aim for 150+ to maximize keyword indexing.` : null,
  })
  if (titleGap > 0) fixes.push({ impact: titleGap, text: `Expand your title to 150+ characters — you're leaving keyword indexing on the table.` })

  const bullets = parseInt(inp.bulletCount) || 0
  let bulletPts = 0
  if (bullets >= 5) bulletPts = 10
  else if (bullets === 4) bulletPts = 7
  else if (bullets === 3) bulletPts = 4
  const bulletCountGap = 10 - bulletPts
  breakdown.push({
    factor: 'Bullet Point Count',
    earned: bulletPts, max: 10,
    label: bullets >= 5 ? '5 bullets (max)' : `${bullets} bullet${bullets !== 1 ? 's' : ''}`,
    tip: bullets < 5 ? `You have ${bullets} bullet${bullets !== 1 ? 's' : ''}. Use all 5 — each is a keyword and conversion opportunity.` : null,
  })
  if (bulletCountGap > 0) fixes.push({ impact: bulletCountGap, text: `Add ${5 - bullets} more bullet point${5 - bullets > 1 ? 's' : ''} — you have unused conversion real estate.` })

  const qualityMap: Record<BulletQuality, number> = { short: 0, mixed: 5, detailed: 10 }
  const qualityPts = qualityMap[inp.bulletQuality]
  const qualityGap = 10 - qualityPts
  breakdown.push({
    factor: 'Bullet Point Depth',
    earned: qualityPts, max: 10,
    label: inp.bulletQuality === 'detailed' ? 'All detailed' : inp.bulletQuality === 'mixed' ? 'Mixed quality' : 'Short / generic',
    tip: inp.bulletQuality !== 'detailed' ? 'Weak bullets are the #1 conversion killer. Lead each with a benefit, back it with a feature.' : null,
  })
  if (qualityGap > 0) fixes.push({ impact: qualityGap, text: `Rewrite bullets to lead with customer benefits, not product features. Each should be 2+ lines.` })

  const images = parseInt(inp.imageCount) || 0
  let imagePts = 0
  if (images >= 9) imagePts = 15
  else if (images >= 7) imagePts = 12
  else if (images >= 5) imagePts = 9
  else imagePts = 5
  const imageGap = 15 - imagePts
  breakdown.push({
    factor: 'Image Count',
    earned: imagePts, max: 15,
    label: images >= 9 ? '9 images (full gallery)' : `${images} image${images !== 1 ? 's' : ''}`,
    tip: images < 9 ? `You have ${images} image${images !== 1 ? 's' : ''}. Amazon allows up to 9 — fill every slot with lifestyle, infographic, size chart, and close-up shots.` : null,
  })
  if (imageGap > 0) fixes.push({ impact: imageGap, text: `Add ${9 - images} more image${9 - images > 1 ? 's' : ''} — Amazon allows 9 total. Lifestyle shots and infographics are the highest-converting additions.` })

  const videoPts = inp.hasVideo === 'yes' ? 10 : 0
  breakdown.push({
    factor: 'Product Video',
    earned: videoPts, max: 10,
    label: inp.hasVideo === 'yes' ? 'Video present' : 'No video',
    tip: inp.hasVideo === 'no' ? 'Listings with video typically see 10–30% higher conversion rates. Even a 30-second product demo makes a measurable difference.' : null,
  })
  if (videoPts === 0) fixes.push({ impact: 10, text: `Add a product video. Listings with video typically see 10–30% higher conversion — one of the highest-leverage upgrades available.` })

  const aPlusMap: Record<ThreeOption, number> = { yes: 20, no: 0, unknown: 0 }
  const aPlusPts = aPlusMap[inp.hasAPlus]
  const aPlusGap = 20 - aPlusPts
  breakdown.push({
    factor: 'A+ Content',
    earned: aPlusPts, max: 20,
    label: inp.hasAPlus === 'yes' ? 'A+ Content live' : inp.hasAPlus === 'unknown' ? "Don't know" : 'No A+ Content',
    tip: inp.hasAPlus !== 'yes' ? 'A+ Content is the single highest-impact listing upgrade. Amazon reports 3–10% conversion lift. Requires Brand Registry.' : null,
  })
  if (aPlusGap > 0) fixes.push({ impact: aPlusGap, text: `Build A+ Content — it's the highest single-impact upgrade available and Amazon reports 3–10% conversion improvement.` })

  const brandStorePts = inp.hasBrandStore === 'yes' ? 5 : 0
  breakdown.push({
    factor: 'Brand Store',
    earned: brandStorePts, max: 5,
    label: inp.hasBrandStore === 'yes' ? 'Brand Store live' : 'No Brand Store',
    tip: inp.hasBrandStore === 'no' ? 'A Brand Store gives you a dedicated brand page on Amazon with no competitor ads on it, and is required to run Sponsored Brands Store Spotlight ads.' : null,
  })
  if (brandStorePts === 0) fixes.push({ impact: 5, text: `Create a Brand Store — your dedicated Amazon brand page has no competitor ads and is required for Sponsored Brands Store Spotlight ads.` })

  const backendMap: Record<BackendKeywords, number> = { full: 10, partial: 5, no: 0, unknown: 0 }
  const backendPts = backendMap[inp.backendKeywords]
  const backendGap = 10 - backendPts
  breakdown.push({
    factor: 'Backend Search Terms',
    earned: backendPts, max: 10,
    label: inp.backendKeywords === 'full' ? 'Fully populated' : inp.backendKeywords === 'partial' ? 'Partially filled' : inp.backendKeywords === 'no' ? 'Empty' : "Don't know",
    tip: inp.backendKeywords !== 'full' ? 'Backend keywords are invisible to shoppers but indexed by Amazon. A full 250-byte field means more search placements with zero listing clutter.' : null,
  })
  if (backendGap > 0) fixes.push({ impact: backendGap, text: `Fill backend search terms to the full 250 bytes with synonyms, misspellings, and long-tail phrases not in your visible copy.` })

  const brandRegPts = inp.brandRegistry === 'yes' ? 5 : 0
  breakdown.push({
    factor: 'Brand Registry',
    earned: brandRegPts, max: 5,
    label: inp.brandRegistry === 'yes' ? 'Enrolled' : 'Not enrolled',
    tip: inp.brandRegistry === 'no' ? 'Brand Registry unlocks A+ Content, Brand Store, and Sponsored Brands. Amazon Vine is also gated behind Brand Registry (note: Vine enrollment costs $200/parent ASIN). Requires a registered trademark.' : null,
  })
  if (brandRegPts === 0) fixes.push({ impact: 5, text: `Enroll in Brand Registry — it unlocks A+ Content, Brand Store, and Sponsored Brands ads. Vine requires Brand Registry plus a $200/ASIN enrollment fee.` })

  const total = breakdown.reduce((sum, b) => sum + b.earned, 0)

  let grade: Results['grade']
  let gradeLabel: string
  if (total >= 85) { grade = 'A'; gradeLabel = 'Well Optimized' }
  else if (total >= 65) { grade = 'B'; gradeLabel = 'Good — Gaps Exist' }
  else if (total >= 40) { grade = 'C'; gradeLabel = 'Needs Work' }
  else { grade = 'D'; gradeLabel = 'Major Issues' }

  fixes.sort((a, b) => b.impact - a.impact)

  return { total, grade, gradeLabel, breakdown, fixes }
}

// ── Grade color helpers ──────────────────────────────────────────────────────

const gradeColors: Record<string, { ring: string; badge: string; score: string }> = {
  A: { ring: 'border-green-400',   badge: 'bg-green-100 text-green-800 border-green-200',   score: 'text-green-600' },
  B: { ring: 'border-amber-400',   badge: 'bg-amber-100 text-amber-800 border-amber-200',   score: 'text-amber-600' },
  C: { ring: 'border-orange-400',  badge: 'bg-orange-100 text-orange-800 border-orange-200', score: 'text-orange-700' },
  D: { ring: 'border-red-400',     badge: 'bg-red-100 text-red-700 border-red-200',          score: 'text-red-600' },
}

// ── Radio + Toggle helpers ───────────────────────────────────────────────────

function RadioGroup<T extends string>({
  label, sublabel, options, value, onChange,
}: {
  label: string
  sublabel?: string
  options: { value: T; label: string; sub?: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">{label}</label>
      {sublabel && <p className="text-muted text-xs mb-3">{sublabel}</p>}
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-4 p-3.5 rounded-lg border-2 text-left transition-all duration-150 ${
              value === opt.value ? 'border-accent bg-accentLight' : 'border-border bg-surfaceAlt hover:border-accent/30'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              value === opt.value ? 'border-accent bg-accent' : 'border-muted/30'
            }`}>
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className={`text-xs font-bold tracking-widest uppercase ${value === opt.value ? 'text-accent' : 'text-ink'}`}>
                {opt.label}
              </p>
              {opt.sub && <p className="text-muted text-xs mt-0.5">{opt.sub}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ earned, max }: { earned: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((earned / max) * 100)
  const color = pct === 100 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-ink w-12 text-right">{earned}/{max}</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const defaultInputs: Inputs = {
  titleLength:     '',
  bulletCount:     '',
  bulletQuality:   'mixed',
  imageCount:      '',
  hasVideo:        'no',
  hasAPlus:        'no',
  hasBrandStore:   'no',
  brandRegistry:   'no',
  backendKeywords: 'unknown',
}

export default function ListingGraderPage() {
  const [inp, setInp] = useState<Inputs>(defaultInputs)
  const [results, setResults] = useState<Results | null>(null)

  function set<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    setInp(prev => ({ ...prev, [key]: val }))
    setResults(null)
  }

  const isValid = (parseInt(inp.titleLength) > 0) &&
                  (parseInt(inp.bulletCount) > 0) &&
                  (parseInt(inp.imageCount) > 0)

  function grade() {
    if (!isValid) return
    setResults(scoreInputs(inp))
  }

  const gc = results ? gradeColors[results.grade] : null

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
            <div className="inline-flex items-center gap-2 bg-surface border border-amber-200 text-amber-700 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase">Free Tool · Amazon Growth</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              Listing<br />
              <span className="gradient-text-accent">Quality Grader</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Answer 9 questions about your listing. Get an instant score out of 100 and a ranked list of exactly what to fix — ordered by conversion impact.
            </p>
          </div>

          {/* Form */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-8 flex flex-col gap-8">

            {/* Title length */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                Title character count
              </label>
              <p className="text-muted text-xs mb-3">Count your full product title including spaces</p>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 142"
                value={inp.titleLength}
                onChange={e => set('titleLength', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <p className="text-muted/50 text-xs mt-1.5">
                {parseInt(inp.titleLength) >= 150
                  ? '✓ Strong — 150+ characters'
                  : parseInt(inp.titleLength) >= 80
                  ? `${150 - parseInt(inp.titleLength)} characters short of the 150+ target`
                  : parseInt(inp.titleLength) > 0
                  ? 'Too short — significant keyword indexing gap'
                  : ''}
              </p>
            </div>

            {/* Bullet count */}
            <RadioGroup
              label="Number of bullet points"
              sublabel="How many bullet points does your listing currently have?"
              value={inp.bulletCount as any}
              onChange={v => set('bulletCount', v)}
              options={[
                { value: '5', label: '5', sub: 'Maximum — all slots used' },
                { value: '4', label: '4', sub: 'One slot unused' },
                { value: '3', label: '3', sub: 'Two slots unused' },
                { value: '1', label: '1 or 2', sub: 'Most slots unused' },
              ]}
            />

            {/* Bullet quality */}
            <RadioGroup
              label="Bullet point quality"
              sublabel="How would you describe the depth of your bullets?"
              value={inp.bulletQuality}
              onChange={v => set('bulletQuality', v)}
              options={[
                { value: 'detailed', label: 'All detailed', sub: 'Each bullet leads with a benefit and backs it with a feature (2+ lines)' },
                { value: 'mixed',    label: 'Mixed',        sub: 'Some are detailed, some are short or generic' },
                { value: 'short',    label: 'Short / generic', sub: 'Most are one-liners or feature-only statements' },
              ]}
            />

            {/* Image count */}
            <RadioGroup
              label="Number of images"
              sublabel="How many images are in your listing gallery? (main image + secondaries — Amazon allows up to 9)"
              value={inp.imageCount as any}
              onChange={v => set('imageCount', v)}
              options={[
                { value: '9', label: '9',  sub: 'Full gallery — all slots used' },
                { value: '7', label: '7–8', sub: '1–2 slots unused' },
                { value: '5', label: '5–6', sub: '3–4 slots unused' },
                { value: '3', label: '4 or fewer', sub: 'Multiple gallery slots unused' },
              ]}
            />

            {/* Video */}
            <RadioGroup
              label="Product video"
              sublabel="Does your listing have a product video uploaded?"
              value={inp.hasVideo}
              onChange={v => set('hasVideo', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Video is live on the listing' },
                { value: 'no',  label: 'No',  sub: 'No video uploaded' },
              ]}
            />

            {/* A+ Content */}
            <RadioGroup
              label="A+ Content"
              sublabel="Does your listing have A+ Content (enhanced brand content below the fold)?"
              value={inp.hasAPlus}
              onChange={v => set('hasAPlus', v as ThreeOption)}
              options={[
                { value: 'yes',     label: 'Yes',         sub: 'A+ Content is live on this listing' },
                { value: 'no',      label: 'No',          sub: 'No A+ Content' },
                { value: 'unknown', label: "Don't know",  sub: "I'm not sure what A+ Content is" },
              ]}
            />

            {/* Brand Store */}
            <RadioGroup
              label="Brand Store"
              sublabel="Does your brand have an Amazon Brand Store live?"
              value={inp.hasBrandStore}
              onChange={v => set('hasBrandStore', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Brand Store is published and linked' },
                { value: 'no',  label: 'No',  sub: 'No Brand Store' },
              ]}
            />

            {/* Brand Registry */}
            <RadioGroup
              label="Brand Registry"
              sublabel="Is your brand enrolled in Amazon Brand Registry?"
              value={inp.brandRegistry}
              onChange={v => set('brandRegistry', v)}
              options={[
                { value: 'yes', label: 'Yes, enrolled',     sub: 'Trademark verified and Brand Registry active' },
                { value: 'no',  label: 'No / not enrolled', sub: 'Not enrolled or trademark not yet registered' },
              ]}
            />

            {/* Backend keywords */}
            <RadioGroup
              label="Backend search terms"
              sublabel="How populated are your Seller Central backend search term fields?"
              value={inp.backendKeywords}
              onChange={v => set('backendKeywords', v as BackendKeywords)}
              options={[
                { value: 'full',    label: 'Fully populated',    sub: 'All 250 bytes used with relevant keywords' },
                { value: 'partial', label: 'Partially filled',   sub: 'Some terms entered but fields not maxed out' },
                { value: 'no',      label: 'Empty',              sub: 'Backend fields not filled in' },
                { value: 'unknown', label: "Don't know",         sub: "I've never checked backend search terms" },
              ]}
            />

            {/* Submit */}
            <button
              onClick={grade}
              disabled={!isValid}
              className="group flex items-center justify-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-5 rounded-full hover:bg-accentDark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
            >
              Grade My Listing
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>

          </div>

          {/* Results */}
          {results && gc && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-500">

              {/* Score hero */}
              <div className={`bg-surface border-2 ${gc.ring} rounded-lg p-8 text-center`}>
                <p className="text-muted text-xs tracking-widest uppercase mb-3">Your Listing Score</p>
                <p className={`font-display font-bold text-8xl leading-none mb-3 ${gc.score}`}>
                  {results.total}
                  <span className="text-3xl text-muted/40">/100</span>
                </p>
                <span className={`inline-flex items-center text-sm font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border ${gc.badge}`}>
                  Grade {results.grade} — {results.gradeLabel}
                </span>
                {results.grade === 'A' && (
                  <p className="text-muted text-sm mt-4 max-w-sm mx-auto">
                    Your listing is well optimized. A few marginal gains may still be available — check the breakdown below.
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-surfaceAlt">
                  <p className="text-xs font-bold tracking-widest uppercase text-ink">Score Breakdown</p>
                </div>
                <div className="divide-y divide-border">
                  {results.breakdown.map((b, i) => (
                    <div key={i} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <p className="text-xs font-semibold text-ink">{b.factor}</p>
                            <p className="text-xs text-muted flex-shrink-0">{b.label}</p>
                          </div>
                          <ScoreBar earned={b.earned} max={b.max} />
                        </div>
                      </div>
                      {b.tip && (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2 mt-3 leading-relaxed">
                          {b.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fix list */}
              {results.fixes.length > 0 && (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-surfaceAlt">
                    <p className="text-xs font-bold tracking-widest uppercase text-ink">Fix List — Ranked by Impact</p>
                    <p className="text-xs text-muted mt-0.5">Implement these top-to-bottom for maximum conversion lift.</p>
                  </div>
                  <div className="divide-y divide-border">
                    {results.fixes.map((fix, i) => (
                      <div key={i} className="px-6 py-4 flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accentLight border border-accent/20 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-accent">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-ink leading-relaxed">{fix.text}</p>
                        </div>
                        <span className="flex-shrink-0 text-[10px] font-bold text-accent bg-accentLight border border-accent/15 px-2 py-1 rounded-full tracking-wide">
                          +{fix.impact} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <p className="font-display font-semibold text-xl text-ink uppercase mb-2">
                  Want Us to Implement These Fixes?
                </p>
                <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6">
                  Book a free listing audit. We'll pull your live data, walk through every gap,
                  and give you a custom action plan — before you commit to anything.
                </p>
                <a
                  href="https://calendly.com/welcome-prettygoodstuff/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-accent text-white font-semibold text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-accentDark transition-colors shadow-lg shadow-accent/20"
                >
                  Book a Free Listing Audit →
                </a>
                <p className="text-muted/40 text-xs mt-4">No commitment. We review your listing live on the call.</p>
              </div>

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
