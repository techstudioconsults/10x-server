const { RegularCourseModel, DraftCourseModel } = require("../models/Course");

// Create a regular or draft course
exports.createCourse = async (req, res) => {
  try {
    const { draft = false, ...courseData } = req.body;
    let course;

    if (draft) {
      course = new DraftCourseModel({ ...courseData, draft });
    } else {
      course = new RegularCourseModel({ ...courseData, draft });
    }

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to create course" });
  }
};

// Update a regular or draft course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { draft } = req.body;
    let updatedCourse;

    if (draft === true) {
      updatedCourse = await DraftCourseModel.findByIdAndUpdate(
        courseId,
        { ...req.body, draft: true },
        { new: true }
      );
    } else {
      updatedCourse = await RegularCourseModel.findByIdAndUpdate(
        courseId,
        req.body,
        { new: true }
      );
    }

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to update course" });
  }
};

// Delete a regular or draft course
exports.deleteRegularCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await RegularCourseModel.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      console.log(`Regular course with ID ${courseId} not found.`);
      return res.status(404).json({ error: "Regular course not found" });
    }

    res.json({ message: "Regular course deleted successfully" });
  } catch (error) {
    console.error("Error deleting regular course:", error);
    res.status(500).json({ error: "Failed to delete regular course" });
  }
};

exports.deleteDraftedCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await DraftCourseModel.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      console.log(`Drafted course with ID ${courseId} not found.`);
      return res.status(404).json({ error: "Drafted course not found" });
    }

    res.json({ message: "Drafted course deleted successfully" });
  } catch (error) {
    console.error("Error deleting drafted course:", error);
    res.status(500).json({ error: "Failed to delete drafted course" });
  }
};

// Get all regular courses
exports.getAllRegularCourses = async (req, res) => {
  try {
    const regularCourses = await RegularCourseModel.find();
    res.json(regularCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regular courses" });
  }
};

// Get all draft courses
exports.getAllDraftCourses = async (req, res) => {
  try {
    const draftCourses = await DraftCourseModel.find();
    res.json(draftCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch draft courses" });
  }
};

// Search regular courses by title
exports.searchRegularCourseByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const regularCourses = await RegularCourseModel.find({
      title: { $regex: new RegExp(title, "i") },
    });
    res.json(regularCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for regular courses" });
  }
};

// Search draft courses by title
exports.searchDraftCourseByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const draftCourses = await DraftCourseModel.find({
      title: { $regex: new RegExp(title, "i") },
    });
    res.json(draftCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for draft courses" });
  }
};

// Find regular course by ID
exports.findRegularCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const regularCourse = await RegularCourseModel.findById(courseId);

    if (!regularCourse) {
      return res.status(404).json({ error: "Regular course not found" });
    }

    res.json(regularCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regular course" });
  }
};

// Find draft course by ID
exports.findDraftCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const draftCourse = await DraftCourseModel.findById(courseId);

    if (!draftCourse) {
      return res.status(404).json({ error: "Draft course not found" });
    }

    res.json(draftCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch draft course" });
  }
};
