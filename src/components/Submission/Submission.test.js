import Enzyme, { render } from "enzyme"
import React from "react"
import { Submission } from "./Submission.js"
import Adapter from "enzyme-adapter-react-16"
import { questions } from "../../helpers/data.json"

Enzyme.configure({ adapter: new Adapter() })

describe("<Foo />", () => {
  it("renders 12 `.item`s", () => {
    const wrapper = render(<Submission questions={questions} />)
    expect(wrapper.find(".submission-item").length).toEqual(12)
  })
  it("default replies should be empty", () => {
    const wrapper = render(<Submission questions={questions} />)
    const replies = wrapper.find(".submission-reply")
    const answers = []
    for (var i = 0; i < replies.length; i++) {
      if (replies.get) {
        const reply = replies.get(i).children
        if (reply.length) {
          answers.push(reply[0].data)
        }
      }
    }
    console.log("answers: ", answers)
    expect(answers.length).toEqual(0)
  })
})
