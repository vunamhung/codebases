import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { List } from "immutable"
import classNames from "classnames"
import Link from "highline/components/secure_link"
import styles from "highline/styles/components/breadcrumbs.module.css"

const Breadcrumbs = ({
  disableLastItem,
  items,
  layout,
  onClick,
  responsiveLayout,
  showForSmartPhoneAndTablet,
}) => {

  const generateLink = (item) => (
    <Link as={ item.get("as") } href={ item.get("href") }>
      <a
        onClick={ () => onClick(item.get("as")) }
      >
        { item.get("name") }
      </a>
    </Link>
  )

  const generateDisabledItem = (item) => (
    showForSmartPhoneAndTablet
      ? <h1 className={ styles.disabledItem }>
        { item.get("name") }
      </h1>
      : <span className={ styles.disabledItem }>
        { item.get("name") }
      </span>
  )

  return (
    <div className={ classNames(
      "component",
      "breadcrumbs-component",
      styles.component,
      styles[layout],
      styles[responsiveLayout],
    ) }>
      { items &&
        <span>
          { items.map((item, index) => (
            <span key={ `breadcrumb-${item.get("name")}-${index}` } className= { styles.breadcrumbItem }>
              { index > 0 &&
                <span className={ styles.slash }>/</span>
              }

              { disableLastItem && index === items.size - 1
                ? generateDisabledItem(item)
                : generateLink(item)
              }
            </span>
          )) }
        </span>
      }
    </div>
  )
}

Breadcrumbs.propTypes = {
  disableLastItem: PropTypes.bool,
  isTablet: PropTypes.bool,
  items: ImmutablePropTypes.list,
  layout: PropTypes.oneOf(["primary", "secondary", "header"]),
  onClick: PropTypes.func,
  responsiveLayout: PropTypes.oneOf(["hideOnDesktop", "hideOnSmartPhoneAndTablet"]),
  showForSmartPhoneAndTablet: PropTypes.bool,
}

Breadcrumbs.defaultProps = {
  disableLastItem: false,
  isTablet: false,
  items: List(),
  layout: "primary",
  onClick: () => {},
  showForSmartPhoneAndTablet: false,
}

export default Breadcrumbs
