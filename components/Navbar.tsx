'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'

const navLinks = [
  { num: '01', label: 'Services', href: '#services' },
  { num: '02', label: 'Pricing',  href: '#pricing' },
  { num: '03', label: 'Platform', href: '#platform' },
  { num: '04', label: 'FAQ',      href: '#faq' },
  { num: '05', label: 'Contact',  href: '#contact' },
]

const tools = [
  {
    num: '01',
    label: 'Amazon Opportunity Score',
    desc:  'Is your product ready to launch?',
    href:  '/tools/amazon-opportunity',
  },
  {
    num: '02',
    label: 'Listing Quality Grader',
    desc:  'Is your listing leaking conversions?',
    href:  '/tools/listing-grader',
  },
  {
    num: '03',
    label: 'China FBA Savings',
    desc:  'How much are you overpaying for prep?',
    href:  '/tools/china-fba-savings',
  },
]

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [toolsOpen, setToolsOpen]       = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const dropdownRef                     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ num, label, href }) => (
            <a key={label} href={href}
              className="group flex items-baseline gap-1.5 text-muted hover:text-ink transition-colors duration-200">
              <span className="text-[10px] text-accent/60 group-hover:text-accent transition-colors">{num}</span>
              <span className="text-sm font-medium tracking-wide uppercase">{label}</span>
            </a>
          ))}

          {/* Tools dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsOpen(prev => !prev)}
              className={`group flex items-baseline gap-1.5 transition-colors duration-200 ${toolsOpen ? 'text-accent' : 'text-muted hover:text-ink'}`}
            >
              <span className={`text-[10px] transition-colors ${toolsOpen ? 'text-accent' : 'text-accent/60 group-hover:text-accent'}`}>06</span>
              <span className="text-sm font-medium tracking-wide uppercase">Tools</span>
              <svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                className={`ml-0.5 mb-0.5 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-accent' : 'text-muted/50'}`}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {toolsOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 bg-surface border border-border rounded-xl shadow-xl shadow-ink/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted/50">Free Tools</p>
                </div>
                {tools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-accentLight transition-colors group"
                  >
                    <span className="text-[10px] text-accent/50 font-light tracking-widest mt-0.5 w-5 flex-shrink-0">{tool.num}</span>
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase text-ink group-hover:text-accent transition-colors leading-snug">{tool.label}</p>
                      <p className="text-[11px] text-muted mt-0.5">{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <a href="#contact"
            className="bg-accent text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-accentDark transition-colors duration-200 rounded-full">
            Let's Talk
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-8 py-10 flex flex-col gap-6 shadow-lg">
          {navLinks.map(({ num, label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}
              className="flex items-baseline gap-2 text-muted hover:text-ink transition-colors">
              <span className="text-[10px] text-accent/60">{num}</span>
              <span className="text-lg font-display font-light tracking-widest uppercase">{label}</span>
            </a>
          ))}

          {/* Mobile tools accordion */}
          <div>
            <button
              onClick={() => setMobileToolsOpen(prev => !prev)}
              className="flex items-baseline gap-2 text-muted hover:text-ink transition-colors w-full"
            >
              <span className="text-[10px] text-accent/60">06</span>
              <span className="text-lg font-display font-light tracking-widest uppercase flex-1 text-left">Tools</span>
              <svg
                width="12" height="12" viewBox="0 0 10 10" fill="none"
                className={`transition-transform duration-200 ${mobileToolsOpen ? 'rotate-180' : ''}`}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileToolsOpen && (
              <div className="mt-3 flex flex-col gap-1 pl-6 border-l border-border">
                {tools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => { setMenuOpen(false); setMobileToolsOpen(false) }}
                    className="py-2.5 group"
                  >
                    <p className="text-sm font-semibold tracking-wide uppercase text-ink group-hover:text-accent transition-colors">{tool.label}</p>
                    <p className="text-xs text-muted mt-0.5">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
