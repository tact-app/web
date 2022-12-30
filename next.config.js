const {withSentryConfig} = require('@sentry/nextjs');

const moduleExports = {
  output: 'standalone',
  sentry: {
    hideSourceMaps: true,
  },
  transpilePackages: ['react-hotkeys-hook'],
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(
  moduleExports,
  sentryWebpackPluginOptions,
);
