'use client';

import { useState, useEffect } from 'react';
import { AirdropCampaign } from '@/types';
import { useWallet } from './useWallet';

export function useAirdrop() {
  const { publicKey } = useWallet();
  const [campaigns, setCampaigns] = useState<AirdropCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setCampaigns([]);
      setIsLoading(false);
      return;
    }

    const mockCampaigns: AirdropCampaign[] = [
      {
        id: '1',
        tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAMAUGH2WCF',
        creator: publicKey,
        config: {
          type: 'weighted',
          recipients: [
            { address: 'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A', amount: '1000000000' },
            { address: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37', amount: '2000000000' }
          ],
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-01')
        },
        distributedAmount: '1500000000',
        totalAmount: '3000000000',
        status: 'active'
      }
    ];

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 800);
  }, [publicKey]);

  const distributeCampaign = async (campaignId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { 
              ...campaign, 
              distributedAmount: campaign.totalAmount,
              status: 'completed' as const
            }
          : campaign
      ));
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