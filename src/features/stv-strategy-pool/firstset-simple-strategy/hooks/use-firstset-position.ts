import { useEthUsd } from '@/modules/web3';
import { useStrategyPosition } from '../../shared';
import { useFirstsetStrategy } from './use-firstset-strategy';

/**
 * The position for a strategy with no external venue.
 *
 * `useStrategyPosition` is already strategy-agnostic -- it reads `wstethOf`,
 * `mintedStethSharesOf` and `WSTETH` off the strategy and everything else off the
 * pool. The three Mellow-shaped parameters describe value parked in an external
 * protocol's queues, which for this strategy is always nothing:
 *
 *   strategyStethSharesBalance          -- shares held in the venue        -> 0
 *   strategyDepositStethSharesOffset    -- queued, not yet deposited       -> 0
 *   strategyWithdrawalStethSharesOffset -- queued, not yet withdrawn       -> 0
 *
 * The minted wstETH simply sits on the user's forwarder, which the shared hook
 * already accounts for via `wstethOf`.
 */
export const useFirstsetPosition = () => {
  const { data: firstsetStrategy } = useFirstsetStrategy();

  const { data: positionData, isLoading: isPositionLoading } =
    useStrategyPosition({
      strategyProxyAddress: firstsetStrategy?.strategyProxyAddress,
      strategyStethSharesBalance: 0n,
      strategyDepositStethSharesOffset: 0n,
      strategyWithdrawalStethSharesOffset: 0n,
    });

  const { usdAmount: totalUserValueInUsd, isLoading: isUsdAmountLoading } =
    useEthUsd(positionData?.totalUserValueInEth);

  return {
    positionData,
    isPositionLoading,
    totalUserValueInUsd,
    isUsdAmountLoading,
  };
};
