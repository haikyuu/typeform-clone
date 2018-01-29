import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { changeCurrentQuestion, saveQuestionReply } from "../../state/actions"
import { getProgress, getPreviousQuestion } from "../../state/selectors"
import { history, isOfType, questionPropType } from "../../helpers"
import "./Questions.css"

class Questions extends React.Component {
  static propTypes = {
    question: questionPropType.isRequired,
    previousQuestionId: PropTypes.string,
    progress: PropTypes.number.isRequired,
    changeCurrentQuestion: PropTypes.func.isRequired,
    saveQuestionReply: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      reply: props.question.reply,
      hasError: false,
      error: ""
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.question.id !== this.props.question.id) {
      // new question
      // bring reply from redux store
      if (this.props.question.type === "boolean") {
        this.setState({ reply: !!this.props.question.reply })
      } else {
        this.setState({ reply: this.props.question.reply })
      }
      this.input && this.input.focus()
    }
  }
  componentDidMount() {
    this.input && this.input.focus()
  }
  clearError = () => {
    this.setState({
      error: "",
      hasError: false
    })
  }
  onNextPress = isSubmit => {
    this.clearError()
    const {
      question: { next, id, type },
      changeCurrentQuestion,
      saveQuestionReply
    } = this.props
    const { reply } = this.state
    // validate reply type
    const { res, expected, found, convertedValue } = isOfType(reply, type)
    if (reply === "") {
      this.setState({
        error: `Oops! you forgot to write a reply (It should be a ${expected}).\n Can you please provide one so that we can help you?`,
        hasError: true
      })
      return
    }
    if (!res) {
      this.setState({
        error: `Oops! expected the reply to be a ${expected} but it was ${found}.\n Can you please try again?`,
        hasError: true
      })
      return
    }
    saveQuestionReply(id, convertedValue)
    if (next && isSubmit !== true) {
      changeCurrentQuestion(next)
    } else {
      // Go to submission page
      history.push("/submission")
    }
  }
  onPreviousPress = () => {
    this.clearError()
    const { previousQuestionId, changeCurrentQuestion } = this.props
    changeCurrentQuestion(previousQuestionId)
  }
  getInputType = type => {
    return {
      string: "text",
      date: "date",
      number: "number"
    }[type]
  }

  onInputChange = event => {
    this.setState({ reply: event.target.value })
  }
  onRadioChange = event => {
    this.setState({ reply: event.target.value === "true" ? true : false })
  }
  onKeyPress = event => {
    if (event.key === "Enter") {
      this.onNextPress()
    }
  }
  render() {
    const { question, previousQuestionId, progress } = this.props
    const { reply, hasError, error } = this.state
    return (
      <div className="questions-container">
        <div className="questions-content">
          <div className="question">
            <span>{question.text}</span>
          </div>
          <div className="reply">
            {question.type === "boolean" ? (
              <Fragment>
                <input
                  className="boolean-input"
                  name="Question"
                  type="radio"
                  checked={reply === true}
                  value={true}
                  onChange={this.onRadioChange}
                />
                <label htmlFor="Question" className="boolean-label">
                  Yes
                </label>

                <input
                  className="boolean-input left"
                  name="Question"
                  type="radio"
                  checked={reply === false}
                  value={false}
                  onChange={this.onRadioChange}
                />
                <label htmlFor="Question" className="boolean-label">
                  No
                </label>
              </Fragment>
            ) : (
              <input
                className="regular-input"
                ref={ref => (this.input = ref)}
                onKeyPress={this.onKeyPress}
                type={this.getInputType(question.type)}
                value={reply}
                onChange={this.onInputChange}
              />
            )}
          </div>
          <span className="ok_container">
            <button className="button ok_button" onClick={this.onNextPress}>
              OK
            </button>
            <span className="enter_text">Press Enter</span>
          </span>
          {hasError && <span className="questions_error">{error}</span>}
        </div>
        <div className="footer">
          <button
            className="button"
            disabled={!previousQuestionId}
            onClick={this.onPreviousPress}
          >
            Previous
          </button>
          <div className="progress">
            <span className="progress-count">
              {parseInt(progress * 100, 10)}% completed
            </span>
            <div className="progress_bar-container">
              <div
                className="progress_bar"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <button
            className="button"
            disabled={progress !== 1}
            onClick={() => this.onNextPress(true)}
          >
            Submit
          </button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  question: state.questions.byId[state.questions.currentQuestion],
  previousQuestionId: getPreviousQuestion(state),
  progress: getProgress(state)
})
const mapDispatchToProps = dispatch => ({
  changeCurrentQuestion: id => dispatch(changeCurrentQuestion(id)),
  saveQuestionReply: (id, reply) => dispatch(saveQuestionReply(id, reply))
})
export default connect(mapStateToProps, mapDispatchToProps)(Questions)
