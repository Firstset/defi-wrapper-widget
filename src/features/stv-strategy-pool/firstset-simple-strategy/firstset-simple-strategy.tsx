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

  return (
    <Navigation
      tabs={TABS}
      showDashboard={!!positionData?.totalUserValueInEth}
    />
  );
};
