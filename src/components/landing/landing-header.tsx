'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import { GITHUB_URL } from '@/lib/site';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: '/docs' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Enterprise', href: '#enterprise' },
] as const;

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left — Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <BrandLogo priority />
          </Link>

          {/* Center — Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right — Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Github size={18} />
            </a>

            <Link
              href="/login"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>

            <Button
              asChild
              className="bg-white text-neutral-900 hover:bg-white/90 font-medium"
              size="sm"
            >
              <Link href="/book-a-demo">Book a demo</Link>
            </Button>
          </div>

          {/* Mobile — hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-5 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {label}
              </a>
            ))}

            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign in
              </Link>

              <Button
                asChild
                className="bg-white text-neutral-900 hover:bg-white/90 font-medium w-full"
              >
                <Link href="/book-a-demo" onClick={() => setMobileOpen(false)}>
                  Book a demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
