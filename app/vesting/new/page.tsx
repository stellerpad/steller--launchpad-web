'use client';

import { useState } from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { VestingConfig } from '@/types';
import { Spinner } from '@/components/ui/Spinner';

export default function NewVestingPage() {
  const { isConnected } = useWallet();
  const [isDeploying, setIsDeploying] = useState(false);
  const [config, setConfig] = useState<VestingConfig>({
    beneficiary: '',
    amount: '',
    vestingType: 'linear',
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    revocable: false
  });
  const [tokenAddress, setTokenAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to create a new vesting schedule.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const handleDeploy = async () => {
    const newErrors: Record<string, string> = {};

    if (!tokenAddress.trim()) {
      newErrors.tokenAddress = 'Token contract address is required';
    }

    if (!config.beneficiary.trim()) {
      newErrors.beneficiary = 'Beneficiary address is required';
    }

    if (!config.amount || isNaN(Number(config.amount))) {
      newErrors.amount = 'Valid vesting amount is required';
    }

    if (config.startDate >= config.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsDeploying(true);
      
      // Mock deployment
      setTimeout(() => {
        setIsDeploying(false);
        window.location.href = '/vesting';
      }, 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/vesting"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vesting
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Create Vesting Schedule</h1>
          <p className="text-muted-foreground">
            Set up a new vesting schedule for token distribution over time
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {isDeploying ? (
            <div className="text-center py-12">
              <Spinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Creating Vesting Schedule</h3>
              <p className="text-muted-foreground">
                Deploying your vesting contract to the Stellar network...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Token Contract Address *
                </label>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
                {errors.tokenAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.tokenAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Beneficiary Address *
                </label>
                <input
                  type="text"
                  value={config.beneficiary}
                  onChange={(e) => setConfig({ ...config, beneficiary: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
                {errors.beneficiary && (
                  <p className="text-red-500 text-sm mt-1">{errors.beneficiary}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vesting Amount *
                </label>
                <input
                  type="number"
                  value={config.amount}
                  onChange={(e) => setConfig({ ...config, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="100000"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vesting Type
                </label>
                <select
                  value={config.vestingType}
                  onChange={(e) => setConfig({ ...config, vestingType: e.target.value as 'linear' | 'cliff' | 'hybrid' })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="linear">Linear - Gradual release over time</option>
                  <option value="cliff">Cliff - Release after specific date</option>
                  <option value="hybrid">Hybrid - Cliff + Linear combination</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={config.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setConfig({ ...config, startDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={config.endDate.toISOString().split('T')[0]}
                    onChange={(e) => setConfig({ ...config, endDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {config.vestingType !== 'linear' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cliff Date
                  </label>
                  <input
                    type="date"
                    value={config.cliffDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      cliffDate: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="revocable"
                  checked={config.revocable}
                  onChange={(e) => setConfig({ ...config, revocable: e.target.checked })}
                  className="mr-3"
                />
                <label htmlFor="revocable" className="text-sm">
                  <span className="font-medium">Revocable</span>
                  <span className="text-muted-foreground ml-2">Allow schedule to be revoked</span>
                </label>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2">Estimated Fees</h4>
                <div className="text-sm text-muted-foreground">
                  Vesting Contract Deployment: ~0.3 XLM
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/vesting"
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleDeploy}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Vesting Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}