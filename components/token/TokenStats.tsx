import { TrendingUp, Users, Coins, Calendar } from 'lucide-react';
import { TokenLaunch } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { shortenAddress } from '@/lib/stellar';

interface TokenStatsProps {
  launch: TokenLaunch;
}

export function TokenStats({ launch }: TokenStatsProps) {
  const totalSupplyFormatted = formatCurrency(
    parseInt(launch.config.totalSupply) / Math.pow(10, launch.config.decimals)
  );

  const stats = [
    {
      icon: <Coins className="w-5 h-5" />,
      label: 'Total Supply',
      value: totalSupplyFormatted,
      description: `${launch.config.decimals} decimals`
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Creator',
      value: shortenAddress(launch.creator),
      description: 'Token deployer'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Launch Date',
      value: formatDate(launch.launchDate),
      description: 'Deployment date'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Holders',
      value: '42', // Mock data
      description: 'Unique addresses'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-primary">
              {stat.icon}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}