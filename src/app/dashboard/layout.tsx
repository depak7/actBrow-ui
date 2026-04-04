'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import {
  Bot,
  LayoutDashboard,
  BotMessageSquare,
  Workflow,
  Wrench,
  LogOut,
  Menu,
  X,
  User,
  Key,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLabel, setUserLabel] = useState('');
  const [apiKeyPreview, setApiKeyPreview] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = localStorage.getItem('actbrow_api_key');
    const userStr = localStorage.getItem('actbrow_user');

    if (!apiKey) {
      router.push('/login');
      return;
    }

    setApiKeyPreview(apiKey.length > 12 ? `${apiKey.slice(0, 8)}…${apiKey.slice(-4)}` : apiKey);

    if (userStr) {
      try {
        const user = JSON.parse(userStr) as { email?: string; fullName?: string };
        setUserLabel(user.fullName || user.email || 'Account');
      } catch {
        setUserLabel('Account');
      }
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('actbrow_api_key');
    localStorage.removeItem('actbrow_user');
    router.push('/login');
  };

  const copyApiKey = async () => {
    const k = localStorage.getItem('actbrow_api_key');
    if (k) await navigator.clipboard.writeText(k);
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/assistants', label: 'Assistants', icon: BotMessageSquare },
    { href: '/dashboard/flows', label: 'Navigation Flows', icon: Workflow },
    { href: '/dashboard/tools', label: 'Tools', icon: Wrench },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark bg-grid flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark bg-grid">
      <div className="lg:hidden border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur">
        <BrandLogo heightClassName="h-12" widthClassName="w-10" href="/" />
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-400">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 p-4 space-y-2 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-white text-neutral-900'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-400" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      )}

      <div className="flex">
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 min-h-screen bg-white/[0.02]">
          <div className="p-6 border-b border-white/10">
            <BrandLogo heightClassName="h-14" widthClassName="w-12" href="/" />
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-white text-neutral-900'
                    : 'text-neutral-400 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-3">
            {userLabel && (
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                <User className="h-4 w-4 text-neutral-400" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">Signed in</p>
                  <p className="text-sm font-medium text-white truncate">{userLabel}</p>
                </div>
              </div>
            )}
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-neutral-400">
                <Key className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">API key</span>
              </div>
              <code className="text-[10px] text-neutral-300 font-mono break-all block">{apiKeyPreview}</code>
              <Button variant="outline" size="sm" className="w-full border-white/10 text-xs text-white h-8" onClick={copyApiKey}>
                Copy full key
              </Button>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-400 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-background/95 backdrop-blur">
            <h1 className="text-2xl font-semibold text-white capitalize">
              {pathname.split('/').pop()?.replace(/-/g, ' ')}
            </h1>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
