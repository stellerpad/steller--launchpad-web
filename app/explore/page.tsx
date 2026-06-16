'use client';

import { useState, useMemo } from 'react';
import { useLaunches } from '@/hooks/useLaunches';
import { LaunchFilter } from '@/components/explore/LaunchFilter';
import { LaunchGrid } from '@/components/explore/LaunchGrid';

export default function ExplorePage() {
  const { launches, isLoading } = useLaunches();
  const [filters, setFilters] = useState<{
    search: string;
    startDate?: string;
    endDate?: string;
  }>({
    search: ''
  });

  const filteredLaunches = useMemo(() => {
    return launches.filter((launch) => {
      const matchesSearch = !filters.search || 
        launch.config.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        launch.config.symbol.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStartDate = !filters.startDate || 
        launch.launchDate >= new Date(filters.startDate);

      const matchesEndDate = !filters.endDate || 
        launch.launchDate <= new Date(filters.endDate);

      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [launches, filters]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Token Launches</h1>
          <p className="text-muted-foreground">
            Discover all tokens launched on our platform. Filter by name, symbol, or launch date.
          </p>
        </div>

        <LaunchFilter onFilterChange={setFilters} />
        
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredLaunches.length} of {launches.length} launches
          </p>
        </div>

        <LaunchGrid launches={filteredLaunches} isLoading={isLoading} />
      </div>
    </div>
  );
}