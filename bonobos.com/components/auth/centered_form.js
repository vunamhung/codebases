import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import LoadingButton from "highline/components/loading_button"
import styles from "highline/styles/components/auth/centered_form.module.css"

const CenteredForm = ({
  buttonText,
  children,
  className,
  disabled,
  errorMessage,
  heading,
  infoLink,
  onSubmit,
  requiredWarning,
  subHeading,
  submitNote,
}) => (
  <div className={ classNames(
    styles.component,
    "centered-form-component",
    className,
  ) }>
    <form onSubmit={ onSubmit } className={ styles.form } method="post">
      { heading && (
        <div className={ styles.formHeading }>
          { heading }
        </div>
      )}

      { subHeading && (
        <div className={ styles.formSubHeading }>
          { subHeading }
        </div>
      )}

      { errorMessage &&
        <div className= { styles.errorHeading }>
          { errorMessage }
        </div>
      }

      { children }

      { submitNote && (
        <div className={ styles.submitNote }>
          { submitNote }
        </div>
      )}

      <LoadingButton
        disabled={ disabled }
        loading={ disabled }
      >
        { buttonText }
      </LoadingButton>
    </form>

    { infoLink && (
      <div className={ styles.infoLink }>
        { infoLink }
      </div>
    )}
  </div>
)

CenteredForm.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  infoLink: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onSubmit: PropTypes.func,
  requiredWarning: PropTypes.bool,
  subHeading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  submitNote: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

CenteredForm.defaultProps = {
  buttonText: "Submit",
  requiredWarning: false,
}

export default CenteredForm
