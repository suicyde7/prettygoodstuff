'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sendLead } from '@/lib/sendLead'

// ── Types ─────────────────────────────────────────────────────────────────────

type BackendKeywords = 'full' | 'partial' | 'no' | 'unknown'
type ThreeOption     = 'yes' | 'no' | 'unknown'

interface Inputs {
  title:           string   // raw pasted title
  bullets:         string   // raw pasted bullets (one per line)
  imageCount:      string   // radio
  hasVideo:        'yes' | 'no'
  hasAPlus:        ThreeOption
  hasBrandStore:   'yes' | 'no'
  brandRegistry:   'yes' | 'no'
  backendKeywords: BackendKeywords
  listingUrl:      string   // lead data only
  name:            string
  email:           string
}

interface ScoreBreakdown {
  factor:  string
  earned:  number
  max:     number
  label:   string
  tip:     string | null
}

interface Results {
  total:     number
  grade:     'A' | 'B' | 'C' | 'D'
  gradeLabel: string
  breakdown: ScoreBreakdown[]
  fixes:     { impact: number; text: string }[]
  titleLen:  number
  bulletArr: string[]
  name:      string
  email:     string
  listingUrl: string
}

// ── Bullet parsing ────────────────────────────────────────────────────────────
// Splits pasted text into individual bullets, stripping common markers

function parseBullets(raw: string): string[] {
  return raw
    .split(/\n/)
    .map(l => l.replace(/^[\s•\-\*·▪►▶→]+/, '').trim())
    .filter(l => l.length > 0)
}

// Assess bullet depth by average word count per bullet
// Short = avg <8 words, detailed = avg ≥15 words, mixed in between
function assessBulletDepth(bullets: string[]): 'short' | 'mixed' | 'detailed' {
  if (bullets.length === 0) return 'short'
  const avgWords = bullets.reduce((sum, b) => sum + b.split(/\s+/).length, 0) / bullets.length
  if (avgWords >= 15) return 'detailed'
  if (avgWords >= 8)  return 'mixed'
  return 'short'
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreInputs(inp: Inputs): Results {
  const breakdown: ScoreBreakdown[] = []
  const fixes: { impact: number; text: string }[] = []

  // ── Title ──
  const titleLen = inp.title.trim().length
  let titlePts = 0
  if (titleLen >= 150)     titlePts = 15
  else if (titleLen >= 80) titlePts = 8
  const titleGap = 15 - titlePts
  breakdown.push({
    factor: 'Title Length',
    earned: titlePts, max: 15,
    label:  titleLen >= 150 ? `Strong — ${titleLen} characters`
          : titleLen >= 80  ? `Moderate — ${titleLen} characters`
          : titleLen > 0    ? `Thin — ${titleLen} characters`
          : 'Not provided',
    tip: titleLen > 0 && titleLen < 150
      ? `Your title is ${titleLen} characters. Aim for 150+ to maximize keyword indexing — you have room for ${150 - titleLen} more characters.`
      : titleLen === 0 ? 'Paste your title above to score this factor.' : null,
  })
  if (titleGap > 0 && titleLen > 0)
    fixes.push({ impact: titleGap, text: `Expand your title to 150+ characters — ${150 - titleLen} more characters of keyword indexing available.` })

  // ── Bullets ──
  const bulletArr  = parseBullets(inp.bullets)
  const bulletCount = bulletArr.length
  const depth       = assessBulletDepth(bulletArr)

  let bulletCountPts = 0
  if (bulletCount >= 5)      bulletCountPts = 10
  else if (bulletCount === 4) bulletCountPts = 7
  else if (bulletCount === 3) bulletCountPts = 4
  const bulletCountGap = 10 - bulletCountPts
  breakdown.push({
    factor: 'Bullet Point Count',
    earned: bulletCountPts, max: 10,
    label:  bulletCount === 0 ? 'Not provided'
          : `${bulletCount} bullet${bulletCount !== 1 ? 's' : ''}${bulletCount >= 5 ? ' (max)' : ''}`,
    tip: bulletCount > 0 && bulletCount < 5
      ? `You have ${bulletCount} bullet${bulletCount !== 1 ? 's' : ''}. Use all 5 — each slot is a keyword and conversion opportunity.`
      : bulletCount === 0 ? 'Paste your bullet points above to score this factor.' : null,
  })
  if (bulletCountGap > 0 && bulletCount > 0)
    fixes.push({ impact: bulletCountGap, text: `Add ${5 - bulletCount} more bullet point${5 - bulletCount > 1 ? 's' : ''} — you have unused conversion real estate.` })

  const depthMap = { short: 0, mixed: 5, detailed: 10 }
  const depthPts = bulletCount > 0 ? depthMap[depth] : 0
  const depthGap = 10 - depthPts
  const avgWords = bulletCount > 0
    ? Math.round(bulletArr.reduce((s, b) => s + b.split(/\s+/).length, 0) / bulletCount)
    : 0
  breakdown.push({
    factor: 'Bullet Point Depth',
    earned: depthPts, max: 10,
    label:  bulletCount === 0 ? 'Not provided'
          : depth === 'detailed' ? `Detailed (avg ${avgWords} words/bullet)`
          : depth === 'mixed'    ? `Mixed (avg ${avgWords} words/bullet)`
          : `Short (avg ${avgWords} words/bullet)`,
    tip: bulletCount > 0 && depth !== 'detailed'
      ? `Your bullets average ${avgWords} words each. Aim for 15+ words — lead with a customer benefit, back it with a feature.`
      : null,
  })
  if (depthGap > 0 && bulletCount > 0)
    fixes.push({ impact: depthGap, text: 'Rewrite bullets to lead with customer benefits, not product features. Each should be 15+ words — one clear benefit claim per bullet.' })

  // ── Images ──
  const images = parseInt(inp.imageCount) || 0
  let imagePts = 0
  if (images >= 9)      imagePts = 15
  else if (images >= 7) imagePts = 12
  else if (images >= 5) imagePts = 9
  else                  imagePts = 5
  const imageGap = 15 - imagePts
  breakdown.push({
    factor: 'Image Count',
    earned: imagePts, max: 15,
    label:  images >= 9 ? '9 images (full gallery)'
          : `${images} image${images !== 1 ? 's' : ''}`,
    tip: images < 9
      ? `You have ${images} image${images !== 1 ? 's' : ''}. Amazon allows up to 9 — fill every slot with lifestyle, infographic, size chart, and close-up shots.`
      : null,
  })
  if (imageGap > 0)
    fixes.push({ impact: imageGap, text: `Add ${9 - images} more image${9 - images > 1 ? 's' : ''} — Amazon allows 9 total. Lifestyle shots and infographics are the highest-converting additions.` })

  // ── Video ──
  const videoPts = inp.hasVideo === 'yes' ? 10 : 0
  breakdown.push({
    factor: 'Product Video',
    earned: videoPts, max: 10,
    label:  inp.hasVideo === 'yes' ? 'Video present' : 'No video',
    tip: inp.hasVideo === 'no'
      ? 'Listings with video typically see 10–30% higher conversion rates. Even a 30-second product demo makes a measurable difference.'
      : null,
  })
  if (videoPts === 0)
    fixes.push({ impact: 10, text: 'Add a product video. Listings with video typically see 10–30% higher conversion — one of the highest-leverage upgrades available.' })

  // ── A+ Content ──
  const aPlusPts = inp.hasAPlus === 'yes' ? 20 : 0
  const aPlusGap = 20 - aPlusPts
  breakdown.push({
    factor: 'A+ Content',
    earned: aPlusPts, max: 20,
    label:  inp.hasAPlus === 'yes' ? 'A+ Content live'
          : inp.hasAPlus === 'unknown' ? "Don't know"
          : 'No A+ Content',
    tip: inp.hasAPlus !== 'yes'
      ? 'A+ Content is the single highest-impact listing upgrade. Amazon reports 3–10% conversion lift. Requires Brand Registry.'
      : null,
  })
  if (aPlusGap > 0)
    fixes.push({ impact: aPlusGap, text: "Build A+ Content — it's the highest single-impact upgrade available and Amazon reports 3–10% conversion improvement." })

  // ── Brand Store ──
  const brandStorePts = inp.hasBrandStore === 'yes' ? 5 : 0
  breakdown.push({
    factor: 'Brand Store',
    earned: brandStorePts, max: 5,
    label:  inp.hasBrandStore === 'yes' ? 'Brand Store live' : 'No Brand Store',
    tip: inp.hasBrandStore === 'no'
      ? 'A Brand Store gives you a dedicated brand page on Amazon with no competitor ads on it, and is required for Sponsored Brands Store Spotlight ads.'
      : null,
  })
  if (brandStorePts === 0)
    fixes.push({ impact: 5, text: 'Create a Brand Store — your dedicated Amazon brand page has no competitor ads and is required for Sponsored Brands Store Spotlight ads.' })

  // ── Backend keywords ──
  const backendMap: Record<BackendKeywords, number> = { full: 10, partial: 5, no: 0, unknown: 0 }
  const backendPts = backendMap[inp.backendKeywords]
  const backendGap = 10 - backendPts
  breakdown.push({
    factor: 'Backend Search Terms',
    earned: backendPts, max: 10,
    label:  inp.backendKeywords === 'full'    ? 'Fully populated'
          : inp.backendKeywords === 'partial' ? 'Partially filled'
          : inp.backendKeywords === 'no'      ? 'Empty'
          : "Don't know",
    tip: inp.backendKeywords !== 'full'
      ? 'Backend keywords are invisible to shoppers but indexed by Amazon. A full 250-byte field means more search placements with zero listing clutter.'
      : null,
  })
  if (backendGap > 0)
    fixes.push({ impact: backendGap, text: 'Fill backend search terms to the full 250 bytes with synonyms, misspellings, and long-tail phrases not in your visible copy.' })

  // ── Brand Registry ──
  const brandRegPts = inp.brandRegistry === 'yes' ? 5 : 0
  breakdown.push({
    factor: 'Brand Registry',
    earned: brandRegPts, max: 5,
    label:  inp.brandRegistry === 'yes' ? 'Enrolled' : 'Not enrolled',
    tip: inp.brandRegistry === 'no'
      ? 'Brand Registry unlocks A+ Content, Brand Store, and Sponsored Brands. Amazon Vine is also gated behind Brand Registry (note: Vine enrollment costs $200/parent ASIN). Requires a registered trademark.'
      : null,
  })
  if (brandRegPts === 0)
    fixes.push({ impact: 5, text: 'Enroll in Brand Registry — it unlocks A+ Content, Brand Store, and Sponsored Brands ads. Vine requires Brand Registry plus a $200/ASIN enrollment fee.' })

  const total = breakdown.reduce((sum, b) => sum + b.earned, 0)

  let grade: Results['grade']
  let gradeLabel: string
  if (total >= 85)      { grade = 'A'; gradeLabel = 'Well Optimized' }
  else if (total >= 65) { grade = 'B'; gradeLabel = 'Good — Gaps Exist' }
  else if (total >= 40) { grade = 'C'; gradeLabel = 'Needs Work' }
  else                  { grade = 'D'; gradeLabel = 'Major Issues' }

  fixes.sort((a, b) => b.impact - a.impact)

  return {
    total, grade, gradeLabel, breakdown, fixes,
    titleLen, bulletArr,
    name:       inp.name.trim(),
    email:      inp.email.trim(),
    listingUrl: inp.listingUrl.trim(),
  }
}

// ── Grade colors ──────────────────────────────────────────────────────────────

const gradeColors: Record<string, { ring: string; badge: string; score: string }> = {
  A: { ring: 'border-green-400',  badge: 'bg-green-100 text-green-800 border-green-200',    score: 'text-green-600' },
  B: { ring: 'border-amber-400',  badge: 'bg-amber-100 text-amber-800 border-amber-200',    score: 'text-amber-600' },
  C: { ring: 'border-orange-400', badge: 'bg-orange-100 text-orange-800 border-orange-200', score: 'text-orange-700' },
  D: { ring: 'border-red-400',    badge: 'bg-red-100 text-red-700 border-red-200',           score: 'text-red-600' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Live title counter ────────────────────────────────────────────────────────

function TitleCounter({ len }: { len: number }) {
  if (len === 0) return null
  if (len >= 150) return <p className="text-green-600 text-xs mt-1.5">✓ {len} characters — strong</p>
  if (len >= 80)  return <p className="text-amber-600 text-xs mt-1.5">{len} characters — {150 - len} more to reach the 150+ target</p>
  return <p className="text-red-500 text-xs mt-1.5">{len} characters — too short, significant keyword gap</p>
}

// ── Live bullet counter ───────────────────────────────────────────────────────

function BulletPreview({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null
  const depth = assessBulletDepth(bullets)
  const avg   = Math.round(bullets.reduce((s, b) => s + b.split(/\s+/).length, 0) / bullets.length)
  return (
    <div className="mt-2 bg-surfaceAlt border border-border rounded-md px-3 py-2.5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink font-semibold">{bullets.length} bullet{bullets.length !== 1 ? 's' : ''} detected</span>
        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${
          depth === 'detailed' ? 'bg-green-100 text-green-700 border-green-200' :
          depth === 'mixed'    ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                 'bg-red-100 text-red-600 border-red-200'
        }`}>
          {depth === 'detailed' ? 'Detailed' : depth === 'mixed' ? 'Mixed depth' : 'Too short'}
        </span>
      </div>
      <p className="text-muted text-xs">avg {avg} words/bullet · {depth === 'detailed' ? 'Solid depth' : depth === 'mixed' ? 'Some bullets need expanding' : 'Aim for 15+ words per bullet'}</p>
    </div>
  )
}

// ── Default state ─────────────────────────────────────────────────────────────

const defaultInputs: Inputs = {
  title:           '',
  bullets:         '',
  imageCount:      '',
  hasVideo:        'no',
  hasAPlus:        'no',
  hasBrandStore:   'no',
  brandRegistry:   'no',
  backendKeywords: 'unknown',
  listingUrl:      '',
  name:            '',
  email:           '',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ListingGraderPage() {
  const [inp, setInp]         = useState<Inputs>(defaultInputs)
  const [results, setResults] = useState<Results | null>(null)

  function set<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    setInp(prev => ({ ...prev, [key]: val }))
    setResults(null)
  }

  const titleLen  = inp.title.trim().length
  const bulletArr = useMemo(() => parseBullets(inp.bullets), [inp.bullets])

  const isValid = (titleLen > 0 || bulletArr.length > 0) && inp.imageCount !== ''

  function grade() {
    if (!isValid) return
    const res = scoreInputs(inp)
    setResults(res)
    sendLead({
      tool:       'Listing Grader',
      name:       inp.name.trim(),
      email:      inp.email.trim(),
      listingUrl: inp.listingUrl.trim(),
      score:      res.total,
      grade:      res.grade,
      gradeLabel: res.gradeLabel,
      topFix:     res.fixes[0]?.text ?? '',
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
              Paste your title and bullet points. Answer 6 questions. Get an instant score out of 100 and a ranked fix list — ordered by conversion impact.
            </p>
          </div>

          {/* Form */}
          <div className="bg-surface border border-border rounded-lg p-8 mb-8 flex flex-col gap-8">

            {/* Listing URL — lead capture */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                Amazon listing URL <span className="text-muted/40 normal-case font-normal tracking-normal">(optional)</span>
              </label>
              <p className="text-muted text-xs mb-3">We'll review it before your audit call so we come fully prepared</p>
              <input
                type="url"
                placeholder="https://www.amazon.com/dp/B0..."
                value={inp.listingUrl}
                onChange={e => set('listingUrl', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Title paste */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                Paste your product title
              </label>
              <p className="text-muted text-xs mb-3">Copy it directly from your Amazon listing page</p>
              <textarea
                rows={3}
                placeholder="e.g. Stainless Steel Insulated Water Bottle 32oz — Leak Proof, BPA Free, Wide Mouth Lid, Keeps Drinks Cold 24 Hours Hot 12 Hours — for Gym, Hiking, Office"
                value={inp.title}
                onChange={e => set('title', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors resize-none leading-relaxed"
              />
              <TitleCounter len={titleLen} />
            </div>

            {/* Bullets paste */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">
                Paste your bullet points
              </label>
              <p className="text-muted text-xs mb-3">Copy all bullet points from your listing, one per line</p>
              <textarea
                rows={7}
                placeholder={`STAY HYDRATED ALL DAY — double-wall vacuum insulation keeps drinks cold for 24 hours and hot for 12 hours, whether you're at the gym or in the office\nLEAK-PROOF GUARANTEED — our patented lid design seals completely, so you can toss it in your bag without worry\n...`}
                value={inp.bullets}
                onChange={e => set('bullets', e.target.value)}
                className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors resize-none leading-relaxed"
              />
              <BulletPreview bullets={bulletArr} />
            </div>

            {/* Image count */}
            <RadioGroup
              label="Number of images"
              sublabel="How many images are in your listing gallery? (main image + secondaries — Amazon allows up to 9)"
              value={inp.imageCount as any}
              onChange={v => set('imageCount', v)}
              options={[
                { value: '9', label: '9',          sub: 'Full gallery — all slots used' },
                { value: '7', label: '7–8',        sub: '1–2 slots unused' },
                { value: '5', label: '5–6',        sub: '3–4 slots unused' },
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
                { value: 'yes',     label: 'Yes',        sub: 'A+ Content is live on this listing' },
                { value: 'no',      label: 'No',         sub: 'No A+ Content' },
                { value: 'unknown', label: "Don't know", sub: "I'm not sure what A+ Content is" },
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
                { value: 'yes', label: 'Yes, enrolled',      sub: 'Trademark verified and Brand Registry active' },
                { value: 'no',  label: 'No / not enrolled',  sub: 'Not enrolled or trademark not yet registered' },
              ]}
            />

            {/* Backend keywords */}
            <RadioGroup
              label="Backend search terms"
              sublabel="How populated are your Seller Central backend search term fields?"
              value={inp.backendKeywords}
              onChange={v => set('backendKeywords', v as BackendKeywords)}
              options={[
                { value: 'full',    label: 'Fully populated',  sub: 'All 250 bytes used with relevant keywords' },
                { value: 'partial', label: 'Partially filled', sub: 'Some terms entered but fields not maxed out' },
                { value: 'no',      label: 'Empty',            sub: 'Backend fields not filled in' },
                { value: 'unknown', label: "Don't know",       sub: "I've never checked backend search terms" },
              ]}
            />

            {/* Contact */}
            <div className="border-t border-border pt-2">
              <p className="text-xs font-bold tracking-widest uppercase text-ink mb-1">Your details</p>
              <p className="text-muted text-xs mb-5">Optional — so we can reach out with your results before the call.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={inp.name}
                    onChange={e => set('name', e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-ink mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@yourbrand.com"
                    value={inp.email}
                    onChange={e => set('email', e.target.value)}
                    className="w-full bg-surfaceAlt border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </div>
            </div>

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

              {/* What we analyzed */}
              {(results.titleLen > 0 || results.bulletArr.length > 0) && (
                <div className="bg-surfaceAlt border border-border rounded-lg px-6 py-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-3">Analyzed from your listing</p>
                  <div className="flex flex-col gap-2">
                    {results.titleLen > 0 && (
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted/60 w-16 flex-shrink-0 mt-0.5">Title</span>
                        <span className="text-xs text-ink leading-relaxed line-clamp-2">{inp.title.trim()}</span>
                        <span className="ml-auto text-[10px] font-semibold text-muted flex-shrink-0">{results.titleLen} chars</span>
                      </div>
                    )}
                    {results.bulletArr.length > 0 && (
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted/60 w-16 flex-shrink-0 mt-0.5">Bullets</span>
                        <span className="text-xs text-ink">{results.bulletArr.length} bullet{results.bulletArr.length !== 1 ? 's' : ''} detected</span>
                      </div>
                    )}
                    {results.listingUrl && (
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted/60 w-16 flex-shrink-0 mt-0.5">URL</span>
                        <span className="text-xs text-accent truncate">{results.listingUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

              {/* Contact summary */}
              {(results.name || results.email) && (
                <div className="bg-surfaceAlt border border-border rounded-lg px-6 py-4">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-3">Your details on file</p>
                  <div className="flex flex-col gap-1.5">
                    {results.name && (
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted/60 w-12">Name</span>
                        <span className="text-xs text-ink">{results.name}</span>
                      </div>
                    )}
                    {results.email && (
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted/60 w-12">Email</span>
                        <span className="text-xs text-ink">{results.email}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted/40 text-xs mt-3">We'll reach out before your audit call.</p>
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
