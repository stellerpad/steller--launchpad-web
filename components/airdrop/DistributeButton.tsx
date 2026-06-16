'use client';

import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

interface DistributeButtonProps {
  campaignId: string;
  onDistribute: (campaignId: string) => Promise<void>;
}

export function DistributeButton({ campaignId, onDistribute }: DistributeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDistribute = async () => {
    try {
      setIsLoading(true);
      await onDistribute(campaignId);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to distribute:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="inline-flex items-center px-4 py-2 bg-green-500/10 text-green-500 rounded-lg">
        <Check className="w-4 h-4 mr-2" />
        Distributed!
      </div>
    );
  }

  return (
    <button
      onClick={handleDistribute}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Distributing...
        </>
      ) : (
        <>
          <Send className="w-4 h-4 mr-2" />
          Distribute
        </>
      )}
    </button>
  );
}