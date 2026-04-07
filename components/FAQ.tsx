'use client'
import { useState } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const faqs = [
  {
    q: 'Do you have experience managing other brands\' Amazon accounts?',
    a: 'We\'re a startup consulting business — and we\'re upfront about that. What we bring is 3 years of real Amazon selling experience with our own brand, spending our own money on PPC and navigating every challenge the platform throws at you. We\'re taking on founding clients at below-market rates precisely because we\'re building our case studies now. What you get in return: founder-level attention, direct access, and more time spent on your account than any large agency would give you.',
  },
  {
    q: 'How long before I see results?',
    a: 'For Amazon Launch clients, your store is fully live and advertising within 90 days. Organic ranking builds over 60–90 days as sales velocity and reviews accumulate. For Growth Management clients, PPC improvements are visible within the first 30 days — most clients see meaningful ACOS reduction in the first 4–6 weeks. We set clear milestones at the start so you always know what to expect.',
  },
  {
    q: 'Is there a minimum contract? Am I locked in?',
    a: 'No lock-in contracts. The Amazon Launch package is a fixed 3-month project — after that, it\'s done. Growth Management is month-to-month; you can cancel with 30 days notice. China FBA Prep has no minimum order quantity. We believe the work should speak for itself.',
  },
  {
    q: 'What does the first month actually look like?',
    a: 'Week 1: strategy call + full account or market audit. Week 2–3: we build the foundation (account setup, keyword research, campaign structure or listing refresh). Week 4: first optimizations go live and we deliver a progress report. You\'ll have a clear view of exactly what\'s been done and what\'s coming next.',
  },
  {
    q: 'What if I\'m not happy with the results?',
    a: 'We won\'t hide behind a contract. If you\'re not seeing progress within the first 60 days and we can\'t identify a clear path forward together, we\'ll work with you to find a resolution — whether that\'s adjusting the strategy, revisiting scope, or parting ways professionally. Our reputation depends on your results.',
  },
  {
    q: 'How is this different from hiring a freelancer on Upwork or Fiverr?',
    a: 'Freelancers are task-based — they do what you tell them. We\'re strategy-led — we tell you what needs to happen and then execute it. You get a full consulting framework: keyword research, competitor analysis, PPC strategy, listing optimization, and reporting. Not just someone to follow instructions.',
  },
  {
    q: 'I\'m worried about giving someone access to my Amazon account. Is it safe?',
    a: 'Amazon Seller Central has a built-in user permissions system. You can add us as a secondary user with exactly the access we need — and revoke it at any time. You never need to share your main login credentials. We\'ll walk you through the setup on our first call.',
  },
  {
    q: 'Do I need a trademark or Brand Registry before we start?',
    a: 'Not to begin. We can set up your account, create listings, and run PPC without Brand Registry. However, Brand Registry unlocks A+ Content, Brand Store, Sponsored Brands ads, and Vine reviews — all of which significantly improve performance. We\'ll guide you through the trademark process (Amazon\'s IP Accelerator can get you enrolled in as little as 4–6 weeks) as part of the launch.',
  },
  {
    q: 'Can you handle both the Amazon launch AND sourcing from China?',
    a: 'Yes — and this is our biggest differentiator. Most agencies only touch the Amazon side. We can source your product in China, arrange FBA-compliant prep at the source, and launch the store. One point of contact for your entire path to market. This is the Full Launch Bundle.',
  },
  {
    q: 'How do I get started?',
    a: 'Book a free 30-minute strategy call. We\'ll look at your product, your market, and your goals — and give you an honest assessment of what\'s possible and what it would take. No pressure, no pitch deck. Just a real conversation.',
  },
]

const left = faqs.slice(0, 5)
const right = faqs.slice(5)

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const { ref, isVisible } = useScrollReveal()

  const Item = ({ faq, i }: { faq: typeof faqs[0]; i: number }) => (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group">
        <span className="text-sm font-semibold text-ink group-hover:text-accent transition-colors duration-200 leading-relaxed">
          {faq.q}
        </span>
        <span className={`text-accent flex-shrink-0 mt-0.5 text-lg transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open === i && (
        <div className="pb-6">
          <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  )

  return (
    <section id="faq" className="bg-base py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-16 border-b border-border pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] text-accent font-light tracking-wider">04</span>
              <span className="w-6 h-px bg-accent/40" />
              <span className="text-muted text-xs tracking-[0.4em] uppercase">Questions</span>
            </div>
            <h2 className="font-display font-bold text-6xl md:text-7xl text-ink uppercase leading-none">
              Honest<br />Answers.
            </h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right leading-relaxed">
            No fluff. If you have a question that isn't here, ask us directly.
          </p>
        </div>

        <div ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 gap-x-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="border-t border-border">
            {left.map((faq, i) => <Item key={i} faq={faq} i={i} />)}
          </div>
          <div className="border-t border-border">
            {right.map((faq, i) => <Item key={i + 5} faq={faq} i={i + 5} />)}
          </div>
        </div>

      </div>
    </section>
  )
}
