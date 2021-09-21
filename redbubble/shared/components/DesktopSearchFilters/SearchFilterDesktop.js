import React, { Component } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import { defineMessages, FormattedMessage, intlShape } from 'react-intl';
import cnames from 'classnames';
import get from 'lodash/get';
import Text from '@redbubble/design-system/react/Text';
import Collapsible from '@redbubble/design-system/react/Collapsible';
import ChevronDown from '@redbubble/design-system/react/Icons/ChevronDown';
import Box from '@redbubble/design-system/react/Box';
import { DESKTOP } from '@redbubble/design-system/react/Form';
import * as constants from '@redbubble/design-system/react/constants';
import {
  getAppliedCategoryLabel,
  getAppliedOptionLabels,
} from '../../lib/searchControls/appliedOptions';
import Loading from '../Loading';
import VariableComponent from '../VariableComponent';
import styles from './SearchFilterDesktop.css';
import RadioControl from '../SearchFilterControls/RadioControl';
import CheckboxControl from '../SearchFilterControls/CheckboxControl';
import ColorSwatchControl from '../SearchFilterControls/ColorSwatchControl';
import { PREFERS_REDUCED_MOTION } from '../../lib/accessibility';
import { historyPropType } from '../../lib/propTypes';
import { searchResultsFiltersPropType } from '../../containers/apollo/withSearchResults';

const DISALLOWED_FILTER_TYPES = ['sortOrder'];

const messages = defineMessages({
  searchControlsTitle: { defaultMessage: 'Filters' },
  staticFilterTitle: { defaultMessage: 'Category' },
  staticFilterAllTitle: { defaultMessage: 'All Categories' },
  collectionFilterTitle: { defaultMessage: 'Collection' },
});

const handleToggle = (event, toggle) => {
  event.target.blur();
  event.target.parentNode.blur();
  toggle();
};

const CollapsibleArrow = posed.div({
  hide: {
    transform: 'rotate(0deg)',
    transition: {
      duration: PREFERS_REDUCED_MOTION ? 0 : 300,
    },
  },
  show: {
    transform: 'rotate(-180deg)',
    transition: {
      duration: PREFERS_REDUCED_MOTION ? 0 : 300,
    },
  },
});

const CategoryTrigger = ({ collapsed, toggleCollapsible, staticFilters }) => {
  const appliedCategoryOptions = getAppliedCategoryLabel(staticFilters);

  return (
    <button
      className={styles.button}
      onClick={e => handleToggle(e, toggleCollapsible)}
      title="Category"
    >
      <FormattedMessage {...messages.staticFilterTitle}>
        {text => (
          <Text className={styles.label} type="display6" display="block">
            {text}
          </Text>
        )}
      </FormattedMessage>
      <CollapsibleArrow pose={collapsed ? 'hide' : 'show'}>
        <ChevronDown size={constants.MEDIUM} />
      </CollapsibleArrow>
      {collapsed && (
        <Text
          className={styles.applied}
          type="body2"
          title={appliedCategoryOptions}
        >
          {appliedCategoryOptions}
        </Text>
      )}
    </button>
  );
};

const CollectionsTrigger = ({ collapsed, toggleCollapsible, intl, selectedCollection }) => {
  return (
    <button
      className={styles.button}
      onClick={e => handleToggle(e, toggleCollapsible)}
      title={intl.formatMessage(messages.collectionFilterTitle)}
    >
      <FormattedMessage {...messages.collectionFilterTitle}>
        {text => (
          <Text className={styles.label} type="display6" display="block">
            {text}
          </Text>
        )}
      </FormattedMessage>
      <CollapsibleArrow pose={collapsed ? 'hide' : 'show'}>
        <ChevronDown size={constants.MEDIUM} />
      </CollapsibleArrow>
      {collapsed && selectedCollection && (
        <Text
          className={styles.applied}
          type="body2"
          title={selectedCollection.label}
        >
          {selectedCollection.label}
        </Text>
      )}
    </button>
  );
};

const standardTextType = (embolden) => {
  return embolden ? 'display6' : 'body2';
};

const isAllowed = filter => !DISALLOWED_FILTER_TYPES.includes(filter.type);

const CONTROL_MAP = {
  radio: RadioControl,
  checkbox: CheckboxControl,
  color: ColorSwatchControl,
};

const getSelectedItemName = appliedPath => appliedPath[appliedPath.length - 1];

const isEmptyOptions = options =>
  !Array.isArray(options) || !options.length;

const isLeaf = item =>
  isEmptyOptions(item.options);

const isLinkToParent = (item, parent) => item.name === parent;

const isInPath = (itemName, appliedPath) => appliedPath.includes(itemName);

const itemIsOnPath = (item, appliedPath) => isInPath(item.name, appliedPath);

const findSelectedItem = (options, selectedItemName) =>
  options.find(item => item.name === selectedItemName);

// we display only:
// not "all elements"
// or
// items on path or last level
const shouldDisplay = (item, appliedPath, options, parent) => {
  if (isLinkToParent(item, parent)) {
    return false;
  }
  if (itemIsOnPath(item, appliedPath)) {
    return true;
  }

  const selectedItemName = getSelectedItemName(appliedPath);
  if (parent === selectedItemName) {
    return true;
  }

  const selectedItem = findSelectedItem(options, selectedItemName);
  return (selectedItem && isLeaf(selectedItem));
};

const Options = ({
  options,
  appliedPath,
  level,
  handleClick,
  selectedOption,
  parent,
}) => {
  if (isEmptyOptions(options)) return null;
  if (!isInPath(parent, appliedPath)) return null;

  const displayedOptions = options.filter(item =>
    shouldDisplay(item, appliedPath, options, parent));

  return (
    <ul className={cnames(styles.list, styles.subList)}>
      {displayedOptions.map((option) => {
        return (
          <li key={option.name}>
            <button
              className={styles.option}
              onClick={e => handleClick(e, option.url, option.name)}
              title={option.label}
            >
              <Text
                className={styles.label}
                type={standardTextType(
                  (appliedPath.includes(option.name) &&
                    selectedOption === null) ||
                    selectedOption === option.name,
                )}
              >
                {option.label}
              </Text>
            </button>
            <Options
              options={option.options}
              appliedPath={appliedPath}
              level={level + 1}
              handleClick={handleClick}
              selectedOption={selectedOption}
              parent={option.name}
            />
          </li>
        );
      })}
    </ul>
  );
};

Options.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})),
  appliedPath: PropTypes.arrayOf(PropTypes.string),
  level: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  selectedOption: PropTypes.string,
  parent: PropTypes.string.isRequired,
};

Options.defaultProps = {
  options: [],
  appliedPath: [],
  selectedOption: null,
};

const FilterTrigger = ({ collapsed, toggleCollapsible, filter }) => {
  const { label: filterLabel, options } = filter;

  const appliedLabel = getAppliedOptionLabels(options).join(', ');

  return (
    <button
      className={styles.button}
      onClick={e => handleToggle(e, toggleCollapsible)}
      title={filterLabel}
    >
      <Text className={styles.label} type="display6">
        {filterLabel}
      </Text>
      <CollapsibleArrow pose={collapsed ? 'hide' : 'show'}>
        <ChevronDown size={constants.MEDIUM} />
      </CollapsibleArrow>
      {collapsed && (
        <Text className={styles.applied} type="body2" title={appliedLabel}>
          {appliedLabel}
        </Text>
      )}
    </button>
  );
};

FilterTrigger.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  toggleCollapsible: PropTypes.func.isRequired,
  filter: PropTypes.shape({
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

class SearchFilterDesktop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStaticFilter: null,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event, url, name = null) {
    event.target.blur();
    event.target.parentNode.blur();

    const { history } = this.props;

    if (name) {
      this.setState({ selectedStaticFilter: name });
    }

    history.push(url, { maintainScrollPosition: true });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ loading: nextLoading }) {
    const { loading } = this.props;

    if (loading && !nextLoading) {
      this.setState({ selectedStaticFilter: null });
    }
  }

  render() {
    const { intl, searchFilter, loading, artistCollections } = this.props;
    const { selectedStaticFilter } = this.state;
    const { staticFilters, filters, appliedPath } = searchFilter || {};
    const showAllCategoryFilters =
      Array.isArray(appliedPath) && appliedPath.length === 0;
    const allowedFilters = (filters || []).filter(isAllowed);
    const appliedCount = (get(artistCollections, 'applied') ? 1 : 0) + searchFilter.appliedCount;
    const selectedCollection = artistCollections.options.find((elem => elem.applied));

    return (
      <Box element="aside" aria-labelledby="FiltersHeading" aria-controls="SearchResults">
        <FormattedMessage {...messages.searchControlsTitle}>
          {text => (
            <Text
              type="display3"
              element="h2"
              display="block"
              className={styles.heading}
              id="FiltersHeading"
            >
              {text}{' '}
              {appliedCount > 0 && (
                <span className={styles.appliedCount}>
                  ({appliedCount})
                </span>
              )}
            </Text>
          )}
        </FormattedMessage>
        <Box className={styles.filterContainer}>
          <ul className={styles.filter}>
            {
              artistCollections && !!artistCollections.options.length &&
              <li className={styles.item}>
                <Collapsible
                  trigger={triggerProps => (
                    <CollectionsTrigger
                      intl={intl}
                      selectedCollection={selectedCollection}
                      {...triggerProps}
                    />
                  )}
                  defaultCollapsed
                >
                  <ul className={styles.list}>
                    {artistCollections.options.map(({ label, url }, index) => (
                      <li key={label}>
                        <button
                          className={styles.option}
                          onClick={e =>
                            this.handleClick(
                              e,
                              url,
                              label,
                            )
                          }
                          title={label}
                        >
                          <Text
                            className={styles.label}
                            type={standardTextType(index === 0 ||
                              (selectedCollection && selectedCollection.label === label))
                            }
                          >
                            {label}
                          </Text>
                        </button>
                      </li>))}
                    {loading && artistCollections.applied && (
                      <div className={styles.loading}>
                        <Loading />
                      </div>
                    )}
                  </ul>
                </Collapsible>
              </li>
            }
            <li className={styles.item}>
              <Collapsible
                trigger={triggerProps => (
                  <CategoryTrigger
                    staticFilters={staticFilters}
                    {...triggerProps}
                  />
                )}
                defaultCollapsed={false}
              >
                <ul className={styles.list}>
                  <li className={styles.subItem}>
                    <button
                      className={styles.option}
                      onClick={e =>
                        this.handleClick(e, searchFilter.resetUrl, 'reset')
                      }
                      title="All Categories"
                    >
                      <FormattedMessage {...messages.staticFilterAllTitle}>
                        {text => (
                          <Text className={styles.label} type="display6">
                            {text}
                          </Text>
                        )}
                      </FormattedMessage>
                    </button>

                    {Array.isArray(staticFilters) && !!staticFilters.length && (
                      <ul className={cnames(styles.list, styles.subList)}>
                        {staticFilters.map(
                          department =>
                            (showAllCategoryFilters ||
                              appliedPath.includes(department.type)) && (
                              <li key={department.type}>
                                <button
                                  className={styles.option}
                                  onClick={e =>
                                    this.handleClick(
                                      e,
                                      department.options[0].url,
                                      department.options[0].name,
                                    )
                                  }
                                  title={department.label}
                                >
                                  <Text
                                    className={styles.label}
                                    type={standardTextType(
                                      appliedPath.includes(department.type) ||
                                        selectedStaticFilter === department.type,
                                    )}
                                  >
                                    {department.label}
                                  </Text>
                                </button>
                                {appliedPath.includes(department.type) && (
                                  <Options
                                    options={department.options}
                                    appliedPath={appliedPath}
                                    level={0}
                                    handleClick={this.handleClick}
                                    selectedOption={selectedStaticFilter}
                                    parent={department.type}
                                  />
                                )}
                              </li>
                            ),
                        )}
                      </ul>
                    )}
                  </li>
                  {loading && selectedStaticFilter && (
                    <div className={styles.loading}>
                      <Loading />
                    </div>
                  )}
                </ul>
              </Collapsible>
            </li>
            {allowedFilters.map((filter) => {
              const { type: filterType, experiences } = filter;

              return (
                <li key={filterType} className={styles.item}>
                  <Collapsible
                    trigger={triggerProp => (
                      <FilterTrigger filter={filter} {...triggerProp} />
                    )}
                    defaultCollapsed={false}
                  >
                    <ul className={styles.form}>
                      <VariableComponent
                        experienceName="control"
                        experiences={experiences}
                        map={CONTROL_MAP}
                        fallback={RadioControl}
                      >
                        {ControlComponent => (
                          <ControlComponent
                            intl={intl}
                            filter={filter}
                            profile={DESKTOP}
                            onChange={url =>
                              this.props.history.push(url, {
                                maintainScrollPosition: true,
                              })
                            }
                          />
                        )}
                      </VariableComponent>
                      {loading && !selectedStaticFilter && (
                        <div className={styles.loading}>
                          <Loading />
                        </div>
                      )}
                    </ul>
                  </Collapsible>
                </li>
              );
            })}
          </ul>
        </Box>
      </Box>
    );
  }
}

SearchFilterDesktop.propTypes = {
  intl: intlShape.isRequired,
  searchFilter: searchResultsFiltersPropType,
  history: historyPropType.isRequired,
  loading: PropTypes.bool,
};

SearchFilterDesktop.defaultProps = {
  searchFilter: {
    staticFilters: [],
    filters: [],
  },
  loading: false,
};

export default SearchFilterDesktop;
