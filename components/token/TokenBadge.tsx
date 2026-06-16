import { CopyButton } from '@/components/ui/CopyButton';
import { shortenAddress } from '@/lib/stellar';

interface TokenBadgeProps {
  symbol: string;
  address: string;
  className?: string;
}

export function TokenBadge({ symbol, address, className = '' }: TokenBadgeProps) {
  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <div className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-medium">
        <span>{symbol}</span>
      </div>
      <div className="inline-flex items-center space-x-1 bg-muted px-2 py-1 rounded-md">
        <span className="text-xs font-mono text-muted-foreground">
          {shortenAddress(address)}
        </span>
        <CopyButton text={address} size="sm" />
      </div>
    </div>
  );
}