const withTranspileModules = require('next-transpile-modules')(['react-hotkeys-hook']);
const {withSentryConfig} = require('@sentry/nextjs');

const moduleExports = {
  sentry: {
    hideSourceMaps: true,
  },
  output: 'standalone',
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(
  withTranspileModules(moduleExports),
  sentryWebpackPluginOptions,
);
