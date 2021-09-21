import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import TextTreeItemLink from "highline/components/text_tree_item_link"
import styles from "highline/styles/components/text_tree_item.module.css"

const TextTreeItem = ({
  children,
  isActive,
  isExpanded,
  item,
  onClick,
  onCollapse,
  onExpand,
}) => {
  const handleToggle = () => {
    isExpanded
      ? onCollapse(item)
      : onExpand(item)
  }

  return (
    <li
      className={ classNames(
        "component",
        "text-tree-item-component",
        styles.component,
      ) }
    >
      { children &&
        <div className={ styles.categoryList } >
          { isActive &&
            <button
              className={ classNames(
                styles.item,
                styles.parent,
                styles.active,
                isExpanded ? styles.minus : styles.plus,
              ) }
              onClick={ handleToggle }
              aria-label={ `Toggle Open ${item.get("label")} Navigation` }
              aria-expanded={ isExpanded }
            >
              { item.get("label") }
            </button>
          }
          { !isActive &&
            <TextTreeItemLink
              item={ item }
              onClick={ onClick }
              isParent
              isActive={ isActive }
            />
          }
          <ul
            className={ classNames(
              styles.children,
              isExpanded && styles.expanded,
            ) }
            onFocus={ !isExpanded ? () => handleToggle() : null }
            tabIndex="0"
          >
            { children }
          </ul>
        </div>
      }
      { !children &&
        <TextTreeItemLink
          item={ item }
          onClick={ onClick }
          isActive={ isActive }
        />
      }
    </li>
  )
}

TextTreeItem.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
  isExpanded: PropTypes.bool,
  item: ImmutablePropTypes.map,
  onClick: PropTypes.func,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
}

TextTreeItem.defaultProps = {
  isActive: false,
  isExpanded: false,
  item: fromJS({}),
  onClick: () => {},
  onCollapse: () => {},
  onExpand: () => {},
}

export default TextTreeItem
