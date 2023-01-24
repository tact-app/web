const {withSentryConfig} = require('@sentry/nextjs');

// some stupid comment

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
