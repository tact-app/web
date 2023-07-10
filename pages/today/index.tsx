import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const DynamicTaskPage = dynamic(() => import('../../components/pages/Today'), {
  loading: () => <PageLoader />,
  ssr: false,
});

export default function Tasks() {
  return <DynamicTaskPage />;
}

export const getServerSideProps = withPageAuthRequired();
