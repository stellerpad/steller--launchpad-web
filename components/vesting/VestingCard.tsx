import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { VestingSchedule } from '@/types';
import { formatDate, formatNumber, formatPercentage } from '@/lib/format';
import { VestingProgress } from './VestingProgress';
import { ClaimButton } from './ClaimButton';

interface VestingCardProps {
  schedule: VestingSchedule;
  tokenSymbol?: string;
  onClaim?: (scheduleId: string) => Promise<void>;
}

export function VestingCard({ schedule, tokenSymbol, onClaim }: VestingCardProps) {
  const totalAmount = Number(schedule.totalAmount);
  const releasedAmount = Number(schedule.releasedAmount);
  const claimableAmount = Number(schedule.claimableAmount);
  
  const releasedPercentage = totalAmount > 0 ? releasedAmount / totalAmount : 0;
  const isCompleted = releasedPercentage >= 1;
  const hasClaimable = claimableAmount > 0;

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (hasClaimable) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return <Clock className="w-5 h-5 text-blue-500" />;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (hasClaimable) return 'Ready to Claim';
    return 'Vesting';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          {tokenSymbol && (
            <div className="text-lg font-semibold">{tokenSymbol} Vesting</div>
          )}
        </div>
        
        {hasClaimable && onClaim && (
          <ClaimButton
            scheduleId={schedule.id}
            claimableAmount={claimableAmount}
            onClaim={onClaim}
          />
        )}
      </div>

      <VestingProgress
        totalAmount={totalAmount}
        releasedAmount={releasedAmount}
        claimableAmount={claimableAmount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Amount</span>
          <div className="font-medium">{formatNumber(totalAmount)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Released</span>
          <div className="font-medium">
            {formatNumber(releasedAmount)} ({formatPercentage(releasedPercentage)})
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Vesting Type</span>
          <div className="font-medium capitalize">{schedule.config.vestingType}</div>
        </div>
        <div>
          <span className="text-muted-foreground">End Date</span>
          <div className="font-medium">{formatDate(schedule.config.endDate)}</div>
        </div>
      </div>

      {schedule.config.revocable && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              This vesting schedule is revocable
            </span>
          </div>
        </div>
      )}
    </div>
  );
}