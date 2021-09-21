import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@redbubble/breadcrumbs';
import '@redbubble/breadcrumbs/lib/styles.css';
import config from '../../../config';
import styles from './BreadcrumbsBar.css';
import { analyticsPayload } from '../../lib/analytics';

const BASE_URL = config('rbmBaseWebUrl');

const RenderText = (text, key) => (
  <span className={styles.text} key={key} itemProp="name">{text}</span>
);

const BreadcrumbsBar = ({ items, showMetaData, logEvent }) => {
  return (
    <Breadcrumbs>
      {(items.map((item) => {
        const itemUrl = item.url;

        const metaData = showMetaData && {
          itemScope: true,
          itemType: 'http://schema.org/Thing',
          itemProp: 'item',
          itemID: `${BASE_URL}${itemUrl}`,
        };

        return (
          <span key={item.name}>
            {
              itemUrl
                ? (
                  <Link
                    to={itemUrl}
                    className={styles.link}
                    data-name="breadcrumbsLink"
                    onMouseDown={() => {
                      logEvent({
                        analytics: analyticsPayload.SRPLinkClicked(`${BASE_URL}${itemUrl}`, 'breadcrumb'),
                      });
                    }}
                    {...metaData}
                  >
                    {RenderText(item.name, itemUrl)}
                  </Link>
                )
                : (
                  <span>
                    {RenderText(item.name, item.name)}
                  </span>
                )
            }
          </span>
        );
      }))}
    </Breadcrumbs>
  );
};

BreadcrumbsBar.defaultProps = {
  items: [],
  showMetaData: true,
  logEvent: () => {},
};

BreadcrumbsBar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
  ),
  showMetaData: PropTypes.bool,
  logEvent: PropTypes.func,
};

export default BreadcrumbsBar;
