/**
 *  @author @AduragbemiShobowale Aduragbemi Shobowale
 *  @version 1.0
 */

const { CourseModel } = require("../models/Course");
const { ContentModel } = require("../models/Content");
const Payment = require("../models/Payment");
const asyncHandler = require("../middleware/async");
const Joi = require("joi");
const uploadImage = require("../utils/uploadImage");
const uploadVideo = require("../utils/uploadVideo");

const courseSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().valid("video", "book").required(),
  thumbnail: Joi.alternatives().try(Joi.string(), Joi.object()),
  content: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        file: Joi.any().required(),
      })
    )
    .required(),
});

const searchSchema = Joi.object({
  keyword: Joi.string().trim().required(),
});

const createCourse = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  try {
    // Ensure user is an admin
    if (req.user.role !== "admin" && req.user.role !== "super admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to add course`,
      });
    }

    // Get content data from req.body
    let { title, description, price, category, content } = req.body;

    // Parse content if it is a string
    if (typeof content === "string") {
      content = JSON.parse(content);
    }

    // Ensure content is an array
    if (!Array.isArray(content)) {
      return res.status(400).json({ error: '"content" must be an array' });
    }

    // Validate request body
    const { error } = courseSchema.validate({
      title,
      description,
      price,
      category,
      content,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Handle thumbnail upload
    let thumbnailUrl;
    if (req.files && req.files.thumbnail) {
      thumbnailUrl = await uploadImage(req.files.thumbnail.tempFilePath);
    } else {
      return res.status(400).json({ error: "Thumbnail file not provided" });
    }

    // Handle content uploads
    const uploadedContent = await Promise.all(
      content.map(async (item, index) => {
        const fileKey = `content[${index}].file`;
        if (!req.files || !req.files[fileKey]) {
          throw new Error(`File not provided for ${item.title}`);
        }
        const fileUrl = await uploadVideo(req.files[fileKey].tempFilePath);
        return { title: item.title, file: fileUrl };
      })
    );

    // Set status to "published" by default
    const newCourse = await CourseModel.create({
      title,
      description,
      price,
      category,
      thumbnail: thumbnailUrl,
      status: "published",
    });

    // Create Content
    const createdContent = await ContentModel.create(
      uploadedContent.map((item) => ({ ...item, course: newCourse._id }))
    );

    // Update Course with Content
    newCourse.content = createdContent.map((content) => content._id);
    await newCourse.save();

    return res
      .status(201)
      .json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    console.error("Error creating course with content:", error.message);
    console.error(error.stack);
    return res.status(500).json({ error: error.message });
  }
};

const editCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    // Ensure user is an admin
    if (req.user.role !== "admin" && req.user.role !== "super admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to edit course`,
      });
    }

    // Fetch the existing course
    const course = await CourseModel.findById(courseId);

    // Ensure the course exists
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Update only the fields that are provided
    let updatedFields = {};
    if (req.body.title) updatedFields.title = req.body.title;
    if (req.body.description) updatedFields.description = req.body.description;
    if (req.body.price) updatedFields.price = req.body.price;
    if (req.body.category) updatedFields.category = req.body.category;

    // Handle thumbnail upload if provided
    let thumbnailUrl = course.thumbnail;
    if (req.files && req.files.thumbnail) {
      thumbnailUrl = await uploadImage(req.files.thumbnail.tempFilePath);
      updatedFields.thumbnail = thumbnailUrl;
    }

    // Update the course
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      updatedFields,
      { new: true }
    );

    // If content is provided, handle content uploads
    let createdContent = [];
    if (req.body.content) {
      const content = JSON.parse(req.body.content);
      createdContent = await Promise.all(
        content.map(async (item, index) => {
          const fileKey = `content[${index}].file`;
          let fileUrl = course.content[index]?.file; // Use the existing file URL if no new file is provided
          if (req.files && req.files[fileKey]) {
            fileUrl = await uploadVideo(req.files[fileKey].tempFilePath);
          }
          return { title: item.title, file: fileUrl, course: courseId };
        })
      );

      // Delete existing content and create new content
      await ContentModel.deleteMany({ course: courseId });
      await ContentModel.create(createdContent);
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error editing course:", error.message);
    console.error(error.stack);
    return res.status(500).json({ error: error.message });
  }
};

// Controller function for deleting a course (and its content)
const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    // Make sure user is an admin
    if (req.user.role !== "admin" && req.user.role !== "super admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete course`,
      });
    }
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await ContentModel.deleteMany({ course: courseId });
    await CourseModel.findByIdAndDelete(courseId);

    return res.json({
      success: true,
      message: "Course and its content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for getting all courses
const getAllCourses = async (req, res) => {
  try {
    // Sorting the courses in descending order by creation date (newest first)
    const courses = await CourseModel.find({ status: "published" }).sort({
      createdAt: -1,
    });
    return res.json({ data: courses });
  } catch (error) {
    console.error("Error getting all courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for getting a single course by ID with its content
const getCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await CourseModel.findOne({
      _id: courseId,
      status: "published",
    }).populate("content");
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json({ data: course });
  } catch (error) {
    console.error("Error getting course by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for searching for courses
const searchCourse = async (req, res) => {
  try {
    // Extract the keyword from the URL parameters
    const { keyword } = req.params;

    // Validate the keyword if necessary (e.g., length, content)
    const { error } = searchSchema.validate({ keyword });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Create a case-insensitive regex from the keyword
    const regex = new RegExp(keyword, "i");

    // Search for courses with the status 'published' and match title or description
    const courses = await CourseModel.find({
      status: "published",
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    });

    // Return the found courses
    return res.json({ data: courses });
  } catch (error) {
    // Log the error and return a 500 status
    console.error("Error searching courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for fetching recently uploaded courses
const getRecentlyUploadedCourses = async (req, res) => {
  try {
    // Fetch recently uploaded courses by sorting based on creation timestamp in descending order
    const courses = await CourseModel.find({ status: "published" })
      .sort({ createdAt: -1 }) // Sort in descending order based on creation timestamp
      .limit(3); // Limit the number of results to 3

    return res.json({ data: courses });
  } catch (error) {
    console.error("Error getting recently uploaded courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTopSellingCourses = asyncHandler(async (req, res, next) => {
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

module.exports = {
  createCourse,
  editCourse,
  deleteCourse,
  searchCourse,
  getAllCourses,
  getCourseById,
  getRecentlyUploadedCourses,
  getTopSellingCourses,
};
