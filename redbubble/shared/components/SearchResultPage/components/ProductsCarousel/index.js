import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { defineMessages, intlShape } from 'react-intl';
import cnames from 'classnames';
import Text from '@redbubble/design-system/react/Text';
import Carousel, { Slide } from '@redbubble/design-system/react/Carousel';
import { DESKTOP, MOBILE } from '@redbubble/design-system/react/constants';
import styles from './ProductsCarousel.css';
import { useBrowserInfo } from '../../../../containers/redux/withBrowserInfo';
import { analyticsPayload } from '../../../../lib/analytics';

const messages = defineMessages({
  productsCarouselTitle: 'Shop by Category',
});

const ProductsCarousel = ({
  products,
  intl,
  loading,
  logEvent,
  classes,
  positionStyles,
}) => {
  const browser = useBrowserInfo();

  return (
    <div className={cnames(styles.container, classes)} style={positionStyles}>
      <Text display="block" element="h2" type="display3" loading={loading}>
        {intl.formatMessage(messages.productsCarouselTitle)}
      </Text>

      <div className={styles.carouselContainer}>
        <Carousel profile={browser.is.large ? DESKTOP : MOBILE} slidesPerView="auto">
          {
            products.map((product) => {
              return (
                <Slide key={product.url}>
                  <Link
                    to={product.url}
                    className={styles.link}
                    draggable="false"
                    alt={product.fullTitle}
                    onMouseDown={() => {
                      logEvent({
                        analytics: analyticsPayload.SRPLinkClicked(product.url, 'shop_department_refinement'),
                      });
                    }}
                  >
                    <div className={cnames(styles.card, { [styles.loading]: loading })}>
                      <Text
                        display="block"
                        type="display5"
                        className={styles.cardText}
                        draggable="false"
                      >
                        {product.productTitle}
                      </Text>
                    </div>
                  </Link>
                </Slide>
              );
            })}
        </Carousel>
      </div>
    </div>
  );
};


ProductsCarousel.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    productTitle: PropTypes.string,
    fullTitle: PropTypes.string,
  })),
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  logEvent: PropTypes.func,
  classes: PropTypes.string,
  positionStyles: PropTypes.shape({
    gridRowStart: PropTypes.string,
    gridRowEnd: PropTypes.string,
  }),
};

ProductsCarousel.defaultProps = {
  loading: false,
  products: [],
  logEvent: () => {},
  classes: '',
  positionStyles: null,
};

export default ProductsCarousel;
