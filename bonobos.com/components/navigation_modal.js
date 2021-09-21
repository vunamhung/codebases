import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import Link from "highline/components/secure_link"
import { getClientSideLink } from "highline/utils/link"
import ImmutablePropTypes from "react-immutable-proptypes"
import classNames from "classnames"
import Modal from "highline/components/modal"
import { ChevronIcons } from "highline/components/icons"
import styles from "highline/styles/components/navigation_modal.module.css"

class NavigationModal extends React.PureComponent {
    state = {
      showModal: false,
    }

    toggleModalVisibility() {
      this.setState({ showModal: !this.state.showModal })
    }

    handleClick(item) {
      this.toggleModalVisibility()
      this.props.onClick(item)
    }

    render() {
      const {
        expandedItem,
        items,
      } = this.props

      const {
        showModal,
      } = this.state

      return (
        <div
          className={ classNames(
            "component",
            "navigation-modal-component",
            styles.component,
          ) }
        >
          { showModal &&
            <Modal
              layout="fullscreenSelect"
              onRequestClose={ () => this.toggleModalVisibility() }
              closeButtonLayout="noBackground"
              returnFocusRef={ (ref) => this.selectRef = ref }
            >
              <div className={ styles.linksContainer }>
                { items.map((item, index) => {
                  const clientLink = getClientSideLink(item.get("path"))
                  const isSelected = item.get("path") === expandedItem.get("path")

                  return (
                    <Link
                      as={ clientLink.get("as") }
                      href={ clientLink.get("href") }
                      key={ `navigation-modal-link-${index}` }
                    >
                      <a
                        className={ classNames(
                          styles.link,
                          isSelected ? styles.selected : "",
                        ) }
                        onClick={ () => { this.handleClick(item) } }
                        href={ clientLink.get("as") }
                      >
                        { item.get("label") }
                      </a>
                    </Link>
                  )
                })}
              </div>
            </Modal>
          }
          <button
            className={ styles.toggleButton }
            onClick={ () => this.toggleModalVisibility() }
            ref={ (ref) => this.selectRef = ref }
          >
            <span>
              <h1>{ expandedItem.get("label") }</h1>
            </span>
            <div className={ styles.chevron }>
              <ChevronIcons.Left />
            </div>
          </button>
        </div>)
    }
}

NavigationModal.propTypes = {
  expandedItem: ImmutablePropTypes.map,
  items: ImmutablePropTypes.list,
  onClick: PropTypes.func,
}

NavigationModal.defaultProps = {
  expandedItem: fromJS({}),
  items: fromJS([]),
  onClick: () => {},
}

export default NavigationModal
