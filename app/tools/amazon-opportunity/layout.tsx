import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amazon Opportunity Score',
  description:
    'Find out if your product has a real opportunity on Amazon. Get an instant market readiness score, category demand tier, and the top gaps blocking your launch.',
  openGraph: {
    title: 'Amazon Opportunity Score | Pretty Good Stuff',
    description: 'Is Amazon the right move for your product? Get a free readiness and opportunity assessment.',
    url: 'https://prettygoodstuff.co/tools/amazon-opportunity',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
