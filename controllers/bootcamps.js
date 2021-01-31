const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp');

// @desc get All Bootcamps
// @routes GET /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
  res.status(200).json(res.advancedResults)
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
  // add user to req.body
  req.body.user = req.user.id
  // check for publish bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
  // if the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published bootcamp`, 400))
  }

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

  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }

  bootcamp.remove()

  res.status(200).json({ success: true, data: {}, message: `success delete ${req.params.id}`})
})

// @desc GET Bootcamps within radius
// @routes GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // get lat and long from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // calculate radius using radians
  // divide distance by radius of Earth
  // Earth radius = 3,663 mi (tiga ribu) / 6,378 km
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

// @desc put upload photo for bootcamp 
// @routes put /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
  }

  if (!req.files) {
    return next(new ErrorResponse('Please Upload a file', 400))
  }

  const file = req.files.file

  // make sure that the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please Upload an image file', 400))
  }
  
  // check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
  }

  // create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({
      success: true,
      data: file.name
    })
  })
})