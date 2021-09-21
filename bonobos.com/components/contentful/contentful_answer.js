import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { useDispatch } from "react-redux"
import { quizAnswerClicked } from "highline/redux/actions/contentful_actions"

import styles from "highline/styles/components/contentful/contentful_answer.module.css"

const ContentfulAnswer = ({
  answer,
  description,
  picture,
  isSelected,
  answerIndex,
  currentQuizQuestionIndex,
}) => {
  const dispatch = useDispatch()
  return (
    <button
      className={ classNames(styles.answer, isSelected && styles.isSelected) }
      onClick={ () => { dispatch(quizAnswerClicked(!isSelected, currentQuizQuestionIndex, answerIndex)) } }>
      <div className={ styles.answerOption }>
        { picture &&
          <div className={ styles.answerPicture }>
            <img src={ picture } alt={ answer }></img>
          </div>
        }
        <div className={ styles.answerText }>
          <div className={ styles.answerTitle }>
            { answer }
          </div>
          <div className={ styles.answerDescription }>
            { description }
          </div>
        </div>
      </div>
    </button>
  )
}

ContentfulAnswer.propTypes = {
  answer: PropTypes.string,
  answerIndex: PropTypes.number,
  currentQuizQuestionIndex: PropTypes.number,
  description: PropTypes.string,
  isSelected: PropTypes.bool,
  numOfAnswers: PropTypes.number,
  output: PropTypes.string,
  picture: PropTypes.string,
}

ContentfulAnswer.defaultProps = {
  answer: "",
  answerIndex: 0,
  currentQuizQuestionIndex: 0,
  description: "",
  isSelected: false,
  numOfAnswers: 1,
  output: "",
  picture: "",
}

export default ContentfulAnswer
