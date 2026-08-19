import {
  DashboardBalanceApy,
  DashboardContainer,
} from '@/shared/wrapper/dashboard';
import { useFirstsetPosition } from '../hooks';
import { WithdrawalRequests } from '../withdrawal';

export const Dashboard = () => {
  const {
    isPositionLoading,
    positionData,
    totalUserValueInUsd,
    isUsdAmountLoading,
  } = useFirstsetPosition();

  return (
    <DashboardContainer>
      {/* No APY: this strategy has no yield venue, so there is no strategy APR to
          quote beyond the validators' own. Passing no aprData renders it as absent
          rather than as zero, which would be a different and wrong claim. */}
      <DashboardBalanceApy
        token={'ETH'}
        balance={positionData?.totalUserValueInEth}
        isBalanceLoading={isPositionLoading}
        isUSDAmountLoading={isUsdAmountLoading}
        usdAmount={totalUserValueInUsd}
        isAPYLoading={false}
      />
      {/* Same view as the Withdraw tab. The dashboard stays visible while a queue
          request is open, so it has to show the thing keeping it visible. */}
      <WithdrawalRequests />
    </DashboardContainer>
  );
};
