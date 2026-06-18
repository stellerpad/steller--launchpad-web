// Contract interaction utilities
// Uses dynamic imports to avoid SSR issues with Stellar SDK

import { getNetwork, getAccountInfo } from './stellar';
import { signTransactionWithFreighter } from './freighter';
import {
  TokenConfig,
  VestingConfig,
  AirdropConfig,
  VestingSchedule,
  AirdropCampaign
} from '@/types';

const TOKEN_CONTRACT_ID = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ID || 'token_contract_id_placeholder';
const VESTING_CONTRACT_ID = process.env.NEXT_PUBLIC_VESTING_CONTRACT_ID || 'vesting_contract_id_placeholder';
const AIRDROP_CONTRACT_ID = process.env.NEXT_PUBLIC_AIRDROP_CONTRACT_ID || 'airdrop_contract_id_placeholder';

type ContractType = 'token' | 'vesting' | 'airdrop';
type ScValArg = { value: unknown; type: { type: string } };

export class ContractService {
  private network: 'testnet' | 'mainnet';
  private rpcUrl: string;

  constructor(network: 'testnet' | 'mainnet') {
    this.network = network;
    const { rpcUrl } = getNetwork(network);
    this.rpcUrl = rpcUrl;
  }

  private getContractId(contract: ContractType): string {
    const id =
      contract === 'token'
        ? TOKEN_CONTRACT_ID
        : contract === 'vesting'
        ? VESTING_CONTRACT_ID
        : AIRDROP_CONTRACT_ID;

    if (!id || id.includes('_placeholder')) {
      throw new Error(`Missing ${contract} contract address. Set NEXT_PUBLIC_${contract.toUpperCase()}_CONTRACT_ID.`);
    }

    return id;
  }

  private static toString(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean') {
      return String(value);
    }

    if (typeof value === 'object' && value && 'toString' in value) {
      return (value as { toString: () => string }).toString();
    }

    return '';
  }

  private static parseDate(value: unknown): Date {
    if (value === undefined || value === null) {
      return new Date(0);
    }

    if (typeof value === 'string' && /^\d+$/.test(value)) {
      return new Date(Number(value) * 1000);
    }

    if (typeof value === 'number' || typeof value === 'bigint') {
      return new Date(Number(value) * 1000);
    }

    const date = new Date(value as string);
    return Number.isNaN(date.getTime()) ? new Date(0) : date;
  }

  private parseVestingConfig(raw: any): VestingConfig {
    const values = Array.isArray(raw) ? raw : raw || {};
    const beneficiary = Array.isArray(values)
      ? ContractService.toString(values[0])
      : ContractService.toString(values.beneficiary ?? values[0]);
    const amount = Array.isArray(values)
      ? ContractService.toString(values[1])
      : ContractService.toString(values.amount ?? values[1]);
    const vestingType = (Array.isArray(values)
      ? values[2]
      : values.vestingType ?? values[2]) as VestingConfig['vestingType'];
    const startDate = ContractService.parseDate(
      Array.isArray(values) ? values[3] : values.startDate ?? values[3]
    );
    const cliffDateValue = Array.isArray(values) ? values[4] : values.cliffDate ?? values[4];
    const endDate = ContractService.parseDate(
      Array.isArray(values) ? values[5] : values.endDate ?? values[5]
    );
    const revocable = Array.isArray(values)
      ? Boolean(values[6])
      : Boolean(values.revocable ?? values[6]);

    return {
      beneficiary,
      amount,
      vestingType: vestingType || 'linear',
      startDate,
      cliffDate: cliffDateValue ? ContractService.parseDate(cliffDateValue) : undefined,
      endDate,
      revocable
    };
  }

  private parseAirdropRecipients(raw: any): AirdropConfig['recipients'] {
    const recipients = Array.isArray(raw) ? raw : [];

    return recipients.map((recipient: any) => {
      if (Array.isArray(recipient)) {
        return {
          address: ContractService.toString(recipient[0]),
          amount: ContractService.toString(recipient[1])
        };
      }

      return {
        address: ContractService.toString(recipient.address ?? recipient[0]),
        amount: ContractService.toString(recipient.amount ?? recipient[1])
      };
    });
  }

  private parseAirdropConfig(raw: any): AirdropConfig {
    const values = Array.isArray(raw) ? raw : raw || {};
    const type = Array.isArray(values)
      ? ContractService.toString(values[0]) as AirdropConfig['type']
      : ContractService.toString(values.type ?? values[0]) as AirdropConfig['type'];
    const recipients = this.parseAirdropRecipients(
      Array.isArray(values) ? values[1] : values.recipients ?? values[1]
    );
    const startDate = ContractService.parseDate(
      Array.isArray(values) ? values[2] : values.startDate ?? values[2]
    );
    const endDateValue = Array.isArray(values) ? values[3] : values.endDate ?? values[3];

    return {
      type: (type || 'equal') as AirdropConfig['type'],
      recipients,
      startDate,
      endDate: endDateValue ? ContractService.parseDate(endDateValue) : undefined
    };
  }

  private parseVestingSchedule(raw: any): VestingSchedule {
    const isArray = Array.isArray(raw);
    const id = ContractService.toString(isArray ? raw[0] : raw.id ?? raw[0]);
    const tokenAddress = ContractService.toString(isArray ? raw[1] : raw.tokenAddress ?? raw[1]);
    const beneficiary = ContractService.toString(isArray ? raw[2] : raw.beneficiary ?? raw[2]);
    const totalAmount = ContractService.toString(isArray ? raw[3] : raw.totalAmount ?? raw[3]);
    const releasedAmount = ContractService.toString(isArray ? raw[4] : raw.releasedAmount ?? raw[4]);
    const claimableAmount = ContractService.toString(isArray ? raw[5] : raw.claimableAmount ?? raw[5]);
    const configRaw = isArray ? raw[6] : raw.config ?? raw[6];

    return {
      id,
      tokenAddress,
      beneficiary,
      totalAmount,
      releasedAmount,
      claimableAmount,
      config: configRaw ? this.parseVestingConfig(configRaw) : {
        beneficiary,
        amount: totalAmount,
        vestingType: 'linear',
        startDate: new Date(0),
        endDate: new Date(0),
        revocable: false
      }
    };
  }

  private parseAirdropCampaign(raw: any): AirdropCampaign {
    const isArray = Array.isArray(raw);
    const id = ContractService.toString(isArray ? raw[0] : raw.id ?? raw[0]);
    const tokenAddress = ContractService.toString(isArray ? raw[1] : raw.tokenAddress ?? raw[1]);
    const creator = ContractService.toString(isArray ? raw[2] : raw.creator ?? raw[2]);
    const configRaw = isArray ? raw[3] : raw.config ?? raw[3];
    const distributedAmount = ContractService.toString(isArray ? raw[4] : raw.distributedAmount ?? raw[4]);
    const totalAmount = ContractService.toString(isArray ? raw[5] : raw.totalAmount ?? raw[5]);
    const status = ContractService.toString(isArray ? raw[6] : raw.status ?? raw[6]) as AirdropCampaign['status'];

    return {
      id,
      tokenAddress,
      creator,
      config: configRaw ? this.parseAirdropConfig(configRaw) : {
        type: 'equal',
        recipients: [],
        startDate: new Date(0)
      },
      distributedAmount,
      totalAmount,
      status: status || 'pending'
    };
  }

  private async simulateContractCall(
    contractType: 'vesting' | 'airdrop',
    method: string,
    args: ScValArg[],
    publicKey: string
  ): Promise<unknown> {
    const { Contract, SorobanRpc, TransactionBuilder, nativeToScVal } = await import('@stellar/stellar-sdk');
    const account = await getAccountInfo(publicKey, this.network);
    const { networkPassphrase } = getNetwork(this.network);
    const rpc = new SorobanRpc.Server(this.rpcUrl);

    const contract = new Contract(this.getContractId(contractType));
    const operation = contract.call(
      method,
      ...args.map((arg) => nativeToScVal(arg.value, arg.type))
    );

    const transaction = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const response = await rpc.simulateTransaction(transaction) as any;
    if (response?.error) {
      throw new Error(`Simulation failed: ${response.error}`);
    }

    return response?.result?.retval ?? null;
  }

  private async submitContractTransaction(
    contractType: 'vesting' | 'airdrop',
    method: string,
    args: ScValArg[],
    signerPublicKey: string
  ) {
    const { Contract, SorobanRpc, TransactionBuilder, nativeToScVal } = await import('@stellar/stellar-sdk');
    const account = await getAccountInfo(signerPublicKey, this.network);
    const { networkPassphrase } = getNetwork(this.network);
    const rpc = new SorobanRpc.Server(this.rpcUrl);

    const contract = new Contract(this.getContractId(contractType));
    const operation = contract.call(
      method,
      ...args.map((arg) => nativeToScVal(arg.value, arg.type))
    );

    const transaction = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const prepared = await rpc.prepareTransaction(transaction);
    const signedXdr = await signTransactionWithFreighter(prepared.toXDR(), {
      networkPassphrase,
      accountToSign: signerPublicKey
    });
    const signedTx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);

    const response = await rpc.sendTransaction(signedTx);
    if (response.status === 'ERROR' || response.status === 'DUPLICATE' || response.status === 'TRY_AGAIN_LATER') {
      throw new Error(`Transaction failed with status ${response.status}`);
    }

    return response;
  }

  async fetchVestingSchedules(beneficiaryPublicKey: string): Promise<VestingSchedule[]> {
    const raw = await this.simulateContractCall(
      'vesting',
      'get_schedules',
      [{ value: beneficiaryPublicKey, type: { type: 'address' } }],
      beneficiaryPublicKey
    );

    if (!Array.isArray(raw)) return [];
    return raw.map((item: any) => this.parseVestingSchedule(item));
  }

  async fetchAirdropCampaigns(creatorPublicKey: string): Promise<AirdropCampaign[]> {
    const raw = await this.simulateContractCall(
      'airdrop',
      'get_campaigns',
      [{ value: creatorPublicKey, type: { type: 'address' } }],
      creatorPublicKey
    );

    if (!Array.isArray(raw)) return [];
    return raw.map((item: any) => this.parseAirdropCampaign(item));
  }

  async claimVested(scheduleId: string, signerPublicKey: string): Promise<void> {
    await this.submitContractTransaction(
      'vesting',
      'claim_vested',
      [{ value: BigInt(scheduleId), type: { type: 'u64' } }],
      signerPublicKey
    );
  }

  async distributeCampaign(campaignId: string, signerPublicKey: string): Promise<void> {
    await this.submitContractTransaction(
      'airdrop',
      'distribute_campaign',
      [{ value: BigInt(campaignId), type: { type: 'u64' } }],
      signerPublicKey
    );
  }
}
