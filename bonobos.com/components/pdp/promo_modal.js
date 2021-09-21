import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { getShortDate } from "highline/utils/modal_helper"
import styles from "highline/styles/components/pdp/promo_modal.module.css"

const PromoModal = ({
  content,
}) => {
  const discountAmount = content.get("discountAmount")
  const expirationDate = content.get("expirationDate")
  const name = content.get("name")
  const promoCode = content.get("promoCode")
  const termsAndConditions = content.get("termsAndConditions")

  return (
    <div
      className={ classNames(
        "component",
        "promo-modal",
        styles.component,
      ) }>
      <div className={ styles.headerContainer }>
        <div className={ styles.headerText }>
          <div className={ styles.name }>{name}</div>
          <div className={ styles.discountAmount }>{discountAmount}% Off</div>
          <div className={ styles.promoCode }>Price as marked - Limited time with code {promoCode}</div>
        </div>
        <div className={ styles.headerDetails }>
          <div className={ styles.detailsBox }>
            <div className={ styles.detailsPromoCode }>Code:&nbsp;&nbsp;{promoCode}</div>
            <div>Expires:&nbsp;&nbsp;{getShortDate(expirationDate)}</div>
          </div>
        </div>
      </div>
      <p className={ styles.promoBody }>
        *{termsAndConditions}
      </p>
    </div>
  )
}

PromoModal.propTypes = {
  content: PropTypes.object,
}

PromoModal.defaultProps = {
  content: {},
}

export default PromoModal
