import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import Link from "highline/components/secure_link"
import { getClientSideLink } from "highline/utils/link"
import styles from "highline/styles/components/text_tree_item_link.module.css"

const TextTreeItemLink = ({
  isActive,
  isExpanded,
  isParent,
  item,
  onClick,
}) => {

  const clientLink = getClientSideLink(item.get("path"))

  return (
    <Link
      as={ clientLink.get("as") }
      href={ clientLink.get("href") }
    >
      <a
        className={ classNames(
          styles.item,
          isActive && styles.active,
          isParent && styles.parent,
          isExpanded ? styles.minus : styles.plus,
        ) }
        onClick={ () => { onClick(item) } }
        href={ clientLink.get("as") }
      >
        { item.get("label") }
      </a>
    </Link>
  )
}

TextTreeItemLink.propTypes = {
  isActive: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isParent: PropTypes.bool,
  item: ImmutablePropTypes.mapContains({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func,
}

TextTreeItemLink.defaultProps = {
  isActive: false,
  isExpanded: false,
  isParent: false,
  item: fromJS({}),
  onClick: () => {},
}

export default TextTreeItemLink
