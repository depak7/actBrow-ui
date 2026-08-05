'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandLogo } from '@/components/brand-logo';
import { API_BASE_URL } from '@/types';
import { CheckCircle2, ArrowLeft, MessagesSquare, Boxes, CalendarClock } from 'lucide-react';
import posthog from 'posthog-js';

function apiErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (typeof record.error === 'string' && record.error.trim()) return record.error;
    if (typeof record.message === 'string' && record.message.trim()) return record.message;
  }
  return fallback;
}

export default function BookADemoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    posthog.capture('book_demo_page_viewed');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json().catch(() => null)) as
        | { alreadyRegistered?: boolean; error?: string; message?: string }
        | null;

      if (!response.ok) {
        throw new Error(apiErrorMessage(payload, 'Failed to book a demo'));
      }

      posthog.capture('book_demo_form_submitted', {
        has_company: !!formData.company,
        has_use_case: !!formData.useCase,
        already_registered: Boolean(payload?.alreadyRegistered),
      });
      setSubmitted(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Something went wrong. Please try again, or email deepakfordev@gmail.com.';
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-dark bg-grid flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-white">Thanks — I&apos;ll be in touch</CardTitle>
              <CardDescription className="text-neutral-400">
                I&apos;ll reach out to you personally to set up your ActBrow walkthrough
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-neutral-400">
              I&apos;ll email{' '}
              <span className="text-white font-medium">{formData.email}</span>{' '}
              to find a time that works for you.
            </p>
            <div className="p-4 rounded-lg border border-white/10 bg-white/5">
              <p className="text-sm text-neutral-400 mb-2">What&apos;s next?</p>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  A personal email from me to schedule the demo
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  A live walkthrough of ActBrow in a real app
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  Answers to how it fits your stack — no commitment
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-white text-neutral-900 hover:bg-white/90"
                onClick={() => router.push('/login')}
              >
                Or start free now
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Book a demo
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              See chat that finishes work inside a real app — so users don&apos;t
              stall on setup or bounce. Tell me about your product and I&apos;ll
              reach out personally to set up a walkthrough.
            </p>
            <p className="text-sm text-neutral-500">
              Want to try yourself first?{' '}
              <Link href="/login" className="text-neutral-300 underline underline-offset-2 hover:text-white">
                Start free with Google
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <MessagesSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">See it finish a task</h3>
                <p className="text-neutral-400 text-sm">I&apos;ll reach out in person and show a real workflow finished in-product — not a canned recording.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Boxes className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">See it in your stack</h3>
                <p className="text-neutral-400 text-sm">We&apos;ll talk through how the two-script embed drops into your own product.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">No commitment</h3>
                <p className="text-neutral-400 text-sm">A conversation, not a sales pitch. Bring your questions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="space-y-6">
            <div className="md:hidden flex justify-center mb-4">
              <BrandLogo heightClassName="h-16" widthClassName="w-14" href={null} />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-white">Book a demo</CardTitle>
              <CardDescription className="text-neutral-400">
                Leave your details and I&apos;ll reach out to you personally
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-medium text-white">Full Name *</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-white">Work Email *</label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="company" className="text-sm font-medium text-white">Company</label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your company"
                  className="h-12 border-white/10 bg-white/5 text-white placeholder:text-neutral-500"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="useCase" className="text-sm font-medium text-white">What do you want to build?</label>
                <textarea
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  placeholder="e.g. users bounce on setup; finish onboarding workflows in-product without forcing them to learn the UI..."
                  className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200"
                >
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-white text-neutral-900 hover:bg-white/90 font-medium"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Book a demo'}
              </Button>

              <div className="text-center text-sm">
                <Link href="/" className="flex items-center justify-center gap-2 text-neutral-400 hover:text-white transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
