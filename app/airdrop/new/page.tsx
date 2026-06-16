'use client';

import { useState } from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { RecipientUpload } from '@/components/airdrop/RecipientUpload';
import { AirdropConfig, AirdropRecipient } from '@/types';
import { Spinner } from '@/components/ui/Spinner';

export default function NewAirdropPage() {
  const { isConnected } = useWallet();
  const [isDeploying, setIsDeploying] = useState(false);
  const [config, setConfig] = useState<AirdropConfig>({
    type: 'weighted',
    recipients: [],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
            Connect your wallet to create a new airdrop campaign.
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

    if (!config.recipients.length) {
      newErrors.recipients = 'At least one recipient is required';
    }

    if (config.startDate >= (config.endDate || new Date())) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsDeploying(true);
      
      // Mock deployment
      setTimeout(() => {
        setIsDeploying(false);
        window.location.href = '/airdrop';
      }, 3000);
    }
  };

  const handleRecipientsChange = (recipients: AirdropRecipient[]) => {
    setConfig({ ...config, recipients });
    if (errors.recipients && recipients.length > 0) {
      setErrors({ ...errors, recipients: '' });
    }
  };

  const totalAmount = config.recipients.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/airdrop"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Airdrops
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Create Airdrop Campaign</h1>
          <p className="text-muted-foreground">
            Set up a new airdrop campaign to distribute tokens to multiple recipients
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {isDeploying ? (
            <div className="text-center py-12">
              <Spinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Creating Airdrop Campaign</h3>
              <p className="text-muted-foreground">
                Deploying your airdrop contract to the Stellar network...
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
                  Airdrop Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => setConfig({ ...config, type: e.target.value as 'equal' | 'weighted' | 'claimable' })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="equal">Equal - Same amount to all recipients</option>
                  <option value="weighted">Weighted - Custom amounts per recipient</option>
                  <option value="claimable">Claimable - Recipients can claim tokens</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipients *
                </label>
                <RecipientUpload 
                  recipients={config.recipients}
                  onChange={handleRecipientsChange}
                />
                {errors.recipients && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
                )}
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
                    End Date
                  </label>
                  <input
                    type="date"
                    value={config.endDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      endDate: e.target.value ? new Date(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {config.recipients.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Campaign Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>Recipients: {config.recipients.length}</div>
                    <div>Total Amount: {totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2">Estimated Fees</h4>
                <div className="text-sm text-muted-foreground">
                  Airdrop Contract Deployment: ~0.3 XLM
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href="/airdrop"
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleDeploy}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Airdrop Campaign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}