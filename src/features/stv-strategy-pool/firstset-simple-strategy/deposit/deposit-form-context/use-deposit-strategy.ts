import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useStvStrategy } from '@/modules/defi-wrapper';
import { readWithReport, useReportCalls, useVault } from '@/modules/vaults';
import {
  TransactionEntry,
  useDappStatus,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from '@/modules/web3';

import {
  DEFAULT_LOADING_DESCRIPTION,
  DEFAULT_SIGNING_DESCRIPTION,
  useTransactionModal,
} from '@/shared/components/transaction-modal';
import { getReferralAddress } from '@/shared/wrapper/refferals/get-refferal-address';
import { minBN } from '@/utils/bn';
import { formatBalance } from '@/utils/formatBalance';
import { tokenLabel } from '@/utils/token-label';
import { useFirstsetStrategy } from '../../hooks';
import type { DepositFormValidatedValues } from './types';

export const useDepositStrategy = () => {
  const { address } = useDappStatus();
  const { activeVault } = useVault();
  const { publicClient, core, WETH } = useLidoSDK();
  const { strategy, dashboard } = useStvStrategy();
  const { data: firstsetStrategy } = useFirstsetStrategy();
  const { onTransactionStageChange } = useTransactionModal();

  const prepareReportCalls = useReportCalls();

  const { sendTX, ...rest } = useSendTransaction({
    callback: onTransactionStageChange,
  });

  return {
    depositStrategy: useCallback(
      async ({ amount, token, referral }: DepositFormValidatedValues) => {
        invariant(address, '[useDeposit] address is undefined');
        invariant(strategy, '[useDeposit] strategy is undefined');
        invariant(dashboard, '[useDeposit] dashboard is undefined');
        invariant(
          firstsetStrategy,
          '[useDeposit] firstsetStrategy is undefined',
        );

        const wethContract = await WETH.wethContract();
        const lidoV3 = await core.getLidoContract();

        const depositedETHAmount = formatBalance(amount).actual;
        const TXTitle = `Depositing ${depositedETHAmount} ${tokenLabel('ETH')} to the vault`;
        const { success } = await withSuccess(
          sendTX({
            successText: `${depositedETHAmount} ${tokenLabel('ETH')} has been deposited to the vault`,
            AATitleText: TXTitle,
            flow: 'deposit',
            AASigningDescription: DEFAULT_SIGNING_DESCRIPTION,
            AALoadingDescription: DEFAULT_LOADING_DESCRIPTION,
            transactions: async () => {
              const calls: TransactionEntry[] = [];
              if (token === 'WETH') {
                calls.push({
                  ...wethContract.encode.withdraw([amount]),
                  loadingText: `Unwrapping ${tokenLabel('WETH')} to ${depositedETHAmount} ${tokenLabel('ETH')} `,
                  signingDescription: DEFAULT_SIGNING_DESCRIPTION,
                  loadingDescription: DEFAULT_LOADING_DESCRIPTION,
                });
              }

              const [
                strategyCapacityShares,
                vaultCapacityShares,
                maxMintableExternalShares,
                currentMintedExternalShares,
              ] = await readWithReport({
                publicClient,
                report: activeVault?.report,
                contracts: [
                  // Quote from the STRATEGY, not the pool. The pool's
                  // remainingMintingCapacitySharesOf knows nothing about MAX_MINT_BP and
                  // would over-report, and minting that amount reverts MintCapExceeded.
                  // The strategy's view already returns min(pool capacity, its own cap),
                  // and simulates the deposit's rounding, so the number it gives is
                  // exactly mintable.
                  firstsetStrategy.firstsetStrategy.prepare.remainingMintingCapacitySharesOf(
                    [address, amount],
                  ),
                  dashboard.prepare.remainingMintingCapacityShares([amount]),
                  // not dependant on report but benefit from batch
                  lidoV3.prepare.getMaxMintableExternalShares(),
                  lidoV3.prepare.getExternalShares(),
                ],
              });

              const maxMintShares = minBN(
                strategyCapacityShares,
                vaultCapacityShares,
                maxMintableExternalShares - currentMintedExternalShares,
              );

              const reportCalls = prepareReportCalls();
              calls.push(...reportCalls);

              const referralAddress = await getReferralAddress(
                referral,
                publicClient,
              );

              calls.push({
                // `_params` is unused by this strategy -- there is no external venue to
                // pass supply options to -- so it is empty rather than an encoded struct.
                ...strategy.encode.supply([
                  referralAddress,
                  maxMintShares,
                  '0x',
                ]),
                value: amount,
                loadingText: TXTitle,
                signingDescription: DEFAULT_SIGNING_DESCRIPTION,
                loadingDescription: DEFAULT_LOADING_DESCRIPTION,
              });

              return calls;
            },
          }),
        );

        return success;
      },
      [
        address,
        strategy,
        dashboard,
        firstsetStrategy,
        WETH,
        core,
        sendTX,
        publicClient,
        activeVault?.report,
        prepareReportCalls,
      ],
    ),
    ...rest,
  };
};
