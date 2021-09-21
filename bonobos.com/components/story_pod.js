import React, { Fragment } from "react"
import PropTypes from "prop-types"
import Link from "highline/components/secure_link"
import classNames from "classnames"
import { LongArrowRightIcon } from "highline/components/icons"
import { getClientSideLink } from "highline/utils/link"
import styles from "highline/styles/components/story_pod.module.css"
import NextImages from "highline/components/next_images"

const StoryPod = ({
  altText,
  ariaLabel,
  textColor,
  description,
  landscapeSrc,
  landscapeWidth,
  landscapeHeight,
  layout,
  link,
  onClick,
  placeholder,
  portraitSrc,
  portraitWidth,
  portraitHeight,
  priority,
  title,
}) => {
  const clientSideLink = getClientSideLink(link)
  const hasClientSideLink = clientSideLink && clientSideLink.get("href") && clientSideLink.get("as")

  const content = (
    <Fragment>
      <section className={ styles.imageSection }>
        { portraitSrc && 
          <NextImages
            src={ portraitSrc }
            alt={ altText }
            ariaLabel={ ariaLabel }
            wrapperClassNames={ [styles.portraitStoryImage, styles.storyImageWrapper] }
            width={ portraitWidth }
            height={ portraitHeight }
            priority={ priority }
            placeholder={ placeholder }
          />
        }
        { landscapeSrc && 
          <NextImages
            src={ landscapeSrc }
            alt={ altText }
            ariaLabel={ ariaLabel }
            wrapperClassNames={ [styles.landscapeStoryImage, styles.storyImageWrapper] }
            width={ landscapeWidth }
            height={ landscapeHeight }
            priority={ priority }
            placeholder={ placeholder }
          />
        }
      </section>
      <section className={ styles.copy }>
        <div className={ styles.ctaContainer }>
          <h2 className={ styles.title }>{ title }</h2>
          <div className={ styles.arrowStyling }> <LongArrowRightIcon /></div>
        </div>
        <h3 className={ styles.description }>{ description }</h3>
      </section>
    </Fragment>
  )

  return (
    <div
      className={ classNames(
        "component",
        "story-pod-component",
        styles.component,
        styles[layout],
        styles[textColor],
      ) }
    >
      { hasClientSideLink ?
        <Link href={ clientSideLink.get("href") } as={ clientSideLink.get("as") }>
          <a
            href={ clientSideLink.get("as") }
            onClick={ onClick }
          >
            { content }
          </a>
        </Link>
        : content
      }
    </div>
  )
}

StoryPod.propTypes = {
  altText: PropTypes.string,
  ariaLabel: PropTypes.string,
  description: PropTypes.string,
  desktopPercentageWidth: PropTypes.number,
  landscapeSrc: PropTypes.string,
  landscapeWidth: PropTypes.number,
  landscapeHeight: PropTypes.number,
  layout: PropTypes.oneOf(["primary", "secondary"]),
  link: PropTypes.string,
  mobilePercentageWidth: PropTypes.number,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  portraitSrc: PropTypes.string,
  portraitWidth: PropTypes.number,
  portraitHeight: PropTypes.number,
  priority: PropTypes.bool,
  textColor: PropTypes.PropTypes.oneOf(["dark", "light"]),
  title: PropTypes.string,
}

StoryPod.defaultProps = {
  altText: "",
  ariaLabel: "",
  description: "",
  desktopPercentageWidth: 1,
  landscapeSrc: "",
  landscapeWidth: 0,
  landscapeHeight: 0,
  layout: "primary",
  link: "",
  mobilePercentageWidth: 1,
  onClick: () => {},
  portraitSrc: "",
  portraitWidth: 0,
  portraitHeight: 0,
  textColor: "dark",
  title: "",
}

export default StoryPod
