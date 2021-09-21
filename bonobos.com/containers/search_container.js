import { connect } from "react-redux"
import Search from "highline/components/application/search"
import Router from "next/router"

import {
  handleSearchSubmitAsync,
  searchFocused,
  searchInputChanged,
  mobileSearchInputChanged,
  mobileSearchBarFocusComplete,
  searchAutosuggestClicked,
  searchSetSource,
  searchFetchSearchSourceAsync,
} from "highline/redux/actions/search_actions"
import { leftDrawerCloseAsync } from "highline/redux/actions/left_drawer_actions"

const handleSubmitGeneral = (e, searchTerm, dispatch, url = null, target = "search") => {
  e.preventDefault()
  if (target === "term" || target === "product") {
    dispatch(searchAutosuggestClicked(target, searchTerm))
  }
  if (target === "term" || target === "search") {
    dispatch(searchInputChanged("term", searchTerm))
    dispatch(handleSearchSubmitAsync(searchTerm))
  } else if (url) {
    Router.push(url.get("href"), url.get("as"))
  }
}

const mapDesktopStateToProps = (state) => {
  return {
    isOpenDesktop: state.getIn(["search", "isOpenDesktop"]),
    searchSource: state.getIn(["search", "searchSource"]),
    term: state.getIn(["search", "term"]),
  }
}

const mapDesktopDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (name, value) => {
      dispatch(searchInputChanged(name, value))
    },
    handleSearchFocus: () => {
      dispatch(searchFocused())
    },
    handleSearchSetSource: (searchSource) => {
      dispatch(searchSetSource(searchSource))
    },
    loadSearchSourceVariation: () => {
      dispatch(searchFetchSearchSourceAsync())
    },
    // handleSubmit is used by both auto suggest client click and search bar form submission
    handleSubmit: (e, searchTerm, url = null, target = "search") => 
      handleSubmitGeneral(e, searchTerm, dispatch, url, target),
  }
}

const DesktopSearchContainer = connect(
  mapDesktopStateToProps,
  mapDesktopDispatchToProps,
)(Search)

export default DesktopSearchContainer

const mapMobileStateToProps = (state) => {
  return {
    isOpenDesktop: false,
    leftDrawerOpen: state.getIn(["leftDrawer", "isOpen"]),
    searchSource: state.getIn(["search", "searchSource"]),
    shouldMobileSearchFocusAfterOpening: state.getIn(["search", "shouldMobileSearchFocusAfterOpening"]),
    term: state.getIn(["search", "term"]),
  }
}

const mapMobileDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (name, value) => {
      dispatch(mobileSearchInputChanged(name, value))
    },
    handleMobileSearchIconClicked: async () => {
      dispatch(mobileSearchBarFocusComplete())
    },
    handleSearchFocus: () => {
      dispatch(searchFocused())
    },
    handleSearchSetSource: (searchSource) => {
      dispatch(searchSetSource(searchSource))
    },
    handleSubmit: (e, searchTerm, url=null, target="search") => {
      dispatch(leftDrawerCloseAsync())
      handleSubmitGeneral(e, searchTerm, dispatch, url, target)
    },
  }
}


export const MobileSearchContainer = connect(
  mapMobileStateToProps,
  mapMobileDispatchToProps,
)(Search)
