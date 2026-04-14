import CountUp from './CountUp'

const stats = [
  { target: 63,   prefix: '',  suffix: '%',  decimals: 0, label: 'of product searches start on Amazon' },
  { target: 34,   prefix: '',  suffix: '%',  decimals: 0, label: 'average seller ACOS — target is under 15%' },
  { target: 1.50, prefix: '$', suffix: '+',  decimals: 2, label: 'average US prep center cost per unit' },
  { target: 30,   prefix: '',  suffix: '%+', decimals: 0, label: 'of FBA revenue goes to Amazon fees & ads' },
]

export default function TrustBar() {
  return (
    <section className="bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map(({ target, prefix, suffix, decimals, label }, i) => (
          <div key={label}
            className={`flex flex-col items-center text-center py-10 px-6 ${
              i < stats.length - 1 ? 'border-r border-border' : ''
            }`}>
            <CountUp
              target={target}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              duration={1800}
              className="font-display font-bold text-4xl gradient-text-accent mb-2"
            />
            <span className="text-muted text-xs tracking-widest uppercase font-medium leading-snug">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
