import { useRequests } from '@/modules/defi-wrapper';
import { Navigation, TAB } from '@/shared/wrapper/navigation';

import { Dashboard } from './dashboard';
import { Deposit } from './deposit';
import { useFirstsetPosition } from './hooks';
import { Withdrawal } from './withdrawal';

const TABS: TAB[] = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    component: Dashboard,
  },
  {
    label: 'Deposit',
    value: 'deposit',
    component: Deposit,
  },
  {
    label: 'Withdraw',
    value: 'withdraw',
    component: Withdrawal,
  },
];

export const FirstsetSimpleStrategy = () => {
  const { positionData } = useFirstsetPosition();
  const { data: requests } = useRequests();

  // Mirrors the Earn module: an outstanding queue request keeps the dashboard
  // visible after the position itself has emptied. Keying only on position value
  // makes the tab vanish the moment a withdrawal is filed, which is exactly when
  // the user most wants to see it.
  const hasOpenRequests =
    (requests?.pending.length ?? 0) > 0 ||
    (requests?.finalized.length ?? 0) > 0;

  return (
    <Navigation
      tabs={TABS}
      showDashboard={hasOpenRequests || !!positionData?.totalUserValueInEth}
    />
  );
};
