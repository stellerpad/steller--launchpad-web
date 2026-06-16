'use client';

import { useState } from 'react';
import { Check, ExternalLink, Rocket } from 'lucide-react';
import { TokenConfig, VestingConfig, AirdropConfig } from '@/types';
import { formatDate, formatNumber } from '@/lib/format';
import { Spinner } from '@/components/ui/Spinner';

interface LaunchSummaryProps {
  tokenConfig: TokenConfig;
  vestingConfig: VestingConfig | null;
  airdropConfig: AirdropConfig | null;
  onDeploy: () => void;
  onBack: () => void;
}

export function LaunchSummary({
  tokenConfig,
  vestingConfig,
  airdropConfig,
  onDeploy,
  onBack
}: LaunchSummaryProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);
  const [deployedAddresses, setDeployedAddresses] = useState<{
    token?: string;
    vesting?: string;
    airdrop?: string;
  }>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentStep(1);

    // Mock deployment process
    try {
      // Deploy token
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDeployedAddresses(prev => ({
        ...prev,
        token: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAMAUGH2WCF'
      }));

      if (vestingConfig) {
        setDeploymentStep(2);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDeployedAddresses(prev => ({
          ...prev,
          vesting: 'CBDQ4ZQLGBVOKNBVN5LMQZ5S5ODUUSOW3KTYMCCRWQ4CCZF3XBCT7NGD'
        }));
      }

      if (airdropConfig) {
        setDeploymentStep(3);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDeployedAddresses(prev => ({
          ...prev,
          airdrop: 'CCGYY7F5DFHGDTVEZTHG2ZONHGHD5JKQG2N5DGSF2PRDQWFQDUEGFHVI'
        }));
      }

      setIsComplete(true);
      onDeploy();
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const totalSupplyFormatted = formatNumber(
    parseInt(tokenConfig.totalSupply) / Math.pow(10, tokenConfig.decimals)
  );

  const deploymentSteps = [
    'Deploying token contract...',
    vestingConfig ? 'Deploying vesting contract...' : null,
    airdropConfig ? 'Deploying airdrop contract...' : null,
  ].filter(Boolean);

  if (isComplete) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 text-green-500 rounded-full mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Token Launched Successfully!</h2>
          <p className="text-muted-foreground">
            Your token is now live on the Stellar network
          </p>
        </div>

        <div className="space-y-4 bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold">Contract Addresses</h3>
          
          {deployedAddresses.token && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Token Contract:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {deployedAddresses.token}
                </code>
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${deployedAddresses.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {deployedAddresses.vesting && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Vesting Contract:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {deployedAddresses.vesting}
                </code>
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${deployedAddresses.vesting}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {deployedAddresses.airdrop && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Airdrop Contract:</span>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {deployedAddresses.airdrop}
                </code>
                <a
                  href={`https://stellar.expert/explorer/testnet/contract/${deployedAddresses.airdrop}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/explore'}
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Explore Launches
          </button>
          <button
            onClick={() => window.location.href = '/launch'}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Launch Another Token
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Deploy</h2>
        <p className="text-muted-foreground">
          Review your configuration before deploying to the Stellar network
        </p>
      </div>

      {isDeploying ? (
        <div className="text-center py-12">
          <Spinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Deploying Your Token</h3>
          <p className="text-muted-foreground mb-4">
            {deploymentSteps[deploymentStep - 1] || 'Preparing deployment...'}
          </p>
          <div className="text-sm text-muted-foreground">
            Step {deploymentStep} of {deploymentSteps.length}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* Token Configuration Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Token Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 font-medium">{tokenConfig.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="ml-2 font-medium">{tokenConfig.symbol}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Supply:</span>
                  <span className="ml-2 font-medium">{totalSupplyFormatted}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Decimals:</span>
                  <span className="ml-2 font-medium">{tokenConfig.decimals}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mintable:</span>
                  <span className="ml-2 font-medium">{tokenConfig.mintable ? 'Yes' : 'No'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Burnable:</span>
                  <span className="ml-2 font-medium">{tokenConfig.burnable ? 'Yes' : 'No'}</span>
                </div>
              </div>
              {tokenConfig.website && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Website:</span>
                  <span className="ml-2">{tokenConfig.website}</span>
                </div>
              )}
              {tokenConfig.description && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <p className="mt-1">{tokenConfig.description}</p>
                </div>
              )}
            </div>

            {/* Vesting Summary */}
            {vestingConfig && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Vesting Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Beneficiary:</span>
                    <span className="ml-2 font-mono text-xs">{vestingConfig.beneficiary}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="ml-2 font-medium">{formatNumber(Number(vestingConfig.amount))}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium capitalize">{vestingConfig.vestingType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(vestingConfig.startDate)} - {formatDate(vestingConfig.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Airdrop Summary */}
            {airdropConfig && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Airdrop Campaign</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium capitalize">{airdropConfig.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Recipients:</span>
                    <span className="ml-2 font-medium">{airdropConfig.recipients.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="ml-2 font-medium">
                      {formatNumber(airdropConfig.recipients.reduce((sum, r) => sum + Number(r.amount), 0))}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(airdropConfig.startDate)}
                      {airdropConfig.endDate && ` - ${formatDate(airdropConfig.endDate)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Estimated Fees */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">Estimated Transaction Fees</h4>
              <div className="text-sm text-muted-foreground">
                <div>Token Deployment: ~0.5 XLM</div>
                {vestingConfig && <div>Vesting Setup: ~0.3 XLM</div>}
                {airdropConfig && <div>Airdrop Setup: ~0.3 XLM</div>}
                <div className="font-medium mt-2">
                  Total: ~{0.5 + (vestingConfig ? 0.3 : 0) + (airdropConfig ? 0.3 : 0)} XLM
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleDeploy}
              className="inline-flex items-center px-8 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Token
            </button>
          </div>
        </>
      )}
    </div>
  );
}