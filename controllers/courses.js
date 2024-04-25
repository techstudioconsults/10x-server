const Course = require("../models/Course");
const Module = require("../models/Module");
const Content = require("../models/Content");
const Joi = require("joi");

// Joi schema for course validation
const courseSchema = Joi.object({
  title: Joi.string().trim().required().min(30).max(100),
  amount: Joi.number().required(),
  courseDescription: Joi.string().required().min(200).max(1200),
  category: Joi.string().valid("video", "book").required(),
  uploadThumbnail: Joi.string().required(),
  draft: Joi.boolean().default(false),
});

// Joi schema for module validation
const moduleSchema = Joi.object({
  title: Joi.string().trim().required().min(30).max(100),
  courseId: Joi.string().required(),
});

// Joi schema for content validation
const contentSchema = Joi.object({
  title: Joi.string().trim().required().min(30).max(100),
  description: Joi.string().required().min(200).max(1200),
  file_url: Joi.string().required(),
  moduleId: Joi.string().required(),
});

// Controller functions for courses

// Create a new course with modules and content
const createCourse = async (req, res) => {
  try {
    // Validate request body for course
    const validatedCourseData = await courseSchema.validateAsync(req.body);

    // Extract module and content data from the request body
    const { modules, contents, ...courseData } = validatedCourseData;

    // Validate modules and contents
    if (modules && modules.length > 0) {
      await Promise.all(
        modules.map((module) => moduleSchema.validateAsync(module))
      );
    }
    if (contents && contents.length > 0) {
      await Promise.all(
        contents.map((content) => contentSchema.validateAsync(content))
      );
    }

    // Create course
    const newCourse = await Course.create(courseData);

    // If modules are provided, link them to the course
    if (modules && modules.length > 0) {
      // Create modules and link them to the course
      const createdModules = await Promise.all(
        modules.map(async (moduleData) => {
          // Create module
          const newModule = await Module.create(moduleData);
          // Link module to course
          newCourse.modules.push(newModule._id);
          await newCourse.save();
          return newModule;
        })
      );
      newCourse.modules = createdModules;
    }

    // If contents are provided, link them to the modules
    if (contents && contents.length > 0) {
      // Iterate through each content
      for (const contentData of contents) {
        // Find the module to link the content
        const module = await Module.findById(contentData.moduleId);
        if (!module) {
          throw new Error(`Module with ID ${contentData.moduleId} not found`);
        }
        // Create content
        const newContent = await Content.create(contentData);
        // Link content to module
        module.contents.push(newContent._id);
        await module.save();
      }
    }

    // Return the newly created course
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update course by ID
const updateCourse = async (req, res) => {
  try {
    // Validate request body for course
    const validatedCourseData = await courseSchema.validateAsync(req.body);

    // Extract module and content data from the request body
    const { modules, contents, ...courseData } = validatedCourseData;

    // Validate modules and contents
    if (modules && modules.length > 0) {
      await Promise.all(
        modules.map((module) => moduleSchema.validateAsync(module))
      );
    }
    if (contents && contents.length > 0) {
      await Promise.all(
        contents.map((content) => contentSchema.validateAsync(content))
      );
    }

    // Find and update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      courseData,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update modules if provided
    if (modules && modules.length > 0) {
      // Delete existing modules linked to the course
      await Module.deleteMany({ _id: { $in: updatedCourse.modules } });
      // Create and link new modules
      const createdModules = await Promise.all(
        modules.map(async (moduleData) => {
          const newModule = await Module.create(moduleData);
          updatedCourse.modules.push(newModule._id);
          return newModule;
        })
      );
      updatedCourse.modules = createdModules.map((module) => module._id);
    }

    // Update contents if provided
    if (contents && contents.length > 0) {
      // Delete existing contents linked to the course
      await Content.deleteMany({ modelId: { $in: updatedCourse.modules } });
      // Iterate through each content
      for (const contentData of contents) {
        // Find the module to link the content
        const module = await Module.findById(contentData.moduleId);
        if (!module) {
          throw new Error(`Module with ID ${contentData.moduleId} not found`);
        }
        // Create content
        const newContent = await Content.create(contentData);
        // Link content to module
        module.contents.push(newContent._id);
        await module.save();
      }
    }

    // Save the updated course
    const savedCourse = await updatedCourse.save();

    // Return the updated course
    res.status(200).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course by ID
const deleteCourse = async (req, res) => {
  try {
    // Find the course
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete modules linked to the course
    await Module.deleteMany({ _id: { $in: course.modules } });

    // Delete contents linked to the modules
    await Content.deleteMany({ modelId: { $in: course.modules } });

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    // Return success message
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for courses by title (case-insensitive)
const searchCourses = async (req, res) => {
  try {
    const searchQuery = req.query.title;
    const courses = await Course.find({
      title: { $regex: new RegExp(searchQuery, "i") },
    }).populate("modules");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  searchCourses,
};
