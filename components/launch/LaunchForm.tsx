'use client';

import { useState } from 'react';
import { TokenConfig, VestingConfig, AirdropConfig } from '@/types';
import { LaunchStepper } from './LaunchStepper';
import { TokenConfigStep } from './TokenConfigStep';
import { VestingConfigStep } from './VestingConfigStep';
import { AirdropConfigStep } from './AirdropConfigStep';
import { LaunchSummary } from './LaunchSummary';

export function LaunchForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tokenConfig, setTokenConfig] = useState<TokenConfig>({
    name: '',
    symbol: '',
    totalSupply: '',
    decimals: 7,
    mintable: false,
    burnable: false,
    website: '',
    description: ''
  });
  const [vestingConfig, setVestingConfig] = useState<VestingConfig | null>(null);
  const [airdropConfig, setAirdropConfig] = useState<AirdropConfig | null>(null);

  const handleDeploy = () => {
    console.log('Deploying with config:', {
      token: tokenConfig,
      vesting: vestingConfig,
      airdrop: airdropConfig
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TokenConfigStep
            config={tokenConfig}
            onChange={setTokenConfig}
            onNext={() => setCurrentStep(1)}
          />
        );
      case 1:
        return (
          <VestingConfigStep
            config={vestingConfig}
            onChange={setVestingConfig}
            onNext={() => setCurrentStep(2)}
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <AirdropConfigStep
            config={airdropConfig}
            onChange={setAirdropConfig}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <LaunchSummary
            tokenConfig={tokenConfig}
            vestingConfig={vestingConfig}
            airdropConfig={airdropConfig}
            onDeploy={handleDeploy}
            onBack={() => setCurrentStep(2)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Stepper */}
        <div className="lg:w-1/4">
          <LaunchStepper currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="lg:w-3/4">
          <div className="bg-card border border-border rounded-lg p-6">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}