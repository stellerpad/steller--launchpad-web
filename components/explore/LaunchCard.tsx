import Link from 'next/link';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { TokenLaunch } from '@/types';
import { formatDate, formatCurrency } from '@/lib/format';
import { shortenAddress } from '@/lib/stellar';
import { Badge } from '@/components/ui/Badge';

interface LaunchCardProps {
  launch: TokenLaunch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const totalSupplyFormatted = formatCurrency(parseInt(launch.config.totalSupply) / Math.pow(10, launch.config.decimals));
  const hasFeatures = launch.vestingAddress || launch.airdropAddress;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{launch.config.name}</h3>
          <p className="text-sm text-muted-foreground">{launch.config.symbol}</p>
        </div>
        <div className="flex items-center space-x-1">
          {launch.vestingAddress && (
            <Badge variant="info" size="sm">Vesting</Badge>
          )}
          {launch.airdropAddress && (
            <Badge variant="success" size="sm">Airdrop</Badge>
          )}
        </div>
      </div>

      {launch.config.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {launch.config.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Supply</span>
          <span>{totalSupplyFormatted}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="w-3 h-3 mr-1" />
            Creator
          </div>
          <span>{shortenAddress(launch.creator)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            Launched
          </div>
          <span>{formatDate(launch.launchDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/token/${launch.id}`}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View Details
        </Link>
        <a
          href={`https://stellar.expert/explorer/testnet/contract/${launch.tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Explorer
        </a>
      </div>
    </div>
  );
}