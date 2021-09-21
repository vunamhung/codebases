import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import marked from "marked"
import insane from "insane"
import styles from "highline/styles/components/markdown.module.css"

const convertMarkdownToSafeHTML = (markdown) => {
  const html = marked(markdown)
  return insane(html) // sanitize html
}

const Markdown = ({ align, className, source }) => (
  <div
    className={ classNames(
      "component",
      "markdown-component",
      styles.component,
      styles[align],
      className,
    ) }
    dangerouslySetInnerHTML={ { __html: convertMarkdownToSafeHTML(source) } }
  />
)

Markdown.propTypes = {
  align: PropTypes.oneOf(["left", "right", "center"]),
  className: PropTypes.string,
  source: PropTypes.string.isRequired,
}

Markdown.defaultProps = {
  align: "left",
}

export default Markdown
