import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const DynamicGoalsPage = dynamic(() => import('../../components/pages/Goals/MainPage'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function Goals() {
  return <DynamicGoalsPage />;
}

export const getServerSideProps = withPageAuthRequired();
