import React from 'react';
import PropTypes from 'prop-types';
import ReactHelmet from 'react-helmet';
import fonts from '@redbubble/design-system/styles/fonts';
import config from '../../../config';
import { publicAssetPath } from '../../lib/routing';

const Helmet = ({ locale }) => (
  <ReactHelmet titleTemplate={config('htmlPage.titleTemplate')}>
    <html lang={locale} />
    <title>
      {config('htmlPage.defaultTitle')}
    </title>

    {
      fonts.map(({ name, path }) => {
        return config('preloadableFonts').includes(name) && (
          <link
            rel="preload"
            as="font"
            href={path}
            key={path}
            type="font/woff2"
            crossOrigin="anonymous"
          />
        );
      })
    }

    <meta charSet="utf-8" />
    <meta name="application-name" content={config('htmlPage.defaultTitle')} />
    <meta name="description" content={config('htmlPage.description')} />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#f2f2f6" />
    <meta name="msapplication-config" content={publicAssetPath('browserconfig.xml')} />

    <link rel="manifest" href={publicAssetPath('manifest.json')} />

    <link
      rel="apple-touch-icon-precomposed"
      sizes="152x152"
      href={publicAssetPath('favicons/apple-touch-icon-152x152.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="144x144"
      href={publicAssetPath('favicons/apple-touch-icon-144x144.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="120x120"
      href={publicAssetPath('favicons/apple-touch-icon-120x120.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="114x114"
      href={publicAssetPath('favicons/apple-touch-icon-114x114.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="76x76"
      href={publicAssetPath('favicons/apple-touch-icon-76x76.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="72x72"
      href={publicAssetPath('favicons/apple-touch-icon-72x72.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="57x57"
      href={publicAssetPath('favicons/apple-touch-icon-57x57.png')}
    />
    <link
      rel="apple-touch-icon-precomposed"
      sizes="60x60"
      href={publicAssetPath('favicons/apple-touch-icon-60x60.png')}
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href={publicAssetPath('favicons/apple-touch-icon-180x180.png')}
    />
    <link rel="mask-icon" href={publicAssetPath('favicons/favicon-pinned-tab.svg')} color="#e41421" />
    <link rel="shortcut icon" href={publicAssetPath('favicons/favicon.ico')} />
    <link rel="icon" type="image/png" href={publicAssetPath('favicons/favicon-196x196.png')} sizes="196x196" />
    <link rel="icon" type="image/png" href={publicAssetPath('favicons/favicon-128x128.png')} sizes="128x128" />
    <link rel="icon" type="image/png" href={publicAssetPath('favicons/favicon-96x96.png')} sizes="96x96" />
    <link rel="icon" type="image/png" href={publicAssetPath('favicons/favicon-32x32.png')} sizes="32x32" />
    <link rel="icon" type="image/png" href={publicAssetPath('favicons/favicon-16x16.png')} sizes="16x16" />

    { /* Open Search Support */ }
    <link rel="search" type="application/opensearchdescription+xml" title="Redbubble Search" href={publicAssetPath('openSearch/redbubble.xml')} />
  </ReactHelmet>
);

Helmet.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default Helmet;
