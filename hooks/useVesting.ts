'use client';

import { useState, useEffect } from 'react';
import { VestingSchedule } from '@/types';
import { useWallet } from './useWallet';

export function useVesting() {
  const { publicKey } = useWallet();
  const [schedules, setSchedules] = useState<VestingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setSchedules([]);
      setIsLoading(false);
      return;
    }

    const mockSchedules: VestingSchedule[] = [
      {
        id: '1',
        tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAMAUGH2WCF',
        beneficiary: publicKey,
        totalAmount: '100000000000',
        releasedAmount: '25000000000',
        claimableAmount: '15000000000',
        config: {
          beneficiary: publicKey,
          amount: '100000000000',
          vestingType: 'linear',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-07-15'),
          revocable: false
        }
      }
    ];

    setTimeout(() => {
      setSchedules(mockSchedules);
      setIsLoading(false);
    }, 800);
  }, [publicKey]);

  const claimVested = async (scheduleId: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { 
              ...schedule, 
              releasedAmount: (BigInt(schedule.releasedAmount) + BigInt(schedule.claimableAmount)).toString(),
              claimableAmount: '0'
            }
          : schedule
      ));
    } catch (err) {
      setError('Failed to claim vested tokens');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    schedules,
    isLoading,
    error,
    claimVested
  };
}