const ITEMS = [
  'Amazon Store Launch',
  'China FBA Prep',
  'PPC Management',
  'Brand Registry',
  'A+ Content',
  'Sponsored Products',
  'SEO Optimization',
  'Account Health',
  'FBA Compliance',
  'Inventory Management',
  'Brand Store Design',
  'Trademark Guidance',
]

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="bg-ink border-y border-border overflow-hidden py-4 select-none">
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted/50 px-8">
              {item}
            </span>
            <span className="text-accent/40 text-xs">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
