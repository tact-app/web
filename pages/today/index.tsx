import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';

const DynamicTaskPage = dynamic(() => import('../../components/pages/Tasks'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function Tasks() {
  return <DynamicTaskPage />;
}
