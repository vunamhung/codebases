import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { fromJS } from "immutable"
import classNames from "classnames"
import TextTree from "highline/components/text_tree"
import NavigationModal from "highline/components/navigation_modal"
import styles from "highline/styles/components/category/category_navigation_v2.module.css"

class CategoryNavigationV2 extends React.PureComponent {

  componentDidMount() {
    this.props.onMount()
  }

  render() {
    const {
      expandedItemSiblings,
      activeItem,
      categoryNavItems,
      expandedItem,
      onClick,
      onCollapse,
      onExpand,
      showForSmartPhoneAndTablet,
    } = this.props

    return (
      <div
        className={ classNames(
          "component",
          "category-navigation-v2-component",
          styles.component,
          showForSmartPhoneAndTablet ? styles.smartPhoneAndTablet : styles.desktop,
        ) }
      >

        <NavigationModal
          expandedItem={ expandedItem }
          items={ expandedItemSiblings }
          onClick={ onClick }
        />

        <TextTree
          activeItem={ activeItem }
          items={ categoryNavItems }
          expandedItem={ expandedItem }
          onClick={ onClick }
          onCollapse={ onCollapse }
          onExpand={ onExpand }
        />

      </div>
    )
  }
}

CategoryNavigationV2.propTypes = {
  expandedItemSiblings: ImmutablePropTypes.list,
  activeItem: ImmutablePropTypes.map,
  categoryNavItems: ImmutablePropTypes.list,
  expandedItem: ImmutablePropTypes.map,
  isTablet: PropTypes.bool,
  onClick: PropTypes.func,
  onCollapse: PropTypes.func,
  onExpand: PropTypes.func,
  onMount: PropTypes.func,
  showForSmartPhoneAndTablet: PropTypes.bool,
}

CategoryNavigationV2.defaultProps = {
  expandedItemSiblings: fromJS([]),
  categoryNavItems: fromJS([]),
  isTablet: false,
  onClick: () => {},
  onCollapse: () => {},
  onExpand: () => {},
  onMount: () => {},
  showForSmartPhoneAndTablet: false,
}

export default CategoryNavigationV2
