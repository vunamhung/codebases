import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';

const userInfoQuery = gql`{ userInfo { id, showMatureContent } }`;

const withToggleMatureContent = Component => graphql(gql`
  mutation withToggleMatureContent($show: Boolean!) {
    toggleMatureContent(show: $show) {
      showMatureContent
    }
  }
`, {
  props: ({ mutate }) => {
    return {
      onToggleMatureContent: show => mutate({
        variables: { show },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleMatureContent: {
            __typename: 'UserInfo',
            showMatureContent: show,
          },
        },
        update: (proxy, { data: { toggleMatureContent } }) => {
          const { showMatureContent } = toggleMatureContent || {};
          const data = proxy.readQuery({ query: userInfoQuery });

          data.userInfo.showMatureContent = showMatureContent;

          proxy.writeQuery({ query: userInfoQuery, data });
        },
      }),
    };
  },
})(Component);

withToggleMatureContent.displayName = 'withToggleMatureContent';

export default withToggleMatureContent;
