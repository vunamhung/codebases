import Loadable from 'react-loadable';

const AsyncLandingPage = Loadable({
  loader: () => import(/* webpackChunkName: "landing-page" */ './AsyncLandingPageRoute.js'),
  loading: () => null,
});

export default AsyncLandingPage;
