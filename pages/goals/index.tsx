import dynamic from 'next/dynamic';

const DynamicGoalsPage = dynamic(() => import('../../components/pages/Goals'), {
  ssr: false,
})

export default function Goals() {
  return <DynamicGoalsPage />;
}
