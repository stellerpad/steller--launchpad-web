'use client';

import { useWallet } from '@/hooks/useWallet';

export function NetworkSelector() {
  const { network } = useWallet();

  return (
    <div className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md">
      <div className={`w-2 h-2 rounded-full mr-2 ${
        network === 'mainnet' ? 'bg-green-500' : 'bg-yellow-500'
      }`} />
      {network === 'mainnet' ? 'Mainnet' : 'Testnet'}
    </div>
  );
}