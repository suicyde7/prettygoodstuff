'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sendLead } from '@/lib/sendLead'

// ── Types ─────────────────────────────────────────────────────────────────────

type BackendKeywords = 'full' | 'partial' | 'no' | 'unknown'
type ThreeOption     = 'yes' | 'no' | 'unknown'
type LaunchAge       = 'new' | '1-6mo' | '6-12mo' | '1yr+'

interface Inputs {
  title:           string
  bullets:         string
  imageCount:      string
  hasVideo:        'yes' | 'no'
  hasAPlus:        ThreeOption
  hasBrandStore:   'yes' | 'no'
  brandRegistry:   'yes' | 'no'
  backendKeywords: BackendKeywords
  launchAge:       LaunchAge
}

interface ScoreBreakdown {
  factor: string
  earned: number
  max:    number
  label:  string
  tip:    string | null
}

interface Results {
  total:      number
  grade:      'A' | 'B' | 'C' | 'D'
  gradeLabel: string
  breakdown:  ScoreBreakdown[]
  fixes:      { impact: number; text: string }[]
  titleLen:   number
  bulletArr:  string[]
}

// ── Bullet parsing ─────────────────────────────────────────────────────────────

function parseBullets(raw: string): string[] {
  return raw
    .split(/\n/)
    .map(l => l.replace(/^[\s•\-\*·▪►▶→]+/, '').trim())
    .filter(l => l.length > 0)
}

function assessBulletDepth(bullets: string[]): 'short' | 'mixed' | 'detailed' {
  if (bullets.length === 0) return 'short'
  const avg = bullets.reduce((s, b) => s + b.split(/\s+/).length, 0) / bullets.length
  if (avg >= 15) return 'detailed'
  if (avg >= 8)  return 'mixed'
  return 'short'
}

// ── Scoring ────────────────────────────────────────────────────────────────────

function scoreInputs(inp: Inputs): Results {
  const breakdown: ScoreBreakdown[] = []
  const fixes: { impact: number; text: string }[] = []

  // Title
  const titleLen = inp.title.trim().length
  const titlePts = titleLen >= 150 ? 15 : titleLen >= 80 ? 8 : 0
  const titleGap = 15 - titlePts
  breakdown.push({
    factor: 'Title Length', earned: titlePts, max: 15,
    label: titleLen >= 150 ? `Strong — ${titleLen} chars` : titleLen >= 80 ? `Moderate — ${titleLen} chars` : titleLen > 0 ? `Thin — ${titleLen} chars` : 'Not provided',
    tip: titleLen > 0 && titleLen < 150 ? `Your title is ${titleLen} characters. Aim for 150+ — you have room for ${150 - titleLen} more.` : titleLen === 0 ? 'No title provided — score assumes 0.' : null,
  })
  if (titleGap > 0 && titleLen > 0) fixes.push({ impact: titleGap, text: `Expand your title to 150+ characters — ${150 - titleLen} more characters of keyword indexing available.` })

  // Bullets count
  const bulletArr    = parseBullets(inp.bullets)
  const bulletCount  = bulletArr.length
  const depth        = assessBulletDepth(bulletArr)
  const bulletCountPts = bulletCount >= 5 ? 10 : bulletCount === 4 ? 7 : bulletCount === 3 ? 4 : 0
  const bulletCountGap = 10 - bulletCountPts
  breakdown.push({
    factor: 'Bullet Point Count', earned: bulletCountPts, max: 10,
    label: bulletCount === 0 ? 'Not provided' : `${bulletCount} bullet${bulletCount !== 1 ? 's' : ''}${bulletCount >= 5 ? ' (max)' : ''}`,
    tip: bulletCount > 0 && bulletCount < 5 ? `You have ${bulletCount} bullet${bulletCount !== 1 ? 's' : ''}. Use all 5 — each is a keyword and conversion opportunity.` : null,
  })
  if (bulletCountGap > 0 && bulletCount > 0) fixes.push({ impact: bulletCountGap, text: `Add ${5 - bulletCount} more bullet point${5 - bulletCount > 1 ? 's' : ''} — unused conversion real estate.` })

  // Bullet depth
  const depthPts = bulletCount > 0 ? ({ short: 0, mixed: 5, detailed: 10 })[depth] : 0
  const depthGap = 10 - depthPts
  const avgWords = bulletCount > 0 ? Math.round(bulletArr.reduce((s, b) => s + b.split(/\s+/).length, 0) / bulletCount) : 0
  breakdown.push({
    factor: 'Bullet Point Depth', earned: depthPts, max: 10,
    label: bulletCount === 0 ? 'Not provided' : depth === 'detailed' ? `Detailed (avg ${avgWords} words)` : depth === 'mixed' ? `Mixed (avg ${avgWords} words)` : `Short (avg ${avgWords} words)`,
    tip: bulletCount > 0 && depth !== 'detailed' ? `Bullets average ${avgWords} words. Aim for 15+ — lead with a benefit, back it with a feature.` : null,
  })
  if (depthGap > 0 && bulletCount > 0) fixes.push({ impact: depthGap, text: 'Rewrite bullets to lead with customer benefits. Each should be 15+ words — one clear benefit claim per bullet.' })

  // Images
  const images   = parseInt(inp.imageCount) || 0
  const imagePts = images >= 9 ? 15 : images >= 7 ? 12 : images >= 5 ? 9 : 5
  const imageGap = 15 - imagePts
  breakdown.push({
    factor: 'Image Count', earned: imagePts, max: 15,
    label: images >= 9 ? '9 images (full gallery)' : `${images} image${images !== 1 ? 's' : ''}`,
    tip: images < 9 ? `You have ${images} image${images !== 1 ? 's' : ''}. Amazon allows up to 9 — fill every slot.` : null,
  })
  if (imageGap > 0) fixes.push({ impact: imageGap, text: `Add ${9 - images} more image${9 - images > 1 ? 's' : ''} — lifestyle shots and infographics convert best.` })

  // Video
  const videoPts = inp.hasVideo === 'yes' ? 10 : 0
  breakdown.push({
    factor: 'Product Video', earned: videoPts, max: 10,
    label: inp.hasVideo === 'yes' ? 'Video present' : 'No video',
    tip: inp.hasVideo === 'no' ? 'Listings with video typically see 10–30% higher conversion. Even a 30-second demo makes a measurable difference.' : null,
  })
  if (videoPts === 0) fixes.push({ impact: 10, text: 'Add a product video — listings with video typically see 10–30% higher conversion.' })

  // A+
  const aPlusPts = inp.hasAPlus === 'yes' ? 20 : 0
  const aPlusGap = 20 - aPlusPts
  breakdown.push({
    factor: 'A+ Content', earned: aPlusPts, max: 20,
    label: inp.hasAPlus === 'yes' ? 'A+ Content live' : inp.hasAPlus === 'unknown' ? "Don't know" : 'No A+ Content',
    tip: inp.hasAPlus !== 'yes' ? 'A+ Content is the single highest-impact listing upgrade. Amazon reports 3–10% conversion lift. Requires Brand Registry.' : null,
  })
  if (aPlusGap > 0) fixes.push({ impact: aPlusGap, text: "Build A+ Content — the highest single-impact upgrade available (Amazon reports 3–10% conversion improvement)." })

  // Brand Store
  const brandStorePts = inp.hasBrandStore === 'yes' ? 5 : 0
  breakdown.push({
    factor: 'Brand Store', earned: brandStorePts, max: 5,
    label: inp.hasBrandStore === 'yes' ? 'Brand Store live' : 'No Brand Store',
    tip: inp.hasBrandStore === 'no' ? 'A Brand Store gives you a dedicated brand page with no competitor ads, required for Sponsored Brands Store Spotlight ads.' : null,
  })
  if (brandStorePts === 0) fixes.push({ impact: 5, text: 'Create a Brand Store — your dedicated Amazon brand page with no competitor ads.' })

  // Backend keywords
  const backendPts = ({ full: 10, partial: 5, no: 0, unknown: 0 })[inp.backendKeywords]
  const backendGap = 10 - backendPts
  breakdown.push({
    factor: 'Backend Search Terms', earned: backendPts, max: 10,
    label: inp.backendKeywords === 'full' ? 'Fully populated' : inp.backendKeywords === 'partial' ? 'Partially filled' : inp.backendKeywords === 'no' ? 'Empty' : "Don't know",
    tip: inp.backendKeywords !== 'full' ? 'Backend keywords are indexed by Amazon but invisible to shoppers. A full 250-byte field means more search placements.' : null,
  })
  if (backendGap > 0) fixes.push({ impact: backendGap, text: 'Fill backend search terms to the full 250 bytes with synonyms, misspellings, and long-tail phrases.' })

  // Brand Registry
  const brandRegPts = inp.brandRegistry === 'yes' ? 5 : 0
  breakdown.push({
    factor: 'Brand Registry', earned: brandRegPts, max: 5,
    label: inp.brandRegistry === 'yes' ? 'Enrolled' : 'Not enrolled',
    tip: inp.brandRegistry === 'no' ? 'Brand Registry unlocks A+ Content, Brand Store, and Sponsored Brands. Vine requires Brand Registry + $200/ASIN enrollment fee.' : null,
  })
  if (brandRegPts === 0) fixes.push({ impact: 5, text: 'Enroll in Brand Registry — unlocks A+ Content, Brand Store, and Sponsored Brands ads.' })

  const total = breakdown.reduce((s, b) => s + b.earned, 0)
  const grade: Results['grade'] = total >= 85 ? 'A' : total >= 65 ? 'B' : total >= 40 ? 'C' : 'D'
  const gradeLabel = total >= 85 ? 'Well Optimized' : total >= 65 ? 'Good — Gaps Exist' : total >= 40 ? 'Needs Work' : 'Major Issues'
  fixes.sort((a, b) => b.impact - a.impact)
  return { total, grade, gradeLabel, breakdown, fixes, titleLen, bulletArr }
}

// ── Grade colors ───────────────────────────────────────────────────────────────

const gradeColors: Record<string, { ring: string; badge: string; score: string }> = {
  A: { ring: 'border-green-400',  badge: 'bg-green-100 text-green-800 border-green-200',    score: 'text-green-600' },
  B: { ring: 'border-amber-400',  badge: 'bg-amber-100 text-amber-800 border-amber-200',    score: 'text-amber-600' },
  C: { ring: 'border-orange-400', badge: 'bg-orange-100 text-orange-800 border-orange-200', score: 'text-orange-700' },
  D: { ring: 'border-red-400',    badge: 'bg-red-100 text-red-700 border-red-200',           score: 'text-red-600' },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

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

function ScoreBar({ earned, max }: { earned: number; max: number }) {
  const pct   = max === 0 ? 0 : Math.round((earned / max) * 100)
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

// ── Defaults ───────────────────────────────────────────────────────────────────

const defaultInputs: Inputs = {
  title: '', bullets: '', imageCount: '',
  hasVideo: 'no', hasAPlus: 'no', hasBrandStore: 'no',
  brandRegistry: 'no', backendKeywords: 'unknown', launchAge: 'new',
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ListingGraderPage() {
  const [inp, setInp]     = useState<Inputs>(defaultInputs)
  const [results, setResults] = useState<Results | null>(null)
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')

  function set<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    setInp(prev => ({ ...prev, [key]: val }))
    setResults(null)
  }

  const titleLen  = inp.title.trim().length
  const isValid   = (titleLen > 0 || inp.bullets.trim().length > 0) && inp.imageCount !== '' && /\S+@\S+\.\S+/.test(email)

  function grade() {
    if (!isValid) return
    const r = scoreInputs(inp)
    setResults(r)
    sendLead({
      tool:            'Listing Grader',
      name:            name.trim(),
      email:           email.trim(),
      score:           r.total,
      grade:           r.grade,
      gradeLabel:      r.gradeLabel,
      titleLength:     r.titleLen,
      bulletCount:     r.bulletArr.length,
      imageCount:      inp.imageCount,
      hasVideo:        inp.hasVideo,
      hasAPlus:        inp.hasAPlus,
      hasBrandStore:   inp.hasBrandStore,
      brandRegistry:   inp.brandRegistry,
      backendKeywords: inp.backendKeywords,
      launchAge:       inp.launchAge,
      topFix:          r.fixes[0]?.text ?? '',
      fix2:            r.fixes[1]?.text ?? '',
      fix3:            r.fixes[2]?.text ?? '',
    })
  }

  const gc = results ? gradeColors[results.grade] : null

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
            <div className="inline-flex items-center gap-2 bg-surface border border-amber-200 text-amber-700 px-4 py-2 rounded-full mb-8 shadow-sm">
              <span className="text-[10px] font-bold tracking-widest uppercase">Free Tool · Amazon Growth</span>
            </div>
            <h1 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none mb-4">
              Listing<br /><span className="gradient-text-accent">Quality Grader</span>
            </h1>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Paste your title and bullets. Answer a few quick questions. Get an instant score out of 100 and a ranked fix list — ordered by conversion impact.
            </p>
          </div>

          {/* Form */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-8 flex flex-col gap-8">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Paste your product title</label>
              <p className="text-muted text-xs mb-3">Copy it directly from your Amazon listing</p>
              <textarea rows={3}
                placeholder="e.g. Stainless Steel Insulated Water Bottle 32oz — Leak Proof, BPA Free, Wide Mouth Lid, Keeps Drinks Cold 24 Hours Hot 12 Hours — for Gym, Hiking, Office"
                value={inp.title} onChange={e => set('title', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors resize-none leading-relaxed" />
            </div>

            {/* Bullets */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Paste your bullet points</label>
              <p className="text-muted text-xs mb-3">Copy all bullets from your listing, one per line</p>
              <textarea rows={6}
                placeholder={`STAY HYDRATED ALL DAY — double-wall vacuum insulation keeps drinks cold 24 hours\nLEAK-PROOF GUARANTEED — patented lid seals completely\n...`}
                value={inp.bullets} onChange={e => set('bullets', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors resize-none leading-relaxed" />
            </div>

            {/* Images */}
            <RadioGroup label="Number of images" sublabel="How many images in your gallery? (Amazon allows up to 9)"
              value={inp.imageCount as any} onChange={v => set('imageCount', v)}
              options={[
                { value: '9', label: '9',          sub: 'Full gallery — all slots used' },
                { value: '7', label: '7–8',        sub: '1–2 slots unused' },
                { value: '5', label: '5–6',        sub: '3–4 slots unused' },
                { value: '3', label: '4 or fewer', sub: 'Multiple gallery slots unused' },
              ]} />

            {/* Video */}
            <RadioGroup label="Product video" sublabel="Does your listing have a product video?"
              value={inp.hasVideo} onChange={v => set('hasVideo', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Video is live on the listing' },
                { value: 'no',  label: 'No',  sub: 'No video uploaded' },
              ]} />

            {/* A+ Content */}
            <RadioGroup label="A+ Content" sublabel="Enhanced brand content below the fold on your listing?"
              value={inp.hasAPlus} onChange={v => set('hasAPlus', v as ThreeOption)}
              options={[
                { value: 'yes',     label: 'Yes',        sub: 'A+ Content is live' },
                { value: 'no',      label: 'No',         sub: 'No A+ Content' },
                { value: 'unknown', label: "Don't know", sub: "I'm not sure what A+ Content is" },
              ]} />

            {/* Brand Store */}
            <RadioGroup label="Brand Store" sublabel="Does your brand have an Amazon Brand Store?"
              value={inp.hasBrandStore} onChange={v => set('hasBrandStore', v)}
              options={[
                { value: 'yes', label: 'Yes', sub: 'Brand Store is published' },
                { value: 'no',  label: 'No',  sub: 'No Brand Store' },
              ]} />

            {/* Brand Registry */}
            <RadioGroup label="Brand Registry" sublabel="Is your brand enrolled in Amazon Brand Registry?"
              value={inp.brandRegistry} onChange={v => set('brandRegistry', v)}
              options={[
                { value: 'yes', label: 'Yes, enrolled',     sub: 'Trademark verified, Brand Registry active' },
                { value: 'no',  label: 'No / not enrolled', sub: 'Not enrolled or trademark not yet registered' },
              ]} />

            {/* Backend keywords */}
            <RadioGroup label="Backend search terms" sublabel="How populated are your Seller Central backend keyword fields?"
              value={inp.backendKeywords} onChange={v => set('backendKeywords', v as BackendKeywords)}
              options={[
                { value: 'full',    label: 'Fully populated',  sub: 'All 250 bytes used' },
                { value: 'partial', label: 'Partially filled', sub: 'Some terms but not maxed out' },
                { value: 'no',      label: 'Empty',            sub: 'Backend fields not filled in' },
                { value: 'unknown', label: "Don't know",       sub: "I've never checked" },
              ]} />

            {/* Qualifying question */}
            <RadioGroup label="How long has this listing been live?" sublabel="Helps us give you the most relevant recommendations"
              value={inp.launchAge} onChange={v => set('launchAge', v as LaunchAge)}
              options={[
                { value: 'new',    label: 'Just launched',    sub: 'Live for less than a month' },
                { value: '1-6mo',  label: '1–6 months',       sub: 'Still building traction' },
                { value: '6-12mo', label: '6–12 months',      sub: 'Established but could be stronger' },
                { value: '1yr+',   label: 'Over a year',      sub: 'Long-running listing' },
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
            <button onClick={grade} disabled={!isValid}
              className="group flex items-center justify-center gap-3 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-accent/30 ring-2 ring-accent/20">
              Grade My Listing
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>

          {/* Full results */}
          {results && gc && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-500">

              {/* Score header */}
              <div className="bg-surface border border-border rounded-lg p-8 flex flex-col items-center text-center gap-4">
                <p className="text-muted text-xs tracking-widest uppercase">Your Listing Grade</p>
                <div className={`w-24 h-24 rounded-full border-4 ${gc.ring} flex items-center justify-center`}>
                  <span className={`font-display font-bold text-5xl leading-none ${gc.score}`}>{results.grade}</span>
                </div>
                <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${gc.badge}`}>{results.gradeLabel}</span>
                <p className="text-muted text-xs">{results.total} / 100 points</p>
              </div>

              {/* Score breakdown */}
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-surfaceAlt">
                  <p className="font-display font-semibold text-lg text-ink uppercase">Score Breakdown</p>
                  <p className="text-xs text-muted mt-1">How each factor contributed to your grade.</p>
                </div>
                <div className="divide-y divide-border">
                  {results.breakdown.map((b, i) => (
                    <div key={i} className="px-6 py-4">
                      <div className="flex items-center gap-4 mb-1">
                        <p className="text-xs font-semibold text-ink flex-1">{b.factor}</p>
                        <ScoreBar earned={b.earned} max={b.max} />
                      </div>
                      <p className="text-[11px] text-muted">{b.label}</p>
                      {b.tip && <p className="text-[11px] text-accent/80 mt-1 leading-relaxed">{b.tip}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fix list */}
              {results.fixes.length > 0 && (
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-surfaceAlt">
                    <p className="font-display font-semibold text-lg text-ink uppercase">Priority Fix List</p>
                    <p className="text-xs text-muted mt-1">Ordered by conversion impact — fix the top ones first.</p>
                  </div>
                  <div className="divide-y divide-border">
                    {results.fixes.map((fix, i) => (
                      <div key={i} className="px-6 py-4 flex items-start gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accentLight border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">{i + 1}</span>
                        <p className="text-xs text-muted leading-relaxed flex-1">{fix.text}</p>
                        <span className="flex-shrink-0 text-[10px] font-bold text-accent/70">+{fix.impact}pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <p className="font-display font-semibold text-xl text-ink uppercase mb-2">Want Us to Implement These Fixes?</p>
                <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto mb-6">
                  In a free 30-minute call we'll review your listing live and build a prioritised action plan — before you commit to anything.
                </p>
                <a href="https://calendly.com/welcome-prettygoodstuff/30min" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-accent text-white font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-full hover:bg-accentDark transition-colors shadow-xl shadow-accent/30 ring-2 ring-accent/20">
                  Book a Free Listing Audit →
                </a>
                <p className="text-muted/40 text-xs mt-4">No commitment. We review your listing live on the call.</p>
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
