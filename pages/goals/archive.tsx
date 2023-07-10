import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const DynamicGoalsArchivePage = dynamic(() => import('../../components/pages/Goals/ArchivePage'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function GoalsArchive() {
  return <DynamicGoalsArchivePage />;
}

export const getServerSideProps = withPageAuthRequired();
