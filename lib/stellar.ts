// Client-side stellar utilities
// Note: Server instances should only be created on demand, not at module level

export const NETWORKS = {
  testnet: {
    horizonUrl: 'https://horizon-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    rpcUrl: 'https://soroban-testnet.stellar.org'
  },
  mainnet: {
    horizonUrl: 'https://horizon.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    rpcUrl: 'https://soroban-rpc.stellar.org'
  }
};

export function getNetwork(network: 'testnet' | 'mainnet') {
  return NETWORKS[network];
}

export async function getAccountInfo(publicKey: string, network: 'testnet' | 'mainnet') {
  try {
    // Dynamically import Stellar SDK only when needed
    const { Server } = await import('@stellar/stellar-sdk');
    const { horizonUrl } = getNetwork(network);
    const server = new Server(horizonUrl);
    return await server.loadAccount(publicKey);
  } catch (error) {
    throw new Error('Failed to load account');
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatAmount(amount: string, decimals: number): string {
  const num = Number(amount) / Math.pow(10, decimals);
  return new Intl.NumberFormat().format(num);
}

export function parseAmount(amount: string, decimals: number): string {
  const num = Number(amount) * Math.pow(10, decimals);
  return num.toString();
}