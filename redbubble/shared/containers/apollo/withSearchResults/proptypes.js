import PropTypes from 'prop-types';

export const artistCollectionsPropType = PropTypes.shape({
  applied: PropTypes.bool.isRequired,
  showMatureContent: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    applied: PropTypes.bool.isRequired,
  })),
  reset: PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
  }),
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});


export const searchResultsMetadataPropType = PropTypes.shape({
  searchContext: PropTypes.shape({
    category: PropTypes.string,
  }).isRequired,
});

export const searchResultsPaginationPropType = PropTypes.shape({
  currentPage: PropTypes.number,
  perPage: PropTypes.number,
  showPreviousPageLink: PropTypes.bool,
  showNextPageLink: PropTypes.bool,
  paginationLinks: PropTypes.shape({
    namedLinks: PropTypes.shape({
      previousPage: PropTypes.shape({
        rel: PropTypes.string,
        url: PropTypes.string,
      }),
      nextPage: PropTypes.shape({
        rel: PropTypes.string,
        url: PropTypes.string,
      }),
    }),
  }),
  fromNumber: PropTypes.number,
  toNumber: PropTypes.number,
  total: PropTypes.number,
});

export const searchResultsFiltersPropType = PropTypes.shape({
  resetUrl: PropTypes.string.isRequired,
  staticFilters: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  filters: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  appliedCount: PropTypes.number.isRequired,
});

export const searchResultsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    inventoryItem: PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
      }),
      previewSet: PropTypes.shape({
        previews: PropTypes.arrayOf(
          PropTypes.shape({
            previewTypeId: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
          }),
        ),
      }),
      attributes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
        attributes: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string,
          value: PropTypes.any,
        })),
      })),
      productPageUrl: PropTypes.string,
    }),
    work: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      isMatureContent: PropTypes.bool,
      artist: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    defaultPreviewTypeId: PropTypes.string,
    rank: PropTypes.number,
  }),
);

export const artistCollectionsDefaultProps = {
  applied: false,
  options: [],
  reset: null,
  type: 'collection',
  label: 'Collection',
};
