import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { getAutoApplyPromoFields, getImgixUrl } from "highline/utils/contentful/contentful_helper.js"
import { useSelector, useDispatch } from "react-redux"
import { toPromoModalFields } from "highline/utils/modal_helper"
import { getPromo } from "highline/redux/helpers/product_detail_helper"
import { contentfulComponentClicked } from "highline/redux/actions/contentful_actions"
import Images from "highline/components/images"
import styles from "highline/styles/components/contentful/contentful_sitewide_promo.module.css"

export const ContentfulSitewidePromo = ({ page }) => {
  const dispatch = useDispatch()
  const buttonClick = (contentType, target, contentId) => {
    dispatch(contentfulComponentClicked(contentType, target, contentId))
  }

  const contentfulData = useSelector((state) => state.getIn(["contentful", "globals"]) )
  const autoApplyPromoFields = getAutoApplyPromoFields(contentfulData)
  const showOnHomepage = autoApplyPromoFields && autoApplyPromoFields.get("showOnHomepage")
  const promo = getPromo(contentfulData)
  if (!promo || !autoApplyPromoFields || (page === "home" && !showOnHomepage)) { return null }

  const promoTermsAndConditionsModal = toPromoModalFields(promo)
  const portraitURL = getImgixUrl(autoApplyPromoFields.get("portraitImage"))
  const landscapeURL = getImgixUrl(autoApplyPromoFields.get("landscapeImage"))
  const imageURL = portraitURL && landscapeURL // check if both images exist in contentful
  const textAlignStyle = autoApplyPromoFields.get("textAlign")

  return (
    <div className={ page === "home" ? styles.home : styles.plp }
      style={ {
        "backgroundColor": (imageURL)
          ? "none"
          : autoApplyPromoFields.get("backgroundColor"),
        "color": autoApplyPromoFields.get("textColor"),
        "minHeight": imageURL ? "none" : "200px" } }>

      { imageURL &&
        <Images
          altText={ "Discount terms and conditions" }
          ariaLabel={ "Discount terms and conditions" }
          landscapeSrc={ landscapeURL }
          portraitSrc={ portraitURL }
        />
      }

      <section className={ classNames( styles.copy, styles[textAlignStyle]) }>
        <div className={ styles.sitewideDiscountTitle }>
          { autoApplyPromoFields.get("name") }
        </div>
        <div className={ styles.sitewideDiscountDescription }>
          { autoApplyPromoFields.get("discount") }% Off
        </div>
        <div className={ styles.sitewideDiscountTerms }>
          Price as marked - Limited time with code{
            <button
              id="sitewide_discount_btn"
              className={ classNames(styles.sitewideDiscountLink) }
              style={ { "color": autoApplyPromoFields.get("textColor") } }
              onClick={ () => buttonClick("modal", promoTermsAndConditionsModal, "Promotion Terms and Conditions Modal") }
              aria-label = "Discount terms and conditions"
            >
              { autoApplyPromoFields.get("promoCode") }
            </button>
          }
        </div>
      </section>
    </div>
  )
}

ContentfulSitewidePromo.propTypes = {
  page: PropTypes.oneOf(["home", "plp"]),
}

export default ContentfulSitewidePromo
