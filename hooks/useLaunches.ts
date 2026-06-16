'use client';

import { useState, useEffect } from 'react';
import { TokenLaunch } from '@/types';

export function useLaunches() {
  const [launches, setLaunches] = useState<TokenLaunch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockLaunches: TokenLaunch[] = [
      {
        id: '1',
        tokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAMAUGH2WCF',
        config: {
          name: 'Stellar DeFi Token',
          symbol: 'SDT',
          totalSupply: '1000000000',
          decimals: 7,
          mintable: false,
          burnable: true,
          website: 'https://stellardefi.com',
          description: 'A DeFi utility token for the Stellar ecosystem'
        },
        creator: 'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A',
        launchDate: new Date('2024-01-15'),
        vestingAddress: 'CBDQ4ZQLGBVOKNBVN5LMQZ5S5ODUUSOW3KTYMCCRWQ4CCZF3XBCT7NGD',
        airdropAddress: 'CCGYY7F5DFHGDTVEZTHG2ZONHGHD5JKQG2N5DGSF2PRDQWFQDUEGFHVI'
      },
      {
        id: '2',
        tokenAddress: 'CBDQ4ZQLGBVOKNBVN5LMQZ5S5ODUUSOW3KTYMCCRWQ4CCZF3XBCT7NGD',
        config: {
          name: 'Gaming Rewards',
          symbol: 'GAME',
          totalSupply: '500000000',
          decimals: 7,
          mintable: true,
          burnable: false,
          description: 'Rewards token for blockchain gaming'
        },
        creator: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
        launchDate: new Date('2024-01-20')
      },
      {
        id: '3',
        tokenAddress: 'CCGYY7F5DFHGDTVEZTHG2ZONHGHD5JKQG2N5DGSF2PRDQWFQDUEGFHVI',
        config: {
          name: 'Social Impact Token',
          symbol: 'SIT',
          totalSupply: '2000000000',
          decimals: 7,
          mintable: false,
          burnable: false,
          website: 'https://socialimpact.org',
          description: 'Token for social impact initiatives'
        },
        creator: 'GCKFBEIYTKP6RSLVQNB3OG6TRFHPQ264BQJFZU3QW7DASU3PFCS7AZI2',
        launchDate: new Date('2024-01-25'),
        airdropAddress: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37'
      }
    ];

    setTimeout(() => {
      setLaunches(mockLaunches.sort((a, b) => b.launchDate.getTime() - a.launchDate.getTime()));
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRecentLaunches = (count = 6) => {
    return launches
      .sort((a, b) => b.launchDate.getTime() - a.launchDate.getTime())
      .slice(0, count);
  };

  const getTotalStats = () => {
    return {
      totalLaunches: launches.length,
      totalTokens: launches.length,
      totalSupply: launches.reduce((sum, launch) => {
        return sum + parseInt(launch.config.totalSupply);
      }, 0).toString()
    };
  };

  return {
    launches,
    isLoading,
    error,
    getRecentLaunches,
    getTotalStats
  };
}