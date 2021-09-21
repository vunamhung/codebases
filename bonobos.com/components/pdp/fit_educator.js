import { memo }  from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { useSelector, useDispatch } from "react-redux"
import { getObjectByFirstField, getField, getImgixUrl } from "highline/utils/contentful/contentful_helper"
import { fitEducatorClosed } from "highline/redux/actions/product_detail_actions"
import { CloseIcon } from "highline/components/icons"
import Imgix from "highline/components/imgix"
import { Map } from "immutable"
import { camelize } from "humps"
import styles from "highline/styles/components/pdp/fit_educator.module.css"

const FitEducator = memo(({
  fitType,
  handleFitChange,
}) => {
  // Data from the Redux Store
  const fitEducatorDetails = useSelector((state) => state.getIn(["sizeAndFit", "educationGroups", fitType, "educationItems"])) || Map()
  const selectedFit = useSelector((state) => state.getIn(["productDetail", "selectedOptions", fitType])) || ""
  const contentfulData = useSelector((state) => state.getIn(["contentful", "globals"]))
  const productName = useSelector((state) => state.getIn(["productDetail", "name"]))
  const dispatch = useDispatch()

  // Data from Contentful
  const contentfulFitData = getField(getObjectByFirstField(contentfulData, "Fit Educators"), "content")
  const contentfulFitEducators = getField(getObjectByFirstField(contentfulFitData, fitType), "fitEducators")
  const contentfulSelectedFitData = getObjectByFirstField(contentfulFitEducators, selectedFit)
  const contentfulFitImage = getImgixUrl(getField(contentfulSelectedFitData, "fitImage"))
  const contentfulFitDescription = getField(contentfulSelectedFitData, "fitDescription")

  // Data from Highline
  const selectedFitDetails = fitEducatorDetails.find((fit) => camelize(fit.get("title")) === camelize(selectedFit))
  const fitMarkdown = selectedFitDetails ? selectedFitDetails.get("markdown") : null
  const fitIllustration = selectedFitDetails ? selectedFitDetails.get("imageUrl") : null

  const fitImage = contentfulFitImage || fitIllustration
  const fitDescription = contentfulFitDescription || fitMarkdown

  // If there is no fit image or description we don't want to render an empty box
  if (!fitImage || !fitDescription) {
    return null
  }

  return (
    <div className={ classNames(
      "component",
      "fit-educator-component",
      styles.component,
    ) }
    >
      <div className={ styles.imageWrapper }>
        <Imgix
          className={ styles.image }
          htmlAttributes={ {
            alt: fitDescription,
            "aria-label": fitDescription,
          } }
          src={ fitImage }
        />
      </div>
      <div className={ styles.textWrapper }>
        <div className={ styles.textTitle }>{ selectedFit }</div>
        <div className={ styles.text }>{ fitDescription }</div>
      </div>
      <button
        aria-label={ "Close fit educator details" }
        className={ styles.closeButtonCTA }
        onClick={ () => {
          dispatch(fitEducatorClosed(productName))
          handleFitChange(false)
        } }
      >
        { <CloseIcon /> }
      </button>
    </div>
  )
})

FitEducator.propTypes = {
  fitType: PropTypes.string,
  handleFitChange: PropTypes.func,
}

FitEducator.defaultProps = {
  handleFitChange:  () => {},
}

export default FitEducator
