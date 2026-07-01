'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrandLogo } from '@/components/brand-logo';
import { API_BASE_URL } from '@/types';
import { Bot, Mail, CheckCircle2, ArrowLeft, Users, Zap, Shield } from 'lucide-react';
import posthog from 'posthog-js';

export default function WaitlistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    posthog.capture('waitlist_page_viewed');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to join waitlist');
      }

      posthog.capture('waitlist_form_submitted', {
        has_company: !!formData.company,
        has_use_case: !!formData.useCase,
      });
      setSubmitted(true);
    } catch (error: any) {
      alert(error.message || 'Failed to join waitlist. Please try again.');
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
              <CardTitle className="text-2xl font-semibold text-white">You're on the list!</CardTitle>
              <CardDescription className="text-neutral-400">
                We'll notify you when ActBrow launches
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-neutral-400">
              Thank you for your interest! We'll send updates to{' '}
              <span className="text-white font-medium">{formData.email}</span>
            </p>
            <div className="p-4 rounded-lg border border-white/10 bg-white/5">
              <p className="text-sm text-neutral-400 mb-2">What's next?</p>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  Early access invitation
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  Platform launch notifications
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  Exclusive product updates
                </li>
              </ul>
            </div>
            <Button 
              className="w-full bg-white text-neutral-900 hover:bg-white/90"
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
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
              Join the Waitlist
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Be among the first to experience the future of AI assistants with browser automation and intelligent workflows.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Early Access</h3>
                <p className="text-neutral-400 text-sm">Get exclusive early access to ActBrow before the public launch.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Limited Spots</h3>
                <p className="text-neutral-400 text-sm">We're onboarding users gradually to ensure the best experience.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">No Spam</h3>
                <p className="text-neutral-400 text-sm">We'll only contact you with important updates about your access.</p>
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
              <CardTitle className="text-2xl font-semibold text-white">Join the Waitlist</CardTitle>
              <CardDescription className="text-neutral-400">
                Get early access to ActBrow when we launch
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
                <label htmlFor="useCase" className="text-sm font-medium text-white">Use Case</label>
                <textarea
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  placeholder="Tell us how you plan to use ActBrow..."
                  className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-white text-neutral-900 hover:bg-white/90 font-medium" 
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Join Waitlist'}
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
