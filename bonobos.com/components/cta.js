import React, { Fragment } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Link from "highline/components/secure_link"
import { getClientSideLink } from "highline/utils/link"
import styles from "highline/styles/components/cta.module.css"

const Cta = ({
  align,
  children,
  className,
  ctaRef,
  externalLink,
  href,
  isLink,
  layout,
  onClick,
  rounded,
  size,
  ...other
}) => {
  const clientSideLink = getClientSideLink(href)
  const anchorTag = (
    <a
      className={ classNames(
        "component",
        "cta-component",
        styles.component,
        className,
        styles[align],
        styles[layout],
        styles[size],
        isLink && styles.link,
        rounded && styles.rounded,
      ) }
      href={ externalLink ? href : clientSideLink.get("as") }
      onClick={ onClick }
      ref={ ctaRef }
      { ...other }
    >
      { children }
    </a>
  )

  return (
    <Fragment>
      { externalLink && anchorTag }
      { !externalLink && href &&
        <Link
          as={ clientSideLink.get("as") }
          href={ clientSideLink.get("href") }
        >
          { anchorTag }
        </Link>
      }
      { !externalLink && !href && anchorTag }
    </Fragment>
  )
}

Cta.propTypes = {
  align: PropTypes.oneOf(["block", "stretch", "inline"]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  ctaRef: PropTypes.func,
  externalLink: PropTypes.bool,
  href: PropTypes.string,
  isLink: PropTypes.bool,
  layout: PropTypes.oneOf([
    "primary",
    "primary-outline",
    "primary-transparent",
    "secondary",
    "secondary-outline",
    "secondary-transparent",
    "alternate",
    "alternate-outline",
    "alternate-transparent",
    "cancel", "cancel-link",
    "warning",
    "warning-link",
    "disabled-style",
    "transparent",
    "link",
    "plain-text",
    "link-underlined",
  ]),
  onClick: PropTypes.func,
  rounded: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
}

Cta.defaultProps = {
  align: "block",
  externalLink: false,
  isLink: false,
  layout: "primary",
  onClick: () => {},
  rounded: false,
  size: "medium",
}

export default Cta
