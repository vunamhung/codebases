import withApplicationLayout from "highline/layouts/with_application_layout"
import AuthContainer from "highline/containers/auth_container"
import { fromJS } from "immutable"
import { decryptCCPAAsync } from "highline/redux/actions/auth_actions"
import PropTypes from "prop-types"

const SignIn = ({ redirectUrl }) => (
  <AuthContainer redirectOnSuccessUrl={ redirectUrl } />
)

SignIn.propTypes = {
  redirectUrl: PropTypes.string,
}

SignIn.getInitialProps = async ({ query, store }) => {
  const encryptedValue = fromJS(query).get("params")
  if (encryptedValue) {
    await store.dispatch(decryptCCPAAsync(encryptedValue))
  }
  return {
    canonicalPath: "sign-in",
    pageCategory: "Sign-in",
    redirectUrl: query.redirect_to,
    title: "Account Sign In | Bonobos",
  }
}

export default withApplicationLayout(SignIn)
