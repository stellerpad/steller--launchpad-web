'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface LaunchFilterProps {
  onFilterChange: (filters: {
    search: string;
    startDate?: string;
    endDate?: string;
  }) => void;
}

export function LaunchFilter({ onFilterChange }: LaunchFilterProps) {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      search,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    onFilterChange({ search: '' });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search by token name or symbol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setTimeout(() => {
                onFilterChange({
                  search: e.target.value,
                  startDate: startDate || undefined,
                  endDate: endDate || undefined
                });
              }, 300);
            }}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
          
          {(search || startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium mb-2">
                Launch Date From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Launch Date To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}