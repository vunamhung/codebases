import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import VerticalNavList from "highline/components/vertical_nav_list"
import TextTreeItem from "highline/components/text_tree_item"
import styles from "highline/styles/components/text_tree.module.css"

const TextTree = ({
  activeItem,
  expandedItem,
  items,
  onClick,
  onCollapse,
  onExpand,
}) => (
  <div
    className={ classNames(
      "component",
      "text-tree-component",
      styles.component,
    ) }
  >
    <div>
      <VerticalNavList>
        { items.map((item, index) => (
          <TextTreeItem
            isActive={ item.get("path") === activeItem.get("path") }
            isExpanded={ item.get("path") === expandedItem.get("path") }
            key={ `${item.get("label")}-${index}` }
            item={ item }
            onClick={ onClick }
            onCollapse={ onCollapse }
            onExpand={ onExpand }
          >
            { item.get("children") && item.get("children").map((child) => (
              <TextTreeItem
                isActive={ child.get("path") === activeItem.get("path") }
                key={ `${child.get("label")}-${index}` }
                item={ child }
                onClick={ onClick }
              />
            )) }
          </TextTreeItem>
        )) }
      </VerticalNavList>
    </div>
  </div>
)

const childrenPropType = ImmutablePropTypes.mapContains({
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
})

const itemPropType = ImmutablePropTypes.mapContains({
  children: ImmutablePropTypes.listOf(childrenPropType),
  label: PropTypes.string.isRequired,
})

TextTree.propTypes = {
  activeItem: ImmutablePropTypes.map,
  expandedItem: ImmutablePropTypes.map,
  items: ImmutablePropTypes.listOf(itemPropType).isRequired,
  onClick: PropTypes.func,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
}

TextTree.defaultProps = {
  activeItem: fromJS({}),
  expandedItem: fromJS({}),
  items: fromJS([]),
  onClick: () => {},
  onCollapse: () => {},
  onExpand: () => {},
}

export default TextTree
