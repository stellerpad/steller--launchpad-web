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
      // Dynamically import Stellar SDK
      const { Contract, SorobanRpc, TransactionBuilder } = await import('@stellar/stellar-sdk');
      
      const account = await getAccountInfo(creatorPublicKey, this.network);
      const { networkPassphrase } = getNetwork(this.network);
      const rpc = new SorobanRpc.Server(this.rpcUrl);

      const contract = new Contract(TOKEN_CONTRACT_WASM);
      const operation = contract.call(
        'initialize',
        config.name,
        config.symbol,
        config.decimals,
        config.totalSupply,
        creatorPublicKey,
        config.mintable,
        config.burnable
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
      // Dynamically import Stellar SDK
      const { Contract, SorobanRpc, TransactionBuilder } = await import('@stellar/stellar-sdk');
      
      const account = await getAccountInfo(creatorPublicKey, this.network);
      const { networkPassphrase } = getNetwork(this.network);
      const rpc = new SorobanRpc.Server(this.rpcUrl);

      const contract = new Contract(VESTING_CONTRACT_WASM);
      const operation = contract.call(
        'create_schedule',
        tokenAddress,
        config.beneficiary,
        config.amount,
        Math.floor(config.startDate.getTime() / 1000),
        config.cliffDate ? Math.floor(config.cliffDate.getTime() / 1000) : 0,
        Math.floor(config.endDate.getTime() / 1000),
        config.vestingType,
        config.revocable
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
      // Dynamically import Stellar SDK
      const { Contract, SorobanRpc, TransactionBuilder } = await import('@stellar/stellar-sdk');
      
      const account = await getAccountInfo(creatorPublicKey, this.network);
      const { networkPassphrase } = getNetwork(this.network);
      const rpc = new SorobanRpc.Server(this.rpcUrl);

      const contract = new Contract(AIRDROP_CONTRACT_WASM);
      const recipients = config.recipients.map(r => [r.address, r.amount]);
      
      const operation = contract.call(
        'create_campaign',
        tokenAddress,
        config.type,
        recipients,
        Math.floor(config.startDate.getTime() / 1000),
        config.endDate ? Math.floor(config.endDate.getTime() / 1000) : 0
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