'use client';

import { useState } from 'react';
import { VestingConfig } from '@/types';

interface VestingConfigStepProps {
  config: VestingConfig | null;
  onChange: (config: VestingConfig | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VestingConfigStep({ config, onChange, onNext, onBack }: VestingConfigStepProps) {
  const [enableVesting, setEnableVesting] = useState(!!config);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEnableChange = (enabled: boolean) => {
    setEnableVesting(enabled);
    if (!enabled) {
      onChange(null);
    } else {
      onChange({
        beneficiary: '',
        amount: '',
        vestingType: 'linear',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        revocable: false
      });
    }
  };

  const validateAndNext = () => {
    if (!enableVesting) {
      onNext();
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!config?.beneficiary.trim()) {
      newErrors.beneficiary = 'Beneficiary address is required';
    }

    if (!config?.amount || isNaN(Number(config.amount))) {
      newErrors.amount = 'Valid vesting amount is required';
    }

    if (config?.startDate >= config?.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (config?.vestingType === 'cliff' && config.cliffDate && config.cliffDate >= config.endDate) {
      newErrors.cliffDate = 'Cliff date must be before end date';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Vesting Setup</h2>
        <p className="text-muted-foreground">
          Optionally create a vesting schedule for team allocation
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableVesting"
          checked={enableVesting}
          onChange={(e) => handleEnableChange(e.target.checked)}
          className="mr-3"
        />
        <label htmlFor="enableVesting" className="text-sm font-medium">
          Enable vesting schedule
        </label>
      </div>

      {enableVesting && config && (
        <div className="space-y-4 border border-border rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Beneficiary Address *
            </label>
            <input
              type="text"
              value={config.beneficiary}
              onChange={(e) => onChange({ ...config, beneficiary: e.target.value })}
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
              onChange={(e) => onChange({ ...config, amount: e.target.value })}
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
              onChange={(e) => onChange({ ...config, vestingType: e.target.value as 'linear' | 'cliff' | 'hybrid' })}
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
                onChange={(e) => onChange({ ...config, startDate: new Date(e.target.value) })}
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
                onChange={(e) => onChange({ ...config, endDate: new Date(e.target.value) })}
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
                onChange={(e) => onChange({ 
                  ...config, 
                  cliffDate: e.target.value ? new Date(e.target.value) : undefined 
                })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.cliffDate && (
                <p className="text-red-500 text-sm mt-1">{errors.cliffDate}</p>
              )}
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="revocable"
              checked={config.revocable}
              onChange={(e) => onChange({ ...config, revocable: e.target.checked })}
              className="mr-3"
            />
            <label htmlFor="revocable" className="text-sm">
              <span className="font-medium">Revocable</span>
              <span className="text-muted-foreground ml-2">Allow schedule to be revoked</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Back
        </button>
        <button
          onClick={validateAndNext}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Next: Airdrop Setup
        </button>
      </div>
    </div>
  );
}