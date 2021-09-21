import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { FilledHeartIcon, EmptyHeartIcon } from "highline/components/icons"

import styles from "highline/styles/components/saved_item_cta.module.css"

const SavedItemCta = ({
  className,
  isCarousel,
  isSaved,
  layout,
  onClick,
}) => {
  const buttonClassName = classNames([styles[layout], isCarousel && styles.carousel])
  return (
    <div
      className={ classNames(
        "component",
        "saved-item-cta-component",
        className,
        styles.component,
      ) }
    >
      { isSaved ?
        <button
          className={ buttonClassName }
          onClick={ onClick }
          aria-label={ "Remove from saved items list" }
        >
          { <FilledHeartIcon /> }{layout === "link" && <span>Item Saved</span>}
        </button>
        : <button
          className={ buttonClassName }
          onClick={ onClick }
          aria-label={ "Add to saved items list" }
        >
          { <EmptyHeartIcon /> }{layout === "link" && <span>Add to Wishlist</span>}
        </button>
      }
    </div>
  )
}

SavedItemCta.propTypes = {
  className: PropTypes.string,
  isCarousel: PropTypes.bool,
  isSaved: PropTypes.bool,
  layout: PropTypes.oneOf(["button", "link"]),
  onClick: PropTypes.func,
}

SavedItemCta.defaultProps = {
  className: "",
  isCarousel: false,
  isSaved: false,
  layout: "button",
  onClick: () => {},
}

export default SavedItemCta
