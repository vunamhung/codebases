import React from 'react';
import PropTypes from 'prop-types';
import Text from '@redbubble/design-system/react/Text';
import Box from '@redbubble/design-system/react/Box';
import styles from './HeroBanner.css';

const HeroBanner = ({
  title,
  pitch,
  loading,
  image,
  color,
}) => {
  const id = 'SearchResultsHeroBanner';
  const loadingId = 'SearchResultsHeroBannerLoading';

  const showFancyHeader = image && color;
  // Fancy image + color version
  if (showFancyHeader) {
    if (loading) { return (<div className={styles.loadingHeroBanner} data-testid={loadingId} />); }

    const styleOverrides = {
      '--hero-background-color': color,
      '--hero-background-image': `url(${image})`,
    };

    return (
      <div className={styles.imageHeroBanner} style={styleOverrides} data-testid={id}>
        <div className={styles.bannerImage} />
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <div className={styles.headerTextContainer}>
            <Box marginBottom="m">
              <Text element="h1" display="block" className={styles.display1}> {title} </Text>
            </Box>
            <Text display="block" className={styles.display4}> {pitch} </Text>
          </div>
        </Box>
      </div>
    );
  }

  // Plain heading/subtitle one
  return (
    <div className={styles.heroBanner} data-testid={id}>
      <Text element="h1" loading={loading} type="display3"> {title} </Text>
      <Text display="block" element="p" loading={loading}> {pitch} </Text>
    </div>
  );
};

HeroBanner.defaultProps = {
  title: '',
  pitch: null,
  loading: false,
  image: null,
  color: null,
};

HeroBanner.propTypes = {
  title: PropTypes.string,
  pitch: PropTypes.string,
  loading: PropTypes.bool,
  image: PropTypes.string,
  color: PropTypes.string,
};

HeroBanner.displayName = 'HeroBanner';

export default HeroBanner;
