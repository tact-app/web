import dynamic from 'next/dynamic';

const DynamicSpacesPage = dynamic(
  () => import('../../components/pages/Spaces'),
  {
    ssr: false,
  }
);

export default function Spaces() {
  return <DynamicSpacesPage />;
}
