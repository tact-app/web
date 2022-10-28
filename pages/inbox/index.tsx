import dynamic from 'next/dynamic';

const DynamicTaskPage = dynamic(() => import('../../components/pages/Inbox'), {
  ssr: false,
});

export default function Tasks() {
  return <DynamicTaskPage />;
}
