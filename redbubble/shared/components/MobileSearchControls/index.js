import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cnames from 'classnames';
import { injectIntl, intlShape, defineMessages, FormattedMessage } from 'react-intl';
import posed from 'react-pose';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { LEFT, MEDIUM, LARGE } from '@redbubble/design-system/react/constants';
import Text from '@redbubble/design-system/react/Text';
import Drawer from '@redbubble/design-system/react/Drawer';
import Box from '@redbubble/design-system/react/Box';
import FilterIcon from '@redbubble/design-system/react/Icons/Filter';
import RootPanel from './RootPanel';
import CategoryPanel from './CategoryPanel';
import { getAppliedCategoryLabel } from '../../lib/searchControls/appliedOptions';
import { PREFERS_REDUCED_MOTION } from '../../lib/accessibility';
import { historyPropType } from '../../lib/propTypes';

import styles from './styles.css';

const AnimatedPanelFromRight = posed.div({
  closed: {
    x: '100%',
    transition: {
      duration: PREFERS_REDUCED_MOTION ? 0 : 300,
    },
  },
  open: {
    x: 0,
    transition: {
      duration: PREFERS_REDUCED_MOTION ? 0 : 300,
    },
  },
});

const messages = defineMessages({
  filters: { defaultMessage: 'Filters' },
});


class MobileSearchControls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      categoryPanelActive: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCategoryPanelOpen = this.handleCategoryPanelOpen.bind(this);
    this.handleCategoryPanelClose = this.handleCategoryPanelClose.bind(this);
  }

  handleOpen() {
    const {
      onOpen,
    } = this.props;

    this.setState({ open: true });

    onOpen();
  }

  handleClose() {
    const {
      onClose,
    } = this.props;

    this.setState({
      open: false,
      categoryPanelActive: false,
    });

    onClose();
  }

  handleCategoryPanelOpen() {
    this.setState({ categoryPanelActive: true });
  }

  handleCategoryPanelClose() {
    this.setState({ categoryPanelActive: false });
  }

  render() {
    const {
      appliedCount,
      categories,
      history,
      intl,
      filters,
      resetUrl,
      loading,
      selectedPreview,
      handlePreviewChange,
      artistCollections,
    } = this.props;

    const { open, categoryPanelActive } = this.state;

    return (
      <Fragment>
        <button
          id="MobileSearchControls-Filter"
          className={cnames(styles.trigger, { [styles.hasAppliedCount]: appliedCount })}
          onClick={this.handleOpen}
        >
          <Box marginRight="xs">
            <FilterIcon size={MEDIUM} />
          </Box>
          <FormattedMessage {...messages.filters}>
            {
              text => (
                <Text type="display6">
                  {text}{appliedCount > 0 ? ` (${appliedCount})` : ''}
                </Text>
              )
            }
          </FormattedMessage>
        </button>
        <Drawer
          open={open}
          accessibleTitle={intl.formatMessage(messages.filters)}
          onCloseRequested={this.handleClose}
          size={LARGE}
          from={LEFT}
        >
          <div className={styles.content}>
            <RootPanel
              onExit={this.handleClose}
              onCategoryPanelOpen={this.handleCategoryPanelOpen}
              intl={intl}
              filters={filters}
              history={history}
              resetUrl={resetUrl}
              loading={loading}
              appliedCategoryLabel={getAppliedCategoryLabel(categories)}
              selectedPreview={selectedPreview}
              handlePreviewChange={handlePreviewChange}
              artistCollections={artistCollections}
            />
            <AnimatedPanelFromRight
              initialPose="closed"
              pose={categoryPanelActive ? 'open' : 'closed'}
              withParent={false}
              className={styles.categoryPanel}
            >
              <CategoryPanel
                categories={categories}
                history={history}
                onExit={this.handleClose}
                onCategoryPanelClose={this.handleCategoryPanelClose}
                intl={intl}
              />
            </AnimatedPanelFromRight>
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

MobileSearchControls.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })),
    })).isRequired,
  })).isRequired,
  history: historyPropType.isRequired,
  appliedCount: PropTypes.number,
  intl: intlShape.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      applied: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  resetUrl: PropTypes.string.isRequired,
  handlePreviewChange: PropTypes.func.isRequired,
  selectedPreview: PropTypes.string.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
};

MobileSearchControls.defaultProps = {
  appliedCount: null,
  onOpen: () => {},
  onClose: () => {},
  loading: false,
};

export default compose(injectIntl, withRouter)(MobileSearchControls);
