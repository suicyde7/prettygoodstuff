const stats = [
  { value: '63%', label: 'of product searches start on Amazon' },
  { value: '2,000+', label: 'new sellers enter your category daily' },
  { value: '34%', label: 'average seller ACOS — target is under 15%' },
  { value: '$1.50+', label: 'average US prep center cost per unit' },
  { value: '50%+', label: 'of FBA revenue consumed by fees' },
]

export default function TrustBar() {
  return (
    <section className="bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5">
        {stats.map(({ value, label, sub }, i) => (
          <div key={label}
            className={`flex flex-col items-center text-center py-10 px-6 ${
              i < stats.length - 1 ? 'border-r border-border' : ''
            }`}>
            <span className="font-display font-bold text-4xl gradient-text-accent mb-2">{value}</span>
            <span className="text-muted text-xs tracking-widest uppercase font-medium leading-snug">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
