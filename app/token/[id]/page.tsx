'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ExternalLink, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLaunches } from '@/hooks/useLaunches';
import { useVesting } from '@/hooks/useVesting';
import { useAirdrop } from '@/hooks/useAirdrop';
import { useWallet } from '@/hooks/useWallet';
import { TokenBadge } from '@/components/token/TokenBadge';
import { TokenStats } from '@/components/token/TokenStats';
import { VestingCard } from '@/components/vesting/VestingCard';
import { AirdropCard } from '@/components/airdrop/AirdropCard';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { shortenAddress } from '@/lib/stellar';
import { formatDate } from '@/lib/format';

export default function TokenDetailPage() {
  const params = useParams();
  const tokenId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');
  
  const { launches, isLoading: launchesLoading } = useLaunches();
  const { schedules, claimVested, isLoading: vestingLoading } = useVesting();
  const { campaigns, distributeCampaign, isLoading: airdropLoading } = useAirdrop();
  const { publicKey } = useWallet();

  const launch = useMemo(() => {
    return launches.find(l => l.id === tokenId);
  }, [launches, tokenId]);

  const tokenVestingSchedules = useMemo(() => {
    if (!launch) return [];
    return schedules.filter(s => s.tokenAddress === launch.tokenAddress);
  }, [schedules, launch]);

  const tokenAirdropCampaigns = useMemo(() => {
    if (!launch) return [];
    return campaigns.filter(c => c.tokenAddress === launch.tokenAddress);
  }, [campaigns, launch]);

  const mockHolders = [
    { address: 'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A', balance: '25000000000000', percentage: 25 },
    { address: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37', balance: '20000000000000', percentage: 20 },
    { address: 'GCKFBEIYTKP6RSLVQNB3OG6TRFHPQ264BQJFZU3QW7DASU3PFCS7AZI2', balance: '15000000000000', percentage: 15 },
    { address: 'GCXKG6RN4ONIEPCMNFB732A436Z5PNDSRLGWK7GBLCMQLIFO4S7EYWVU', balance: '10000000000000', percentage: 10 },
  ];

  if (launchesLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <ErrorState
          title="Token Not Found"
          message="The token you&apos;re looking for doesn&apos;t exist or has been removed."
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vesting', label: 'Vesting', count: tokenVestingSchedules.length },
    { id: 'airdrop', label: 'Airdrops', count: tokenAirdropCampaigns.length },
    { id: 'holders', label: 'Holders', count: mockHolders.length }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <TokenStats launch={launch} />
            
            {launch.config.description && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {launch.config.description}
                </p>
              </div>
            )}

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Token Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mintable:</span>
                  <span className={launch.config.mintable ? 'text-green-400' : 'text-red-400'}>
                    {launch.config.mintable ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Burnable:</span>
                  <span className={launch.config.burnable ? 'text-green-400' : 'text-red-400'}>
                    {launch.config.burnable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vesting':
        return (
          <div className="space-y-6">
            {tokenVestingSchedules.length > 0 ? (
              tokenVestingSchedules.map((schedule) => (
                <VestingCard
                  key={schedule.id}
                  schedule={schedule}
                  tokenSymbol={launch.config.symbol}
                  onClaim={claimVested}
                />
              ))
            ) : (
              <EmptyState
                title="No Vesting Schedules"
                description="This token doesn&apos;t have any vesting schedules configured."
              />
            )}
          </div>
        );

      case 'airdrop':
        return (
          <div className="space-y-6">
            {tokenAirdropCampaigns.length > 0 ? (
              tokenAirdropCampaigns.map((campaign) => (
                <AirdropCard
                  key={campaign.id}
                  campaign={campaign}
                  tokenSymbol={launch.config.symbol}
                  onDistribute={distributeCampaign}
                />
              ))
            ) : (
              <EmptyState
                title="No Airdrop Campaigns"
                description="This token doesn&apos;t have any airdrop campaigns configured."
              />
            )}
          </div>
        );

      case 'holders':
        return (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Top Holders</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Addresses with the largest token balances
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Rank</th>
                    <th className="text-left p-4 font-medium">Address</th>
                    <th className="text-right p-4 font-medium">Balance</th>
                    <th className="text-right p-4 font-medium">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHolders.map((holder, index) => (
                    <tr key={holder.address} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4 font-medium">#{index + 1}</td>
                      <td className="p-4">
                        <code className="text-sm bg-background px-2 py-1 rounded">
                          {shortenAddress(holder.address, 8)}
                        </code>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {(Number(holder.balance) / Math.pow(10, launch.config.decimals)).toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {holder.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/explore"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explore
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-3">{launch.config.name}</h1>
              <TokenBadge 
                symbol={launch.config.symbol} 
                address={launch.tokenAddress} 
                className="mb-4"
              />
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Created by {shortenAddress(launch.creator)}</span>
                <span>•</span>
                <span>{formatDate(launch.launchDate)}</span>
                {launch.config.website && (
                  <>
                    <span>•</span>
                    <a
                      href={launch.config.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:text-foreground transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  </>
                )}
                <span>•</span>
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${launch.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Explorer
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}