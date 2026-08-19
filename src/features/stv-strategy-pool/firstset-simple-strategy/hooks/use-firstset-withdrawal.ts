import { useMemo } from 'react';
import { useProcessWithdrawal } from '../../shared';
import { useFirstsetPosition } from './use-firstset-position';

/**
 * Withdrawal for a strategy with no external venue.
 *
 * The Earn flow is two stages: the Withdraw form requests an exit from Mellow's
 * redeem queue, and days later a separate "Process" action repays the vault
 * liability and files the stVault withdrawal request. Here the first stage does
 * not exist -- the wstETH is on the user's forwarder from the moment it was
 * minted -- so the two collapse into the second, and `useProcessWithdrawal`
 * (already strategy-agnostic: it only encodes `burnWsteth` and
 * `requestWithdrawalFromPool`) does the whole job.
 *
 * The four amounts come straight from the shared position hook rather than from
 * a user-entered figure. That is deliberate: translating a requested ETH amount
 * into (stv, repay, rebalance) is the non-linear split in
 * `splitExcessLiability`, and quoting it wrongly either reverts or silently
 * rebalances more debt than the user intended. Withdrawing the whole available
 * position needs no such conversion, and is the case that actually matters here.
 */
export const useFirstsetWithdrawal = () => {
  const { positionData, isPositionLoading } = useFirstsetPosition();
  const { processWithdrawal, mutation } = useProcessWithdrawal();

  const request = useMemo(() => {
    if (!positionData) return undefined;

    const stvToWithdraw = positionData.totalStvToWithdrawFromProxy;
    const ethToReceive = positionData.totalEthToWithdrawFromProxy;
    const sharesToRepay = positionData.stethSharesToRepay;
    const sharesToRebalance = positionData.stethSharesToRebalance;

    // Nothing to do at all: no stv leaving and no liability to repay.
    if (stvToWithdraw <= 0n && sharesToRepay <= 0n) return undefined;

    return {
      stvToWithdraw,
      ethToReceive,
      sharesToRepay,
      sharesToRebalance,
      stethToRepay: positionData.stethToRepay,
      // stv staying put while liability is repaid: a heal, not a withdrawal
      isHealing: stvToWithdraw <= 0n,
    };
  }, [positionData]);

  return {
    request,
    isLoading: isPositionLoading,
    isPending: mutation.isPending,
    submit: request
      ? () =>
          processWithdrawal({
            stvToWithdraw: request.stvToWithdraw,
            sharesToRepay: request.sharesToRepay,
            sharesToRebalance: request.sharesToRebalance,
            ethToReceive: request.ethToReceive,
          })
      : undefined,
  };
};
