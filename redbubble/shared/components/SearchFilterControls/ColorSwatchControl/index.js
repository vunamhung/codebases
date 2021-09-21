import React from 'react';
import PropTypes from 'prop-types';
import Form, {
  MOBILE,
  DESKTOP,
  FieldSet,
  Field,
} from '@redbubble/design-system/react/Form';
import Box from '@redbubble/design-system/react/Box';

const allApplied = options => options.filter(({ applied }) => applied);

const initialValues = ({ type, options }) => {
  const prefixedType = type;
  return { [prefixedType]: allApplied(options).map(({ name }) => name) };
};

const ColorSwatchControl = ({ filter, onChange, profile }) => {
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
            <Box paddingTop="xs">
              <Field
                type="color"
                name={type}
                fluid
                label={text}
                hideLabel
                multiple
                options={options.map(({
                  hexColor,
                  name,
                  label,
                  disabled,
                  imageUrl,
                }) => ({
                  hexColor,
                  value: name,
                  label,
                  isDisabled: disabled,
                  imageUrl,
                }))}
              />
            </Box>
          </FieldSet>
        )
      }
    </Form>
  );
};

ColorSwatchControl.propTypes = {
  filter: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      applied: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      hexColor: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
    })).isRequired,
  }).isRequired,
  profile: PropTypes.oneOf([MOBILE, DESKTOP]),
  onChange: PropTypes.func.isRequired,
};

ColorSwatchControl.defaultProps = {
  profile: MOBILE,
};

export default ColorSwatchControl;
