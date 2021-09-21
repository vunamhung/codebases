import React, { useEffect }  from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { useDispatch } from "react-redux"
import { contentfulQuizOutput } from "highline/redux/actions/contentful_actions"

import styles from "highline/styles/components/contentful/contentful_quiz_output.module.css"

const ContentfulQuizOutput = ({
  outputURL,
  quizType,
  onCompletion,
  loadingTitle,
  loadingDescription,
}) => {
  const dispatch = useDispatch()

  useEffect(()=>{
    if (outputURL && quizType === "Filter Quiz") {
      dispatch(contentfulQuizOutput(outputURL))
    }
  },[outputURL, quizType])

  return (
    <div
      className={ classNames(
        "component",
        "quiz_output_page",
        styles.component,
      ) }>
      { onCompletion === "Show output" &&
        <div className={ styles.loadingSection }>
          <div className={ styles.loadingTitle }>{ loadingTitle }</div>
          { loadingDescription && <div className={ styles.loadingDescription }>{ loadingDescription }</div> }
          <div className={ styles.skCircle }>
            <div className={ classNames( styles.skCircle1, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle2, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle3, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle4, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle5, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle6, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle7, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle8, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle9, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle10, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle11, styles.skChild ) }></div>
            <div className={ classNames( styles.skCircle12, styles.skChild ) }></div>
          </div>
        </div>
      }
    </div>
  )
}

ContentfulQuizOutput.propTypes = {
  loadingDescription: PropTypes.string,
  loadingTitle: PropTypes.string,
  onCompletion: PropTypes.string,
  outputURL: PropTypes.string,
  quizType: PropTypes.string,
}

ContentfulQuizOutput.defaultProps = {
  onCompletion: "Show output",
  quizType: "Filter Quiz",
}

export default ContentfulQuizOutput
