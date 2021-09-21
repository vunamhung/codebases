import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { MOBILE } from '@redbubble/design-system/react/Form';
import VariableComponent from '../VariableComponent';
import { getAppliedOptionLabels } from '../../lib/searchControls/appliedOptions';
import LoadingWrapper from '../LoadingWrapper';
import CollapsibleControlGroup, { CollapsibleControlGroupBody } from './CollapsibleControlGroup';
import RadioControl from '../SearchFilterControls/RadioControl';
import CheckboxControl from '../SearchFilterControls/CheckboxControl';
import ColorSwatchControl from '../SearchFilterControls/ColorSwatchControl';

const CONTROL_MAP = {
  radio: RadioControl,
  checkbox: CheckboxControl,
  color: ColorSwatchControl,
};

const CollapsibleFilter = ({ intl, filter, onChange, loading }) => {
  const { label: text, options, experiences } = filter;

  return (
    <CollapsibleControlGroup
      key={text}
      topLevel
      text={text}
      label={getAppliedOptionLabels(options).join(', ')}
    >
      <LoadingWrapper loading={loading}>
        <CollapsibleControlGroupBody>
          <VariableComponent
            experienceName="control"
            experiences={experiences}
            map={CONTROL_MAP}
            fallback={RadioControl}
          >
            {
                Component => (
                  <Component
                    intl={intl}
                    filter={filter}
                    profile={MOBILE}
                    onChange={url => onChange(url)}
                  />
                )
              }
          </VariableComponent>
        </CollapsibleControlGroupBody>
      </LoadingWrapper>
    </CollapsibleControlGroup>
  );
};
CollapsibleFilter.propTypes = {
  intl: intlShape.isRequired,
  filter: PropTypes.shape({
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
  }).isRequired,
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

CollapsibleFilter.defaultProps = {
  loading: false,
};
export default CollapsibleFilter;
