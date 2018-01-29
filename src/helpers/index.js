import createHistory from "history/createHashHistory"
import PropTypes from "prop-types"

export const history = createHistory()

const type = val =>
  val === null
    ? "Null"
    : val === undefined
      ? "Undefined"
      : Object.prototype.toString
          .call(val)
          .slice(8, -1)
          .toLowerCase()

export const isOfType = (rawValue, expectedType) => {
  let val = rawValue
  let res = type(rawValue) === expectedType

  if (expectedType === "date") {
    res = !isNaN(new Date(rawValue).getTime())
  } else if (expectedType === "number") {
    val = parseFloat(rawValue)
    res = !isNaN(val)
  }
  return {
    res: res,
    expected: expectedType,
    found: type(val),
    convertedValue: val
  }
}
export const questionPropType = PropTypes.shape({
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
