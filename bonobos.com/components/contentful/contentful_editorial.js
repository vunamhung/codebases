import React from "react"
import classNames from "classnames"
import ImmutablePropTypes from "react-immutable-proptypes"
import { Map, fromJS } from "immutable"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { MARKS, INLINES } from "@contentful/rich-text-types"
import Cta from "highline/components/cta"
import { getField } from "highline/utils/contentful/contentful_helper"
import { renderContentfulComponent } from "highline/utils/contentful/component_helper"
import insane from "insane" // sanitize html
import PropTypes from "prop-types"
import styles from "highline/styles/components/contentful/contentful_editorial.module.css"

const Editorial = ({ editorialComponent, callbackFn }) => {
  const editorialStyling = {
    "textAlign": getField(editorialComponent, "textAlign"),
  }

  const options = {
    renderMark: {
      [MARKS.CODE]: (code) => (
        <div style={ { display: "inline" } } dangerouslySetInnerHTML={ { __html: insane(code, {
          allowedAttributes: {
            a: ["href", "style", "target"],
            div: ["style"],
            h1: ["style"],
            h2: ["style"],
            h3: ["style"],
            h4: ["style"],
            h5: ["style"],
            h6: ["style"],
            iframe: ["frameborder", "src", "title", "id", "width", "height"],
            img: ["src", "style", "alt", "height", "width"],
            p: ["style"],
            span: ["style"],
          },
          allowedTags: ["a", "blockquote", "br", "div", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
            "i", "iframe", "img", "li", "ol", "p", "span", "strike", "strong", "u", "ul"],
          displayName: "Inline code",
        }) } }></div>
      ),
    },
    renderNode: {
      // eslint-disable-next-line react/display-name
      [INLINES.EMBEDDED_ENTRY]: (node) => (
        <span className="embedded">
          {
            renderContentfulComponent(fromJS(node.data.target), callbackFn)
          }
        </span>
      ),
    },
  }

  return (
    <div className={
      classNames(
        "component",
        "contentful-editorial-component",
        styles.contentSection,
      )
    }
    style={ editorialStyling }
    >
      { getField(editorialComponent, "showTitle") &&
        <div className={ styles.title }>
          { getField(editorialComponent, "title") }
        </div>
      }
      { getField(editorialComponent, "body") &&
          <div className={ styles.richText }>
            { documentToReactComponents(getField(editorialComponent, "body").toJS(), options) }
          </div>
      }
      { getField(editorialComponent, "callToAction") && getField(editorialComponent, "callToActionUrl") &&
        <Cta
          className={ styles.cta }
          align="inline"
          layout="primary-outline"
          rounded="true"
          href={ getField(editorialComponent, "callToActionUrl") }
        >
          { getField(editorialComponent, "callToAction") }
        </Cta>
      }
    </div>

  )
}

Editorial.propTypes = {
  callbackFn: PropTypes.func,
  editorialComponent: ImmutablePropTypes.map,
}

Editorial.defaultProps = {
  callbackFn: () => {},
  editorialComponent: Map(),
}

export default Editorial