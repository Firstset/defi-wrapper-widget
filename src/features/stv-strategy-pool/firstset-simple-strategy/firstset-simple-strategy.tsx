import { Navigation, TAB } from '@/shared/wrapper/navigation';

import { Dashboard } from './dashboard';
import { useFirstsetPosition } from './hooks';

const TABS: TAB[] = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    component: Dashboard,
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
