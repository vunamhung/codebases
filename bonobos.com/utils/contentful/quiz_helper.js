import { getField, getObjectByIdentifier, getObjectByFirstField, getImgixUrl } from "highline/utils/contentful/contentful_helper"
import { fromJS } from "immutable"

export const toQuizFields = (quiz) => {
  return {
    content: {
      quiz,
    },
    contentId: "Contentful quiz",
    layout: "fullscreenQuiz",
  }
}

export const getContentfulQuiz = (contentfulData, quizName) => {
  const contentfulQuizzes = contentfulData && getField(getObjectByIdentifier(contentfulData, "target", "Quizzes"), "content")
  return getObjectByFirstField(contentfulQuizzes, quizName)
}

export const toContentfulQuizFields = (quiz) => {
  return quiz && fromJS({
    quizName: getField(quiz, "name"),
    questions: toContentfulQuestionFields(getField(quiz, "questions")),
    quizType: getField(quiz, "quizType"),
    onCompletion: getField(quiz, "onCompletion"),
    outputLoading: false,
    loadingTitle: getField(quiz, "loadingTitle"),
    loadingDescription: getField(quiz, "loadingDescription"),
  })
}

const toContentfulQuestionFields = (questions) => {
  return questions && questions.map((question) => {
    return fromJS({
      question: getField(question, "question"),
      description: getField(question, "description"),
      answerType: getField(question, "answerType"),
      answers: toContentfulAnswerFields(getField(question, "answers")),
      skipAnswer: getField(question, "skipAnswer") && toContentfulSkipAnswerFields(getField(question, "skipAnswer")),
      skipAnswerTitle: getField(question, "skipAnswerTitle"),
    })
  })
}

const toContentfulSkipAnswerFields = (answer) => {
  return answer && fromJS({
    description: getField(answer, "description"),
    output: getField(answer, "output"),
    selected: false,
    quizRedirect: getField(answer, "quizRedirect") && toContentfulQuestionFields(getField(getField(answer, "quizRedirect"), "questions")),
    skipAnswerTitle: getField(answer, "skipAnswerTitle"),
  })
}

export const toContentfulAnswerFields = (answers) => {
  return answers && answers.map((answer) => {
    return fromJS({
      answer: getField(answer, "answer"),
      description: getField(answer, "description"),
      picture: getImgixUrl(getField(answer, "picture")),
      output: getField(answer, "output"),
      selected: false,
      quizRedirect: getField(answer, "quizRedirect") && toContentfulQuestionFields(getField(getField(answer, "quizRedirect"), "questions")),
    })
  })
}

export const getSkipNestedQuestion = (mappedQuiz, questionIndex) => {
  const initialQuestions = mappedQuiz.get("questions").slice(0, questionIndex + 1) //get initial questions not including the ones following the split. Used for when you use the back arrow
  let newQuestionsList = initialQuestions
  const nestedQuestions = mappedQuiz.getIn(["questions", questionIndex]).getIn(["skipAnswer", "quizRedirect"])
  if (nestedQuestions) {
    newQuestionsList = initialQuestions.concat(nestedQuestions)
    getNestedQuestionsHelper(newQuestionsList, nestedQuestions.get("0"), 0)
  }
  return newQuestionsList
}

export const getNestedQuestions = (mappedQuiz, questionIndex, answerIndex) => { //Get the nested questions, based on a answer selected.
  const initialQuestions = mappedQuiz.get("questions").slice(0, questionIndex + 1) //get initial questions not including the ones following the split. Used for when you use the back arrow
  return getNestedQuestionsHelper(initialQuestions, mappedQuiz.getIn(["questions", questionIndex]), answerIndex)
}

const getNestedQuestionsHelper = (questionsList, question, answerIndex) => {
  let newQuestionsList = questionsList
  const nestedQuestions = question.getIn(["answers", answerIndex, "quizRedirect"])
  if (nestedQuestions) {
    newQuestionsList = questionsList.concat(nestedQuestions)
    getNestedQuestionsHelper(newQuestionsList, nestedQuestions.get("0"), 0)
  }
  return newQuestionsList
}

export const getOutputUrl = (quizQuestions) => {
  return quizQuestions.map((question) => {
    const answerOutputs = question.get("answers").map((answer) => {
      return answer.get("selected") ? answer.get("output") : null
    }).join("")
    return answerOutputs ? answerOutputs : question.getIn(["skipAnswer", "output"]) || ""
  }).join("")
}

export const getSingleSelectedAnswer = (answers, answerIndex) => {
  return answers.map((answer, index) => {
    return answer.set("selected", index === answerIndex)
  })
}
