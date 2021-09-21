import React from "react"
import classNames from "classnames"
import dynamic from "next/dynamic"
import PropTypes from "prop-types"
import Modal from "highline/components/modal"
import styles from "highline/styles/components/terms_and_privacy/terms_and_privacy_summary.module.css"

const loadingPlaceholder = () => (
  <p><i>Loading...</i></p>
)

const DynamicPrivacyPolicy = dynamic(
  import("highline/components/terms_and_privacy/privacy_policy"),
  {
    loading: loadingPlaceholder,
    ssr: false,
  },
)

const DynamicTermsOfService = dynamic(
  import("highline/components/terms_and_privacy/terms_of_service"),
  {
    loading: loadingPlaceholder,
    ssr: false,
  },
)
export const RecaptchaTermsAndPrivacySummary = () =>
  <TermsAndPrivacySummary
    layout="light"
    copy={ () => (
      <div>
        <span>This site is protected by reCAPTCHA and the Google&nbsp;</span>
        <a href="https://policies.google.com/privacy">Privacy Policy&nbsp;</a>
        <span>and&nbsp;</span>
        <a href="https://policies.google.com/terms">Terms of Service&nbsp;</a>
        <span>apply.</span>
      </div>
    ) }
  />
class TermsAndPrivacySummary extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    copy: PropTypes.func,
    indicateUpdate: PropTypes.bool,
    layout: PropTypes.oneOf(["dark", "light"]),
    openInModal: PropTypes.bool,
  }

  static defaultProps = {
    copy: (content) => {
      return (
        <div>
          By clicking &quot;Continue&quot; you agree to our { content } updates.
        </div>
      )
    },
    indicateUpdate: false,
    layout: "dark",
    openInModal: true,
  }

  state = {
    openModal: null,
  }

  handleTermsClick = () => {
    this.setState({ openModal: "terms" })
  }

  handlePrivacyClick = () => {
    this.setState({ openModal: "privacy" })
  }

  handleModalClose = () => {
    this.setState({
      openModal: null,
    })
  }

  handleNewTabOrModal = () => {
    const policyCopy = this.props.indicateUpdate ? "updated Privacy Policy" : "Privacy Policy"

    if (this.props.openInModal) {
      return (
        <span>
          <button
            aria-label="Open the Terms of Service modal"
            className={ styles.terms }
            onClick={ this.handleTermsClick }
          >
            Terms of Service
          </button>
          <span> + </span>
          <button
            aria-label="Open the Privacy Policy modal"
            className={ styles.privacy }
            onClick={ this.handlePrivacyClick }
          >
            { policyCopy }
          </button>
        </span>
      )
    }

    return (
      <span>
        <a
          aria-label="Go to the Bonobos Terms of Service"
          className={ styles.terms }
          href="/terms"
          rel="noopener"
          target="_blank"
        >
          Terms of Service
        </a>
        <span> + </span>
        <a
          aria-label="Go to the Bonobos Privacy Policy"
          href="/privacy"
          rel="noopener"
          target="_blank"
          className={ styles.privacy }
        >
          { policyCopy }
        </a>
      </span>
    )
  }

  render() {
    const { className, copy, layout } = this.props

    return (
      <div
        className={ classNames(
          "terms-and-privacy-summary-component",
          styles.component,
          "component",
          className,
          styles[layout],
        ) }
      >
        <div>
          { copy(this.handleNewTabOrModal()) }
        </div>
        <div>
          { this.state.openModal === "terms" &&
            <Modal
              layout="legal"
              onRequestClose={ this.handleModalClose }
            >
              <DynamicTermsOfService />
            </Modal>
          }

          { this.state.openModal === "privacy" &&
            <Modal
              layout="legal"
              onRequestClose={ this.handleModalClose }
            >
              <DynamicPrivacyPolicy />
            </Modal>
          }

        </div>
      </div>
    )
  }
}

export default TermsAndPrivacySummary
