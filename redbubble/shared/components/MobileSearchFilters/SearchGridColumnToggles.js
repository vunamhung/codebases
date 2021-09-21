import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cnames from 'classnames';
import { MEDIUM } from '@redbubble/design-system/react/constants';
import GridFilledIcon from '@redbubble/design-system/react/Icons/GridFilled';
import GridIcon from '@redbubble/design-system/react/Icons/Grid';
import ListFilledIcon from '@redbubble/design-system/react/Icons/ListFilled';
import ListIcon from '@redbubble/design-system/react/Icons/List';
import styles from './SearchGridColumnToggles.css';

export const GRID_LAYOUT_COOKIE_NAME = 'search_page_preview_size';
export const SINGLE_COLUMN_GRID_LAYOUT = 'large';
export const MULTI_COLUMN_GRID_LAYOUT = 'default';

class SearchGridColumnToggles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: MULTI_COLUMN_GRID_LAYOUT,
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.updateToggleName = this.updateToggleName.bind(this);
  }

  updateToggleName(toggleName) {
    const {
      handleSelection,
      cookies,
    } = this.props;

    handleSelection(toggleName);

    this.setState({ selected: toggleName });

    cookies.set(GRID_LAYOUT_COOKIE_NAME, toggleName);
  }

  handleSelection(toggleName) {
    this.updateToggleName(toggleName);
  }

  componentDidMount() {
    const {
      cookies,
    } = this.props;
    const toggleName = cookies.get(GRID_LAYOUT_COOKIE_NAME) || MULTI_COLUMN_GRID_LAYOUT;

    this.updateToggleName(toggleName);
  }

  render() {
    const {
      selected,
    } = this.state;

    return (
      <Fragment>
        <button
          id="MultiColumnSearchGrid"
          className={
            cnames(
              styles.button,
              { [styles.selected]: selected === MULTI_COLUMN_GRID_LAYOUT },
            )
          }
          onClick={() => this.handleSelection(MULTI_COLUMN_GRID_LAYOUT)}
          aria-hidden
          z-index="-1"
        > {
            selected === MULTI_COLUMN_GRID_LAYOUT ?
              <GridFilledIcon size={MEDIUM} /> :
              <GridIcon size={MEDIUM} />
          }
        </button>
        <button
          id="SingleColumnSearchGrid"
          className={
            cnames(
              styles.button,
              { [styles.selected]: selected === SINGLE_COLUMN_GRID_LAYOUT },
            )
          }
          onClick={() => this.handleSelection(SINGLE_COLUMN_GRID_LAYOUT)}
          aria-hidden
          z-index="-1"
        > {
            selected === SINGLE_COLUMN_GRID_LAYOUT ?
              <ListFilledIcon size={MEDIUM} /> :
              <ListIcon size={MEDIUM} />
          }
        </button>
      </Fragment>
    );
  }
}

SearchGridColumnToggles.propTypes = {
  handleSelection: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}),
};

SearchGridColumnToggles.defaultProps = {
  cookies: {},
};

export default SearchGridColumnToggles;
