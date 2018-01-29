import { createStore } from "redux"
import state from "./"
import * as actions from "./actions"
import { initialState } from "../App"
import questions from "./questions"

const store = createStore(state, initialState)

// action creator
const changeCurrentQuestionAction = {
  type: "QUESTIONS/CHANGE_CURRENT_QUESTION"
}
it("should create an action to change the current question", () => {
  const id = "A03"
  expect(actions.changeCurrentQuestion(id)).toEqual({
    ...changeCurrentQuestionAction,
    id
  })
})

// reducer
it("should return initial state", () => {
  expect(questions(undefined, {})).toEqual({
    byId: {},
    all: [],
    currentQuestion: null,
    firstQuestion: null
  })
})

it("should handle changing the current question", () => {
  expect(
    questions(undefined, { ...changeCurrentQuestionAction, id: 1 })
  ).toEqual({
    byId: {},
    all: [],
    currentQuestion: 1,
    firstQuestion: null
  })
})
