const Bootcamp = require('../models/Bootcamp');
// @desc get All Bootcamps
// @routes GET /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({ success: true, message: 'success all get bootcamp', count: bootcamps.length, data: bootcamps })
  } catch (error) {
    res.status(400).json({ success: false, message: error })
  }
}

// @desc get single Bootcamp 
// @routes GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
      return res.status(400).json({ success: false, message: error })
    }
    res.status(200).json( { success: true, message: `success get single bootcamp with id ${req.params.id}`, data: bootcamp } )
  } catch (error) {
    res.status(400).json({ success: false, message: error })
  }
}

// @desc create new Bootcamp 
// @routes POST /api/v1/bootcamps/
// @access private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
      success: true,
      message: bootcamp.name,
      data: bootcamp
    }) 
  } catch (error) {
    res.status(400).json({ success: false, message: error })
  }
}

// @desc update Bootcamp 
// @routes PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!bootcamp) {
      return res.status(400).json( { success: false, message: error } )
    }

    res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    res.status(400).json( { success: false, message: error } )
  }
}

// @desc delete Bootcamp 
// @routes DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
      return res.status(400).json( { success: false, message: error } )
    }

    res.status(200).json({ success: true, data: {}, message: `success delete ${req.params.id}`})
  } catch (error) {
    res.status(400).json( { success: false, message: error } )
  }
}