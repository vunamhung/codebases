import config from '../../../config';

export const datadogRUM = () => {
  if (typeof window === 'undefined') return;
  (function (h, o, u, n, d) {
    /* eslint-disable no-param-reassign, prefer-destructuring, no-multi-assign */
    h = h[d] = h[d] || {
      q: [],
      onReady(c) {
        h.q.push(c);
      },
    };
    d = o.createElement(u);
    d.async = 1;
    d.src = n;
    n = o.getElementsByTagName(u)[0];
    n.parentNode.insertBefore(d, n);
    /* eslint-enable no-param-reassign, prefer-destructuring, no-multi-assign */
  }(
    window,
    document,
    'script',
    'https://www.datadoghq-browser-agent.com/datadog-rum.js',
    'DD_RUM',
  ));
  window.DD_RUM.onReady(() => {
    window.DD_RUM.init({
      applicationId: config('datadogRumAppId'),
      clientToken: config('datadogRumClientId'),
      service: config('datadogRumServiceName'),
      env: config('environment'),
      sampleRate: config('datadogRumSampleRate'),
      trackInteractions: config('datadogRumTrackInteractions'),
      silentMultipleInit: config('datadogRumSilentMultiInit'),
    });
  });
};

