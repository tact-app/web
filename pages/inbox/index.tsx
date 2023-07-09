import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export { default } from './[...path]';

export const getServerSideProps = withPageAuthRequired();
