'use client';

import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/lib/stellar';
import { Spinner } from '@/components/ui/Spinner';

export function ConnectButton() {
  const { isConnected, publicKey, connect, disconnect, isLoading, error } = useWallet();

  if (isLoading) {
    return (
      <button 
        disabled
        className="inline-flex items-center px-4 py-2 bg-muted text-muted-foreground rounded-lg cursor-not-allowed"
      >
        <Spinner size="sm" className="mr-2" />
        Connecting...
      </button>
    );
  }

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          {shortenAddress(publicKey)}
        </span>
        <button
          onClick={disconnect}
          className="inline-flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={connect}
        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Freighter
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}