import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, defineMessages, FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import cnames from 'classnames';

import Text from '@redbubble/design-system/react/Text';

import Panel from './Panel';
import ControlsList from './ControlsList';
import CollapsibleControlGroup, { CollapsibleControlGroupBody } from './CollapsibleControlGroup';
import ControlGroupItem from './ControlGroupItem';
import ControlItem from './ControlItem';
import styles from './CategoryPanel.css';
import { historyPropType } from '../../lib/propTypes';

const messages = defineMessages({
  title: { defaultMessage: 'Categories' },
  done: { defaultMessage: 'Done' },
  back: { defaultMessage: 'Back' },
});

const LeafItem = ({ label, onClick }) => (
  <ControlGroupItem
    text={label}
    onClick={onClick}
  />
);

LeafItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const InternalItem = ({ label, options, handleCategoryClick }) => (
  <CollapsibleControlGroup
    text={label}
  >
    <CollapsibleControlGroupBody>
      {
        options.map(({
          label: nestedOptionLabel,
          url: nestedOptionUrl,
        }) => (
          <LeafItem
            key={nestedOptionLabel}
            label={nestedOptionLabel}
            onClick={() => handleCategoryClick(nestedOptionUrl)}
          />
        ))
      }
    </CollapsibleControlGroupBody>
  </CollapsibleControlGroup>
);

InternalItem.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  handleCategoryClick: PropTypes.func.isRequired,
};

const CategoryPanel = ({
  intl,
  onExit,
  onCategoryPanelClose,
  history,
  categories,
}) => {
  const handleCategoryClick = (url) => {
    onExit();
    history.push(url);
  };

  return (
    <Panel
      title={intl.formatMessage(messages.title)}
      leftAction={
        <button
          className={cnames(styles.button, styles.back)}
          onClick={onCategoryPanelClose}
        >
          <FormattedMessage {...messages.back}>
            {text => <Text type="display6" display="block">{text}</Text>}
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
        {
          categories.map(({ label, options }) => {
            // Top-level categories can't be rendered without options with the current schema.
            if (!Array.isArray(options) || !options.length) return null;

            // If there is only a single option, we don't render a CollapsibleControlGroup.
            // Stickers is the only current use case for this behaviour.
            return options.length === 1 ? (
              <ControlItem
                key={label}
                text={label}
                onClick={() => handleCategoryClick(get(options, '[0].url'))}
              />
            ) : (
              <CollapsibleControlGroup
                key={label}
                text={label}
                topLevel
              >
                <CollapsibleControlGroupBody>
                  {
                    options.map(({ label: optionLabel, url, options: nestedOptions }) => {
                      return Array.isArray(nestedOptions) && nestedOptions.length ? (
                        <InternalItem
                          key={optionLabel}
                          label={optionLabel}
                          options={nestedOptions}
                          handleCategoryClick={handleCategoryClick}
                        />
                      ) : (
                        <LeafItem
                          key={optionLabel}
                          label={optionLabel}
                          onClick={() => handleCategoryClick(url)}
                        />
                      );
                    })
                  }
                </CollapsibleControlGroupBody>
              </CollapsibleControlGroup>
            );
          })
        }
      </ControlsList>
    </Panel>
  );
};

CategoryPanel.propTypes = {
  intl: intlShape.isRequired,
  onExit: PropTypes.func.isRequired,
  onCategoryPanelClose: PropTypes.func.isRequired,
  history: historyPropType.isRequired,
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
};

CategoryPanel.defaultProps = {};

export default CategoryPanel;
