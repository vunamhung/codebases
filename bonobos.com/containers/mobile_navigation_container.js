import { connect } from "react-redux"
import MobileNavigation from "highline/components/application/mobile_navigation"
import {
  navigationParentTileClicked,
  navigationSubNavTileClickedAsync,
} from "highline/redux/actions/navigation_actions"
import { logoutAsync } from "highline/redux/actions/auth_actions"

const mapStateToProps = (state) => ({
  activeNav: state.getIn(["navigation", "activeNav"]),
  activePath: state.getIn(["navigation", "activePath"]),
  isLoggedIn: state.getIn(["auth", "isLoggedIn"]),
  isMobileNavOpen: state.getIn(["navigation", "isOpen"]),
  rootItems: state.getIn(["navigation", "items"]),
  shouldCollapse: state.getIn(["navigation", "shouldCollapse"]),
  subNavItems: state.getIn(["navigation", "mobileNavVisibleItems"]),
  view: state.getIn(["navigation", "view"]),
})

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick: () => {
    },
    handleLogOut: (e, name, level, link) => {
      e.preventDefault()
      dispatch(logoutAsync(name, level, link))
    },
    onClickParentTile: (name, path) => {
      dispatch(navigationParentTileClicked(name, path))
    },
    onClickSubNavTile: (name, link) => {
      dispatch(navigationSubNavTileClickedAsync(link, name))
    },
  }
}

const MobileNavigationContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileNavigation)

export default MobileNavigationContainer
