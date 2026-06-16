// Client-side freighter wallet utilities
// Uses dynamic imports to avoid SSR issues

export async function connectWallet() {
  try {
    // Dynamically import freighter API
    const { isConnected, getPublicKey, getNetwork } = await import('@stellar/freighter-api');
    
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
    // Dynamically import freighter API
    const { signTransaction } = await import('@stellar/freighter-api');
    const result = await signTransaction(xdr);
    return result;
  } catch (error) {
    throw new Error('Transaction signing failed');
  }
}