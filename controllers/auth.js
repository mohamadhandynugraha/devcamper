const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

// @desc Register user
// @routes POST /api/v1/auth/register
// @access public
exports.register = asyncHandler(async(req, res, next) => {
  const { name, email, password, role } = req.body

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })

  sendTokenResponse(user, 200, res)

})

// @desc Login user
// @routes POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async(req, res, next) => {
  const { email, password } = req.body

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  // check for user
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // create token, user huruf kecil karena methods
  sendTokenResponse(user, 200, res)

})

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token, user huruf kecil karena methods
  const token = user.getSignedJwtToken()
  const options = {
    // set expire dari tanggal sekarang di tambah 30 hari.
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token
  })
}

// @desc GET CURRENCT LOGGED IN USER
// @routes GET /api/v1/auth/me
// @access PRIVATE
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    data: user
  })
})