'use client';

import { Plus, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { useVesting } from '@/hooks/useVesting';
import { VestingCard } from '@/components/vesting/VestingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ConnectButton } from '@/components/wallet/ConnectButton';

export default function VestingPage() {
  const { isConnected } = useWallet();
  const { schedules, claimVested, isLoading } = useVesting();

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to view and manage your vesting schedules.
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
            <h1 className="text-3xl font-bold mb-2">My Vesting Schedules</h1>
            <p className="text-muted-foreground">
              View and claim your vested tokens from various projects
            </p>
          </div>
          <Link
            href="/vesting/new"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Schedule
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : schedules.length > 0 ? (
          <div className="space-y-6">
            {schedules.map((schedule) => (
              <VestingCard
                key={schedule.id}
                schedule={schedule}
                onClaim={claimVested}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Vesting Schedules"
            description="You don&apos;t have any vesting schedules yet. Create one to start vesting tokens over time."
            action={
              <Link
                href="/vesting/new"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Schedule
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}