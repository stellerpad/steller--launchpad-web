'use client';

import { useState, useEffect, useMemo } from 'react';
import { VestingSchedule } from '@/types';
import { useWallet } from './useWallet';
import { ContractService } from '@/lib/contracts';

export function useVesting() {
  const { publicKey, network } = useWallet();
  const [schedules, setSchedules] = useState<VestingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractService = useMemo(() => new ContractService(network), [network]);

  const loadSchedules = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedSchedules = await contractService.fetchVestingSchedules(publicKey);
      setSchedules(fetchedSchedules);
    } catch (err) {
      setError('Failed to load vesting schedules');
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!publicKey) {
      setSchedules([]);
      setIsLoading(false);
      return;
    }

    loadSchedules();
  }, [publicKey, contractService]);

  const claimVested = async (scheduleId: string) => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await contractService.claimVested(scheduleId, publicKey);
      await loadSchedules();
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
