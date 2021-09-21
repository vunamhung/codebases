import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cnames from 'classnames';
import md5 from 'md5';
import Box from '@redbubble/design-system/react/Box';
import Text from '@redbubble/design-system/react/Text';
import Carousel, { Slide } from '@redbubble/design-system/react/Carousel';
import { DESKTOP, MOBILE } from '@redbubble/design-system/react/constants';
import styles from './styles.css';
import { useBrowserInfo } from '../../../../containers/redux/withBrowserInfo';
import { analyticsPayload } from '../../../../lib/analytics';

const COLOR_PALETTE = [
  '#D8D7DC', '#DFE4E6', '#EFEDE7', '#DFDBDF', '#E2DDDB',
  '#E0D9DA', '#D5DBD6', '#DADCDE', '#EAE9ED', '#EFF2F3',
  '#F3F3EB', '#F1EEF1', '#F0EEEB', '#EEEAEA', '#ECEFED',
  '#E7E8EB',
];

const colorForLink = (link) => {
  const hash = md5(link);
  const colorIndex = parseInt(`0x${hash.slice(-5)}`, 16) % COLOR_PALETTE.length;
  return COLOR_PALETTE[colorIndex];
};

const LinksCarousel = ({
  links,
  refLabel,
  loading,
  logEvent,
  getColor,
  showEventAction,
  showEventLabel,
  clickEventAction,
  makeClickEventLabel,
}) => {
  const browser = useBrowserInfo();

  useEffect(() => {
    if (links && links.length && showEventAction) {
      const analytics = analyticsPayload.searchPageComponentShowed(
        showEventAction,
        showEventLabel,
      );

      logEvent({ analytics });
    }
  }, [links]);

  return (
    <div className={styles.linkContainer}>
      <div className={styles.carouselContainer}>
        <Carousel profile={browser.is.large ? DESKTOP : MOBILE} slidesPerView="auto">
          {
            links.filter(link => link.title).map((link, position) => {
              return (
                <Slide key={link.url}>
                  <Link
                    to={link.url}
                    className={styles.link}
                    draggable="false"
                    onMouseDown={() => {
                      if (clickEventAction) {
                        const analytics = analyticsPayload.linkCarouselClicked({
                          action: clickEventAction,
                          label: makeClickEventLabel({
                            refLabel,
                            clickedLabel: link.title,
                            position,
                          }),
                          destination: link.url,
                        });

                        logEvent({ analytics });
                      }
                    }}
                  >
                    <Box
                      className={cnames(styles.linkCard, { [styles.loading]: loading })}
                      style={{
                        backgroundColor: loading
                          ? 'var(--ds-color-state-loading-background)'
                          : getColor(link.title),
                      }}
                    >
                      <Text
                        display="block"
                        type="display5"
                        className={styles.linkCardText}
                        draggable="false"
                      >
                        {link.title}
                      </Text>
                    </Box>
                  </Link>
                </Slide>
              );
            })}
        </Carousel>
      </div>
    </div>
  );
};

LinksCarousel.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
  })),
  refLabel: PropTypes.string,
  loading: PropTypes.bool,
  logEvent: PropTypes.func,
  getColor: PropTypes.func,
  showEventAction: PropTypes.string,
  showEventLabel: PropTypes.string,
  clickEventAction: PropTypes.string,
  makeClickEventLabel: PropTypes.func,
};

LinksCarousel.defaultProps = {
  loading: false,
  links: [],
  refLabel: null,
  showEventAction: null,
  showEventLabel: null,
  clickEventAction: null,
  logEvent: () => {},
  getColor: colorForLink,
  makeClickEventLabel: () => null,
};

export default LinksCarousel;
