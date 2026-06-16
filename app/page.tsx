'use client';

import Link from 'next/link';
import { Rocket, Zap, Shield, Globe, ArrowRight, TrendingUp, Users, Coins } from 'lucide-react';
import { useLaunches } from '@/hooks/useLaunches';
import { LaunchCard } from '@/components/explore/LaunchCard';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/format';

function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Launch your token on Stellar in minutes
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Deploy tokens with built-in vesting schedules and airdrop campaigns. 
          No coding required, just configure and launch.
        </p>
        <Link
          href="/launch"
          className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Rocket className="w-5 h-5 mr-2" />
          Launch a Token
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </section>
  );
}

function StatsBar() {
  const { getTotalStats, isLoading } = useLaunches();
  
  if (isLoading) {
    return (
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Spinner />
        </div>
      </section>
    );
  }

  const stats = getTotalStats();
  const totalSupplyFormatted = formatCurrency(parseInt(stats.totalSupply) / 1e7);

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
            </div>
            <div className="text-3xl font-bold">{stats.totalLaunches}</div>
            <div className="text-muted-foreground">Total Launches</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Coins className="w-8 h-8 text-primary mb-2" />
            </div>
            <div className="text-3xl font-bold">{stats.totalTokens}</div>
            <div className="text-muted-foreground">Tokens Created</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Users className="w-8 h-8 text-primary mb-2" />
            </div>
            <div className="text-3xl font-bold">{totalSupplyFormatted}</div>
            <div className="text-muted-foreground">Total Supply Distributed</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Configure',
      description: 'Set up your token parameters, supply, and features'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Deploy',
      description: 'Deploy your token contract to the Stellar network'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Set Vesting',
      description: 'Optional: Create vesting schedules for team allocation'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Airdrop',
      description: 'Optional: Distribute tokens via airdrops campaigns'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground">
            Four simple steps to launch your token
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentLaunches() {
  const { getRecentLaunches, isLoading } = useLaunches();

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Recent Launches</h2>
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </section>
    );
  }

  const recentLaunches = getRecentLaunches();

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Recent Launches</h2>
          <p className="text-xl text-muted-foreground">
            Latest tokens launched on our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recentLaunches.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/explore"
            className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Explore all launches
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <RecentLaunches />
    </div>
  );
}