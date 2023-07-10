import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const DynamicSpacesPage = dynamic(
  () => import('../../components/pages/Spaces'),
  {
    loading: () => <PageLoader />,
    ssr: false,
  }
);

export default function Spaces() {
  return <DynamicSpacesPage />;
}

export const getServerSideProps = withPageAuthRequired();
