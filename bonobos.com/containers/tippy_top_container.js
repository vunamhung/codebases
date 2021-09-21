import { connect } from "react-redux"
import { getObjectByFirstField, getField, getPageGmb } from "highline/utils/contentful/contentful_helper"

import {
  detailsToggled,
  tippyTopDismissClicked,
  tippyTopHeightHasChanged,
} from "highline/redux/actions/tippy_top_actions"

import TippyTop from "highline/components/application/tippy_top"

const mapStateToProps = (state) => {
  const currentPath = state.getIn(["currentPage", "path"])
  const contentfulData = state.getIn(["contentful", "globals"])
  const allGmbs = getField(getObjectByFirstField(contentfulData, "GMBs"),"content")
  const gmb = getPageGmb( currentPath, allGmbs)
  if (!gmb) {
    return {}
  }
  return {
    backgroundColor: gmb.backgroundColor,
    currentPath: state.getIn(["currentPage", "path"]),
    description: gmb.description,
    isOpen: state.getIn(["tippyTop", "isOpen"]),
    showDetails: state.getIn(["tippyTop", "showDetails"]),
    textColor: gmb.textColor,
    title: gmb.title,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickDismiss: () => {
      dispatch(tippyTopDismissClicked())
    },
    onToggleDetails: () => {
      dispatch(detailsToggled())
    },
    onTippyTopHeightChange: (height) => {
      dispatch(tippyTopHeightHasChanged(height))
    },
  }
}

const TippyTopContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TippyTop)

export default TippyTopContainer
