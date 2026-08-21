import { DepositPausedBecauseOfMintingAlert } from '@/shared/components/paused-alert';
import { FormContainer } from '@/shared/hook-form/container';
import { SubmitButton } from '@/shared/hook-form/controls';

import { useFirstsetStrategy } from '../hooks';
import { DepositFormProvider } from './deposit-form-context';
import { DepositInputGroup } from './deposit-input-group';

export const Deposit = () => {
  const { data: firstsetStrategy } = useFirstsetStrategy();
  return (
    <DepositFormProvider>
      <FormContainer>
        <DepositPausedBecauseOfMintingAlert
          isPaused={firstsetStrategy?.state.isDepositPaused}
        />
        {/* No APY panel and no pending-deposit or healing warnings: this strategy
            has no external venue, so there is no second APR to quote and no queued
            deposit that could be in flight. */}
        <DepositInputGroup />
        <SubmitButton>Deposit</SubmitButton>
      </FormContainer>
    </DepositFormProvider>
  );
};
