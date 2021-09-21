import React from "react"
import PropTypes from "prop-types"
import Input from "highline/components/input"
import classNames from "classnames"
import { detectTabletWidth } from "highline/utils/viewport"
import { SearchIcon } from "highline/components/icons"
import getConfig from "highline/config/application"
import { generateLink } from "highline/redux/helpers/filters_helper"
import { List, fromJS } from "immutable"

import styles from "highline/styles/components/application/search.module.css"

class Search extends React.PureComponent {
  static propTypes = {
    handleInputChange: PropTypes.func,
    handleMobileSearchIconClicked: PropTypes.func,
    handleSearchFocus: PropTypes.func,
    handleSearchSetSource: PropTypes.func,
    handleSubmit: PropTypes.func,
    loadSearchSourceVariation: PropTypes.func,
    searchSource: PropTypes.string,
    shouldMobileSearchFocusAfterOpening: PropTypes.bool,
    term: PropTypes.string,
  }

  static defaultProps = {
    handleInputChange: () => {},
    handleMobileSearchIconClicked: () => {},
    handleSearchFocus: () => {},
    handleSearchSetSource: () => {},
    handleSubmit: () => {},
    loadSearchSourceVariation: () => {},
    shouldMobileSearchFocusAfterOpening: false,
    term: "",
  }

  constructor(props) {
    super(props)
    this.state = { searchInput: null }
  }

  componentDidMount() {
    // A/B test to hit Constructor or Flatiron
    this.props.loadSearchSourceVariation()
  }

  componentDidUpdate() {
    const mobileFocus = this.props.shouldMobileSearchFocusAfterOpening
    // When opening the left menu from Search Icon, we'll want to focus the input field
    if (mobileFocus) {
      this.triggerTabletKeyboard()
      this.focusSearchInputField()
    }


    const isConstructorFlagLoaded = this.props.searchSource !== ""
    if (isConstructorFlagLoaded && !!this.state.searchInput && !this.autoSuggest) {
      this.mountAutoSuggest()
    }
  }

  componentWillUnmount() {
    // dispose autosuggest box when client unmounts from desktop or mobile
    this.autoSuggest && this.autoSuggest.dispose()
  }

  mountAutoSuggest = () => {
    const isConstructorDisabled = this.props.searchSource !== "constructor-on"
    if (window.ConstructorioAutocomplete != undefined) {
      this.autoSuggest = new window.ConstructorioAutocomplete(this.state.searchInput, {
        // make the autosuggest container sticky on search bar for desktop
        appendTo: detectTabletWidth() ? document.body : ".stickyAutosuggest",
        beaconMode: isConstructorDisabled,
        key: getConfig().constructorKey,
        maxResultsPerSection: {
          "Products": 4,
          "Search Suggestions": detectTabletWidth() ? 5 : 6,
        },
        onSelect: (suggestion) => {
          const safeSuggestion = fromJS(suggestion)
          const termOrProductClicked = !safeSuggestion.getIn(["data", "url"]) ? "term" : "product"
          const color_name =  safeSuggestion.getIn(["data", "color_name"])
          const url = safeSuggestion.getIn(["data", "url"])
          const is_gift_card = safeSuggestion.getIn(["data", "is_gift_card"])
          const is_bundle =  safeSuggestion.getIn(["data", "is_bundle"])
          const link = generateLink(
            url,
            color_name,
            List([]),
            is_gift_card,
            is_bundle,
          )
          suggestion.data.url = ""
          // fire tracking event
          this.props.handleSubmit(new Event(""), safeSuggestion.get("value"), link, termOrProductClicked)
        },
        triggerSubmitOnSelect: false,
      })
    }
  }

  triggerTabletKeyboard = () => {
    this.props.handleMobileSearchIconClicked()
  }

  focusSearchInputField = () => {
    this.state.searchInput && this.state.searchInput.focus()
  }

  render() {
    const {
      handleInputChange,
      handleSubmit,
      term,
      handleSearchFocus,
    } = this.props

    const searchComponentId = "search-input"

    return (
      <div
        className={ classNames(
          "component",
          "search-component",
          styles.searchWrapper,
        ) }
      >
        <form className={ styles.form } onSubmit={ (e) => handleSubmit(e, term) } autoComplete="off" action="#">
          <Input
            autoComplete="off"
            className={ styles.input }
            name="search"
            type="search"
            id={ searchComponentId }
            aria-label="Search"
            inputRef={ (input) => { this.setState({ searchInput: input }) } }
            placeholder= "Search"
            onChange={ (e) => handleInputChange("term", e.target.value) }
            onFocus={ (e) => {
              handleSearchFocus(e)
            } }
            value={ term }
            data-cy={ searchComponentId }
          />
          <label htmlFor={ searchComponentId }>Search</label>
          <SearchIcon
            className={ styles.searchIcon }
            onClick={ this.focusSearchInputField }
          />
        </form>
      </div>
    )
  }
}

export default Search
