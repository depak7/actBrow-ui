'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import { QueryProvider } from '@/components/query-provider';
import {
  Bot,
  LayoutDashboard,
  BotMessageSquare,
  Workflow,
  Wrench,
  Webhook,
  BookOpenCheck,
  Compass,
  PlugZap,
  LogOut,
  MessageSquareText,
  Menu,
  X,
  User,
  Key,
  Copy,
  Check,
  BarChart3,
  Server,
  Palette,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  clearSession,
  copyStoredAccountApiKey,
  getStoredAccountApiKeyPreview,
  readStoredUser,
} from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { ActiveAssistantSelect } from '@/components/active-assistant-select';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLabel, setUserLabel] = useState('');
  const [apiKeyPreview, setApiKeyPreview] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncApiKeyPreview = () => {
      setApiKeyPreview(getStoredAccountApiKeyPreview());
    };
    const user = readStoredUser();

    if (!user?.id) {
      router.push('/login');
      return;
    }

    syncApiKeyPreview();
    setUserLabel(user.fullName || user.email || 'Account');
    setLoading(false);

    const onKeyOrStorage = () => syncApiKeyPreview();
    window.addEventListener('actbrow-api-key-changed', onKeyOrStorage);
    window.addEventListener('storage', onKeyOrStorage);
    return () => {
      window.removeEventListener('actbrow-api-key-changed', onKeyOrStorage);
      window.removeEventListener('storage', onKeyOrStorage);
    };
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const copyApiKey = async () => {
    const result = await copyStoredAccountApiKey();
    if (result.ok) {
      setApiKeyCopied(true);
      toast({ title: 'Copied to clipboard' });
      setTimeout(() => setApiKeyCopied(false), 2000);
    } else {
      toast({
        title: 'Copy failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/assistants', label: 'Assistants', icon: BotMessageSquare },
    { href: '/dashboard/checklist', label: 'Getting started', icon: Bot },
    { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
    { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquareText },
    { href: '/dashboard/connect', label: 'Connect', icon: PlugZap },
    { href: '/dashboard/theme', label: 'Widget theme', icon: Palette },
    { href: '/dashboard/navigation', label: 'Navigation', icon: Compass },
    { href: '/dashboard/flows', label: 'Navigation Flows', icon: Workflow },
    { href: '/dashboard/tools', label: 'Tools', icon: Wrench },
    { href: '/dashboard/integrations', label: 'API Integrations', icon: Webhook },
    { href: '/dashboard/mcp', label: 'MCP servers', icon: Server },
    { href: '/dashboard/knowledge', label: 'Knowledge', icon: BookOpenCheck },
    { href: '/dashboard/safety', label: 'Safety', icon: ShieldAlert },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark bg-grid flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  return (
    <QueryProvider>
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
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <Key className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Account key</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-snug">
              Dashboard only — never embed. Use widget key (<code className="font-mono">wk_</code>) from Connect.
            </p>
            {apiKeyPreview ? (
              <>
                <code className="text-[10px] text-neutral-300 font-mono break-all block" aria-label="Account API key preview">
                  {apiKeyPreview}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/10 text-xs text-white h-8 gap-2"
                  onClick={() => void copyApiKey()}
                  aria-label="Copy account API key"
                >
                  {apiKeyCopied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                  Copy
                </Button>
              </>
            ) : (
              <p className="text-xs text-neutral-500">No key for this session. Sign in again.</p>
            )}
          </div>
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
                <Key className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Account key</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-snug">
                Dashboard/operator API only. Never embed this in the browser — use the widget key (<code className="font-mono">wk_</code>) from Connect.
              </p>
              {apiKeyPreview ? (
                <>
                  <code className="text-[10px] text-neutral-300 font-mono break-all block" aria-label="Account API key preview">
                    {apiKeyPreview}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 text-xs text-white h-8 gap-2"
                    onClick={() => void copyApiKey()}
                    aria-label="Copy account API key"
                  >
                    {apiKeyCopied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                    Copy
                  </Button>
                </>
              ) : (
                <p className="text-xs text-neutral-500">No key for this session. Sign in again.</p>
              )}
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-neutral-400 hover:text-white" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-40 bg-background/95 backdrop-blur">
            <h1 className="text-2xl font-semibold text-white capitalize">
              {pathname.split('/').pop()?.replace(/-/g, ' ')}
            </h1>
            <ActiveAssistantSelect />
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
    </QueryProvider>
  );
}
