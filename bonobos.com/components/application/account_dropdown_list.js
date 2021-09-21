import React from "react"
import PropTypes from "prop-types"
import Link from "highline/components/secure_link"
import List from "highline/components/list"
import styles from "highline/styles/components/application/account_dropdown_list.module.css"
import { paths } from "highline/utils/navigate"


const accountList = <List>
  <a href={ paths.get("account") }>My Account</a>
  <a href={ paths.get("fitPreferences") }>My Fit</a>
  <a href={ paths.get("savedItems") }>Saved Items</a>
</List>
const helpList = <List>
  <Link href={ paths.get("help") }>
    <a href={ paths.get("help") }>Help</a>
  </Link>
  <Link href={ paths.get("returns") }>
    <a href={ paths.get("returns") }>Returns</a>
  </Link>
  <Link href={ paths.get("contactUs") }>
    <a href={ paths.get("contactUs") }>Contact Us</a>
  </Link>
</List>

const AccountDropDownList = ( { isLoggedIn, onClickLogout } ) => (
  <div className={ styles.accountDropdownContainer }>
    { isLoggedIn && accountList }
    { helpList }
    <List>{ isLoggedIn
      ? <button
        aria-label="Sign out"
        onClick={ onClickLogout }
      >
        Sign Out
      </button>
      : <Link href={ paths.get("signIn") }>
        <a href={ paths.get("signIn") } aria-label="Navigate to sign-in page">Sign In</a>
      </Link>
    }
    </List>
  </div>
)

AccountDropDownList.propTypes = {
  isLoggedIn: PropTypes.bool,
  onClickLogout: PropTypes.func,
}

AccountDropDownList.defaultProps = {
  isLoggedIn: false,
  onClickLogout: () => {},
}

export default AccountDropDownList
