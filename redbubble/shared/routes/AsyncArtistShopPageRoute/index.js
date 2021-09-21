import Loadable from 'react-loadable';

const AsyncArtistShopPage = Loadable({
  loader: () => import(/* webpackChunkName: "artist-shop-page" */ './AsyncArtistShopPageRoute.js'),
  loading: () => null,
});

export default AsyncArtistShopPage;
