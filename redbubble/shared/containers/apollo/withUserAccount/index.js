import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

const withUserAccount = Component => graphql(gql`
  query withUserAccount {
    userAccount {
      joinedAt
      onboardedAt
      analytics {
        artistSalesGroup
        artistUploadsGroup
      }
      isArtist
      metrics {
        followers
        favorites
        productsSold
      }
      displayName
      hasAvatar
    }
  }
`, {
  props: ({ data: { loading, userAccount }, ownProps }) => {
    return {
      ...ownProps,
      userAccountLoading: loading,
      userAccount,
    };
  },
})(Component);

withUserAccount.displayName = 'withUserAccount';

export default withUserAccount;
