export const STELLAR_NETWORKS = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet'
} as const;

export const CONTRACT_FEES = {
  TOKEN_DEPLOYMENT: 0.5,
  VESTING_SETUP: 0.3,
  AIRDROP_SETUP: 0.3
} as const;

export const TOKEN_LIMITS = {
  MAX_SYMBOL_LENGTH: 5,
  MAX_DECIMALS: 18,
  MIN_DECIMALS: 0
} as const;

export const VALIDATION_PATTERNS = {
  STELLAR_ADDRESS: /^G[A-Z2-7]{55}$/,
  CONTRACT_ADDRESS: /^C[A-Z2-7]{55}$/,
  AMOUNT: /^\d+(\.\d+)?$/
} as const;

export const DEFAULT_TOKEN_CONFIG = {
  decimals: 7,
  mintable: false,
  burnable: false
} as const;