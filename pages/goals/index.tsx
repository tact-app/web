import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';

const DynamicGoalsPage = dynamic(() => import('../../components/pages/Goals/MainPage'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function Goals() {
  return <DynamicGoalsPage />;
}
