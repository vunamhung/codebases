import React, { useEffect } from "react"
import ImmutablePropTypes from "react-immutable-proptypes"
import { useSelector, useDispatch } from "react-redux"
import classNames from "classnames"
import { BackArrowIcon } from "highline/components/icons"
import { changeQuizQuestion, loadContentfulQuiz } from "highline/redux/actions/contentful_actions"
import ContentfulQuestion from "highline/components/contentful/contentful_question"
import ContentfulQuizOutput from "highline/components/contentful/contentful_quiz_output"
import { getOutputUrl } from "highline/utils/contentful/quiz_helper"

import styles from "highline/styles/components/contentful/contentful_quiz.module.css"

const ContentfulQuiz = ({
  quizContent,
}) => {
  const currentQuizQuestionIndex = useSelector((state) => state.getIn(["contentful", "currentQuizQuestionIndex"]))
  const quizType = useSelector((state) => state.getIn(["contentful", "activeQuiz", "quizType"]))
  const loadingTitle = useSelector((state) => state.getIn(["contentful", "activeQuiz", "loadingTitle"]))
  const loadingDescription = useSelector((state) => state.getIn(["contentful", "activeQuiz", "loadingDescription"]))
  const onCompletion = useSelector((state) => state.getIn(["contentful", "activeQuiz", "onCompletion"]))
  const questions = useSelector((state) => state.getIn(["contentful", "activeQuiz", "questions"]))
  const activeQuestion = questions && questions.getIn([currentQuizQuestionIndex])
  const numOfQuestions = questions && questions.size

  const dispatch = useDispatch()
  const showLoadingResults = currentQuizQuestionIndex >= numOfQuestions

  useEffect(() => {
    dispatch(loadContentfulQuiz(quizContent))
  }, [])

  if (!questions) return null

  return (
    <div
      className={ classNames(
        "component",
        "quiz-content",
        styles.component,
      ) }>
      <div className={ styles.top }>
        <div className={ styles.progressBar }>
          <div className={ styles.progress } style={ { "width": `${(currentQuizQuestionIndex+1)*100.0/numOfQuestions}%` } }></div>
        </div>
        <div className={ styles.topBar }>
          { (currentQuizQuestionIndex > 0 && !showLoadingResults) &&
            <button
              onClick={ () => dispatch(changeQuizQuestion(currentQuizQuestionIndex - 1)) }
              className={ styles.backButton }
            >
              <BackArrowIcon />
            </button>
          }
          { !showLoadingResults &&
            <div className={ styles.progressText }>{ `${currentQuizQuestionIndex + 1} of ${numOfQuestions}` }</div>
          }
        </div>
      </div>,
      <div className={ styles.middle }>
        { (activeQuestion && !showLoadingResults) &&
          <ContentfulQuestion
            question={ activeQuestion.get("question") }
            answerType={ activeQuestion.get("answerType") }
            answers={ activeQuestion.get("answers") }
            description={ activeQuestion.get("description") }
            currentQuizQuestionIndex={ currentQuizQuestionIndex }
            skipAnswer={ activeQuestion.get("skipAnswer") }
            skipAnswerTitle={ activeQuestion.get("skipAnswerTitle") }
          />
        }
        { showLoadingResults &&
          <ContentfulQuizOutput
            outputURL={ getOutputUrl(questions) }
            quizType={ quizType }
            onCompletion={ onCompletion }
            loadingTitle={ loadingTitle }
            loadingDescription={ loadingDescription }
          />
        }
      </div>
    </div>
  )
}

ContentfulQuiz.propTypes = {
  quizContent: ImmutablePropTypes.map,
}

export default ContentfulQuiz
