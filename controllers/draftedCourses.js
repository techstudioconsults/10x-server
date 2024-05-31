/**
 *  @author @AduragbemiShobowale  Aduragbemi Shobowale
 *  @version 1.0
 */
const { DraftedCourseModel } = require("../models/draftedCourse");
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

// Create a drafted course
exports.createDraftedCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to add a course`,
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

  const draftedCourse = await DraftedCourseModel.create({
    ...value,
    thumbnail: thumbnailUrl,
    status: "drafted",
  });

  res.status(201).json({ success: true, data: draftedCourse });
});

// Get all drafted courses
exports.getDraftedCourses = asyncHandler(async (req, res, next) => {
  const courses = await DraftedCourseModel.find({ status: "drafted" });
  res.status(200).json({ success: true, data: courses });
});

// Get a single drafted course
exports.getDraftedCourse = asyncHandler(async (req, res, next) => {
  const course = await DraftedCourseModel.findOne({
    _id: req.params.id,
    status: "drafted",
  });
  if (!course) {
    return res
      .status(404)
      .json({ success: false, error: "Course not found or not drafted" });
  }
  res.status(200).json({ success: true, data: course });
});

// Update a drafted course
exports.updateDraftedCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to update a course`,
    });
  }

  // Find the existing course to retain existing data if no new data is provided
  const existingCourse = await DraftedCourseModel.findById(req.params.id);
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
  const course = await DraftedCourseModel.findByIdAndUpdate(
    req.params.id,
    updatedCourseData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: course });
});

// Delete a drafted course
exports.deleteDraftedCourse = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to delete a course`,
    });
  }

  const course = await DraftedCourseModel.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: "Course not found" });
  }
  res.status(200).json({
    success: true,
    data: {},
    message: "This course has been deleted successfully",
  });
});

// Search drafted courses dynamically by keyword
exports.searchDraftedCourses = asyncHandler(async (req, res, next) => {
  const { error, value } = searchSchema.validate({
    keyword: req.params.keyword,
  });
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }

  const courses = await DraftedCourseModel.find({
    $or: [
      { title: { $regex: value.keyword, $options: "i" } },
      { description: { $regex: value.keyword, $options: "i" } },
    ],
    status: "drafted",
  });

  res.status(200).json({ success: true, data: courses });
});
