import Loadable from 'react-loadable';

const AsyncArtistExplorePage = Loadable({
  loader: () => import(/* webpackChunkName: "artist-explore-page" */ './AsyncArtistExplorePageRoute.js'),
  loading: () => null,
});

export default AsyncArtistExplorePage;
