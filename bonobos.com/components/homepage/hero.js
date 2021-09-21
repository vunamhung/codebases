import React, { useEffect } from "react"
import { detectSmartphoneWidth } from "highline/utils/viewport"
import PropTypes from "prop-types"
import { List } from "immutable"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import { getClientSideLink } from "highline/utils/link"
import Cta from "highline/components/cta"
import Router from "next/router"
import styles from "highline/styles/components/homepage/hero.module.css"
import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import NextImages from "highline/components/next_images"

const textAlignClassName = {
  center: "textAlignCenter",
  left: "textAlignLeft",
  right: "textAlignRight",
}

const mobileTextAlignClassName = {
  center: "mobileTextAlignCenter",
  left: "mobileTextAlignLeft",
  right: "mobileTextAlignRight",
}

const Hero = ({
  align,
  altText,
  ariaLabel,
  className,
  copyWidth,
  ctas,
  ctaRef,
  ctaStyle,
  dark,
  description,
  descriptionExtended,
  descriptionSize,
  displayCopy,
  h1,
  heroWrapperClasses,
  justify,
  landscapeSrc,
  landscapeWidth,
  landscapeHeight,
  landscapeVideo,
  layout,
  legalText,
  linkHeroImage,
  mobileAlign,
  mobileDark,
  mobileTextAlign,
  objectFit,
  onCtaClick,
  isInSliderComponent,
  portraitSrc,
  portraitWidth,
  portraitHeight,
  portraitVideo,
  placeholder,
  priority,
  secondaryBackground,
  subDescription,
  subDescriptionExtended,
  textAlign,
  textColor,
  titleSize,
  textStyleDesktop,
  title,
  titleExtended,
}) => {

  const mainTargetUrl = ctas.getIn([0, "targetUrl"])
  const clientSideLink = linkHeroImage && !landscapeVideo && mainTargetUrl && getClientSideLink(mainTargetUrl)
  const ctasWithText = ctas.filter((cta) => cta.get("ctaText"))

  const newAlign = (layout === "secondary-left" || layout === "secondary-right") ? "" : align
  const newJustify = layout === "secondary-left" ? "left" : layout === "secondary-right" ? "right" : justify

  // When Hero is used in Swiper component (called Slider on Contentful) we need to force Hero images to use the Portrait src in order to make sure the previous images load correctly.
  const heroInSliderStyles = isInSliderComponent ? styles.overrideDesktopToPortrait : ""

  const darkStyle = (dark, mobileDark) => {
    if (dark === mobileDark && dark === true) {
      return "dark"
    } else if (dark === mobileDark && dark === false) {
      return "light"
    } else if (dark !== mobileDark && dark === true) {
      return "darkDesktopLightMobile"
    } else {
      return "lightDesktopDarkMobile"
    }
  }

  const [isSmartphone, setIsSmartphone] = React.useState(true)

  useEffect(() => {
    setIsSmartphone(detectSmartphoneWidth())
  }, [detectSmartphoneWidth()])


  return (
    <button
      className={ classNames(
        "component",
        "hero-component",
        styles.component,
        className,
        styles[newAlign],
        styles[displayCopy],
        styles[newJustify],
        styles[layout],
        styles[mobileAlign],
        styles[darkStyle(dark, mobileDark)],
        styles[textColor],
        styles[titleSize],
        styles[copyWidth],
        styles[descriptionSize],
        styles[textStyleDesktop],
        clientSideLink && styles.imageLink,
      ) }
      style={ secondaryBackground ? { "background-color": secondaryBackground } : null }
      onClick={ (e) => {
        const url = e.target.getAttribute("href") || mainTargetUrl
        onCtaClick(e, url)
        clientSideLink && navigateToImageLink(clientSideLink)
      } }
      tabIndex={ clientSideLink ? 0 : -1 }
    >
      <div className={ classNames(
        layout === "secondary-left" && styles.reverse,
        (layout === "secondary-left" || layout === "secondary-right") && styles.contentWrapper) }>
        { ((!isSmartphone && !landscapeVideo) || (isSmartphone && !portraitVideo)) &&
            <div className={ styles.image }>
              {/*
                both the portrait and landscape sources are presented, but CSS media queries will only display the appropriate image.
                picture tag is currently not supported with next/image, so we can't swap between two completely different src values,
                event with overriding the "srcset" and "sizes" props
              */}
              { portraitSrc &&
                <NextImages
                  src={ portraitSrc }
                  alt={ altText }
                  ariaLabel={ ariaLabel }
                  priority={ priority }
                  placeholder={ placeholder }
                  wrapperClassNames={ [styles.portraitHero, styles.heroImageWrapper, heroInSliderStyles, ...heroWrapperClasses] }
                  width={ portraitWidth }
                  height={ portraitHeight }
                  objectFit={ objectFit }
                />
              }
              { !isSmartphone && landscapeSrc &&
                <NextImages
                  src={ landscapeSrc }
                  alt={ altText }
                  ariaLabel={ ariaLabel }
                  priority={ priority }
                  placeholder={ placeholder }
                  wrapperClassNames={ [styles.landscapeHero, styles.heroImageWrapper, heroInSliderStyles, ...heroWrapperClasses] }
                  width={ landscapeWidth }
                  height={ landscapeHeight }
                  objectFit={ objectFit }
                />
              }
            </div>
        }
        { !isSmartphone && landscapeVideo &&
          <div className={ styles.video }>
            { renderContentfulComponent(landscapeVideo) }
          </div>
        }
        { isSmartphone && portraitVideo &&
          <div className={ styles.video }>
            { renderContentfulComponent(portraitVideo) }
          </div>
        }
        <section className={ classNames(
          styles.copy,
          clientSideLink && styles.copyNoPointerEvents,
          textAlign ? styles[textAlignClassName[textAlign]] : null,
          mobileTextAlign ? styles[mobileTextAlignClassName[mobileTextAlign]] : null,
        ) }>
          { subDescriptionExtended &&
            <h3 className={ styles.subDescription }>{createDescriptionText(subDescriptionExtended)}</h3>
          }
          { !subDescriptionExtended && subDescription &&
            <h3 className={ styles.subDescription }>{ subDescription }<br></br>{ subDescription }</h3>
          }
          { titleExtended &&
            titleExtended.map(
              (titleLine, index) => <div key={ "title " + index } className={ styles.title } style={ titleSize || textColor ? { "fontSize": titleSize, "color": textColor } :null }
              >{ titleLine }</div> )
          }
          { !titleExtended && title &&
            ( h1
              ? <h1 className={ styles.title }>{ title }</h1>
              : <div className={ styles.title }>{ title }</div>
            )
          }
          { descriptionExtended &&
            <h2 className={ styles.description } style={ descriptionSize ? { "fontSize": descriptionSize } : null }>{createDescriptionText(descriptionExtended)}</h2>
          }
          { !descriptionExtended && description &&
            <h2 className={ styles.description } style={ descriptionSize ? { "fontSize": descriptionSize } : null }>{ description }</h2>
          }
          { ctasWithText.size > 0 &&
            <div className={ styles.ctaContainer }>
              { ctasWithText.map((cta, index) => (
                <Cta
                  key={ `${ index }` }
                  align="inline"
                  className={ styles.cta }
                  ctaRef={ ctaRef }
                  href={ cta.get("targetUrl") }
                  layout={ ctaStyle }
                  tabIndex="0"
                  size="small"
                  onClick={ (e) => {
                    e.stopPropagation()
                    const url = e.target.getAttribute("href") || mainTargetUrl
                    onCtaClick(e, url)
                  } }
                >
                  { cta.get("ctaText") }
                </Cta>
              ))
              }
            </div>
          }
          { legalText &&
            <h3 className={ styles.legalText }>{ legalText }</h3>
          }
        </section>
      </div>
    </button>
  )
}

const createDescriptionText = (textArray) => {
  return (
    textArray.map((titleLine, index) => <span key={ "description " + index }>{ titleLine }<br></br></span> )
  )
}

const navigateToImageLink = (clientSideLink) => {
  Router.push(
    clientSideLink.get("href"),
    clientSideLink.get("as"),
  )
}

Hero.propTypes = {
  align: PropTypes.oneOf(["top", "bottom", "middle"]),
  altText: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  copyWidth: PropTypes.oneOf(["ten-percent", "twenty-percent", "thirty-percent", "forty-percent", "fifty-percent", "sixty-percent", "seventy-percent", "eighty-percent", "ninety-percent", "one-hundred-percent"]),
  ctaRef: PropTypes.func,
  ctas: ImmutablePropTypes.list,
  ctaStyle: PropTypes.oneOf(["primary", "primary-outline", "primary-transparent", "secondary", "secondary-outline", "secondary-transparent", "alternate", "alternate-outline", "alternate-transparent", "warning", "warning-link", "cancel-link", "link", "link-underlined", "plain-text"]),
  dark: PropTypes.bool,
  description: PropTypes.string,
  descriptionExtended: PropTypes.object,
  descriptionSize: PropTypes.string,
  displayCopy: PropTypes.oneOf(["both", "mobile", "desktop"]),
  h1: PropTypes.bool,
  heroWrapperClasses: PropTypes.array,
  justify: PropTypes.oneOf(["left", "right", "center"]),
  landscapeSrc: PropTypes.string,
  landscapeWidth: PropTypes.number,
  landscapeHeight: PropTypes.number,
  landscapeVideo: PropTypes.object,
  layout: PropTypes.oneOf(["primary", "secondary", "secondary-left", "secondary-right"]),
  legalText: PropTypes.string,
  linkHeroImage: PropTypes.bool,
  mobileAlign: PropTypes.oneOf(["mobileTop", "mobileBottom", "mobileMiddle"]),
  mobileDark: PropTypes.bool,
  mobileTextAlign: PropTypes.oneOf(["left", "center", "right"]),
  objectFit: PropTypes.string,
  onCtaClick: PropTypes.func,
  isInSliderComponent: PropTypes.bool,
  placeholder: PropTypes.string,
  portraitSrc: PropTypes.string,
  portraitWidth: PropTypes.number,
  portraitHeight: PropTypes.number,
  portraitVideo: PropTypes.object,
  priority: PropTypes.bool,
  secondaryBackground: PropTypes.string,
  srcWidth: PropTypes.number,
  subDescription: PropTypes.string,
  subDescriptionExtended: PropTypes.object,
  targetUrl: PropTypes.string,
  textAlign: PropTypes.oneOf(["left", "right", "center"]),
  textColor: PropTypes.string,
  titleSize: PropTypes.string,
  textStyleDesktop: PropTypes.oneOf(["large-avenir-medium", "large-avenir-demi", "large-avenir-bold", "small-avenir-medium", "small-avenir-demi", "small-avenir-bold", "small-sang-light", "large-sang-light"]),
  title: PropTypes.string,
  titleExtended: PropTypes.object,
}

Hero.defaultProps = {
  align: "middle",
  copyWidth: "forty-percent",
  ctas: List(),
  ctaStyle: "alternate",
  dark: false,
  displayCopy: "both",
  h1: false,
  heroWrapperClasses: [],
  justify: "center",
  layout: "primary",
  landscapeWidth: 0,
  landscapeHeight: 0,
  linkHeroImage: false,
  mobileAlign: "mobileMiddle",
  mobileTextAlign: "center",
  objectFit: "initial",
  onCtaClick: () => {},
  isInSliderComponent: false,
  portraitWidth: 0,
  portraitHeight: 0,
  priority: false,
  textAlign: "center",
  textStyleDesktop: "large-avenir",
}

export default Hero
