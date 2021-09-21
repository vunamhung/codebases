import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, defineMessages, FormattedMessage } from 'react-intl';
import cnames from 'classnames';

import Box from '@redbubble/design-system/react/Box';
import Button from '@redbubble/design-system/react/Button';
import * as constants from '@redbubble/design-system/react/constants';
import Text from '@redbubble/design-system/react/Text';

import Panel from './Panel';
import ControlsList from './ControlsList';
import ControlItem from './ControlItem';
import CollapsibleFilter from './CollapsibleFilter';
import SearchGridPreviewSelector from './SearchGridPreviewSelector';
import styles from './RootPanel.css';
import { historyPropType } from '../../lib/propTypes';

const messages = defineMessages({
  title: { defaultMessage: 'Filters' },
  clear: { defaultMessage: 'Clear all' },
  done: { defaultMessage: 'Done' },
  categories: { defaultMessage: 'Category' },
  applyFiltersButtonLabel: { defaultMessage: 'Apply Filters' },
});

const RootPanel = ({
  intl,
  onExit,
  onCategoryPanelOpen,
  filters,
  history,
  resetUrl,
  loading,
  appliedCategoryLabel,
  handlePreviewChange,
  selectedPreview,
  artistCollections,
}) => {
  const sortOrderFilter = filters.find(f => f.type === 'sortOrder');
  const hasArtistCollections = artistCollections && artistCollections.options
    && Array.isArray(artistCollections.options)
    && artistCollections.options.length > 0;
  return (
    <Panel
      title={intl.formatMessage(messages.title)}
      leftAction={
        <button className={styles.button} onClick={() => history.push(resetUrl)}>
          <FormattedMessage {...messages.clear}>
            {text => <Text type="display6">{text}</Text>}
          </FormattedMessage>
        </button>
      }
      rightAction={
        <button
          className={cnames(styles.button, styles.done)}
          onClick={onExit}
        >
          <FormattedMessage {...messages.done}>
            {text => <Text type="display6" display="block">{text}</Text>}
          </FormattedMessage>
        </button>
      }
    >
      <ControlsList>
        { hasArtistCollections && <CollapsibleFilter
          intl={intl}
          onChange={history.push}
          filter={artistCollections}
          loading={loading}
        />}
        <ControlItem
          onClick={onCategoryPanelOpen}
          text={intl.formatMessage(messages.categories)}
          label={appliedCategoryLabel}
        />
        {
          filters.filter(f => f.type !== 'sortOrder').map((filter) => {
            return (<CollapsibleFilter
              key={`collapsible-filter-${filter.label}`}
              intl={intl}
              onChange={history.push}
              filter={filter}
              loading={loading}
            />);
          })
        }
        <SearchGridPreviewSelector
          intl={intl}
          loading={loading}
          selectedPreview={selectedPreview}
          handlePreviewChange={handlePreviewChange}
        />
        { sortOrderFilter && <CollapsibleFilter
          intl={intl}
          onChange={history.push}
          filter={sortOrderFilter}
          loading={loading}
        /> }
      </ControlsList>
      <Box
        margin="m"
      >
        <Button
          onClick={onExit}
          intent={constants.PRIMARY}
          size={constants.LARGE}
          fluid
          strong
        >
          {intl.formatMessage(messages.applyFiltersButtonLabel)}
        </Button>
      </Box>
    </Panel>
  );
};

RootPanel.propTypes = {
  intl: intlShape.isRequired,
  onExit: PropTypes.func.isRequired,
  onCategoryPanelOpen: PropTypes.func.isRequired,
  history: historyPropType.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    experiences: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      applied: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  resetUrl: PropTypes.string.isRequired,
  selectedPreview: PropTypes.string.isRequired,
  handlePreviewChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  appliedCategoryLabel: PropTypes.string,
};

RootPanel.defaultProps = {
  loading: false,
  appliedCategoryLabel: null,
};

export default RootPanel;
