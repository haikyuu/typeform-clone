import React, { Component } from "react"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { Router, Route, Redirect, Switch } from "react-router-dom"
import { normalize, schema } from "normalizr"
import { history } from "./helpers"
import state from "./state"
import Questions from "./components/Questions/Questions"
import Submission from "./components/Submission/Submission"
import "./App.css"
import data from "./helpers/data"

const question = new schema.Entity("questions")
const mySchema = { questions: [question] }
const { entities, result } = normalize(data, mySchema)
// export to test
export const initialState = {
  questions: {
    byId: entities.questions,
    all: result.questions,
    currentQuestion: data.questions[0].id,
    firstQuestion: data.questions[0].id
  }
}
const store = createStore(
  state,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class MainApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path="/questions" component={Questions} />
            <Route path="/submission" component={Submission} />
            <Redirect to="/questions" />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default MainApp
