const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp');

// @desc get All Bootcamps
// @routes GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
  
  const bootcamps = await Bootcamp.find()
  res.status(200).json({ success: true, message: 'success all get bootcamp', count: bootcamps.length, data: bootcamps })
  
})

// @desc get single Bootcamp 
// @routes GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  res.status(200).json( { success: true, message: `success get single bootcamp with id ${req.params.id}`, data: bootcamp } )
})

// @desc create new Bootcamp 
// @routes POST /api/v1/bootcamps/
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    success: true,
    message: bootcamp.name,
    data: bootcamp
  }) 
})

// @desc update Bootcamp 
// @routes PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }
  res.status(200).json({ success: true, data: bootcamp })
})

// @desc delete Bootcamp 
// @routes DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({ success: true, data: {}, message: `success delete ${req.params.id}`})
})