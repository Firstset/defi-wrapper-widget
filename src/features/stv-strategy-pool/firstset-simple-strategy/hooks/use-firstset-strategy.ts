import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { useStvStrategy } from '@/modules/defi-wrapper';
import { VAULT_REPORT_REFETCH_INTERVAL_MS } from '@/modules/vaults';
import { useDappStatus, useLidoSDK } from '@/modules/web3';

import { getFirstsetSimpleStrategyContract } from '../contracts';

/**
 * Reads the pieces of FirstsetSimpleStrategy the generic strategy ABI does not cover:
 * the caller's StrategyCallForwarder, the mint cap, and the pause flags.
 *
 * There is no external protocol behind this strategy, so unlike the Earn ETH module
 * there are no queues or share manager to resolve -- the whole position lives on the
 * pool and on the forwarder.
 */
export const useFirstsetStrategy = () => {
  const { publicClient } = useLidoSDK();
  const { address } = useDappStatus();
  const { wrapper, strategy, strategyId } = useStvStrategy();

  if (strategyId) {
    invariant(
      strategyId === 'strategy.firstset.simple',
      'Invalid strategyId for Firstset Simple Strategy',
    );
  }

  return useQuery({
    queryKey: [
      'wrapper',
      wrapper?.address,
      'firstset-simple-strategy',
      strategy?.address,
      { address, chainId: publicClient.chain?.id },
    ],
    throwOnError: true,
    enabled: !!wrapper && !!strategy && !!address,
    refetchInterval: VAULT_REPORT_REFETCH_INTERVAL_MS,
    queryFn: async () => {
      invariant(wrapper, 'wrapper is required');
      invariant(strategy, 'strategy is required');
      invariant(address, 'address is required');

      const firstsetStrategy = getFirstsetSimpleStrategyContract(
        strategy.address,
        publicClient,
      );

      const [supplyFeature, redeemFeature] = await Promise.all([
        firstsetStrategy.read.SUPPLY_FEATURE(),
        firstsetStrategy.read.REDEEM_FEATURE(),
      ]);

      const [
        strategyProxyAddress,
        maxMintBP,
        isDepositPaused,
        isWithdrawalPaused,
        isAllowListEnabled,
        isUserAllowListed,
      ] = await Promise.all([
        firstsetStrategy.read.getStrategyCallForwarderAddress([address]),
        firstsetStrategy.read.MAX_MINT_BP(),
        firstsetStrategy.read.isFeaturePaused([supplyFeature]),
        firstsetStrategy.read.isFeaturePaused([redeemFeature]),
        firstsetStrategy.read.ALLOW_LIST_ENABLED(),
        firstsetStrategy.read.isAllowListed([address]),
      ]);

      return {
        firstsetStrategy,
        // named to match the Earn module so the shared hooks read the same way:
        // this is the caller's per-user forwarder, not the strategy proxy itself
        strategyProxyAddress,
        maxMintBP,
        state: {
          isDepositPaused,
          isWithdrawalPaused,
          isAllowListEnabled,
          isUserAllowListed,
        },
      };
    },
  });
};
