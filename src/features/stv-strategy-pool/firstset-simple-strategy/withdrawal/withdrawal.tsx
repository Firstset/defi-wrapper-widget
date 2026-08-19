import { Button, Text, VStack } from '@chakra-ui/react';
import { WithdrawalPausedAlert } from '@/shared/components/paused-alert';
import { Tooltip } from '@/shared/components/tooltip';
import {
  VaultInfo,
  VaultInfoEntry,
  VaultInfoSection,
} from '@/shared/components/vault-info';
import { WaitingTime } from '@/shared/wrapper/withdrawal/waiting-time';

import { useFirstsetStrategy, useFirstsetWithdrawal } from '../hooks';

export const Withdrawal = () => {
  const { data: firstsetStrategy } = useFirstsetStrategy();
  const { request, isPending, submit } = useFirstsetWithdrawal();

  return (
    <VStack align="stretch" gap={6}>
      <WithdrawalPausedAlert
        isPaused={firstsetStrategy?.state.isWithdrawalPaused}
      />

      {!request && (
        <Text textStyle="sm" color="fg.muted">
          Nothing available to withdraw.
        </Text>
      )}

      {request && !request.isHealing && (
        <VaultInfo>
          <VaultInfoSection label={'Available to withdraw'}>
            <VaultInfoEntry
              token={'ETH'}
              amount={request.ethToReceive}
              suffix={
                <Tooltip
                  content={
                    'Repays the minted stETH from wstETH held on your forwarder, then files a withdrawal request against the stVault. There is no strategy queue to wait on first.'
                  }
                >
                  <Button
                    disabled={!submit}
                    loading={isPending}
                    onClick={() => submit?.()}
                    size={'xs'}
                  >
                    {'Withdraw'}
                  </Button>
                </Tooltip>
              }
            />
          </VaultInfoSection>
        </VaultInfo>
      )}

      {request && request.isHealing && (
        <VaultInfo>
          <VaultInfoSection label={'Heal your position'}>
            <VaultInfoEntry
              token={'STETH'}
              amount={request.stethToRepay}
              suffix={
                <Tooltip
                  content={
                    'Repays liability to the vault without withdrawing ETH, partially healing an unbalanced position.'
                  }
                >
                  <Button
                    disabled={!submit}
                    loading={isPending}
                    onClick={() => submit?.()}
                    size={'xs'}
                  >
                    Heal Position
                  </Button>
                </Tooltip>
              }
            />
          </VaultInfoSection>
        </VaultInfo>
      )}

      {/* The stVault queue delay only. This strategy adds no wait of its own --
          there is no external venue to exit first. */}
      <WaitingTime waitingTime="7 days" />
    </VStack>
  );
};
