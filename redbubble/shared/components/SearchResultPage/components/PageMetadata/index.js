import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useCookies } from 'react-cookie';
import get from 'lodash/get';
import serialize from 'serialize-javascript';
import { dataLayer, buildGtmData } from '../../../../lib/googleTagManager';
import { userInfoPropType } from '../../../../containers/apollo/withUserInfo';
import { searchResultsPropType } from '../../../../containers/apollo/withSearchResults';
import { ARTWORK } from '../../../../lib/previews';

const buildJsonLdData = (products) => {
  const itemListElement = products.map((product, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${product.inventoryItem.productPageUrl}`,
  }));
  return {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    itemListElement,
  };
};

const seoImageFromProduct = (product) => {
  const previews = get(product, 'inventoryItem.previewSet.previews', []);
  const preview = previews.find(p => p.previewTypeId === ARTWORK);
  return preview && preview.url ? preview.url : null;
};

const PageMetadata = ({
  seoMetadata,
  userInfo,
  onChangeClientState,
  products,
}) => {
  const [cookies] = useCookies(['_ga']);

  if (!seoMetadata) return null;

  const gtmDataLayer = buildGtmData(userInfo, cookies);

  const productHasInventoryItem = p =>
    p && p.inventoryItem && p.inventoryItem.productPageUrl;

  const itemIsSafeForWork = p =>
    !get(p, 'work.isMatureContent', true);

  const filteredProducts = products.filter(productHasInventoryItem);


  const productOnCover = filteredProducts.find(itemIsSafeForWork);
  const seoImage = productOnCover ?
    seoImageFromProduct(productOnCover) :
    seoMetadata.seoImage;

  return (
    <Helmet onChangeClientState={onChangeClientState}>
      <title>{seoMetadata.searchTitle}</title>
      <meta name="description" content={seoMetadata.pageDescription} />
      <meta name="og:title" content={seoMetadata.searchTitle} />
      {seoMetadata.pageDescription && (
        <meta
          name="og:description"
          content={seoMetadata.pageDescription.substring(0, 99).concat('...')}
        />
      )}
      <meta name="og:type" content="article" />
      {seoMetadata.canonicalURL && (
        <meta name="og:url" content={seoMetadata.canonicalURL} />
      )}
      <meta name="og:image" content={seoImage} />
      {seoMetadata.robots && (
        <meta name="robots" content={seoMetadata.robots} />
      )}
      <meta name="og:site_name" content="Redbubble" />
      <link
        rel="search"
        type="application/opensearchdescription+xml"
        title="Redbubble Search"
        href="/searchwidget/redbubble.xml"
      />
      {seoMetadata.canonicalURL && (
        <link rel="canonical" href={seoMetadata.canonicalURL} />
      )}
      {get(seoMetadata, 'alternatePageVersions', []).map(
        alternatePageVersion => (
          <link
            key={alternatePageVersion.locale}
            rel="alternate"
            href={alternatePageVersion.href}
            hrefLang={alternatePageVersion.locale}
          />
        ),
      )}
      {filteredProducts.length > 0 && (
        <script type="application/ld+json">{serialize(buildJsonLdData(filteredProducts))}</script>
      )}
      {
        gtmDataLayer && gtmDataLayer.visitorType && (
          <script>{dataLayer(gtmDataLayer)}</script>
        )
      }
    </Helmet>
  );
};

PageMetadata.propTypes = {
  seoMetadata: PropTypes.shape({
    pageDescription: PropTypes.string,
    canonicalURL: PropTypes.string,
    searchTitle: PropTypes.string,
    robots: PropTypes.string,
    seoImage: PropTypes.string,
    alternatePageVersions: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        locale: PropTypes.string,
      }),
    ),
  }),
  userInfo: userInfoPropType,
  onChangeClientState: PropTypes.func,
  products: searchResultsPropType,
};

PageMetadata.defaultProps = {
  seoMetadata: null,
  userInfo: {},
  onChangeClientState: () => {},
  products: [],
};

PageMetadata.displayName = 'PageMetadata';

export default PageMetadata;
