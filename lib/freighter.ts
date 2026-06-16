import { isConnected, getPublicKey, signTransaction, getNetwork } from '@stellar/freighter-api';

export async function connectWallet() {
  try {
    const isWalletConnected = await isConnected();
    if (!isWalletConnected) {
      throw new Error('Freighter wallet not found');
    }

    const publicKey = await getPublicKey();
    const network = await getNetwork();
    
    return {
      publicKey,
      network: network === 'TESTNET' ? 'testnet' as const : 'mainnet' as const
    };
  } catch (error) {
    throw new Error('Failed to connect wallet');
  }
}

export async function signTransactionWithFreighter(xdr: string) {
  try {
    const result = await signTransaction(xdr);
    return result;
  } catch (error) {
    throw new Error('Transaction signing failed');
  }
}