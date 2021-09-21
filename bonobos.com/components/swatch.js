import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { buildUrl, stripQueryString } from "highline/utils/url"
import { CancelIcon, CancelIconHeavy } from "highline/components/icons"
import styles from "highline/styles/components/swatch.module.css"

class Swatch extends React.PureComponent {
  static propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    imageUrl: PropTypes.string.isRequired,
    interactable: PropTypes.bool,
    width: PropTypes.oneOf(["default", "skinny"]),
    layout: PropTypes.string,
    title: PropTypes.oneOf(["default", "small"]),
  }

  static defaultProps = {
    checked: false,
    disabled: false,
    interactable: true,
    width: "default",
    layout: "default",
  }

  render() {
    const {
      checked,
      className,
      disabled,
      imageUrl,
      interactable,
      width,
      layout,
      title,
      ...other
    } = this.props

    const optimizedImageUrl = buildUrl(stripQueryString(imageUrl), {
      auto: "format,compress",
      q: 25, // can set the quality low becuase we are oversizing the image to support DPR up to 3
      fit: "clip",
      w: 28 * 3, // 28px is max size from swatch_common.css and then x3 for DPR=3 support
    })

    return (
      <div
        className={ classNames(
          "swatch-component",
          "component",
          styles.component,
          checked ? styles.checked : styles.unchecked,
          disabled && styles.disabled,
          interactable && styles.interactable,
          styles[width],
          styles[layout],
          className,
        ) }
        { ...other }
      >
        <div
          className={ classNames(styles.swatch, "swatchImage") }
          style={ { backgroundImage: `url(${optimizedImageUrl})` } }
          title={ title }
        />

        { disabled &&
            <div
              className={ classNames(styles.noSymbolIcon, styles[layout]) }
              aria-label={ "This option is currently not available" }
            >
              <CancelIconHeavy className={ styles.outerIcon } />
              <CancelIcon className={ styles.innerIcon } />
            </div>
        }
      </div>
    )
  }
}

export default Swatch
