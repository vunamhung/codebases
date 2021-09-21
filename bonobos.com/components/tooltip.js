import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { Manager, Reference, Popper } from "react-popper"
import styles from "highline/styles/components/tooltip.module.css"

const Tooltip = ({
  children,
  className,
  layout,
  modifiers,
  placement,
  target,
  isOpen,
  onClose,
}) => (
  <div
    className={ classNames(
      "component",
      "tooltip-component",
      styles.component,
      styles[layout],
      className,
    ) }
  >
    <Manager>
      <Reference>
        { ({ ref }) => (
          <span ref={ ref } className={ styles.target }>
            { target }
          </span>
        )}
      </Reference>
      { isOpen &&
        <Popper placement={ placement } modifiers={ modifiers } className={ styles.popper } >
          { ({ ref, style, placement, arrowProps }) => (
            <span ref={ ref } className={ classNames("popperBg", styles.popperBg) } style={ style }>
              { children }
              <button
                aria-label="Close the Tooltip"
                onClick={ onClose }
                className={ styles.closeButton }
              >
                Close
              </button>
              <span
                ref={ arrowProps.ref }
                style={ arrowProps.style }
                className={ classNames(
                  styles.arrow,
                  styles[placement],
                ) }
              />
            </span>
          ) }
        </Popper>
      }
    </Manager>
  </div>
)

Tooltip.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  layout: PropTypes.oneOf(["default", "admin", "account"]),
  modifiers: PropTypes.object,
  onClose: PropTypes.func,
  placement: PropTypes.string,
  target: PropTypes.node,
}

Tooltip.defaultProps = {
  isOpen: false,
  layout: "default",
  modifiers: {
    offset: {
      offset: "0 10px",
    },
    preventOverflow: {
      boundariesElement: "viewport",
      enabled: true,
    },
  },
  placement: "right",
}

export default Tooltip
