'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const clientId = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '').trim();

  const finishLogin = useCallback(
    (apiKey: string, user: Record<string, unknown>, showApiKeyOnce: boolean) => {
      localStorage.setItem('actbrow_api_key', apiKey);
      localStorage.setItem('actbrow_user', JSON.stringify(user));
      if (showApiKeyOnce) {
        setNewApiKey(apiKey);
        setApiKeyModalOpen(true);
      } else {
        toast({ title: 'Signed in', description: 'Welcome back.' });
        router.push('/dashboard');
      }
    },
    [router, toast]
  );

  const handleCredential = useCallback(
    async (credential: string) => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: credential }),
        });
        const data = await response.json();
        if (!response.ok || !data.success || !data.apiKey) {
          toast({
            title: 'Sign-in failed',
            description: data.error || 'Could not complete Google sign-in',
            variant: 'destructive',
          });
          return;
        }
        finishLogin(data.apiKey, data.user, Boolean(data.showApiKeyOnce));
      } catch {
        toast({ title: 'Sign-in failed', description: 'Network error', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    },
    [finishLogin, toast]
  );

  useEffect(() => {
    if (!scriptReady || !clientId || !googleBtnRef.current || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (res) => handleCredential(res.credential),
    });
    googleBtnRef.current.innerHTML = '';
    /* filled_black matches dark UI; outline is a bright white pill on dark — avoid for this theme */
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: 'filled_black',
      size: 'large',
      width: 320,
      text: 'continue_with',
      shape: 'pill',
    });
  }, [scriptReady, clientId, handleCredential]);

  const copyKey = async () => {
    await navigator.clipboard.writeText(newApiKey);
    toast({ title: 'Copied', description: 'API key copied to clipboard' });
  };

  const closeKeyModal = () => {
    setApiKeyModalOpen(false);
    router.push('/dashboard');
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="min-h-screen bg-gradient-dark bg-grid flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <BrandLogo />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-white">Sign in with Google</CardTitle>
              <CardDescription className="text-neutral-400">
                We create your account, issue an API key for the ActBrow API, and then you can add assistants and
                tools.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {clientId ? (
              <div className="flex flex-col items-center gap-3">
                <div ref={googleBtnRef} className="min-h-[40px]" />
                {loading && <p className="text-sm text-neutral-500">Signing in…</p>}
              </div>
            ) : (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                Set <code className="text-xs">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in the UI env to enable Google
                Sign-In. It must match a Web client ID from Google Cloud Console.
              </div>
            )}

            <p className="text-center text-xs text-neutral-500">
              <a href="/" className="text-neutral-400 hover:text-white transition-colors">
                ← Back to Home
              </a>
            </p>
          </CardContent>
        </Card>

        <Dialog open={apiKeyModalOpen} onOpenChange={(o) => !o && closeKeyModal()}>
          <DialogContent className="border-white/10 bg-neutral-900 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Save your API key</DialogTitle>
              <DialogDescription className="text-neutral-400">
                This key was just created for your account. Copy it now; you will use it in the SDK and for API
                requests. You can also find it later in the dashboard sidebar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Input readOnly value={newApiKey} className="font-mono text-xs border-white/10 bg-black/40 text-white" />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={copyKey} className="border-white/10 text-white">
                Copy key
              </Button>
              <Button onClick={closeKeyModal} className="bg-white text-neutral-900 hover:bg-white/90">
                Continue to dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
