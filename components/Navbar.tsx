'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import LanguageSwitcher from './LanguageSwitcher'

const navLinks = [
  { num: '01', label: 'Services', href: '#services' },
  { num: '02', label: 'Pricing', href: '#pricing' },
  { num: '03', label: 'Platform', href: '#platform' },
  { num: '04', label: 'FAQ', href: '#faq' },
  { num: '05', label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      scrolled ? 'bg-surface/95 backdrop-blur-md shadow-sm border-b border-border py-4' : 'bg-transparent py-7'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">

        <a href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Pretty Good Stuff"
            width={800}
            height={150}
            className="h-[37px] w-auto object-contain"
            priority
          />
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ num, label, href }) => (
            <a key={label} href={href}
              className="group flex items-baseline gap-1.5 text-muted hover:text-ink transition-colors duration-200">
              <span className="text-[10px] text-accent/60 group-hover:text-accent transition-colors">{num}</span>
              <span className="text-sm font-medium tracking-wide uppercase">{label}</span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a href="#contact"
            className="bg-accent text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-accentDark transition-colors duration-200 rounded-full">
            Let's Talk
          </a>
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-8 py-10 flex flex-col gap-6 shadow-lg">
          {navLinks.map(({ num, label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}
              className="flex items-baseline gap-2 text-muted hover:text-ink transition-colors">
              <span className="text-[10px] text-accent/60">{num}</span>
              <span className="text-lg font-display font-light tracking-widest uppercase">{label}</span>
            </a>
          ))}
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
          <a href="#contact"
            className="bg-accent text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 text-center mt-2 rounded-full">
            Let's Talk
          </a>
        </div>
      )}
    </nav>
  )
}
