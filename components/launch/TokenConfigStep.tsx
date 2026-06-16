'use client';

import { useState } from 'react';
import { TokenConfig } from '@/types';

interface TokenConfigStepProps {
  config: TokenConfig;
  onChange: (config: TokenConfig) => void;
  onNext: () => void;
}

export function TokenConfigStep({ config, onChange, onNext }: TokenConfigStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};

    if (!config.name.trim()) {
      newErrors.name = 'Token name is required';
    }

    if (!config.symbol.trim()) {
      newErrors.symbol = 'Token symbol is required';
    } else if (config.symbol.length > 5) {
      newErrors.symbol = 'Symbol must be 5 characters or less';
    }

    if (!config.totalSupply || isNaN(Number(config.totalSupply))) {
      newErrors.totalSupply = 'Valid total supply is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Token Configuration</h2>
        <p className="text-muted-foreground">
          Set up the basic parameters for your token
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Token Name *
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., My Awesome Token"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Token Symbol *
          </label>
          <input
            type="text"
            value={config.symbol}
            onChange={(e) => onChange({ ...config, symbol: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., MAT"
            maxLength={5}
          />
          {errors.symbol && (
            <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Supply *
            </label>
            <input
              type="number"
              value={config.totalSupply}
              onChange={(e) => onChange({ ...config, totalSupply: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="1000000"
            />
            {errors.totalSupply && (
              <p className="text-red-500 text-sm mt-1">{errors.totalSupply}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Decimals
            </label>
            <select
              value={config.decimals}
              onChange={(e) => onChange({ ...config, decimals: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Array.from({ length: 19 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Website URL (optional)
          </label>
          <input
            type="url"
            value={config.website || ''}
            onChange={(e) => onChange({ ...config, website: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description (optional)
          </label>
          <textarea
            value={config.description || ''}
            onChange={(e) => onChange({ ...config, description: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
            placeholder="Describe your token's purpose and utility..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="mintable"
              checked={config.mintable}
              onChange={(e) => onChange({ ...config, mintable: e.target.checked })}
              className="mr-3"
            />
            <label htmlFor="mintable" className="text-sm">
              <span className="font-medium">Mintable</span>
              <span className="text-muted-foreground ml-2">Allow future minting of tokens</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="burnable"
              checked={config.burnable}
              onChange={(e) => onChange({ ...config, burnable: e.target.checked })}
              className="mr-3"
            />
            <label htmlFor="burnable" className="text-sm">
              <span className="font-medium">Burnable</span>
              <span className="text-muted-foreground ml-2">Allow token holders to burn tokens</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={validateAndNext}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Next: Vesting Setup
        </button>
      </div>
    </div>
  );
}