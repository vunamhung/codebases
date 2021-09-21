import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "cookiebot_declaration" */ './CookiePolicyPageRoute.js'),
  loading: () => null,
});

