import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';

const DynamicGoalsArchivePage = dynamic(() => import('../../components/pages/Goals/pages/Archive'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function GoalsArchive() {
  return <DynamicGoalsArchivePage />;
}
