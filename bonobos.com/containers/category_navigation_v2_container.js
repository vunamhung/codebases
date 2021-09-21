import { connect } from "react-redux"
import CategoryNavigationV2 from "highline/components/category/category_navigation_v2"
import {
  categoryNavigationV2ItemClicked,
  categoryNavigationV2ItemCollapsed,
  categoryNavigationV2ItemExpanded,
  categoryNavigationV2FetchAsync,
} from "highline/redux/actions/category_navigation_v2_actions"

const mapStateToProps = (state, ownProps) => ({
  expandedItemSiblings: state.getIn(["categoryNavigationV2", "expandedItemSiblings"]),
  activeItem: state.getIn(["categoryNavigationV2", "activeItem"]),
  categoryNavItems: state.getIn(["categoryNavigationV2", "navItems"]),
  expandedItem: state.getIn(["categoryNavigationV2", "expandedItem"]),
  showForSmartPhoneAndTablet: ownProps.showForSmartPhoneAndTablet,
})

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (item) => {
      dispatch(categoryNavigationV2ItemClicked(item))
    },
    onCollapse: (item) => {
      dispatch(categoryNavigationV2ItemCollapsed(item))
    },
    onExpand: (item) => {
      dispatch(categoryNavigationV2ItemExpanded(item))
    },
  }
}

const CategoryNavigationV2Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryNavigationV2)

export default CategoryNavigationV2Container
