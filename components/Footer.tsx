'use client'
import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { num: '01', label: 'Services',  href: '#services' },
  { num: '02', label: 'Pricing',   href: '#pricing' },
  { num: '03', label: 'Platform',  href: '#platform' },
  { num: '04', label: 'FAQ',       href: '#faq' },
  { num: '05', label: 'Contact',   href: '#contact' },
]

// Split to prevent scraper harvest
const e = ['welcome', 'prettygoodstuff.co']
const w = ['+1', '310', '710', '1208']
const wc = ['cn', 'xo', 'xo', 'usa']

export default function Footer() {
  const [copied, setCopied] = useState(false)

  function openEmail() {
    window.location.href = 'mailto:' + e[0] + '@' + e[1]
  }

  function openWhatsApp() {
    window.open('https://wa.me/' + w.join('').replace(/\D/g, ''), '_blank', 'noopener,noreferrer')
  }

  function handleWeChat() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = 'weixin://dl/chat?' + wc.join('')
    } else {
      navigator.clipboard.writeText(wc.join('')).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <footer className="bg-surface border-t border-border px-8 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <a href="/" className="inline-block mb-3">
              <Image
                src="/logo.png"
                alt="Pretty Good Stuff"
                width={800}
                height={150}
                className="h-[29px] w-auto object-contain"
              />
            </a>
            <p className="text-muted text-xs tracking-widest uppercase leading-relaxed mt-3">
              Amazon Growth · China Sourcing<br />FBA Prep · Tech Platform
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {navLinks.map(({ num, label, href }) => (
              <a key={label} href={href}
                className="group flex items-baseline gap-2 text-muted/60 hover:text-ink transition-colors duration-200">
                <span className="text-[10px] text-accent/50 group-hover:text-accent transition-colors">{num}</span>
                <span className="text-xs tracking-widest uppercase">{label}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-muted/40 text-[10px] tracking-widest uppercase mb-2">Contact</p>
            <button
              onClick={openEmail}
              className="text-muted text-sm hover:text-ink transition-colors duration-200 text-left"
            >
              Get in Touch →
            </button>
            <button
              onClick={openWhatsApp}
              className="text-muted/50 text-xs hover:text-muted transition-colors duration-200 tracking-wide text-left"
            >
              WhatsApp
            </button>
            <button
              onClick={handleWeChat}
              className="text-muted/50 text-xs hover:text-muted transition-colors duration-200 tracking-wide text-left"
            >
              {copied ? 'WeChat ID Copied ✓' : 'WeChat'}
            </button>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted/40 text-xs">© 2026 Pretty Good Stuff. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-muted/40 text-xs hover:text-muted transition-colors duration-200">Privacy Policy</a>
            <a href="/terms" className="text-muted/40 text-xs hover:text-muted transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
