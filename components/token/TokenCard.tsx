import Link from 'next/link';
import { ExternalLink, Globe } from 'lucide-react';
import { TokenLaunch } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { TokenBadge } from './TokenBadge';

interface TokenCardProps {
  launch: TokenLaunch;
}

export function TokenCard({ launch }: TokenCardProps) {
  const totalSupplyFormatted = formatCurrency(
    parseInt(launch.config.totalSupply) / Math.pow(10, launch.config.decimals)
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{launch.config.name}</h3>
          <TokenBadge symbol={launch.config.symbol} address={launch.tokenAddress} />
        </div>
        {launch.config.website && (
          <a
            href={launch.config.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-5 h-5" />
          </a>
        )}
      </div>

      {launch.config.description && (
        <p className="text-muted-foreground mb-4">{launch.config.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Supply</span>
          <div className="font-medium">{totalSupplyFormatted}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Decimals</span>
          <div className="font-medium">{launch.config.decimals}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Launched</span>
          <div className="font-medium">{formatDate(launch.launchDate)}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Features</span>
          <div className="flex space-x-1">
            {launch.config.mintable && (
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                Mintable
              </span>
            )}
            {launch.config.burnable && (
              <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded">
                Burnable
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/token/${launch.id}`}
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          View Details
        </Link>
        <a
          href={`https://stellar.expert/explorer/testnet/contract/${launch.tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Explorer
        </a>
      </div>
    </div>
  );
}