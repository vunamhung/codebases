import React from "react"
import PropTypes from "prop-types"
import ImmutablePropTypes from "react-immutable-proptypes"
import { useDispatch } from "react-redux"
import { List } from "immutable"
import classNames from "classnames"
import { changeQuizQuestion, quizSkipQuestionClicked } from "highline/redux/actions/contentful_actions"
import ContentfulAnswer from "highline/components/contentful/contentful_answer"

import styles from "highline/styles/components/contentful/contentful_question.module.css"

const ContentfulQuestion = ({
  answers,
  answerType,
  description,
  question,
  currentQuizQuestionIndex,
  skipAnswer,
  skipAnswerTitle,
}) => {
  const dispatch = useDispatch()

  const showContinue = (answerType === "Select Many" && answers.some((answer) => answer.get("selected")))
  const skipAnswerRedirect = skipAnswer && !!skipAnswer.get("quizRedirect")

  return (
    <div
      className={ classNames(
        "component",
        "question",
        styles.component,
      ) }>
      <div className={ styles.questionText }>
        <div className={ styles.questionTitle }>{ question }</div>
        <div className={ styles.questionDescription }>{ description }</div>
      </div>
      <div className={ styles.answerSection }>
        { answers && answers.map((answer, index) =>
          <ContentfulAnswer
            answer={ answer.get("answer") }
            description={ answer.get("description") }
            picture={ answer.get("picture") }
            isSelected={ answer.get("selected") }
            answerIndex={ index }
            currentQuizQuestionIndex={ currentQuizQuestionIndex }
            key={ index }
          />,
        )}
      </div>
      <div className={ styles.bottomSection }>
        <button
          className={ styles.continueButton }
          onClick={ () => {
            showContinue
              ? dispatch(changeQuizQuestion(currentQuizQuestionIndex + 1))
              : dispatch(quizSkipQuestionClicked(currentQuizQuestionIndex, skipAnswerRedirect))
          } }>
          { showContinue
            ? <span>Continue</span>
            : <span>{ skipAnswerTitle }</span>
          }
        </button>
      </div>
    </div>
  )
}

ContentfulQuestion.propTypes = {
  answers: ImmutablePropTypes.list,
  answerType: PropTypes.string,
  currentQuizQuestionIndex: PropTypes.number,
  description: PropTypes.string,
  question: PropTypes.string,
  skipAnswer: ImmutablePropTypes.map,
  skipAnswerTitle: PropTypes.string,
}

ContentfulQuestion.defaultProps = {
  answers: List(),
  answerType: "",
  currentQuizQuestionIndex: 0,
  skipAnswerTitle: "Skip Question",
}

export default ContentfulQuestion
