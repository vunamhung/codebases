import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import NavigationSlider from "highline/components/navigation_slider"
import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import { ContentfulSitewidePromo } from "highline/components/contentful/contentful_sitewide_promo_component"
import HomepageHead from "highline/components/homepage/homepage_head"
import styles from "highline/styles/components/homepage/homepage.module.css"

const Homepage = ({
  callbackFn,
  homepageContentfulData,
  navSliderData,
  isHeaderMinified,
  trackNavSliderItemClicked,
}) => {
  return (
    <div className={ classNames(
      styles.component,
      "homepage-component",
      isHeaderMinified && styles.headerMinified,
    ) }>
      <HomepageHead />
      <h1 className={ styles.homepageHeader }>Bonobos</h1>
      { navSliderData &&
        <div className={ styles.navigationSlider }>
          <NavigationSlider onClick ={ trackNavSliderItemClicked } contentfulData={ navSliderData } />
        </div>
      }
      <ContentfulSitewidePromo page={ "home" } />
      { homepageContentfulData &&
        homepageContentfulData.map((component, index) => renderContentfulComponent(component, callbackFn, index))
      }
    </div>
  )
}

Homepage.propTypes = {
  callbackFn: PropTypes.func,
  homepageContentfulData: PropTypes.object,
  navSliderData: PropTypes.object,
  isHeaderMinified: PropTypes.bool,
  trackNavSliderItemClicked: PropTypes.func,
}

export default Homepage
