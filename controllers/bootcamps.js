// @desc get All Bootcamps
// @routes GET /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ message: 'success show all bootcamps', data: [], isSuccess: true })
}

// @desc get single Bootcamp 
// @routes GET /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ message: `success get single bootcamp with id ${req.params.id}`, data: [], isSuccess: true })
}

// @desc create new Bootcamp 
// @routes POST /api/v1/bootcamps/
// @access private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ message: `success create bootcamp with id ${req.params.id}`, data: [], isSuccess: true })
}

// @desc update Bootcamp 
// @routes PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ message: `success update ${req.params.id} bootcamp`, data: [], isSuccess: true })
}

// @desc delete Bootcamp 
// @routes DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
  res.status(201).json({ message: `success delete ${req.params.id} bootcamp`, data: [], isSuccess: true })
}