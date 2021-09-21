import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import get from 'lodash/get';

export const query = gql`
  query withUserInfo {
    userInfo {
      id
      userId
      country
      currency
      locale
      isLoggedIn
      username
      avatar
      showMatureContent
      federatedId
      isEligibleForAutoSubscribe
      enrolments {
        experiment
        group
      }
    }
  }
`;

export const userInfoPropType = PropTypes.shape({
  locale: PropTypes.string,
  showMatureContent: PropTypes.bool,
  enrolments: PropTypes.arrayOf(PropTypes.shape({
    experiment: PropTypes.string,
    group: PropTypes.string,
  })),
  federatedId: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  currency: PropTypes.string,
  country: PropTypes.string,
  isEligibleForAutoSubscribe: PropTypes.bool,
});

const withUserInfo = Component => graphql(query, {
  props: ({ data: { loading, userInfo }, ownProps }) => {
    return {
      ...ownProps,
      userInfoLoading: loading,
      userInfo: userInfo || {},
    };
  },
})(Component);

withUserInfo.displayName = 'withUserInfo';

export default withUserInfo;

export const useUserInfo = () => {
  const { data, loading } = useQuery(query);
  const userInfo = get(data, 'userInfo') || {};

  return {
    userInfo,
    userInfoLoading: loading,
  };
};
