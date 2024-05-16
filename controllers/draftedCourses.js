const { DraftedCourseModel } = require("../models/draftedCourse");
const { ContentModel } = require("../models/Content");
const Joi = require("joi");
const uploadImage = require("../utils/uploadImage");
const uploadVideo = require("../utils/uploadVideo");

const courseSchema = Joi.object({
  courseTitle: Joi.string().trim().required(),
  courseDescription: Joi.string().required(),
  price: Joi.number().required(),
  courseCategory: Joi.string().valid("video", "book").required(),
  thumbnail: Joi.string(),
  content: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        file_url: Joi.string().required(),
      })
    )
    .required(),
});

const searchSchema = Joi.object({
  keyword: Joi.string().trim().required(),
});

const createDraftCourse = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  try {
    const { error } = courseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      courseTitle,
      courseDescription,
      price,
      courseCategory,
      thumbnail,
      content,
    } = req.body;

    let thumbnailUrl;
    if (thumbnail && thumbnail.startsWith("http")) {
      // If thumbnail is provided as an HTTP link
      thumbnailUrl = await uploadImage(thumbnail);
    } else if (
      req.files &&
      req.files.thumbnail &&
      req.files.thumbnail.tempFilePath
    ) {
      // If thumbnail is uploaded as a file
      thumbnailUrl = await uploadImage(req.files.thumbnail.tempFilePath);
    } else {
      return res.status(400).json({ error: "Thumbnail file not provided" });
    }

    const uploadedContent = await Promise.all(
      content.map(async (item) => {
        let fileUrl;
        if (item.file_url && item.file_url.startsWith("http")) {
          // If file_url is provided as an HTTP link
          fileUrl = await uploadVideo(item.file_url);
        } else if (item.file_path) {
          // If file_path is provided
          fileUrl = await uploadVideo(item.file_path);
        } else {
          return res
            .status(400)
            .json({ error: `File URL or path not provided for ${item.title}` });
        }
        return { title: item.title, file_url: fileUrl };
      })
    );

    // Set status to "draft" by default
    const newCourse = await CourseModel.create({
      courseTitle,
      courseDescription,
      price,
      courseCategory,
      thumbnail: thumbnailUrl,
      status: "draft", // Set status to "draft" by default
    });

    // Create DraftedContent
    const createdContent = await ContentModel.create(
      uploadedContent.map((item) => ({ ...item, course: newCourse._id }))
    );

    // Update DraftedCourse with Content
    newCourse.content = createdContent.map((content) => content._id);
    await newCourse.save();

    return res
      .status(201)
      .json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    console.error("Error creating course with content:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for editing a course
const editDraftedCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const { error } = courseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const {
      courseTitle,
      courseDescription,
      price,
      courseCategory,
      thumbnail,
      content,
      status, // Include status in the request body
    } = req.body;

    let thumbnailUrl = course.thumbnail;
    if (thumbnail && thumbnail.startsWith("http")) {
      thumbnailUrl = await uploadImage(thumbnail);
    } else if (
      req.files &&
      req.files.thumbnail &&
      req.files.thumbnail.tempFilePath
    ) {
      thumbnailUrl = await uploadImage(req.files.thumbnail.tempFilePath);
    }

    const uploadedContent = await Promise.all(
      content.map(async (item) => {
        let fileUrl = item.file_url;
        if (item.file_url && item.file_url.startsWith("http")) {
          fileUrl = await uploadVideo(item.file_url);
        } else if (item.file_path) {
          fileUrl = await uploadVideo(item.file_path);
        }
        return { title: item.title, file_url: fileUrl };
      })
    );

    await ContentModel.deleteMany({ course: courseId });
    const createdContent = await ContentModel.create(
      uploadedContent.map((item) => ({ ...item, course: courseId }))
    );

    // Update status if provided in the request
    if (status && status !== course.status) {
      course.status = status;
    }

    course.courseTitle = courseTitle || course.courseTitle;
    course.courseDescription = courseDescription || course.courseDescription;
    course.price = price || course.price;
    course.courseCategory = courseCategory || course.courseCategory;
    course.thumbnail = thumbnailUrl;

    course.content = createdContent.map((content) => content._id);
    await course.save();

    return res.json({ message: "Course updated successfully", data: course });
  } catch (error) {
    console.error("Error editing course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for deleting a course (and its content)
const deleteDraftedCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await ContentModel.deleteMany({ course: courseId });
    await CourseModel.findByIdAndDelete(courseId);

    return res.json({ message: "Course and its content deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for getting all courses
const getAllDraftedCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({ status: "draft" });
    return res.json({ data: courses });
  } catch (error) {
    console.error("Error getting all courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for getting a single course by ID with its content
const getDraftedCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await CourseModel.findOne({
      _id: courseId,
      status: "draft",
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
const searchDraftedCourse = async (req, res) => {
  try {
    const { error } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { keyword } = req.query;
    const regex = new RegExp(keyword, "i");
    const courses = await CourseModel.find({
      $and: [
        { status: "draft" },
        {
          $or: [
            { courseTitle: { $regex: regex } },
            { courseDescription: { $regex: regex } },
          ],
        },
      ],
    });
    return res.json({ data: courses });
  } catch (error) {
    console.error("Error searching courses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDraftCourse,
  editDraftedCourse,
  deleteDraftedCourse,
  getAllDraftedCourses,
  getDraftedCourseById,
  searchDraftedCourse,
};
