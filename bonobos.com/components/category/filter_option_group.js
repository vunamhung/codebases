import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import ToggleGroup from "highline/components/toggle_group"
import ToggleItem from "highline/components/toggle_item"
import { List } from "immutable"
import TextTag from "highline/components/text_tag"
import classNames from "classnames"
import { optionSizeMapper } from "highline/utils/variant_helper"
import { getObjectByFirstField, getField, getImgixUrl } from "highline/utils/contentful/contentful_helper"
import { detectTabletWidth } from "highline/utils/viewport"
import styles from "highline/styles/components/category/filter_option_group.module.css"

const getFilterTitle = (filter) => {
  const isTablet = detectTabletWidth()
  if (filter == "Base Color") {
    return isTablet ? "Color" : null
  } else if (filter == "Product") {
    return isTablet ? "Product" : null
  }
  return filter
}

const FilterOptionGroup = ({
  fitEducators,
  selectable,
  selectedFilters,
  showFitImages,
  filters,
  filterName,
  filterPresentation,
  displayType,
  filterValueKey,
  handleOptionClick,
  isDisabled,
}) => (
  <div
    className={ classNames(
      "component",
      "filter-option-group-component",
      styles.component,
      showFitImages ? styles.componentWithImages : styles.componentWithoutImages,
    ) }
  >
    <ToggleGroup
      canDeselect
      layout={ displayType === "toggle" ? "text" : "checkbox" }
      name={ filterName }
      onChange={ handleOptionClick }
      title={ getFilterTitle(filterPresentation) }
      type="checkbox"
      value={ selectedFilters }
      showFitImages={ showFitImages }
    >
      { selectable && filters.map((filter) => {
        const toggleLogic = (
          displayType === "toggle"
            ? <TextTag className={
              classNames(filterPresentation == "Base Color" &&
                [styles.colorFilterMobile, styles[filter.get(filterValueKey).toLowerCase()]],
              filterPresentation == "Product" && styles.productFilterText,
              )
            }>
              { filter.get("presentation") }
            </TextTag>
            : <span className={ classNames(
              styles.filterText,
              filterPresentation == "Base Color" && styles.colorFilter,
            ) }>
              { filter.get("presentation") }
            </span>
        )
        return (
          <ToggleItem
            disabled={ !!filter.get("eliminated") || isDisabled }
            key={ filter.get(filterValueKey) }
            value={ filter.get(filterValueKey) }
            size={ optionSizeMapper(filterName) }
            showFitImages={ showFitImages }
            color={ filterPresentation == "Base Color" ? filter.get(filterValueKey).toLowerCase() : null }
            className={ filterPresentation == "Product" && styles.productFilter }
          >
            { showFitImages ?
              <div className={ styles.imageFilter } >
                <img className={ styles.fitImage } alt={ filter.get("presentation") } src={ getImgixUrl(getField(getObjectByFirstField(fitEducators, filter.get("presentation")),"fitImage"))+"?w=200" }></img>
                { toggleLogic }
                <div>{ getField(getObjectByFirstField(fitEducators, filter.get("presentation")), "fitDescription")  }</div>
              </div>
              : toggleLogic
            }
          </ToggleItem>
        )
      }) }
      { !selectable && filters.map((filter) => (
        displayType === "toggle"
          ? <TextTag
            className={ styles.readOnlyText }
            key={ filter.get(filterValueKey) }
            value={ filter.get(filterValueKey) }
            readOnly={ !selectable }
          >
            { filter.get("presentation") }
          </TextTag>
          :
          <span
            className={ styles.readOnlyText }
            key={ filter.get(filterValueKey) }
          >
            { filter.get("presentation") }
          </span>
      )) }
    </ToggleGroup>
  </div>
)

FilterOptionGroup.propTypes = {
  displayType: PropTypes.oneOf(["toggle","checkbox"]),
  filterName: PropTypes.string,
  filterPresentation: PropTypes.string,
  filters: ImmutablePropTypes.list,
  filterValueKey: PropTypes.string,
  fitEducators: ImmutablePropTypes.list,
  handleOptionClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  selectable: PropTypes.bool,
  selectedFilters: ImmutablePropTypes.list,
  showFitImages: PropTypes.bool,
}

FilterOptionGroup.defaultProps = {
  displayType: "toggle",
  filters: List(),
  filterValueKey: "name",
  fitEducators: List(),
  handleOptionClick: () => {},
  isDisabled: false,
  selectable: true,
  selectedFilters: List(),
  showFitImages: false,
}

export default FilterOptionGroup
