'use client';

import { useWallet } from '@/hooks/useWallet';
import { LaunchForm } from '@/components/launch/LaunchForm';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Wallet } from 'lucide-react';

export default function LaunchPage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8">
            You need to connect your Freighter wallet to launch a token on Stellar.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <h1 className="text-3xl font-bold mb-2">Launch a Token</h1>
          <p className="text-muted-foreground">
            Create and deploy your token on the Stellar network with optional vesting and airdrop features.
          </p>
        </div>
        <LaunchForm />
      </div>
    </div>
  );
}