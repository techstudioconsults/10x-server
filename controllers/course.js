const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const uploadImage = require("../utils/uploadImage");
const Payment = require("../models/Payment");

//@desc     Get all courses
//@route    GET /api/v1/courses
//@access   Public
const getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get single course
//@route    GET /api/v1/course/:id
//@access   Public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

//@desc   Create Course
//@route   POST /api/v1/course
//@access  Private/Admin
const createCourse = asyncHandler(async (req, res, next) => {
  // Make sure user is an admin or super admin
  if (req.user.role !== "admin" || req.user.role != "super admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add courses`,
        401
      )
    );
  }

  console.log(req.files);

  // upload image
  const photoUrl = await uploadImage(req.files.photo.tempFilePath);
  req.body.photo = photoUrl;

  const course = await Course.create({ ...req.body });

  res.status(201).json({ success: true, data: course });
});

//@desc   Update Course
// @route   PUT /api/v1/course/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is an admin
  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update resource ${course._id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

//@desc   Delete course
// @route   DELETE /api/v1/course/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is an admin
  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete resource ${course._id}`,
        401
      )
    );
  }

  await Course.deleteOne({ _id: req.params.id });

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getCourse,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
