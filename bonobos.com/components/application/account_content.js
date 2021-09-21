import React from "react"
import PropTypes from "prop-types"
import Tooltip from "highline/components/tooltip"
import AccountDropDownList from "highline/components/application/account_dropdown_list"
import styles from "highline/styles/components/application/account_content.module.css"
import Link from "highline/components/secure_link"
import { paths } from "highline/utils/navigate"
import { AccountIcon } from "highline/components/icons"

const mobileSignedOut =
  <button className={ styles.accountDropdownButton }>
    <Link href="/sign-in">
      <a className={ styles.signInLinkText } aria-label="Navigate to sign-in page">Sign In</a>
    </Link>
  </button>

const AccountContent = ({
  firstName,
  isLoggedIn,
  isAccountDropdownOpen,
  isTablet,
  onClickLogout,
  onMouseEnterAccount,
  onMouseLeaveAccount,
  onClickAccount,
}) => {
  const accountOrSignInLink = (isLoggedIn) => isLoggedIn
    ? (
      <a href={ paths.get("account") } className={ styles.accountButtonText } tabIndex="-1">
        { `Hi, ${firstName}` }
      </a>
    ) : (
      <Link href={ paths.get("signIn") }>
        <a href={ paths.get("signIn") } className={ styles.accountButtonText } tabIndex="-1">
          Sign In
        </a>
      </Link>
    )

  return isTablet && !isLoggedIn
    ? mobileSignedOut
    : <div
      className={ styles.authWrapper }
      onMouseEnter={ onMouseEnterAccount }
      onMouseLeave={ onMouseLeaveAccount }
    >
      <Tooltip
        placement="bottom"
        layout="account"
        isOpen={ isAccountDropdownOpen }
        target={
          <button
            aria-label={ isLoggedIn ? "Open Account Dropdown" : "Open Sign In Dropdown" }
            onClick={ onClickAccount }
            className={ styles.accountDropdownButton }
          >
            {!isTablet && accountOrSignInLink(isLoggedIn)}
            {isTablet && <AccountIcon />}
          </button>
        }
      >
        <AccountDropDownList
          isLoggedIn= { isLoggedIn }
          onClickLogout={ onClickLogout }
        />
      </Tooltip>
    </div>
}

AccountContent.propTypes = {
  firstName: PropTypes.string,
  isAccountDropdownOpen: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isTablet: PropTypes.bool,
  onClickAccount: PropTypes.func,
  onClickLogout: PropTypes.func,
  onMouseEnterAccount: PropTypes.func,
  onMouseLeaveAccount: PropTypes.func,
}

AccountContent.defaultProps = {
  firstName: "",
  isAccountDropdownOpen: false,
  isLoggedIn: false,
  isTablet: false,
  onClickAccount: () => {},
  onClickLogout: () => {},
  onMouseEnterAccount: () => {},
  onMouseLeaveAccount: () => {},
}

export default AccountContent
