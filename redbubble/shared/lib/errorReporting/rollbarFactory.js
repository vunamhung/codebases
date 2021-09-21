import Rollbar from 'rollbar';

export const SERVER = 'SERVER';
export const CLIENT = 'CLIENT';

const rollbarFactory = (client, token, environment, version) => {
  const isBrowser = typeof window !== 'undefined';
  const isDev = environment === 'development';

  const options = {
    scrubFields: ['password', 'refreshToken'],
    captureUncaught: isBrowser && client === CLIENT,
    captureUnhandledRejections: isBrowser && client === CLIENT,
    hostWhiteList: isBrowser && client === CLIENT ? ['www.redbubble.com'] : undefined,
    enabled: !!token,
  };

  const rollbar = new Rollbar({
    ...options,
    accessToken: token,
    environment,
    payload: {
      client: {
        javascript: {
          code_version: version,
          source_map_enabled: true,
          guess_uncaught_frames: true,
        },
      },
    },
    ignoredMessages: isBrowser && client === CLIENT
      ? [
        'The internet connection appears to be offline.',
        'The operation is insecure.',
        'Failed to fetch',
        'Can\'t find variable: twttr',
        'Can\'t find variable: rdt',
        'Can\'t find variable: snaptr',
      ]
      : [
        'fetchjson error.*502',
        'fetchjson error.*504',
        'request to.*socket hang up',
      ],
  });

  return (err, req, payload) => {
    // eslint-disable-next-line no-console
    if (isDev) console.error(err, payload);
    if (token) rollbar.error(err, req, payload);
  };
};

export default rollbarFactory;
