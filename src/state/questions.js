import data from "../helpers/data"
import { normalize, schema } from "normalizr"

const question = new schema.Entity("questions")
const mySchema = { questions: [question] }
const { entities, result } = normalize(data, mySchema)

// Actions
export const changeCurrentQuestion = id => ({
  type: "QUESTIONS/CHANGE_CURRENT_QUESTION",
  id
})
export const saveQuestionReply = (id, reply) => ({
  type: "QUESTIONS/SAVE_QUESTION_REPLY",
  id,
  reply
})
// State shape & Initial state
const initialState = {
  byId: entities.questions,
  all: result.questions,
  currentQuestion: data.questions[0].id,
  firstQuestion: data.questions[0].id
}

// Reducer
const questions = (state = initialState, action) => {
  switch (action.type) {
    case "QUESTIONS/CHANGE_CURRENT_QUESTION":
      return {
        ...state,
        currentQuestion: action.id
      }
    case "QUESTIONS/SAVE_QUESTION_REPLY":
      const { reply, id } = action
      const question = state.byId[id]
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: { ...question, reply }
        }
      }
    default:
      return state
  }
}

export default questions
