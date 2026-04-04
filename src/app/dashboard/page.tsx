'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { assistantsApi, toolsApi } from '@/lib/api';
import { Bot, Wrench, Workflow, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ assistants: 0, tools: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [assistants, tools] = await Promise.all([
          assistantsApi.list(), toolsApi.list(),
        ]);
        setStats({ assistants: assistants.length, tools: tools.length });
      } catch (error) { console.error('Failed to fetch stats:', error); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'My Assistants', value: stats.assistants, icon: Bot },
    { title: 'Available Tools', value: stats.tools, icon: Wrench },
    { title: 'Navigation Flows', value: 0, icon: Workflow },
  ];

  const quickActions = [
    { label: 'Create Assistant', href: '/dashboard/assistants', icon: Bot },
    { label: 'Create Flow', href: '/dashboard/flows', icon: Workflow },
    { label: 'Create Tool', href: '/dashboard/tools', icon: Wrench },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
        <p className="text-neutral-400 mt-1">Manage your AI assistants and resources</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-white/10 bg-white/5 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-white">{loading ? '-' : stat.value}</div>
              <p className="text-xs text-neutral-500 mt-1">Active resources</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle className="text-white">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex items-center justify-between p-5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-lg bg-white/10 flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-neutral-500">Create new {action.label.toLowerCase()}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
