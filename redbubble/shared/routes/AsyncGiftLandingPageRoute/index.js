import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import(/* webpackChunkName: "gift_landing_page" */ './AsyncGiftLandingPageRoute.js'),
  loading: () => null,
});

