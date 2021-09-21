import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

const withGlobalNavigation = (Component) => {
  const WrappedComponent = graphql(gql`
    fragment GlobalNavigationItemFragment on GlobalNavigationItem {
      id
      label
      position
      color
      action {
        type
        parameters {
          urlType
          url
        }
      }
      banner {
        url
        set {
          url
          descriptor
        }
      }
      icon {
        url
        set {
          url
          descriptor
        }
      }
      badge {
        type
        label
      }
    }

    query withGlobalNavigation($locale: String!, $currency: String!) {
      globalNavigation(locale: $locale, currency: $currency) {
        ...GlobalNavigationItemFragment
        items {
          ...GlobalNavigationItemFragment
        }
      }
    }
  `, {
    options: (props) => {
      const { userInfo } = props;
      // TODO: Do we need currency anymore, now that gifts are gone?
      const { locale, currency } = userInfo;

      return {
        variables: {
          locale,
          currency,
        },
      };
    },
    skip: ({ userInfo }) => {
      const info = userInfo || {};
      return !(info.locale && info.currency);
    },
    props: ({ data, ownProps }) => {
      const { globalNavigation } = data;

      return {
        ...ownProps,
        globalNavigation: globalNavigation || [],
      };
    },
  })(Component);

  WrappedComponent.displayName = 'withGlobalNavigation';

  return WrappedComponent;
};

export default withGlobalNavigation;
