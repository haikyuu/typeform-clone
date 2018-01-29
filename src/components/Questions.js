import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { changeCurrentQuestion, saveQuestionReply } from "../state/actions"
import { getProgress, getPreviousQuestion } from "../state/selectors"
import { history, isOfType, questionPropType } from "../helpers"

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
  onNextPress = isSubmit => {
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
        error: `Oops! you forgot to write a reply (It should be a ${expected}) . Can you please provide one so that we can help you?`,
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
      <div>
        <button disabled={!previousQuestionId} onClick={this.onPreviousPress}>
          Previous
        </button>
        <span>{question.text}</span>
        {question.type === "boolean" ? (
          <Fragment>
            <label htmlFor="Question">
              <input
                name="Question"
                type="radio"
                checked={reply === true}
                value={true}
                onChange={this.onRadioChange}
              />YES
            </label>
            <label htmlFor="Question">
              <input
                name="Question"
                type="radio"
                checked={reply === false}
                value={false}
                onChange={this.onRadioChange}
              />NO
            </label>
          </Fragment>
        ) : (
          <input
            ref={ref => (this.input = ref)}
            onKeyPress={this.onKeyPress}
            type={this.getInputType(question.type)}
            value={reply}
            onChange={this.onInputChange}
          />
        )}
        <button onClick={this.onNextPress}>Next</button>
        {progress === 1 ? (
          <button onClick={() => this.onNextPress(true)}>Submit</button>
        ) : null}
        {hasError && error}
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
