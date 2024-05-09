const express = require('express');
const Course = require('../models/Course');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/course');
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');
const router = express.Router();


// Include other resource routers
 const reviewRouter = require('./review');

 // Re-route into other routers
router.use('/:courseId/reviews', reviewRouter);


router
   .route('/')
   .get(advancedResult(Course),  getCourses)
   .post(protect, authorize('admin', 'super admin'), createCourse);


router
    .route('/:id')
    .get(getCourse)
    .put(protect, authorize('admin', 'super admin'), updateCourse)
    .delete(protect, authorize('admin', 'super admin'), deleteCourse);
    
module.exports = router;