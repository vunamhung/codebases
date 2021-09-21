import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import Link from "highline/components/secure_link"
import { getClientSideLink } from "highline/utils/link"
import styles from "highline/styles/components/category/navigation_pill_item.module.css"

const NavigationPillItem = ({
  link,
  text,
  activePath,
  onClick,
}) => {

  var isActive = false
  const path = getClientSideLink(link)

  if ( activePath == link){
    isActive = true
  }

  return (

    <div className={ classNames(
      "component",
      "pill-item",
      styles.component,
    ) }
    >
      { !path.isEmpty() &&
        <Link href={ path.get("href") } as={ path.get("as") }>
          <a onClick={ () => onClick(text, path.get("href")) } className={ classNames( styles.pillItem ), (isActive ? styles.pillItemIsActive : styles.pillItem ) }>
            <div className={ styles.text }>
              { text }
            </div>
          </a>
        </Link>
      }
    </div>
  )
}

NavigationPillItem.propTypes = {
  link: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  activePath: PropTypes.string,
}

NavigationPillItem.defaultProps = {
  link: "",
  text: "",
  activePath: "",
  onClick: () => {},
}

export default NavigationPillItem
