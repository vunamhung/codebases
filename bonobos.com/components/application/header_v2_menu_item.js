import React from "react"
import Link from "highline/components/secure_link"
import PropTypes from "prop-types"
import classNames from "classnames"
import { highlinePages } from "highline/config/pages"
import { getClientSideLink } from "highline/utils/link"

import styles from "highline/styles/components/application/header_v2_menu_item.module.css"

const HeaderV2MenuItem = ({
  active,
  displayText,
  onClick,
  onMouseEnter,
  onMouseLeave,
  path,
  title,
}) => {
  const clientLink = getClientSideLink(path)
  const isHighlinePage = highlinePages.find((regex) => regex.test(path))

  const anchorTag = <a
    className={ classNames(
      styles.menuLink,
      active ? styles.active : null,
    ) }
    href={ path }
    onClick={ onClick }
    onMouseEnter={ onMouseEnter }
    onMouseLeave={ onMouseLeave }
  >
    { displayText || title }
  </a>

  return isHighlinePage ?
    <Link as={ clientLink.get("as") } href={ clientLink.get("href") }>
      { anchorTag }
    </Link>
    :
    anchorTag
}

HeaderV2MenuItem.propTypes = {
  active: PropTypes.bool,
  displayText: PropTypes.string,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  path: PropTypes.string,
  title: PropTypes.string,
}

HeaderV2MenuItem.defaultProps = {
  active: false,
  onClick: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
}

export default HeaderV2MenuItem
