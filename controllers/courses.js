/**
 *  @author @AduragbemiShobowale  Aduragbemi Shobowale
 *  @version 1.0
 */
const { CourseModel } = require("../models/Course");
const Payment = require("../models/Payment");
const asyncHandler = require("../middleware/async");
const Joi = require("joi");
const uploadImage = require("../utils/uploadImage");

const courseSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().valid("video", "book").required(),
  url: Joi.string(),
  thumbnail: Joi.alternatives().try(Joi.string(), Joi.object()),
});

const searchSchema = Joi.object({
  keyword: Joi.string().trim().required(),
});

// Create a course
exports.createCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to add course`,
    });
  }
  const { error, value } = courseSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }

  // Handle thumbnail upload
  let thumbnailUrl;
  if (req.files && req.files.thumbnail) {
    thumbnailUrl = await uploadImage(req.files.thumbnail.tempFilePath);
  } else {
    return res.status(400).json({ error: "Thumbnail file not provided" });
  }

  const course = await CourseModel.create({
    ...value,
    thumbnail: thumbnailUrl,
  });

  res.status(201).json({ success: true, data: course });
});

// Get all courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await CourseModel.find({ status: "published" }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, data: courses });
});

// Get a single course
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById({
    _id: req.params.id,
    status: "published",
  });
  if (!course) {
    return res
      .status(404)
      .json({ success: false, error: "Course not found or not published" });
  }
  res.status(200).json({ success: true, data: course });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to update a course`,
    });
  }

  // Find the existing course to retain existing data if no new data is provided
  const existingCourse = await CourseModel.findById(req.params.id);
  if (!existingCourse) {
    return res.status(404).json({ success: false, error: "Course not found" });
  }

  // Validate the input data
  const { error, value } = courseSchema.validate(req.body, {
    allowUnknown: true,
    stripUnknown: true,
  });
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }

  // Handle thumbnail upload if a new thumbnail is provided
  if (req.files && req.files.thumbnail) {
    value.thumbnail = await uploadImage(req.files.thumbnail.tempFilePath);
  }

  // Merge existing course data with the new data
  const updatedCourseData = {
    ...existingCourse._doc,
    title: value.title || existingCourse.title,
    description: value.description || existingCourse.description,
    price: value.price || existingCourse.price,
    category: value.category || existingCourse.category,
    thumbnail: value.thumbnail || existingCourse.thumbnail, // retain existing thumbnail if not provided
    url: value.url || existingCourse.url, // retain existing url if not provided
  };

  // Update the course with the merged data
  const course = await CourseModel.findByIdAndUpdate(
    req.params.id,
    updatedCourseData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: course });
});

// Delete a course
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to delete a course`,
    });
  }

  const course = await CourseModel.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: "Course not found" });
  }
  res.status(200).json({
    success: true,
    data: {},
    message: "This course has been deleted successsfully",
  });
});

// Search courses dynamically by keyword
exports.searchCourses = asyncHandler(async (req, res, next) => {
  const { error, value } = searchSchema.validate({
    keyword: req.params.keyword,
  });
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }

  const courses = await CourseModel.find({
    $or: [
      { title: { $regex: value.keyword, $options: "i" } },
      { description: { $regex: value.keyword, $options: "i" } },
    ],
  });

  res.status(200).json({ success: true, data: courses });
});

exports.getTopSellingCourses = asyncHandler(async (req, res, next) => {
  try {
    const bestSellingCourses = await Payment.aggregate([
      { $match: { status: "success" } }, // Match only successful payments
      { $group: { _id: "$courseId", count: { $sum: 1 } } }, // Group by courseId and count payments
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $limit: 4 }, // Limit to top 4 courses
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" }, // Unwind the course array
      {
        $project: {
          "course.title": 1,
          "course.description": 1,
          "course.price": 1,
          "course.category": 1,
          "course.thumbnail": 1,
          count: 1,
        },
      }, // Project only necessary fields
    ]);

    res.status(200).json({
      success: true,
      data: bestSellingCourses,
    });
  } catch (err) {
    next(err);
  }
});
