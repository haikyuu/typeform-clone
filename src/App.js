import React, { Component } from "react"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { Router, Route } from "react-router-dom"
import { history } from "./helpers"
import state from "./state"
import Questions from "./components/Questions"
import "./App.css"

const store = createStore(
  state,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

class MainApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Questions} />
        </Router>
      </Provider>
    )
  }
}

export default MainApp
