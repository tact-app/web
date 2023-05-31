const nextConfig = {
  output: 'standalone',
  transpilePackages: ['react-hotkeys-hook'],
};

if (['staging', 'production'].includes(process.env.APP_ENV)) {
    const { withSentryConfig } = require('@sentry/nextjs');

    const next = {
        sentry: {
            hideSourceMaps: true,
        },
        ...nextConfig,
    }

    const webpack = {
        silent: true,
    };

    module.exports = withSentryConfig(next, webpack);
    return;
}

module.exports = nextConfig;
