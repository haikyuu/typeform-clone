import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { changeCurrentQuestion } from "../state/actions"
import { history } from "../helpers"

const questionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  reply: PropTypes.oneOfType([
    PropTypes.string, // no reply || string
    PropTypes.date,
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
    changeCurrentQuestion: PropTypes.func.isRequired
  }
  state = {
    reply: "",
    hasError: false
  }
  onNextPress = () => {
    const { question: { next }, changeCurrentQuestion } = this.props
    // validate reply type

    if (next) {
      this.setState({ reply: "" })
      changeCurrentQuestion(next)
    } else {
      // Go to submission page
      history.push("/submission")
    }
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
  render() {
    const { question } = this.props
    const { reply } = this.state
    return (
      <div>
        <span>{question.text}</span>
        <button onClick={this.onNextPress}>Next</button>
        {question.type === "boolean" ? (
          "boolean"
        ) : (
          <input
            type={this.getInputType(question.type)}
            value={reply}
            onChange={this.onInputChange}
          />
        )}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  question: state.questions.byId[state.questions.currentQuestion]
})
const mapDispatchToProps = dispatch => ({
  changeCurrentQuestion: next => dispatch(changeCurrentQuestion(next))
})
export default connect(mapStateToProps, mapDispatchToProps)(Questions)
