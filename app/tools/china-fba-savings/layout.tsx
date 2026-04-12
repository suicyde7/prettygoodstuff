import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'China FBA Prep Savings Calculator',
  description:
    'Find out how much you could save by prepping your Amazon FBA inventory in China instead of a US prep center. Free calculator for FBA sellers.',
  openGraph: {
    title: 'China FBA Prep Savings Calculator | Pretty Good Stuff',
    description:
      'Find out how much you could save by prepping your FBA inventory in China. Free calculator — takes 60 seconds.',
    url: 'https://prettygoodstuff.co/tools/china-fba-savings',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
