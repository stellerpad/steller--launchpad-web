import { TokenLaunch } from '@/types';
import { LaunchCard } from './LaunchCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search } from 'lucide-react';

interface LaunchGridProps {
  launches: TokenLaunch[];
  isLoading?: boolean;
}

export function LaunchGrid({ launches, isLoading }: LaunchGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <div className="w-2 h-2 bg-muted rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (launches.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-12 h-12" />}
        title="No launches found"
        description="Try adjusting your search criteria or check back later for new token launches."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {launches.map((launch) => (
        <LaunchCard key={launch.id} launch={launch} />
      ))}
    </div>
  );
}