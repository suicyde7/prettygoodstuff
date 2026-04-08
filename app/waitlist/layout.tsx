import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the Waitlist — PGS Compass & Origin',
  description:
    'Get early access to PGS Compass (the guided Amazon seller platform) and PGS Origin (managed China procurement). Founding members get locked-in rates before public launch.',
  openGraph: {
    title: 'Join the Waitlist — PGS Compass & Origin | Pretty Good Stuff',
    description:
      'Get early access to PGS Compass and PGS Origin. Founding members get locked-in rates and priority onboarding before public launch.',
    url: 'https://prettygoodstuff.co/waitlist',
  },
  twitter: {
    card: 'summary',
    title: 'Join the Waitlist — PGS Compass & Origin | Pretty Good Stuff',
    description:
      'Get early access to PGS Compass and PGS Origin. Founding members get locked-in rates before public launch.',
  },
}

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
