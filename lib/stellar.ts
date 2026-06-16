import { Server, Networks, Asset, Operation, TransactionBuilder, Keypair } from '@stellar/stellar-sdk';

export const NETWORKS = {
  testnet: {
    server: new Server('https://horizon-testnet.stellar.org'),
    networkPassphrase: Networks.TESTNET,
    rpcUrl: 'https://soroban-testnet.stellar.org'
  },
  mainnet: {
    server: new Server('https://horizon.stellar.org'),
    networkPassphrase: Networks.PUBLIC,
    rpcUrl: 'https://soroban-rpc.stellar.org'
  }
};

export function getNetwork(network: 'testnet' | 'mainnet') {
  return NETWORKS[network];
}

export async function getAccountInfo(publicKey: string, network: 'testnet' | 'mainnet') {
  try {
    const { server } = getNetwork(network);
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