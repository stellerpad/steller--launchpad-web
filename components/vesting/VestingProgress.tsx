import { formatNumber, formatPercentage } from '@/lib/format';

interface VestingProgressProps {
  totalAmount: number;
  releasedAmount: number;
  claimableAmount: number;
}

export function VestingProgress({
  totalAmount,
  releasedAmount,
  claimableAmount
}: VestingProgressProps) {
  const releasedPercentage = totalAmount > 0 ? (releasedAmount / totalAmount) * 100 : 0;
  const claimablePercentage = totalAmount > 0 ? (claimableAmount / totalAmount) * 100 : 0;
  const remainingPercentage = 100 - releasedPercentage - claimablePercentage;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Vesting Progress</span>
        <span className="font-medium text-sm">
          {formatPercentage(releasedPercentage / 100)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
          style={{ width: `${releasedPercentage}%` }}
        />
        <div
          className="absolute top-0 h-full bg-yellow-500 transition-all duration-300"
          style={{
            left: `${releasedPercentage}%`,
            width: `${claimablePercentage}%`
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-muted-foreground">Released</span>
          </div>
          {claimableAmount > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-muted-foreground">Claimable</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-muted rounded-full" />
            <span className="text-muted-foreground">Vesting</span>
          </div>
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Released</div>
          <div className="font-medium">{formatNumber(releasedAmount)}</div>
        </div>
        {claimableAmount > 0 && (
          <div>
            <div className="text-muted-foreground">Claimable</div>
            <div className="font-medium text-yellow-600">{formatNumber(claimableAmount)}</div>
          </div>
        )}
        <div>
          <div className="text-muted-foreground">Remaining</div>
          <div className="font-medium">
            {formatNumber(totalAmount - releasedAmount - claimableAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}