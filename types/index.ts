export interface TokenConfig {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  mintable: boolean;
  burnable: boolean;
  website?: string;
  description?: string;
}

export interface VestingConfig {
  beneficiary: string;
  amount: string;
  vestingType: 'linear' | 'cliff' | 'hybrid';
  startDate: Date;
  cliffDate?: Date;
  endDate: Date;
  revocable: boolean;
}

export interface AirdropRecipient {
  address: string;
  amount: string;
}

export interface AirdropConfig {
  type: 'equal' | 'weighted' | 'claimable';
  recipients: AirdropRecipient[];
  startDate: Date;
  endDate?: Date;
}

export interface TokenLaunch {
  id: string;
  tokenAddress: string;
  config: TokenConfig;
  creator: string;
  launchDate: Date;
  vestingAddress?: string;
  airdropAddress?: string;
}

export interface VestingSchedule {
  id: string;
  tokenAddress: string;
  beneficiary: string;
  totalAmount: string;
  releasedAmount: string;
  claimableAmount: string;
  config: VestingConfig;
}

export interface AirdropCampaign {
  id: string;
  tokenAddress: string;
  creator: string;
  config: AirdropConfig;
  distributedAmount: string;
  totalAmount: string;
  status: 'pending' | 'active' | 'completed';
}

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: 'testnet' | 'mainnet';
}