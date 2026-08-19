import { useClaim, useRequests } from '@/modules/defi-wrapper';
import { VaultInfo } from '@/shared/components/vault-info';
import {
  FinalizedRequests,
  PendingRequests,
} from '@/shared/components/withdrawal-requests';

/**
 * Requests already filed against the stVault's WithdrawalQueue.
 *
 * Both the reader and the components are generic -- `useRequests` reads
 * `withdrawalRequestsOf` off the queue and splits pending from finalized, with no
 * strategy involvement -- so this is the same view the Earn module shows, minus
 * the Mellow redeem-queue requests that sit in front of it there.
 *
 * A request stays pending until the crank finalizes it, which needs a fresh
 * report and the request to be at least an hour old.
 */
export const WithdrawalRequests = () => {
  const { data: requests } = useRequests();
  const { claim, mutation } = useClaim();

  const pending = requests?.pending;
  const finalized = requests?.finalized;

  if (!pending?.length && !finalized?.length) return null;

  return (
    <VaultInfo>
      <PendingRequests
        label={'Pending withdrawal requests from stVault'}
        requests={pending}
      />
      <FinalizedRequests
        isClaimLoading={mutation.isPending}
        onClaim={({ id, amountOfAssets, checkpointHint }) =>
          claim({ id, amountETH: amountOfAssets, checkpointHint })
        }
        requests={finalized}
      />
    </VaultInfo>
  );
};
