import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

const withBannerMessages = Component => graphql(gql`
  query withBannerMessages($countryCode: String!, $locale: String!) {
    banners(countryCode: $countryCode, locale: $locale) {
      message
      endDate
    }
  }
`, {
  skip: ({ countryCode, locale }) => {
    return !countryCode || !locale;
  },
  options: ({ countryCode, locale }) => ({
    variables: { countryCode, locale },
  }),
  props: ({ data: { banners }, ownProps }) => ({
    ...ownProps,
    banners,
  }),
})(Component);

withBannerMessages.displayName = 'withBannerMessages';

export default withBannerMessages;
