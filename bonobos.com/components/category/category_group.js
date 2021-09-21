import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import { List, Map } from "immutable"
import { checkImmutable } from "highline/utils/immutable_helper"
import { generateSubcategoryAnchor, getPrimaryImageUrl, getSecondaryImageUrl } from "highline/redux/helpers/category_helper"
import { generateLink, formatSelectedOptions } from "highline/redux/helpers/filters_helper"
import Editorial from "highline/components/category/editorial"
import ProductTile from "highline/components/category/product_tile"
import { isSavedItem } from "highline/redux/helpers/saved_items_helper"
import BundlePromoTile from "highline/components/category/bundle_promo_tile"
import styles from "highline/styles/components/category/category_group.module.css"

const CategoryGroup = ({
  bundlePromoTileData,
  currentCategory,
  ctaText,
  editorial,
  groupPosition,
  isTablet,
  items,
  name,
  onCTAClick,
  onProductImageHover,
  onSavedItemCtaClick,
  presentation,
  savedItems,
  selectedFilters,
}) => {
  const isFirstGroup = groupPosition === 0
  const editorialInfo = checkImmutable(editorial, Map)
  const subcatAnchor = generateSubcategoryAnchor(name, currentCategory)

  const bundlePromoTileIndex = bundlePromoTileData && bundlePromoTileData.get("position")
  const bundlePromoTile = bundlePromoTileData && <BundlePromoTile key="bundle-promo-tile" { ...bundlePromoTileData.toJS() } />

  return (
    <div
      className={ classNames(
        "component",
        "category-group-component",
        styles.component,
      ) }
      id={ subcatAnchor }
    >
      <Editorial
        description={ editorialInfo.get("description") }
        imageUrl={ editorialInfo.get("imageUrl") }
        imageAlt={ `Editorial photo for ${presentation} category` }
        lazyLoad={ !isFirstGroup }
        promotionalMessage={ editorialInfo.get("promotionalMessage") }
        title={ presentation }
        subDescription={ editorialInfo.get("subDescription") }
      />

      { items.map((categoryItem, index) => {
        // lazyload anything that is not the first 6 items in group 0
        const lazyLoad = !(isFirstGroup && index < 6)

        const item = checkImmutable(categoryItem, Map)
        const color = item.getIn(["options", "color"]) || item.getIn(["options", "theme"]) || Map()
        const slug = item.get("slug")
        const isBundle = item.get("isBundle")
        const isGiftCard = item.get("isGiftCard")
        const selectedOptions = formatSelectedOptions(color.get("name"), selectedFilters)

        // We only display description for desktop experience. Otherwise there is no title and
        // subtitle maps to color presentation
        const title = isTablet ? "" : color.get("presentation")
        const subtitle = isTablet ? color.get("presentation") : item.get("programShortDescription")

        const link = generateLink(
          slug,
          color.get("name"),
          selectedFilters,
          isGiftCard,
          isBundle,
        )

        const isSaved = savedItems.isEmpty() ? item.get("saved") : isSavedItem(slug, color.get("name"), savedItems)
        return (
          <ProductTile
            ariaLabel={ `Open Quick Shop for ${item.get("name")} in ${color.get("presentation")}` }
            isTablet={ isTablet }
            fullPrice={ item.get("fullPrice") }
            primaryImageUrl={ getPrimaryImageUrl(item) }
            secondaryImageUrl={ getSecondaryImageUrl(item) }
            lazyLoad={ lazyLoad }
            link={ link }
            key={ `${ item.get("name") }-${ index }` }
            name={ item.get("name") }
            price={ item.get("price") }
            promoPrice={ item.get("finalSale") || item.get("isBundle") ? null : item.get("promoPrice") }
            onCTAClick={ () => {
              onCTAClick(slug, selectedOptions)
            } }
            onProductImageHover={ onProductImageHover }
            onSavedItemCtaClick={ onSavedItemCtaClick }
            ctaText={ ctaText }
            showCTA={ !isBundle && !isGiftCard }
            saved={ isSaved }
            slug={ slug }
            selectedOptions={ selectedOptions }
            showSavedItemCta={ !isBundle }
            title={ title }
            subtitle={ subtitle }
          />
        )
      }).insert(bundlePromoTileIndex, bundlePromoTile) }
    </div>
  )
}


CategoryGroup.propTypes = {
  bundlePromoTileData: ImmutablePropTypes.map,
  ctaText: PropTypes.string,
  currentCategory: PropTypes.string,
  editorial: ImmutablePropTypes.map,
  groupPosition: PropTypes.number.isRequired,
  isTablet: PropTypes.bool,
  items: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  name: PropTypes.string,
  onCTAClick: PropTypes.func,
  onProductImageHover: PropTypes.func,
  onSavedItemCtaClick: PropTypes.func,
  presentation: PropTypes.string,
  savedItems: ImmutablePropTypes.listOf(
    ImmutablePropTypes.map,
  ),
  selectedFilters: ImmutablePropTypes.map,
}

CategoryGroup.defaultProps = {
  currentCategory: "",
  editorial: Map(),
  isTablet: false,
  items: List(),
  savedItems: List(),
  selectedFilters: Map(),
}

export default CategoryGroup
