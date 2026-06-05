import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';

const PRODUCT_LINKS = [
  { label: 'Overview', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Enterprise', href: '#enterprise' },
] as const;

const COMPANY_LINKS = [
  { label: 'Product tour', href: '#product' },
  { label: 'Book a demo', href: '/waitlist' },
  { label: 'Sign in', href: '/login' },
] as const;

const CONNECT_LINKS = [
  { label: 'deepakfordev@gmail.com', href: 'mailto:deepakfordev@gmail.com' },
  { label: '@depak_7 on X', href: 'https://x.com/depak_7' },
  { label: 'GitHub', href: 'https://github.com' },
] as const;

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {heading}
      </p>
      <ul className="flex flex-col gap-3">{children}</ul>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column — spans 2 on large */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Link href="/" className="inline-flex">
              <BrandLogo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
              An AI agent that lives inside your product.
            </p>
            <p className="text-xs text-neutral-600">© ActBrow</p>
          </div>

          {/* Product */}
          <FooterColumn heading="Product">
            {PRODUCT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </FooterColumn>

          {/* Company */}
          <FooterColumn heading="Company">
            {COMPANY_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          {/* Connect */}
          <FooterColumn heading="Connect">
            {CONNECT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm text-neutral-400 hover:text-white transition-colors break-all"
                >
                  {label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-600">
            © 2026 ActBrow. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#enterprise"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Security
            </a>

            <div className="flex items-center gap-3 ml-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Github size={15} />
              </a>
              <a
                href="https://x.com/depak_7"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Twitter size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
