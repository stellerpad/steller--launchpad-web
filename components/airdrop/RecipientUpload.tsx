'use client';

import { useState } from 'react';
import { Upload, Download, X, AlertCircle } from 'lucide-react';
import { AirdropRecipient } from '@/types';
import { parseCSV, validateCSVFile, generateSampleCSV } from '@/lib/csv';
import { formatNumber } from '@/lib/format';
import { shortenAddress } from '@/lib/stellar';

interface RecipientUploadProps {
  recipients: AirdropRecipient[];
  onChange: (recipients: AirdropRecipient[]) => void;
}

export function RecipientUpload({ recipients, onChange }: RecipientUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      const content = await validateCSVFile(file);
      const parsedRecipients = parseCSV(content);
      
      if (parsedRecipients.length === 0) {
        setError('No valid recipients found in CSV');
        return;
      }

      onChange(parsedRecipients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
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
    a.download = 'airdrop_recipients_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const removeRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    onChange(newRecipients);
  };

  const clearAll = () => {
    onChange([]);
  };

  const totalAmount = recipients.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-border rounded-lg p-6">
        <div className="text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file with recipient addresses and amounts
            </p>
            <div className="flex items-center justify-center space-x-4">
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
                {isUploading ? 'Uploading...' : 'Choose CSV File'}
              </label>
              <button
                onClick={downloadSample}
                className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Sample CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Recipients List */}
      {recipients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">
                Recipients ({recipients.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Total Amount: {formatNumber(totalAmount)}
              </p>
            </div>
            <button
              onClick={clearAll}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-medium">Address</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="w-10 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3">
                      <code className="text-xs bg-background px-2 py-1 rounded">
                        {shortenAddress(recipient.address, 8)}
                      </code>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatNumber(Number(recipient.amount))}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeRecipient(index)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                        title="Remove recipient"
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
    </div>
  );
}