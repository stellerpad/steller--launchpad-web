'use client';

import { useState, useEffect, useMemo } from 'react';
import { AirdropCampaign } from '@/types';
import { useWallet } from './useWallet';
import { ContractService } from '@/lib/contracts';

export function useAirdrop() {
  const { publicKey, network } = useWallet();
  const [campaigns, setCampaigns] = useState<AirdropCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractService = useMemo(() => new ContractService(network), [network]);

  const loadCampaigns = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedCampaigns = await contractService.fetchAirdropCampaigns(publicKey);
      setCampaigns(fetchedCampaigns);
    } catch (err) {
      setError('Failed to load airdrop campaigns');
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!publicKey) {
      setCampaigns([]);
      setIsLoading(false);
      return;
    }

    loadCampaigns();
  }, [publicKey, contractService]);

  const distributeCampaign = async (campaignId: string) => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await contractService.distributeCampaign(campaignId, publicKey);
      await loadCampaigns();
    } catch (err) {
      setError('Failed to distribute airdrop');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    campaigns,
    isLoading,
    error,
    distributeCampaign
  };
}
