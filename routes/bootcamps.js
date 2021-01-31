const express = require('express');

const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps')

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')

// include other resource routers
const courseRouter = require('./courses')

const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/').get(advancedResults(Bootcamp, 'courses') ,getBootcamps).post(protect,authorize('publisher', 'admin'), createBootcamp)

router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = router