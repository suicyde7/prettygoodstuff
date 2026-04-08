import type { Metadata } from 'next'
import { Inter_Tight, Oswald } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://prettygoodstuff.co'),
  title: {
    default: 'Amazon Store Launch & FBA Management Services | Pretty Good Stuff',
    template: '%s | Pretty Good Stuff',
  },
  description:
    'Expert Amazon account management, China FBA prep, and full launch services for brands entering or scaling on Amazon. Founding client rates — limited spots.',
  keywords: [
    'Amazon FBA management',
    'Amazon store launch',
    'China FBA prep center',
    'Amazon PPC management',
    'Amazon consulting',
    'FBA prep China',
    'Amazon seller services',
    'Amazon growth management',
    'Amazon Brand Registry',
    'private label Amazon',
  ],
  authors: [{ name: 'Pretty Good Stuff', url: 'https://prettygoodstuff.co' }],
  creator: 'Pretty Good Stuff',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prettygoodstuff.co',
    siteName: 'Pretty Good Stuff',
    title: 'Amazon Store Launch & FBA Management | Pretty Good Stuff',
    description:
      'Expert Amazon account management, China FBA prep, and full launch services for brands entering or scaling on Amazon. Founding client rates — limited spots.',
    images: [
      {
        // Add a 1200×630 branded image to /public/og-image.jpg
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pretty Good Stuff — Amazon Store Launch & FBA Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amazon Store Launch & FBA Management | Pretty Good Stuff',
    description:
      'Expert Amazon account management, China FBA prep, and full launch services for brands entering or scaling on Amazon.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Pretty Good Stuff',
  url: 'https://prettygoodstuff.co',
  logo: 'https://prettygoodstuff.co/logo.png',
  description:
    'Expert Amazon account management, China FBA prep, and full launch services for brands entering or scaling on Amazon.',
  email: 'welcome@prettygoodstuff.co',
  telephone: '+13107101208',
  priceRange: '$$',
  areaServed: 'Worldwide',
  serviceType: [
    'Amazon Store Launch',
    'Amazon Growth Management',
    'China FBA Prep Center',
  ],
  knowsAbout: [
    'Amazon FBA',
    'Amazon PPC',
    'China Product Sourcing',
    'FBA Prep Services',
    'Amazon Brand Registry',
    'Amazon A+ Content',
    'Sponsored Products',
  ],
  sameAs: [
    // Add your LinkedIn, social links here when ready
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${oswald.variable} font-sans antialiased`}>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />

        {/* Hidden Google Translate mount point */}
        <div id="google_translate_element" className="hidden" />
        {children}

        {/* Google Translate — init */}
        <Script id="gt-init" strategy="afterInteractive">{`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'zh-CN,es,pt',
              autoDisplay: false,
            }, 'google_translate_element');
          }
        `}</Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
