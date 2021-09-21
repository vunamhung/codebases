import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Errors from "highline/components/errors"
import Button from "highline/components/button"
import InputWithLabel from "highline/components/input_with_label"
import TermsAndPrivacySummary from "highline/components/terms_and_privacy/terms_and_privacy_summary"
import Markdown from "highline/components/markdown"
import { PlusIcon } from "highline/components/icons"

import styles from "highline/styles/components/application/email_form.module.css"

const EmailForm = ({
  description,
  disabled,
  email,
  errorMessage,
  finePrint,
  layout,
  onChange,
  onSubmit,
  placeholder,
  placement,
  subscribed,
  successMessage,
  title,
}) => {

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div
      className={ classNames(
        "component",
        "email-form-component",
        styles.component,
        styles[layout],
        styles[placement],
      ) }
    >
      { !subscribed &&
        <div className={ styles.title }>{ title }</div>
      }

      { !subscribed &&
        <div className={ styles.description }>{ description }</div>
      }

      <div className={ styles.formWrapper }>
        { errorMessage &&
          <Errors message={ errorMessage } />
        }

        { subscribed &&
          <div className={ styles.subscribed }>
            { successMessage && placement === "modal" &&
              <Markdown
                className={ styles.successMessage }
                align="center"
                source={ successMessage }
              />
            }
            <div className={ styles.subscribedText }>
              Thank you! <span className={ styles.email }>{ email }</span> has been subscribed.
            </div>
          </div>
        }

        { !subscribed &&
          <form className={ styles.form } onSubmit={ handleSubmit } method="post">
            <InputWithLabel
              autoCorrect="off"
              className={ styles.input }
              label="Email Address"
              name="email"
              type="email"
              aria-label={ placeholder }
              onChange={ onChange }
              value={ email }
              sensitive
              spellCheck="false"
              required
            />
            <span className={ styles.buttonContainer }>
              <Button
                aria-label="submit"
                align="stretch"
                type="submit"
                layout="secondary"
                disabled={ disabled }
              >
                <PlusIcon />
              </Button>
            </span>
          </form>
        }
      </div>

      <div className={ styles.bottomArea }>
        { subscribed && finePrint &&
          <Markdown
            className={ styles.finePrint }
            align="center"
            source={ finePrint }
          />
        }
        { !subscribed &&
          <TermsAndPrivacySummary
            openInModal={ placement === "footer" }
            copy={ (content) => (
              <div>
                By entering your email, you agree to our { content }, including receipt of emails and promotions. You can unsubscribe at any time.
              </div>
            ) }
            layout={ layout }
          />
        }
      </div>
    </div>
  )
}

EmailForm.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  email: PropTypes.string,
  errorMessage: PropTypes.string,
  finePrint: PropTypes.string,
  layout: PropTypes.oneOf(["dark", "light"]),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  placement: PropTypes.oneOf(["footer", "modal"]),
  subscribed: PropTypes.bool,
  successMessage: PropTypes.string,
  title: PropTypes.string,
}

EmailForm.defaultProps = {
  layout: "light",
  placement: "footer",
  show: false,
}

export default EmailForm
