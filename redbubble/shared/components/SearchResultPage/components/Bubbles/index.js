import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cnames from 'classnames';
import { Link } from 'react-router-dom';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Carousel, { Slide } from '@redbubble/design-system/react/Carousel';
import Card, { CardBody } from '@redbubble/design-system/react/Card';
import Image from '@redbubble/design-system/react/Image';
import * as constants from '@redbubble/design-system/react/constants';
import styles from './Bubbles.css';
import { useBrowserInfo } from '../../../../containers/redux/withBrowserInfo';
import LinksCarousel from '../LinksCarousel';
import { BUBBLE_CAROUSEL_CLICKED } from '../../../../lib/analytics';

const renderImage = (loading, item) => {
  if (loading) {
    return (
      <div className={cnames(styles.imageWrapper, styles.loading)} />
    );
  }

  if (item.realisticImage) {
    return (
      <div className={styles.imageWrapper}>
        <Image src={item.realisticImage} className={styles.image} />
      </div>
    );
  }

  return (
    <Image src={item.image} className={styles.icon} />
  );
};

const Bubbles = ({
  bubbles,
  loading,
  logEvent,
}) => {
  const browser = useBrowserInfo();
  const title = get(bubbles, 'title');
  const items = get(bubbles, 'items') || [];

  if (!bubbles.hasImages) {
    return (<LinksCarousel
      links={items}
      loading={loading}
      logEvent={logEvent}
      clickEventAction={BUBBLE_CAROUSEL_CLICKED}
      makeClickEventLabel={({ clickedLabel, position }) => `${clickedLabel}|${position}`}
    />);
  }


  return (
    <Box className={styles.bubblesContainer}>
      <Box marginBottom="m">
        <Text element="h2" type="display3" loading={loading}>
          {title}
        </Text>
      </Box>
      <Carousel
        profile={browser.is.large ? constants.DESKTOP : constants.MOBILE}
        slidesPerView="auto"
      >
        {
          items.map(item => (
            <Slide key={item.url}>
              <Link
                className={styles.linkWrapper}
                to={item.url}
                tabIndex={0}
              >
                <Card
                  className={styles.card}
                  elevation={constants.ELEVATION_LOW}
                >
                  { renderImage(loading, item) }
                  <CardBody>
                    <Text type="display6" className={styles.text} loading={loading}>
                      {item.title}
                    </Text>
                  </CardBody>
                </Card>
              </Link>
            </Slide>
          ))
        }
      </Carousel>
    </Box>
  );
};

Bubbles.defaultProps = {
  bubbles: {
    title: '',
    items: [],
  },
  loading: false,
  logEvent: () => {},
};

Bubbles.propTypes = {
  bubbles: PropTypes.shape({
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      image: PropTypes.string,
      realisticImage: PropTypes.string,
      url: PropTypes.string,
      isExternal: PropTypes.bool,
    })),
  }),
  loading: PropTypes.bool,
  logEvent: PropTypes.func,
};

export default Bubbles;
