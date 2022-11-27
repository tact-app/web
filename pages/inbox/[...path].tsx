import dynamic from 'next/dynamic';
import { PageLoader } from '../../components/shared/PageLoader';

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
