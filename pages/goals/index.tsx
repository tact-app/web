import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';

const DynamicGoalsPage = dynamic(() => import('../../components/pages/Goals'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function Goals() {
  return <DynamicGoalsPage />;
}
