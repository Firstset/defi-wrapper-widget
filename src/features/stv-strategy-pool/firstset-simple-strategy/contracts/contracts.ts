import { type Address, getContract, type GetContractReturnType } from 'viem';

import type { RegisteredPublicClient } from '@/modules/web3';
import { getEncodable, EncodableContract } from '@/utils/encodable';

import {
  FirstsetSimpleStrategyAbi,
  type FirstsetSimpleStrategyAbiType,
} from './abi';

export type GetFirstsetSimpleStrategyContractReturnType = EncodableContract<
  GetContractReturnType<FirstsetSimpleStrategyAbiType, RegisteredPublicClient>
>;

export const getFirstsetSimpleStrategyContract = (
  address: Address,
  publicClient: RegisteredPublicClient,
): GetFirstsetSimpleStrategyContractReturnType => {
  return getEncodable(
    getContract({
      address,
      abi: FirstsetSimpleStrategyAbi,
      client: publicClient,
    }),
  );
};
