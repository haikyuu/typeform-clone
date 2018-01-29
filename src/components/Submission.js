import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { questionPropType, history } from "../helpers"
import { getQuestions } from "../state/selectors"
import { changeCurrentQuestion } from "../state/actions"

class Submission extends React.Component {
  static propTypes = {
    questions: PropTypes.arrayOf(questionPropType),
    changeCurrentQuestion: PropTypes.func
  }
  onEdit = id => {
    const { changeCurrentQuestion } = this.props
    changeCurrentQuestion(id)
    history.push("/questions")
  }
  render() {
    const { questions } = this.props
    return (
      <div>
        {questions.map((question, index) => (
          <div key={question.id}>
            <span>{`${index}. ${question.text}`}</span>
            <br />
            <span>
              {question.type === "boolean"
                ? question.reply ? "Yes" : "No"
                : `${question.reply}`}
            </span>
            <button onClick={() => this.onEdit(question.id)}>Edit</button>
          </div>
        ))}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  questions: getQuestions(state)
})
const mapDispatchToProps = dispatch => ({
  changeCurrentQuestion: id => dispatch(changeCurrentQuestion(id))
})
export default connect(mapStateToProps, mapDispatchToProps)(Submission)
