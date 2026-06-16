'use client';

import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';

interface ClaimButtonProps {
  scheduleId: string;
  claimableAmount: number;
  onClaim: (scheduleId: string) => Promise<void>;
}

export function ClaimButton({ scheduleId, claimableAmount, onClaim }: ClaimButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClaim = async () => {
    try {
      setIsLoading(true);
      await onClaim(scheduleId);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to claim:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (claimableAmount <= 0) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
        <Check className="w-4 h-4 mr-2" />
        Claimed!
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Claiming...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Claim {formatNumber(claimableAmount)}
        </>
      )}
    </button>
  );
}