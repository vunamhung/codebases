import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, defineMessages } from 'react-intl';
import CollapsibleFilter from './CollapsibleFilter';
import { ARTWORK_VIEW, PRODUCT_VIEW } from './consts';

const FILTER_TYPE = 'previewType';
const DEFAULT_OPTIONS = [
  {
    applied: true,
    disabled: false,
    name: PRODUCT_VIEW,
    url: PRODUCT_VIEW,
  },
  {
    applied: false,
    disabled: false,
    name: ARTWORK_VIEW,
    url: ARTWORK_VIEW,
  },
];

const messages = defineMessages({
  label: { defaultMessage: 'View as' },
  [PRODUCT_VIEW]: { defaultMessage: 'Product' },
  [ARTWORK_VIEW]: { defaultMessage: 'Design' },
});

const buildFilter = (intl, selected) => {
  return {
    label: intl.formatMessage(messages.label),
    experiences: [{ name: 'control', value: 'radio' }],
    options: DEFAULT_OPTIONS.map((o) => {
      return {
        ...o,
        applied: o.url === selected,
        label: intl.formatMessage(messages[o.name]),
      };
    }),
    type: FILTER_TYPE,
  };
};

const SearchGridPreviewSelector = ({
  intl,
  loading,
  selectedPreview,
  handlePreviewChange,
}) => {
  const filter = buildFilter(intl, selectedPreview);
  return (
    <CollapsibleFilter
      intl={intl}
      onChange={handlePreviewChange}
      filter={filter}
      loading={loading}
    />
  );
};

SearchGridPreviewSelector.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool.isRequired,
  selectedPreview: PropTypes.string.isRequired,
  handlePreviewChange: PropTypes.func.isRequired,
};

export default SearchGridPreviewSelector;
