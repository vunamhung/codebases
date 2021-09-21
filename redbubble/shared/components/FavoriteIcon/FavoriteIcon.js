import React from 'react';
import PropTypes from 'prop-types';
import cnames from 'classnames';
import Image from '@redbubble/design-system/react/Image';
import styles from './FavoriteIcon.css';
import heartFilled from './heart-filled.svg';
import heartOutline from './heart-outline.svg';

export const SMALL = 'small';
export const MEDIUM = 'medium';

class FavoriteIcon extends React.Component {
  get title() {
    if (this.props.favorited) {
      return 'Favorited';
    }
    return 'Favorite';
  }

  render() {
    const { size, favorited } = this.props;

    if (favorited === null || typeof favorited === 'undefined') return null;

    const iconClass = cnames(this.props.className, styles.icon,
      {
        [styles.small]: size === SMALL,
        [styles.medium]: size === MEDIUM,
        [styles.favorited]: favorited === true,
      });

    return (
      <div className={iconClass}>
        <Image
          data-testid={favorited ? 'heartFilled' : 'heartOutline'}
          src={favorited ? heartFilled : heartOutline}
          alt={this.title}
        />
      </div>
    );
  }
}

FavoriteIcon.propTypes = {
  favorited: PropTypes.bool,
  size: PropTypes.oneOf([SMALL, MEDIUM]),
  className: PropTypes.string,
};

FavoriteIcon.defaultProps = {
  favorited: null,
  className: '',
  size: SMALL,
};

FavoriteIcon.displayName = 'FavoriteIcon';

export default FavoriteIcon;
