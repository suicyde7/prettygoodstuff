import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import AboutStrip from '@/components/AboutStrip'
import Services from '@/components/Services'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import Platform from '@/components/Platform'
import FAQ from '@/components/FAQ'
import CTAStrip from '@/components/CTAStrip'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBar />
      <AboutStrip />
      <Services />
      <Testimonials />
      <Pricing />
      <Platform />
      <FAQ />
      <CTAStrip />
      <Footer />
    </main>
  )
}
