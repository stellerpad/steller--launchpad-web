'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { connectWallet } from '@/lib/freighter';
import { WalletState } from '@/types';

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    network: 'testnet'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const walletInfo = await connectWallet();
      setWallet({
        isConnected: true,
        publicKey: walletInfo.publicKey,
        network: walletInfo.network
      });
      
      localStorage.setItem('wallet_connected', 'true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setWallet({
      isConnected: false,
      publicKey: null,
      network: 'testnet'
    });
    localStorage.removeItem('wallet_connected');
    setError(null);
  };

  useEffect(() => {
    const wasConnected = localStorage.getItem('wallet_connected');
    if (wasConnected) {
      connect();
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      ...wallet,
      connect,
      disconnect,
      isLoading,
      error
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}