'use client';

import { Plus, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useAirdrop } from '@/hooks/useAirdrop';
import { AirdropCard } from '@/components/airdrop/AirdropCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ConnectButton } from '@/components/wallet/ConnectButton';

export default function AirdropPage() {
  const { isConnected } = useWallet();
  const { campaigns, distributeCampaign, isLoading } = useAirdrop();

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to view and manage your airdrop campaigns.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Airdrop Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage token distribution campaigns
            </p>
          </div>
          <Link
            href="/airdrop/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : campaigns.length > 0 ? (
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <AirdropCard
                key={campaign.id}
                campaign={campaign}
                onDistribute={distributeCampaign}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Airdrop Campaigns"
            description="You haven&apos;t created any airdrop campaigns yet. Create one to distribute tokens to multiple recipients."
            action={
              <Link
                href="/airdrop/new"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}