'use client';

import { useState } from 'react';
import { Upload, Download, X } from 'lucide-react';
import { AirdropConfig } from '@/types';
import { parseCSV, validateCSVFile, generateSampleCSV } from '@/lib/csv';

interface AirdropConfigStepProps {
  config: AirdropConfig | null;
  onChange: (config: AirdropConfig | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AirdropConfigStep({ config, onChange, onNext, onBack }: AirdropConfigStepProps) {
  const [enableAirdrop, setEnableAirdrop] = useState(!!config);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleEnableChange = (enabled: boolean) => {
    setEnableAirdrop(enabled);
    if (!enabled) {
      onChange(null);
    } else {
      onChange({
        type: 'weighted',
        recipients: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !config) return;

    try {
      setIsUploading(true);
      const content = await validateCSVFile(file);
      const recipients = parseCSV(content);
      
      if (recipients.length === 0) {
        setErrors({ file: 'No valid recipients found in CSV' });
        return;
      }

      onChange({ ...config, recipients });
      setErrors({});
    } catch (error) {
      setErrors({ file: error instanceof Error ? error.message : 'Failed to parse CSV' });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSample = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airdrop_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const removeRecipient = (index: number) => {
    if (!config) return;
    const newRecipients = config.recipients.filter((_, i) => i !== index);
    onChange({ ...config, recipients: newRecipients });
  };

  const validateAndNext = () => {
    if (!enableAirdrop) {
      onNext();
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!config?.recipients.length) {
      newErrors.recipients = 'At least one recipient is required';
    }

    if (config?.startDate >= (config?.endDate || new Date())) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const totalAmount = config?.recipients.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Airdrop Campaign</h2>
        <p className="text-muted-foreground">
          Optionally create an airdrop campaign for token distribution
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enableAirdrop"
          checked={enableAirdrop}
          onChange={(e) => handleEnableChange(e.target.checked)}
          className="mr-3"
        />
        <label htmlFor="enableAirdrop" className="text-sm font-medium">
          Enable airdrop campaign
        </label>
      </div>

      {enableAirdrop && config && (
        <div className="space-y-4 border border-border rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Airdrop Type
            </label>
            <select
              value={config.type}
              onChange={(e) => onChange({ ...config, type: e.target.value as 'equal' | 'weighted' | 'claimable' })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="equal">Equal - Same amount to all recipients</option>
              <option value="weighted">Weighted - Custom amounts per recipient</option>
              <option value="claimable">Claimable - Recipients can claim tokens</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Recipients CSV *
              </label>
              <button
                onClick={downloadSample}
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Sample CSV
              </button>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload CSV with address and amount columns
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </label>
            </div>
            
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file}</p>
            )}
            {errors.recipients && (
              <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>
            )}
          </div>

          {config.recipients.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Recipients ({config.recipients.length})</h4>
                <span className="text-sm text-muted-foreground">
                  Total: {totalAmount.toLocaleString()}
                </span>
              </div>
              
              <div className="max-h-40 overflow-y-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2">Address</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="w-8 p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.recipients.map((recipient, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-2 font-mono text-xs">
                          {recipient.address.slice(0, 8)}...{recipient.address.slice(-4)}
                        </td>
                        <td className="p-2 text-right">{Number(recipient.amount).toLocaleString()}</td>
                        <td className="p-2">
                          <button
                            onClick={() => removeRecipient(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                End Date
              </label>
              <input
                type="date"
                value={config.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => onChange({ 
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
          Next: Review & Deploy
        </button>
      </div>
    </div>
  );
}