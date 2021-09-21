import React, { Fragment } from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { List, Map } from "immutable"
import { checkImmutable } from "highline/utils/immutable_helper"
import CategoryGroup from "highline/components/category/category_group"

const CategoryExpandedLayout = ({
  appliedFilters,
  bundlePromoTileData,
  groups,
  name,
  handleProductImageHover,
  handleQuickAddClick,
  isTablet,
  onSavedItemCtaClick,
  savedItems,
  selectedFilters,
}) => (
  <Fragment>
    { groups.map((group, index) => {
      const categoryGroup = checkImmutable(group, Map)
      return (
        <CategoryGroup
          appliedFilters={ appliedFilters }
          bundlePromoTileData={ index === 0 ? bundlePromoTileData : null }
          ctaText="Quick Shop"
          currentCategory={ name }
          editorial={ categoryGroup.get("editorial") }
          groupPosition={ index }
          isTablet={ isTablet }
          items={ categoryGroup.get("items") }
          key={ `${ categoryGroup.get("name") }-${ index }` }
          name={ categoryGroup.get("slug", "").split("/").pop() }
          onCTAClick={ handleQuickAddClick }
          onProductImageHover={ handleProductImageHover }
          onSavedItemCtaClick={ onSavedItemCtaClick }
          presentation={ categoryGroup.get("name") }
          savedItems={ savedItems }
          selectedFilters={ selectedFilters }
        />
      )
    }) }
  </Fragment>
)

CategoryExpandedLayout.propTypes = {
  appliedFilters: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  bundlePromoTileData: ImmutablePropTypes.map,
  groups: ImmutablePropTypes.list,
  handleProductImageHover: PropTypes.func,
  handleQuickAddClick: PropTypes.func,
  isTablet: PropTypes.bool,
  name: PropTypes.string,
  onSavedItemCtaClick: PropTypes.func,
  savedItems: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  selectedFilters: ImmutablePropTypes.map,
}

CategoryExpandedLayout.defaultProps = {
  groups: List(),
  handleProductImageHover: () => {},
  handleQuickAddClick: () => {},
  isTablet: false,
  savedItems: List(),
  selectedFilters: Map(),
}

export default CategoryExpandedLayout
