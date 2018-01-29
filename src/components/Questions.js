import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { changeCurrentQuestion, saveQuestionReply } from "../state/actions"
import { history, isOfType } from "../helpers"

const questionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  reply: PropTypes.oneOfType([
    PropTypes.string, // no reply || string
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.bool
  ]).isRequired,
  type: PropTypes.oneOf(["string", "boolean", "date", "number"]).isRequired,
  next: PropTypes.string
})

class Questions extends React.Component {
  static propTypes = {
    question: questionPropType.isRequired,
    previousQuestionId: PropTypes.string,
    progress: PropTypes.number,
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
  onNextPress = () => {
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
    if (next) {
      changeCurrentQuestion(next)
      // this.input.focus()
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
    const { question, previousQuestionId } = this.props
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
        {hasError && error}
      </div>
    )
  }
}
const getPreviousQuestion = (questionsById, current, first) => {
  // linked list traversal
  let i = first
  while (questionsById[i]) {
    if (questionsById[i].next === current) {
      return i
    }
    i = questionsById[i].next
  }
  return null
}
const mapStateToProps = state => ({
  question: state.questions.byId[state.questions.currentQuestion],
  previousQuestionId: getPreviousQuestion(
    state.questions.byId,
    state.questions.currentQuestion,
    state.questions.firstQuestion
  ) // reselect is probably an overkill for one case
})
const mapDispatchToProps = dispatch => ({
  changeCurrentQuestion: next => dispatch(changeCurrentQuestion(next)),
  saveQuestionReply: (id, reply) => dispatch(saveQuestionReply(id, reply))
})
export default connect(mapStateToProps, mapDispatchToProps)(Questions)
