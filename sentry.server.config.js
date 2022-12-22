import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://05be0b4fa8d8494382ae920592a94c52@o1099367.ingest.sentry.io/4504373784412160',
  tracesSampleRate: 1.0,
});
