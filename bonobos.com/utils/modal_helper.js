import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import { getField } from "highline/utils/contentful/contentful_helper"
import PromoModal from "highline/components/pdp/promo_modal"
import ContentfulQuiz from "highline/components/contentful/contentful_quiz"

export const getModalContent = (modalId, modalContent, callbackFn) => {
  switch (modalId) {
    case "Promotion Terms and Conditions Modal":
      return <PromoModal content={ modalContent }></PromoModal>
    case "Quiz":
      return <ContentfulQuiz quizContent={ modalContent.get("quiz") }></ContentfulQuiz>
    default:
      return modalContent.map(
        (component, index) => renderContentfulComponent(component, callbackFn, index))
  }
}

export const toPromoModalFields = (promo) => {
  return {
    content: {
      discountAmount: getField(promo, "discount"),
      expirationDate: getField(promo, "expirationDate"),
      name: getField(promo, "name"),
      promoCode: getField(promo, "promoCode"),
      termsAndConditions: getField(promo, "termsAndConditions"),
    },
    contentId: "Promotion Terms and Conditions Modal",
    layout: "roundedFlexible",
  }
}

export const getShortDate = (date) => {
  const longDate = new Date(date)
  const year = longDate.getFullYear()
  let month = longDate.getMonth()+1
  let dt = longDate.getDate()+1

  if (dt < 10) {
    dt = "0" + dt
  }
  if (month < 10) {
    month = "0" + month
  }

  return `${month}/${dt}/${year}`
}
