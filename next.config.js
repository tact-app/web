const withTM = require('next-transpile-modules')(['react-hotkeys-hook']);

module.exports = withTM({
  output: 'standalone',
});
