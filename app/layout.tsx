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
  title: 'Pretty Good Stuff | Amazon · Sourcing · Tech Platform',
  description:
    'End-to-end e-commerce consulting — Amazon store management, China product sourcing & private labeling, and China FBA prep center services.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} ${oswald.variable} font-sans antialiased`}>
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
