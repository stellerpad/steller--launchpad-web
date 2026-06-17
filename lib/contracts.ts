// Contract interaction utilities
// Uses dynamic imports to avoid SSR issues with Stellar SDK

import { getNetwork, getAccountInfo } from './stellar';
import { TokenConfig, VestingConfig, AirdropConfig } from '@/types';

const TOKEN_CONTRACT_WASM = 'token_contract_id_placeholder';
const VESTING_CONTRACT_WASM = 'vesting_contract_id_placeholder';
const AIRDROP_CONTRACT_WASM = 'airdrop_contract_id_placeholder';

export class ContractService {
  private network: 'testnet' | 'mainnet';
  private rpcUrl: string;

  constructor(network: 'testnet' | 'mainnet') {
    this.network = network;
    const { rpcUrl } = getNetwork(network);
    this.rpcUrl = rpcUrl;
  }

  async deployToken(config: TokenConfig, creatorPublicKey: string): Promise<string> {
    try {
      const { Contract, SorobanRpc, TransactionBuilder, nativeToScVal, xdr } = await import('@stellar/stellar-sdk');
      
      const account = await getAccountInfo(creatorPublicKey, this.network);
      const { networkPassphrase } = getNetwork(this.network);
      const rpc = new SorobanRpc.Server(this.rpcUrl);

      const contract = new Contract(TOKEN_CONTRACT_WASM);
      const operation = contract.call(
        'initialize',
        nativeToScVal(config.name, { type: 'string' }),
        nativeToScVal(config.symbol, { type: 'string' }),
        nativeToScVal(config.decimals, { type: 'u32' }),
        nativeToScVal(BigInt(config.totalSupply), { type: 'i128' }),
        xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(
          xdr.PublicKey.publicKeyTypeEd25519(Buffer.from(creatorPublicKey, 'base64'))
        )),
        nativeToScVal(config.mintable, { type: 'bool' }),
        nativeToScVal(config.burnable, { type: 'bool' })
      );

      const transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      const prepared = await rpc.prepareTransaction(transaction);
      return prepared.toXDR();
    } catch (error) {
      throw new Error('Failed to prepare token deployment');
    }
  }

  async deployVesting(
    tokenAddress: string,
    config: VestingConfig,
    creatorPublicKey: string
  ): Promise<string> {
    try {
      const { Contract, SorobanRpc, TransactionBuilder, nativeToScVal } = await import('@stellar/stellar-sdk');
      
      const account = await getAccountInfo(creatorPublicKey, this.network);
      const { networkPassphrase } = getNetwork(this.network);
      const rpc = new SorobanRpc.Server(this.rpcUrl);

      const contract = new Contract(VESTING_CONTRACT_WASM);
      const operation = contract.call(
        'create_schedule',
        nativeToScVal(tokenAddress, { type: 'address' }),
        nativeToScVal(config.beneficiary, { type: 'address' }),
        nativeToScVal(BigInt(config.amount), { type: 'i128' }),
        nativeToScVal(Math.floor(config.startDate.getTime() / 1000), { type: 'u64' }),
        nativeToScVal(config.cliffDate ? Math.floor(config.cliffDate.getTime() / 1000) : 0, { type: 'u64' }),
        nativeToScVal(Math.floor(config.endDate.getTime() / 1000), { type: 'u64' }),
        nativeToScVal(config.vestingType, { type: 'string' }),
        nativeToScVal(config.revocable, { type: 'bool' })
      );

      const transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      const prepared = await rpc.prepareTransaction(transaction);
      return prepared.toXDR();
    } catch (error) {
      throw new Error('Failed to prepare vesting deployment');
    }
  }

  async deployAirdrop(
    tokenAddress: string,
    config: AirdropConfig,
    creatorPublicKey: string
  ): Promise<string> {
    try {
      const { Contract, SorobanRpc, TransactionBuilder, nativeToScVal } = await import('@stellar/stellar-sdk');
      
      const account = await getAccountInfo(creatorPublicKey, this.network);
      const { networkPassphrase } = getNetwork(this.network);
      const rpc = new SorobanRpc.Server(this.rpcUrl);

      const contract = new Contract(AIRDROP_CONTRACT_WASM);
      const recipients = nativeToScVal(
        config.recipients.map(r => ({ address: r.address, amount: BigInt(r.amount) }))
      );
      
      const operation = contract.call(
        'create_campaign',
        nativeToScVal(tokenAddress, { type: 'address' }),
        nativeToScVal(config.type, { type: 'string' }),
        recipients,
        nativeToScVal(Math.floor(config.startDate.getTime() / 1000), { type: 'u64' }),
        nativeToScVal(config.endDate ? Math.floor(config.endDate.getTime() / 1000) : 0, { type: 'u64' })
      );

      const transaction = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase
      })
        .addOperation(operation)
        .setTimeout(30)
        .build();

      const prepared = await rpc.prepareTransaction(transaction);
      return prepared.toXDR();
    } catch (error) {
      throw new Error('Failed to prepare airdrop deployment');
    }
  }
}