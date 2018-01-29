import createHistory from "history/createHashHistory"

const history = createHistory()

const type = val =>
  val === null
    ? "Null"
    : val === undefined
      ? "Undefined"
      : Object.prototype.toString
          .call(val)
          .slice(8, -1)
          .toLowerCase()

const isOfType = (rawValue, expectedType) => {
  let val = rawValue
  let res = type(rawValue) === expectedType

  if (expectedType === "date") {
    val = new Date(rawValue) // will be store in redux as a string anyway
    res = !isNaN(val.getTime())
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

export { history, isOfType }
