import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { List } from "immutable"
import classNames from "classnames"
import ReactImageGallery from "react-image-gallery"
import styles from "highline/styles/components/image_gallery.module.css"

class ImageGallery extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    items: ImmutablePropTypes.list.isRequired,
    startIndex: PropTypes.number,
  }

  static defaultProps = {
    items: List(),
    startIndex: 0,
  }

  render() {
    const { className, items, startIndex, ...other } = this.props
    const itemsArray = items.toArray()
    const initialIndex = Math.max(0, startIndex)

    return (
      <div
        className={ classNames(
          "component",
          "image-gallery-component",
          styles.component,
          className,
        ) }
      >
        <ReactImageGallery
          ref={ (c) => this._imageGallery = c }
          items={ itemsArray }
          startIndex={ initialIndex }
          { ...other }
        />
      </div>
    )
  }
}

export default ImageGallery
