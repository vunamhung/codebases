import { connect } from "react-redux"

import {
  leftDrawerOpenClicked,
  leftDrawerCloseAsync,
  leftDrawerLeftCTAClicked,
} from "highline/redux/actions/left_drawer_actions"

import LeftDrawer from "highline/components/application/left_drawer"

const mapStateToProps = (state) => {
  return {
    isLeftCtaVisible: state.getIn(["navigation", "view"]) !== "root",
    isOpen: state.getIn(["leftDrawer", "isOpen"]),
    isRendered: state.getIn(["navigation", "isOpen"]),
    title: state.getIn(["navigation", "mobileNavBreadcrumbs"]).get(0),
    // Empty breadcrumb will show Bonobos icon instead of Title
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickLeftCTA: () => {
      dispatch(leftDrawerLeftCTAClicked())
    },
    onClose: () => {
      dispatch(leftDrawerCloseAsync())
    },
    onLoad: () => { },
    onOpen: () => {
      dispatch(leftDrawerOpenClicked())
    },
  }
}

const LeftDrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftDrawer)

export default LeftDrawerContainer
