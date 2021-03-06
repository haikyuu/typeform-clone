import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { questionPropType, history } from "../../helpers"
import { getQuestions } from "../../state/selectors"
import { changeCurrentQuestion } from "../../state/actions"
import "./Submission.css"

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
  formatReply = (type, reply) => {
    if (type === "boolean" && [true, false].indexOf(reply) > -1) {
      return reply === true ? "Yes" : "No"
    } else if (reply === "") {
      return ""
    } else if (type === "date") {
      return new Date(reply).toLocaleDateString()
    } else {
      return reply
    }
  }
  render() {
    const { questions } = this.props
    return (
      <div className="submission-container">
        <h1 className="title">Submission</h1>
        <div className="items-container">
          {questions.map((question, index) => (
            <div className="submission-item" key={question.id}>
              <div className="submission-question_container">
                <span className="submission-question">{`${index + 1}. ${
                  question.text
                }`}</span>
                <button
                  className="edit-button"
                  onClick={() => this.onEdit(question.id)}
                >
                  Edit
                </button>
              </div>
              <span className="submission-reply">
                {this.formatReply(question.type, question.reply)}
              </span>
            </div>
          ))}
        </div>
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

export { Submission }
export default connect(mapStateToProps, mapDispatchToProps)(Submission)
