import { Users, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { AirdropCampaign } from '@/types';
import { formatDate, formatNumber, formatPercentage } from '@/lib/format';
import { DistributeButton } from './DistributeButton';

interface AirdropCardProps {
  campaign: AirdropCampaign;
  tokenSymbol?: string;
  onDistribute?: (campaignId: string) => Promise<void>;
}

export function AirdropCard({ campaign, tokenSymbol, onDistribute }: AirdropCardProps) {
  const totalAmount = Number(campaign.totalAmount);
  const distributedAmount = Number(campaign.distributedAmount);
  const distributedPercentage = totalAmount > 0 ? distributedAmount / totalAmount : 0;
  
  const getStatusIcon = () => {
    switch (campaign.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (campaign.status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const canDistribute = campaign.status === 'pending' || 
    (campaign.status === 'active' && distributedPercentage < 1);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          <div className="text-lg font-semibold">
            {tokenSymbol ? `${tokenSymbol} Airdrop` : 'Token Airdrop'}
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {campaign.config.type} distribution
          </div>
        </div>
        
        {canDistribute && onDistribute && (
          <DistributeButton
            campaignId={campaign.id}
            onDistribute={onDistribute}
          />
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Distribution Progress</span>
          <span className="font-medium">
            {formatPercentage(distributedPercentage)}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${distributedPercentage * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center space-x-1 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span>Recipients</span>
          </div>
          <div className="font-medium">{campaign.config.recipients.length}</div>
        </div>
        
        <div>
          <span className="text-muted-foreground">Total Amount</span>
          <div className="font-medium">{formatNumber(totalAmount)}</div>
        </div>
        
        <div>
          <span className="text-muted-foreground">Distributed</span>
          <div className="font-medium">{formatNumber(distributedAmount)}</div>
        </div>
        
        <div>
          <div className="flex items-center space-x-1 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span>Start Date</span>
          </div>
          <div className="font-medium">{formatDate(campaign.config.startDate)}</div>
        </div>
      </div>

      {campaign.config.endDate && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm">
            <span className="text-muted-foreground">End Date: </span>
            <span className="font-medium">{formatDate(campaign.config.endDate)}</span>
          </div>
        </div>
      )}
    </div>
  );
}