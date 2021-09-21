import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import Collapsible from '@redbubble/design-system/react/Collapsible';
import Button from '@redbubble/design-system/react/Button';
import Box from '@redbubble/design-system/react/Box';
import { SMALL } from '@redbubble/design-system/react/constants';
import get from 'lodash/get';

import Form, {
  MOBILE,
  DESKTOP,
  FieldSet,
  FieldRow,
  Field,
} from '@redbubble/design-system/react/Form';

const messages = defineMessages({
  seeMore: 'See More',
  seeLess: 'See Less',
});

const firstApplied = options => options.find(({ applied }) => applied);

const initialValues = ({ type, options }) => {
  const prefixedType = type;
  return { [prefixedType]: get(firstApplied(options), 'name') };
};

const CollapsibleWrapperStyle = {
  margin: '-16px 8px 16px 8px',
  width: '100%',
};

class CollapsibleField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: this.props.collapsed,
    };
    this.handleClick = this.handleClick.bind(this);
    this.shouldSplit = this.shouldSplit.bind(this);
  }

  handleClick(event, toggleCollapsible) {
    this.setState({ collapsed: !this.state.collapsed });
    event.target.blur();
    toggleCollapsible();
  }

  shouldSplit() {
    const {
      applied,
      options,
      collapseThreshold,
    } = this.props;
    const appliedIndex = options.findIndex(opts => get(opts, 'value') === applied);
    return Array.isArray(options) &&
      options.length > collapseThreshold &&
      appliedIndex < collapseThreshold;
  }

  render() {
    const {
      intl,
      children,
      options,
      collapseThreshold,
    } = this.props;

    const {
      collapsed,
    } = this.state;

    const shouldSplit = this.shouldSplit();
    const firstPartOfOptions = collapsed && shouldSplit
      ? options.slice(0, collapseThreshold)
      : options;
    const secondPartOfOptions = collapsed && shouldSplit
      ? options.slice(collapseThreshold)
      : null;

    const trigger = ({ collapsed: col, toggleCollapsible }) => (
      <Button
        fluid
        size={SMALL}
        onClick={e => this.handleClick(e, toggleCollapsible)}
      >
        {col ? intl.formatMessage(messages.seeMore) : intl.formatMessage(messages.seeLess)}
      </Button>
    );

    return (
      <>
        {React.cloneElement(children, { options: firstPartOfOptions })}
        {shouldSplit &&
          <Box
            style={CollapsibleWrapperStyle}
          >
            <Collapsible
              trigger={trigger}
              defaultCollapsed={collapsed}
            >
              {secondPartOfOptions &&
                React.cloneElement(children, { options: secondPartOfOptions })}
            </Collapsible>
          </Box>
        }
      </>
    );
  }
}

CollapsibleField.propTypes = {
  intl: intlShape.isRequired,
  collapsed: PropTypes.bool,
  collapseThreshold: PropTypes.number,
  applied: PropTypes.string,
  children: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
  })).isRequired,
};

CollapsibleField.defaultProps = {
  collapsed: true,
  collapseThreshold: 7,
  applied: '',
};

const RadioControl = ({ intl, filter, onChange, profile }) => {
  const { type, options, label: text } = filter;

  return (
    <Form
      onChange={({ values }, { values: oldValues }) => {
        if (values !== oldValues) {
          const newValue = values[type];
          const activeOptionName = newValue;
          const activeOption = options
            .find(({ name }) => name === activeOptionName);

          onChange(activeOption.url);
        }
      }}
      profile={profile}
      initialValues={initialValues(filter)}
      // We are making an assumption here that the non-applied options never change
      key={`${type}-${get(firstApplied(options), 'name', '')}`}
    >
      {
        () => (
          <FieldSet>
            <FieldRow>
              <CollapsibleField
                intl={intl}
                applied={get(firstApplied(options), 'name')}
                options={options.map(({
                  name,
                  label,
                  disabled,
                }) => ({
                  value: name,
                  label,
                  isDisabled: disabled,
                }))}
              >
                <Field
                  type="radio"
                  name={type}
                  stacked
                  label={text}
                  hideLabel
                />
              </CollapsibleField>
            </FieldRow>
          </FieldSet>
        )
      }
    </Form>
  );
};

RadioControl.propTypes = {
  intl: intlShape.isRequired,
  filter: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      applied: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  profile: PropTypes.oneOf([MOBILE, DESKTOP]),
  onChange: PropTypes.func.isRequired,
};

RadioControl.defaultProps = {
  profile: MOBILE,
};

export default RadioControl;
