export const getQuestionsById = state => state.questions.byId
export const getFirstQuestion = state => state.questions.firstQuestion
export const getCurrentQuestion = state => state.questions.currentQuestion

export const getPreviousQuestion = state => {
  // linked list traversal
  const questionsById = getQuestionsById(state)
  const current = getCurrentQuestion(state)
  const first = getFirstQuestion(state)

  let i = first
  while (questionsById[i]) {
    if (questionsById[i].next === current) {
      return i
    }
    i = questionsById[i].next
  }
  return null
}
export const getQuestions = state => {
  const questionsById = getQuestionsById(state)
  const firstQuestion = getFirstQuestion(state)

  let i = firstQuestion
  const result = [questionsById[i]]
  while (questionsById[i]) {
    const nextId = questionsById[i].next
    if (nextId) {
      result.push(questionsById[nextId])
    }
    i = nextId
  }
  return result
}
export const getProgress = state => {
  const questions = getQuestions(state)
  return (
    questions.filter(question => question.reply !== "").length /
    questions.length
  )
}
