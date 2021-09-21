import { connect } from "react-redux"
import ContentfulProductTile from "highline/components/contentful/contentful_product_tile"
import { productPreviewClicked } from "highline/redux/actions/category_actions"
import {
  contentfulProductPreviewClickedAsync,
  contentfulProductVariantSelected,
  contentfulProductVariantActivated,
  contentfulProductVariantDeactivated,
  contentfulProductTileClicked,
} from "highline/redux/actions/contentful_actions"

const mapStateToProps = (state, ownProps) => {
  return {
    cmsContent: state.getIn("rightDrawer", "cmsContent"),
    color: ownProps.color,
    contentfulId: ownProps.contentfulId,
    itemsDetails: state.getIn(["contentful", "itemsDetails"]),
    onClick: ownProps.onClick,
    primaryImageOverride: ownProps.primaryImageOverride,
    secondaryImageOverride: ownProps.secondaryImageOverride,
    shouldShowSwatches: ownProps.shouldShowSwatches,
    sku: ownProps.sku,
    placeholder: ownProps.placeholder,
    priority: ownProps.priority,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleProductTileClick: (slug, contentfulId) => {
      // firing of analytic event determined by the mapper in the component
      dispatch(contentfulProductTileClicked(slug, contentfulId))
    },

    handleQuickAddClick: (slug, selectedOptions) => {
      dispatch(productPreviewClicked(slug, selectedOptions))
      dispatch(contentfulProductPreviewClickedAsync(slug))
    },

    handleSwatchClick: (slug, optionValue) => {
      dispatch(contentfulProductVariantSelected(slug, optionValue))
    },

    handleSwatchMouseEnter: (slug, optionValue) => {
      dispatch(contentfulProductVariantActivated(slug, optionValue))
    },

    handleSwatchMouseLeave: (slug) => {
      dispatch(contentfulProductVariantDeactivated(slug))
    },
  }
}

const ContentfulProductTileContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentfulProductTile)

export default ContentfulProductTileContainer