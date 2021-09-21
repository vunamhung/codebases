import config from '@redbubble/boom-config';

const isDev = process.env.BUILD_FLAG_IS_DEV;
const isClient = process.env.BUILD_FLAG_IS_CLIENT;

// We use "process.env.BUILD_FLAG_IS_NODE" here to tell webpack to include this code in
// node bundles and exclude it from client bundles. This has to happen at build time.
// This is a security measure to ensure that ./values.js is not included in client bundles.
let values;

if (typeof process.env.BUILD_FLAG_IS_NODE === 'undefined' || process.env.BUILD_FLAG_IS_NODE === 'true') {
  // eslint-disable-next-line global-require
  values = require('./values').default;
}

export default config(values, { isDev, isClient });
