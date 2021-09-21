import React from 'react';
import PropTypes from 'prop-types';

import Form, {
  MOBILE,
  DESKTOP,
  FieldSet,
  FieldRow,
  Field,
} from '@redbubble/design-system/react/Form';

const allApplied = options => options.filter(({ applied }) => applied);

const initialValues = ({ type, options }) => {
  const prefixedType = type;
  return { [prefixedType]: allApplied(options).map(({ name }) => name) };
};

const CheckboxControl = ({ filter, onChange, profile }) => {
  const { type, options, label: text } = filter;

  return (
    <Form
      onChange={({ values }, { values: oldValues }) => {
        if (values !== oldValues) {
          const newValue = values[type];
          const oldValue = oldValues[type];

          let activeOptionName;

          if (newValue.length > oldValue.length) {
            activeOptionName = newValue.find(value => !oldValue.includes(value));
          } else {
            activeOptionName = oldValue.find(value => !newValue.includes(value));
          }

          const activeOption = options
            .find(({ name }) => name === activeOptionName);

          onChange(activeOption.url);
        }
      }}
      profile={profile}
      initialValues={initialValues(filter)}
      // We are making an assumption here that the non-applied options never change
      key={`${type}-${allApplied(options).map(({ name }) => name).join(',')}`}
    >
      {
        () => (
          <FieldSet>
            <FieldRow>
              <Field
                type="checkbox"
                name={type}
                stacked
                label={text}
                hideLabel
                options={options.map(({
                  name,
                  label,
                  disabled,
                }) => ({
                  value: name,
                  label,
                  isDisabled: disabled,
                }))}
              />
            </FieldRow>
          </FieldSet>
        )
      }
    </Form>
  );
};

CheckboxControl.propTypes = {
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

CheckboxControl.defaultProps = {
  profile: MOBILE,
};

export default CheckboxControl;
