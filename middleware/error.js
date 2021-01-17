const ErrorResponse = require("../utils/errorResponse")

const errorHanlder = (err, req, res, next) => {
  let error = {...err}
  error.message = err.message
  // log to console for dev
  console.log(err)

  //mongoose bad Object id
  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const message = `Cannot create bootcamp because duplicate value ${err.keyValue.name}`
    error = new ErrorResponse(message, 400)
  }

  // mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(element => element.message)
    error = new ErrorResponse(message, 400)
  }


  res.status(error.statusCode || 500).json({
    message: error.message || `Server Error`,
    success: false
  })
}

module.exports = errorHanlder