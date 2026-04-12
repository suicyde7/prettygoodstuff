import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amazon Listing Quality Grader',
  description:
    'Get an instant quality score for your Amazon listing. Find exactly which gaps are costing you conversions — title, bullets, images, A+ Content, video, and more.',
  openGraph: {
    title: 'Amazon Listing Quality Grader | Pretty Good Stuff',
    description: 'Instantly score your Amazon listing and get a ranked fix list. Free tool.',
    url: 'https://prettygoodstuff.co/tools/listing-grader',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
